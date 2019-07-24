require('dotenv').config();
var validator = require('validator');
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

exports.register = async function(req, res) {
    if(validator.isEmail(req.body.email)==false)
        return res.status(400).send({'message':'Email kosong atau format salah!'})
    if(validator.isLength(req.body.password, {min:8, max: 10})==false)
        return res.status(400).send({'message':'Panjang password min 8 char, max 8 char'})

    await model.User.findOne({ where: {email: req.body.email} })
    .then(function(user){
        if(user != null)
            return res.status(200).send({'message':'email anda telah terdaftar'})
    })
    .catch(function(e){
        console.log('error cek email terdaftar',e);
        res.status(400).send({'message':'error'})
    })

    	
    await model.User.create(req.body)
    .then(function(user){
        var newUser = {
            id:user.id,
            email:user.email,
            username:user.username,
        }
        return res.status(201).send(newUser)
    })
    .catch(function(e){
        console.log('error register new user',e);
        res.status(400).send({'message':'error'})
    })
}