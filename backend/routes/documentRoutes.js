const express = require('express');
const router = express.Router();
const { getAllDocuments} = require('../controller/documentController');
const {getCustomerData} = require('../controller/DataCustomers');


// Route to fetch all documents
router.get('/documents', getAllDocuments);
router.get('/customerData', getCustomerData);
module.exports = router;
