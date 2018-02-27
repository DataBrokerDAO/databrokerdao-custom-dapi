const express = require('express');
const router = require('./router');

require('dotenv').load();

const port = process.env.APP_PORT;

// Initialize app.
const app = express();

app.use('/', router);

app.listen(port, () => {
  console.log('Server is running on port ' + port);
});

// Export app for tests.
module.exports = app;
