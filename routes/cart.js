const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');

router.get('/', itemsController.getCart);
router.post('/', itemsController.postItemtoCart);

module.exports = router;