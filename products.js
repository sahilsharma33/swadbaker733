const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/productController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/', ctrl.list);
router.get('/:id', ctrl.get);

// admin
router.post('/', auth, adminOnly, ctrl.create);
router.put('/:id', auth, adminOnly, ctrl.update);
router.delete('/:id', auth, adminOnly, ctrl.delete);

module.exports = router;