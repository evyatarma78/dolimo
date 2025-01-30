const axios = require('axios');
require('dotenv').config();

async function getCustomerData(req, res) {
  try {
    // Make the request to the API
     const requestBody1 = {
        api_token: process.env.API_TOKEN,
        "filter_fields": [
          {
            "filter_field": "customer_id",
            "filter_value": "12"
          
          }]
      };
      const requestBody2 = {
        api_token: API_TOKEN,
        "filter_fields": [
          {
            "filter_field": "customer_id",
            "filter_value": "70"
          
          }]
      };
  
      const response = await axios.post(`${BASE_API_URL}/Customer.List`, requestBody1, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          
        },
      });
      const response2 = await axios.post(`${process.env.BASE_API_URL}/Customer.List`, requestBody2, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.API_TOKEN}`,
          
        },
      });
      const all_Customers = JSON.stringify(response.data);
      const specific_Customers = JSON.stringify(response2.data);
      
      
      // Log the data to inspect its structure
      console.log('All Customers:',all_Customers);
      console.log('Specific Customers:',specific_Customers);
    // Send the response data back to the client
    res.status(200).json({
      response1: response.data,
      response2: response2.data,
    });
    
      
      // Respond with the fetched customer data
  } catch (error) {
    console.error('Error fetching customer data:', error);
    // Send an error response to the client
    res.status(500).json({ error: 'Failed to fetch customer data' });
  }
}

module.exports = { getCustomerData };
