"""
Simple worker that periodically advances order status for demo.
It calls admin API endpoints to update order statuses. Requires a JWT admin token.

Usage:
  export API_BASE=http://localhost:5000/api
  export ADMIN_TOKEN="Bearer <admin_jwt>"
  python3 worker.py
"""

import os, time, requests

API_BASE = os.getenv('API_BASE', 'http://localhost:5000/api')
ADMIN_TOKEN = os.getenv('ADMIN_TOKEN', None)

HEADERS = {'Content-Type': 'application/json'}
if ADMIN_TOKEN:
    HEADERS['Authorization'] = ADMIN_TOKEN

STATUS_FLOW = ['PLACED', 'CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED']

def list_orders():
    try:
        r = requests.get(f"{API_BASE}/orders", headers=HEADERS, timeout=10)
        if r.status_code == 200:
            return r.json()
    except Exception as e:
        print("Error fetching orders:", e)
    return []

def advance_order(order):
    try:
        idx = STATUS_FLOW.index(order['status'])
        if idx < len(STATUS_FLOW) - 1:
            new_status = STATUS_FLOW[idx+1]
            r = requests.put(f"{API_BASE}/orders/{order['_id']}/status", json={'status': new_status}, headers=HEADERS, timeout=10)
            if r.status_code == 200:
                print(f"Order {order['_id']} advanced to {new_status}")
            else:
                print("Failed to update", r.status_code, r.text)
    except Exception as e:
        print("Error advancing order:", e)

def run_loop():
    print("Worker started. Polling orders every 15 seconds.")
    while True:
        orders = list_orders()
        for o in orders:
            if o['status'] != 'DELIVERED':
                advance_order(o)
                time.sleep(1)
        time.sleep(15)

if __name__ == '__main__':
    if not ADMIN_TOKEN:
        print("ADMIN_TOKEN environment variable is required to run worker. Get an admin JWT and set ADMIN_TOKEN='Bearer <token>'")
    else:
        run_loop()