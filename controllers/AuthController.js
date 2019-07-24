require('dotenv').config();
var validator = require('validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var nodemailer = require('nodemailer');


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

        var newData = {
            id:user.id,
            email:user.email,
            username:user.username,
            isActive:user.isActive
        }
        
        var token = await jwt.sign(newData, process.env.SECRET_KEY);

        return res.send({
            'token':token
        })
    })
    .catch(function(e){
        return res.status(400).send({'message':'Bad Request!'})
    })
};

async function sendEmail(email, token){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_ACCOUNT,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: 'sender@email.com', // sender address
        to: email, // list of receivers
        subject: 'verify ur email', // Subject line
        html: `<a href="http://localhost:3000/auth/verify?token=${token}" >klik to verify</a>`// plain text body
    };

    await transporter.sendMail(mailOptions, function (err, info) {
        if(err)
            // console.log(err)
            return res.send(err)
        else
            // console.log(info);
            return res.send(err)
    });
}

exports.register = async function(req, res) {
    if(validator.isEmail(req.body.email)==false)
        return res.status(400).send({'message':'Email kosong atau format salah!'})

    if(validator.isLength(req.body.password, {min:8, max: 10})==false)
        return res.status(400).send({'message':'Panjang password min 8 char, max 8 char'})

    await model.User.findOne({ where: {email: req.body.email},  })
    .then(function(user){
        if(user != null)
            return res.status(200).send({'message':'email anda telah terdaftar'})
    })
    .catch(function(e){
        console.log('error cek email terdaftar',e);
        res.status(400).send({'message':'error'})
    })

    var salt = crypto.randomBytes(16).toString('hex');
    var emailToken = await crypto.pbkdf2Sync(req.body.email, salt, 1000, 32, `sha512`).toString(`hex`);
	
    await model.User.create({
        name: req.body.name,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        emailToken: emailToken,
    })
    .then(async function(user){
        await sendEmail(user.email, user.emailToken)

        var newUser = {
            id: user.id,
            email: user.email,
            username: user.username,
        }
        return res.status(201).send({
            data: newUser,
            message: 'verify your email!'
        })
    })
    .catch(function(e){
        console.log('error register new user',e);
        res.status(400).send({'message':"error"})
    })
}

exports.verifyEmail = function(req, res) {
    var token = req.query.token;
    model.User.scope('withEmailToken').findOne({ where: {emailToken: token} })
    .then(function(user){
        if(user==null)
            return res.status(404).send({'message':'link invalid'})

        model.User.update(
            {
                emailToken: null,
                isActive: true
            },
            {where: { id: user.id }}
        )
        .then(function(result) {
            res.status(200).send({"message":"success, user now is verified"})
        })
        .catch(function(e){
            console.log('error update token and isActive',e);
            res.status(400).send({'message':"error"})
        })
    })
    .catch(function(e){
        console.log('error verify email',e);
        res.status(400).send({'message':"error"})
    })
}