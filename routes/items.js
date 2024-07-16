const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');

router.get('/', itemsController.getAll);
router.get('/:id', itemsController.getSingle);
router.get('/', itemsController.getAll);
router.get('/:id', itemsController.getSingle);
router.get('/:id/rating', itemsController.getItemRating);
router.post('/:id/rating', itemsController.postItemRating);
router.get('/:id/comments', itemsController.getItemComment);
router.post('/:id/comments', itemsController.postItemComment);
router.post('/', itemsController.createItem);
router.delete('/:id', itemsController.deleteItem);

module.exports = router;
