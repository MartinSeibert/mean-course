const express = require('express');
const multer = require('multer');

const Post = require('../models/post');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "backend/images");
  }
});

router.get('', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    });
  });
});

router.post('', (req, res, next) => {
  const post = new Post(req.body);

  // get the results of the save in order to pass the object id in the response
  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: result._id
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: 'Post not found!'});
    }
  });
});

router.put('/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({ message: 'Update successful' });
  });
});

router.delete('/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {});
  res.status(200).json({ message: 'post deleted' });
});


module.exports = router;
