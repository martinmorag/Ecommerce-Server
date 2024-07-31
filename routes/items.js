const express = require('express');
const router = express.Router();
const itemsController = require('../controllers/items');

router.get('/', itemsController.getAll);
router.get('/:id', itemsController.getSingle);
router.post('/', itemsController.createItem);
router.put('/:id', itemsController.editItem);
router.delete('/:id', itemsController.deleteItem);
router.get('/:id/rating', itemsController.getItemRating);
router.post('/:id/rating', itemsController.postItemRating);
router.get('/:id/comments', itemsController.getItemComment);
router.post('/:id/comments', itemsController.postItemComment);


module.exports = router;