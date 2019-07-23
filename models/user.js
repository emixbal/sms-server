'use strict';
var crypto = require('crypto');
require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };

  User.beforeCreate((user, options) => {
    var passwordHash = crypto.pbkdf2Sync(user.password, process.env.PASSWORD_KEY, 1000, 64, `sha512`).toString(`hex`);
    user.password = passwordHash;
    return user;
  });

  return User;
};