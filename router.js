const express = require('express');
const router = express.Router();

const streamCategoriesHandlers = require('./handlers/stream/categories');

router.get('/stream/categories', streamCategoriesHandlers.getStreamCategories);

module.exports = router;
