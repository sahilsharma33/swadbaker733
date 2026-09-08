const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/orderController');
const { auth, adminOnly } = require('../middleware/auth');

router.post('/', auth, ctrl.createOrder);
router.post('/verify', ctrl.verifyPayment);
router.get('/my', auth, ctrl.listUserOrders);
router.get('/', auth, adminOnly, ctrl.adminListOrders);
router.put('/:id/status', auth, adminOnly, ctrl.updateStatus);

module.exports = router;