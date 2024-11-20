// app.js
const express = require('express');
const app = express();

// Define a simple route
app.get('/', (req, res) => {
  res.status(200).send('Hello, World!');
});

// Export the app for testing
module.exports = app;
