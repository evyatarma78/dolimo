const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');  

// Define the Customer model
const Customer = sequelize.define('Customer', {
  customer_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    allowNull: true,
  },
  full_name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'customers',
  timestamps: true,  
});

module.exports = Customer;
