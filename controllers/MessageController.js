var model = require('../models');

exports.index = function(req, res) {
    model.User.findAll({})
    .then(function(users){
        res.send(users)
    })
    .catch(function(e){
        res.send(e)
    })
};