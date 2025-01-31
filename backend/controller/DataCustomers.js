const axios = require('axios');

const BASE_API_URL = 'https://api.rivhit.co.il/online/RivhitOnlineAPI.svc';
const API_TOKEN = 'decd03e5-e35c-41e8-84f7-fba2fb483928';

/**
 * Fetch customer data from the Rivhit API
 * @param {number} customerId - The customer ID to fetch
 * @returns {Promise<Object>} - The API response data
 */
const fetchCustomerData = async (customerId) => {
  try {
    const requestBody = {
      api_token: API_TOKEN,
      filter_fields: [{ filter_field: 'customer_id', filter_value: customerId.toString() }],
    };

    const { data } = await axios.post(`${BASE_API_URL}/Customer.List`, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return data;
  } catch (error) {
    console.error(`Error fetching data for customer ID ${customerId}:`, error.message);
    throw new Error('Failed to fetch customer data');
  }
};

/**
 * Express handler to fetch customer data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCustomerData = async (req, res) => {
  try {
    const customerIds = [12, 70]; // List of customer IDs to fetch
    const customerData = await Promise.all(customerIds.map(fetchCustomerData));

    console.log('Customer Data:', customerData);

    res.status(200).json({
      customers: customerData,
    });
  } catch (error) {
    console.error('Error in getCustomerData:', error.message);
    res.status(500).json({ error: 'Failed to retrieve customer data' });
  }
};

module.exports = { getCustomerData };
