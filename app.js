// Load environment variables from .env file
require('dotenv').config();

const express = require('express');

// Example of accessing environment variables
const app = express();
const PORT = process.env.PORT || 3000;

function isTestEnv() {
  return process.env.NODE_ENV.trim() === 'test';
}

function isStagingEnv() {
  return process.env.NODE_ENV.trim() === 'staging';
}

// Timeout duration (1 hour in milliseconds)
// const INACTIVITY_TIMEOUT = 60 * 60 * 1000;
const value = process.env.INACTIVITY_TIMEOUT_SECOND || 86400;
const INACTIVITY_TIMEOUT = parseInt(value) * 1000;

let inactivityTimer;
let server; // Declare server outside to be used in tests

// Middleware to reset the inactivity timer
app.use((req, res, next) => {
  console.log('Request received, resetting inactivity timer.');
  resetInactivityTimer();
  next();
});

// Define routes
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

// Function to reset the inactivity timer
function resetInactivityTimer() {
  if (!isStagingEnv()) {
    return;
  }

  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
  }
  inactivityTimer = setTimeout(() => {
    console.log(`No activity for ${INACTIVITY_TIMEOUT / 1000} seconds, shutting down server.`);
    shutdownServer();
  }, INACTIVITY_TIMEOUT);
}

// Function to gracefully shut down the server
function shutdownServer() {
  if (server) {
    server.close(() => {
      console.log('Server has shut down.');
      process.exit(0); // Exit the process
    });
  }
}

// Start the server (only for non-test environments)
function startServer() {
  console.log(`The application is running in the ${process.env.NODE_ENV.trim()} environment.`);
  server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    resetInactivityTimer(); // Start the inactivity timer
  });
}


if (!isTestEnv()) {
  startServer(); // Only start the server in non-test environments
}

module.exports = { app, startServer, resetInactivityTimer, shutdownServer }; // Export app for testing
