const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/post');

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
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  next();
});

// if request starts with /api/posts, apply the postRoutes
// the request then hits the postRoutes with that portion already stripped from it
app.use('/api/posts', postsRoutes);

// makes the app available to the server
module.exports = app;
