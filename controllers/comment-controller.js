const { Comment, Pizza } = require("../models");

const commentController = {
  //add comment to pizza
  // add comment to pizza
  addComment({ params, body }, res) {
    console.log(body);
    //create a comment
    Comment.create(body)
      //take the just created comment's id
      .then(({ _id }) => {
        //find the pizza with this id
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          //add comment id to just founded pizza
          { $push: { comments: _id } },
          //return the data of this pizza updated
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
  //remove comment
  removeComment({ params }, res) {
    //find the comment with this id and delete it from the collection
    Comment.findOneAndDelete({ _id: params.commentId })
      //return the data of the comment just deleted form the collection.
      .then((deletedComment) => {
        if (!deletedComment) {
          return res.status(404).json({ message: "No comment with this id!" });
        }
        //find the pizza with this id
        return Pizza.findOneAndUpdate(
          { _id: params.pizzaId },
          //remove the comment with this id from the pizza
          { $pull: { comments: params.commentId } },
          //return the updated pizza
          { new: true }
        );
      })
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        //return the updated data for this pizza.
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
  addReply({ params, body }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $push: { replies: body } },
      { new: true }
    )
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
  removeReply({ params }, res) {
    Comment.findOneAndUpdate(
      { _id: params.commentId },
      { $pull: { replies: { replyId: params.replyId }} },
      { new: true }
    )
      .then((dbPizzaData) => {
        if (!dbPizzaData) {
          res.status(404).json({ message: "No pizza found with this id!" });
          return;
        }
        res.json(dbPizzaData);
      })
      .catch((err) => res.json(err));
  },
};


module.exports = commentController;
