'use strict';
var crypto = require('crypto');
var uuid = require('uuid/v4');

require('dotenv').config();

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    defaultScope: {
      attributes: { exclude: ['password'] },
    },
    scopes: {
      withPassword: {
        attributes: { include: ['password'] },
      }
    }
  });
  User.associate = function(models) {
    // associations can be defined here
  };

  User.beforeCreate((user, options) => {
    user.id = uuid();
    var passwordHash = crypto.pbkdf2Sync(user.password, process.env.PASSWORD_KEY, 1000, 64, `sha512`).toString(`hex`);
    user.password = passwordHash;
    return user;
  });

  return User;
};