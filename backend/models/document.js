const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');

const Document = sequelize.define('Document', {
  document_number: {
    type: DataTypes.STRING,
    primaryKey: true,
    allowNull: false,
  },
  document_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  customer_id: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  document_total: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  document_type_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  is_canceled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = { Document, sequelize };
