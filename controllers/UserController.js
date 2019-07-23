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

exports.store = function(req, res) {
    models.User.create({
        username: req.body.username
    })
    .then(function() {
        res.redirect('/');
    })
    .catch(function(e){
        res.send(e)
    });
};