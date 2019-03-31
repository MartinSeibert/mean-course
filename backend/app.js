const express = require('express');
const bodyParser = require('body-parser');

// creates an Express App
// Express apps are a chain of middleware functions
const app = express();

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

app.post('/api/posts', (req, res, next) =>{
  const post = req.body;
  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    {
      id: '1fsdafeqwqwr',
      title: 'Title 1',
      content: 'Content 1'
    },
    {
      id: '2vasczx',
      title: 'Title 2',
      content: 'Content 2'
    },
    {
      id: '3asdfaczx',
      title: 'Title 3',
      content: 'Content 3'
    }
  ];

  res.status(200).json({
    message: 'Posts sent successfully',
    posts: posts
  });
});

// makes the app available to the server
module.exports = app;
