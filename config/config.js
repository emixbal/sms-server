require('dotenv').config();
module.exports = {
  "development": {
    "username": process.env.DB_USERNAME,
    "password": process.env.DB_PASS,
    "database": process.env.DB_DATABASE,
    "host": process.env.DB_HOST,
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "test": {
    "username": "root",
    "password": null,
    "database": "database_test",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "operatorsAliases": false
  },
  "production": {
    "username": "jpccabvrrateqc",
    "password": "f59a044ef1ba9b8029d376f24beaaae7eadcac3f164f1d6b3f5264283541dac0",
    "database": "db08eas3ichar5",
    "host": "postgres://jpccabvrrateqc:f59a044ef1ba9b8029d376f24beaaae7eadcac3f164f1d6b3f5264283541dac0@ec2-79-125-2-142.eu-west-1.compute.amazonaws.com:5432/db08eas3ichar5",
    "dialect": "postgres",
    "operatorsAliases": false
  }
}
