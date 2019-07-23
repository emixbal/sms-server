var express = require('express');
var router = express.Router();

var AuthController = require('../controllers/AuthController');


/* GET users listing. */
router.post('/login', AuthController.login );

module.exports = router;