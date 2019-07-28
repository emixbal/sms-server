var express = require('express');
var router = express.Router();

var model = require('../models');

var MessageController = require('../controllers/MessageController');

router.get('/', MessageController.index );

module.exports = router;
