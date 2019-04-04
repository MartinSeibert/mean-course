const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const fs = require('fs');

// read connectionstring in from outside of the repo to avoid pushing the password to github
var mongoConnectionString = fs
  .readFileSync('../mongoConnectionString.txt')
  .toString();

console.log(mongoConnectionString);

const Post = require('./models/post.js');

// creates an Express App
// Express apps are a chain of middleware functions
const app = express();

mongoose
  .connect(mongoConnectionString.toString())
  .then(() => {
    console.log('connected to database!');
  })
  .catch(() => {
    console.log('connection failed!');
  });

// adds body parser to parse json data and make it available on the req object
app.use(bodyParser.json());

// this middleware allows for Cross Origin Resource Sharing so the api can be hit from outside of the server it is running on
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PATCH, DELETE, OPTIONS'
  );
  next();
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then(documents => {
    res.status(200).json({
      message: 'Posts fetched successfully',
      posts: documents
    });
  });
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post(req.body);

  // get the results of the save in order to pass the object id in the response
  post.save().then(result => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: result._id
    });
  });

});


app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
  });
  res.status(200).json({message: 'post deleted'});
});
// makes the app available to the server
module.exports = app;
