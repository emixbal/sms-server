require('dotenv').config();
var crypto = require('crypto');
var jwt = require('jsonwebtoken');

var model = require('../models');

exports.login = function(req, res) {
    var email = req.body.email;
    var password = req.body.password
    model.User.scope('withPassword').findOne({ where: {email: email} })
    .then(async function(user){
        if(user==null)
            return res.status(401).send({'message':'user tidak ditemukan'})

        var passwordHash = await crypto.pbkdf2Sync(password, process.env.PASSWORD_KEY, 1000, 64, `sha512`).toString(`hex`);
        if(user.password != passwordHash)
            return res.status(401).send({'message':'wrong password'})

        var newUser = {
            id:user.id,
            email:user.email,
            username:user.username,
        }
        
        var token = await jwt.sign(newUser, process.env.SECRET_KEY);

        return res.send({
            'token':token
        })
    })
    .catch(function(e){
        return res.status(400).send({'message':'Bad Request!'})
    })
};

exports.register = function(req, res) {
    model.User.create(req.body)
    .then(function(user){
        res.send(user)
    })
    .catch(function(e){
        console.log(e);
        res.send({'message':'error'})
    })
}