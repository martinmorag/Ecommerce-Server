const mongodb = require('../db/connect');

const ObjectId = require('mongodb').ObjectId;
const collectionNameItems = 'items';
const collectionNameRating = 'rating';
const collectionNameComments = 'comments';

const getAll = async (req, res) => {
  try {
    // const db = mongodb.getDb().db();
    // const collections = await db.listCollections().toArray();
    // console.log('Collections:', collections);

    const result = await mongodb.getDb().db().collection(collectionNameItems).find();
    result.toArray().then((items) => {
      if (items.length === 0) {
        res.status(404).json({ message: 'There are no registered items' });
        return;
      }
      res.status(200).json(items);
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSingle = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'You must use a valid item ID' });
    }

    const itemId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection(collectionNameItems).find({ _id: itemId });

    result.toArray().then((items) => {
        if (items.length === 0) {
          res.status(404).json({message: 'The item with that ID does not exist.'});
          return;
        }
        res.status(200).json(items[0]);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getItemRating = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'You must use a valid item ID' });
    }

    const itemId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection(collectionNameRating).find({ itemId: itemId });
    result.toArray().then((ratings) => {
      res.status(200).json(ratings);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const postItemRating = async (req, res) => {
  try {
    const itemId = new ObjectId(req.params.id);
    const rating = {
      rating: req.body.rating,
      itemId: itemId,
    };

    const response = await mongodb.getDb().db().collection(collectionNameRating).insertOne(rating);
    if (response.acknowledged) {
      const result = await mongodb.getDb().db().collection(collectionNameRating).find({ itemId: itemId });
      result.toArray().then((ratings) => {
        if (ratings.length === 0) {
          res.status(404).json({message: 'The item with that ID does not exist.'});
          return;
        }
        res.status(201).json(ratings);
      });
    } else {
      res.status(500).json({message: 'Some error occurred while posting the rating.'})
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getItemComment = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'You must use a valid item ID' });
    }

    const itemId = new ObjectId(req.params.id);
    const result = await mongodb.getDb().db().collection(collectionNameComments).find({ itemId: itemId });
    result.toArray().then((ratings) => {
      res.status(200).json(ratings);
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const postItemComment = async (req, res) => {
  try {
    const itemId = new ObjectId(req.params.id);
    const comment = {
      author: req.body.author,
      text: req.body.text,
      itemId: itemId,
    };

    const response = await mongodb.getDb().db().collection(collectionNameComments).insertOne(comment);
    if (response.acknowledged) {
      const result = await mongodb.getDb().db().collection(collectionNameComments).find({ itemId: itemId });
      result.toArray().then((comments) => {
        if (comments.length === 0) {
          res.status(404).json({message: 'The item with that ID does not exist.'});
          return;
        }
        res.status(201).json(comments);
      });
    } else {
      res.status(500).json({message: 'Some error occurred while creating the item.'})
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}


const createItem = async (req, res) => {
  try {

    const itemBody = {
      name: req.body.name,
      description: req.body.description,
      price: parseFloat(req.body.price),
      size: req.body.size,
      images: req.body.images,
      storeId: parseInt(req.body.storeId),
      storeName: req.body.storeName,
      category: parseInt(req.body.category),
      email: req.body.email
    };

    const response = await await mongodb.getDb().db().collection(collectionNameItems).insertOne(itemBody);

    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json ({message: 'Some error occurred while posting the comment.'})
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    if (!ObjectId.isValid(req.params.id)) {
      res.status(400).json({ message: 'You must use a valid item ID to find one.' });
    }
    const itemId = new ObjectId(req.params.id);
    const response = await mongodb.getDb().db().collection(collectionNameItems).deleteOne({_id: itemId }, true);

    if (response.deletedCount > 0) {
      res.status(204).json(response);
    } else {
      res.status(500).json(response.error || 'Some error occurred while deleting the item.');
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


module.exports = {
    getAll,
    getSingle,
    getItemRating,
    postItemRating,
    getItemComment,
    postItemComment,
    createItem,
    deleteItem
};
