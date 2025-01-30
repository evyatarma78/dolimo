const { Sequelize } = require('sequelize');  
const { Document } = require('../models/document');

const getAllDocuments = async (req, res) => {
  try {
    const documents = await Document.findAll();
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve documents' });
  }
};



module.exports = {
  getAllDocuments,
};
