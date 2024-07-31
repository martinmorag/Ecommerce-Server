const mongodb = require('../db/connect');

const ObjectId = require('mongodb').ObjectId;
const collectionNameItems = 'items';
const collectionNameRating = 'rating';
const collectionNameComments = 'comments';
const collectionCartItems = 'cart';

const getAll = async (req, res) => {
  try {
    const items = await mongodb.getDb().db().collection(collectionNameItems).find().toArray();

    if (items.length === 0) {
      return res.status(404).json({ message: 'There are no registered items' });
    }

    res.status(200).json(items);
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

const editItem = async (req, res) => {
  try {
      if (!ObjectId.isValid(req.params.id)) {
          return res.status(400).json({ message: 'You must use a valid item ID to update an item.' });
      }

      const itemId = new ObjectId(req.params.id);

      // Prepare the updated item data from the request body
      const updatedItem = {
          name: req.body.name,
          description: req.body.description,
          price: parseFloat(req.body.price),
          size: req.body.size,
          images: req.body.images, // Assuming this is an array of strings (URLs)
          storeId: parseInt(req.body.storeId),
          storeName: req.body.storeName,
          category: parseInt(req.body.category),
          email: req.body.email
      };

      // Perform the update operation in MongoDB
      const response = await mongodb.getDb().db().collection(collectionNameItems)
          .updateOne(
              { _id: itemId }, // Filter by item ID
              { $set: updatedItem } // Update fields with new data
          );

      if (response.matchedCount > 0) {
          res.status(200).json({ message: `Item with ID ${itemId} updated successfully` });
      } else {
          res.status(404).json({ message: `Item with ID ${itemId} not found` });
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



const getCart = async (req, res) => {
  try {
    console.log('Fetching cart items...');
    const cartItems = await mongodb.getDb().db().collection(collectionCartItems).aggregate([
      {
        $group: {
          _id: "$itemId",
          quantity: { $sum: "$quantity" },
          item: { $first: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: collectionNameItems,
          localField: "_id",
          foreignField: "_id",
          as: "itemDetails"
        }
      },
      {
        $unwind: "$itemDetails"
      },
      {
        $project: {
          _id: 1,
          quantity: 1,
          item: "$itemDetails",
          totalPrice: { $multiply: ["$itemDetails.price", "$quantity"] } // Calculate total price
        }
      }
    ]).toArray();

    console.log('Cart items fetched:', cartItems);

    if (cartItems.length === 0) {
      console.log('No items found in the cart.');
      return res.status(404).json({ message: 'There are no registered items in the cart' });
    }

    res.status(200).json(cartItems);
    console.log('Response sent successfully.');
  } catch (err) {
    console.error('Error fetching cart items:', err.message);
    res.status(500).json({ message: err.message });
  }
};




 
const postItemtoCart = async (req, res) => {
  try {
    const itemId = new ObjectId(req.body.itemId);
    const email = req.body.email;

    const cartItem = {
      itemId: itemId,
      email: email,
      quantity: req.body.quantity || 1
    };

    const response = await mongodb.getDb().db().collection(collectionCartItems).insertOne(cartItem);
    if (response.acknowledged) {
      res.status(201).json(response);
    } else {
      res.status(500).json({ message: 'Some error occurred while adding the item to the cart' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}




module.exports = {
    getAll,
    getSingle,
    createItem,
    editItem,
    deleteItem,
    getItemRating,
    postItemRating,
    getItemComment,
    postItemComment,
    getCart,
    postItemtoCart
};
