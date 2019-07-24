var express = require('express');
var router = express.Router();


var model = require('../models');

var UserController = require('../controllers/UserController');

router.get('/', UserController.index );
router.post('/', UserController.store );

module.exports = router;
