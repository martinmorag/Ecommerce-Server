const express = require('express');
const router = express.Router();

router.use('/items', require('./items'));
router.use('/cart', require('./cart'));

module.exports = router;
