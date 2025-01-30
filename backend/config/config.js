const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('rivhitDB', 'root', 'neta1709', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    charset: 'utf8mb4',
  },

});

module.exports = sequelize;
