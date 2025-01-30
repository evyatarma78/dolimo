require("dotenv").config();
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const sequelize = require("./config/config");
const documentRoutes = require("./routes/documentRoutes");
const Customer = require("./models/customer");
const { Document } = require("./models/document");
const parseDate = require("./helpers/parseDate");

const app = express();
const port = 4000;
// Utility function for logging with timestamps
const log = (message, type = "info") => {
  const timestamp = new Date().toISOString();
  const prefix = type === "error" ? "❌" : type === "success" ? "✅" : "🔹";
  console.log(`${prefix} [${timestamp}] ${message}`);
};

// Middleware setup
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api", documentRoutes);

// Health Check Endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

// Document fetch function
const fetchCustomerDocuments = async (customerId, transaction) => {
  try {
    log(`Fetching documents for customer: ${customerId}`);
    const response = await axios.post(
      `https://api.rivhit.co.il/online/RivhitOnlineAPI.svc/Document.List`,
      {
        api_token: "decd03e5-e35c-41e8-84f7-fba2fb483928",
        filter_fields: [{ filter_field: "document_type", filter_value: "7" }],
      }
    );

    
    if (!response.data || !response.data.data.document_list) {
      log(`No documents found for customer: ${customerId}`, "error");
      return;
    }

    const documents = response.data.data.document_list;
    log(`Received ${documents.length} documents for customer ${customerId}`);

    for (const doc of documents) {
      const [docRecord, created] = await Document.findOrCreate({
        where: { document_number: doc.document_number },
        defaults: {
          document_number: doc.document_number,
          document_date: parseDate(doc.document_date) || new Date(),
          customer_id: customerId,
          document_total: doc.document_total || 0,
          is_canceled: doc.is_canceled || false,
          document_type_name: doc.document_type_name,
        },
        transaction,
      });

      if (!created) {
        await docRecord.update(
          {
            document_date: parseDate(doc.document_date) || new Date(),
            document_total: doc.amount || 0,
            is_canceled: doc.is_cancelled || false,
            document_type_name: doc.document_type_name,
          },
          { transaction }
        );
      }
    }
  } catch (error) {
    log(`Document fetch error for ${customerId}: ${error.message}`, "error");
  }
};

// Customer fetch function
const fetchCustomers = async () => {
  log("Starting customer sync...");
  const transaction = await sequelize.transaction();
  try {
    const response = await axios.post(
      `https://api.rivhit.co.il/online/RivhitOnlineAPI.svc/Customer.List`,
      {
        api_token: "decd03e5-e35c-41e8-84f7-fba2fb483928",
        filter_fields: [{ filter_field: "project_id", filter_value: "8" }],
      }
    );
    
    if (!response.data || !response.data.data.customer_list) {
      log("No customers found", "error");
      await transaction.rollback();
      return;
    }

    const customers = response.data.data.customer_list;
    log(`Received ${customers.length} customers.`);

    for (const customer of customers) {
      const [customerRecord, created] = await Customer.findOrCreate({
        where: { customer_id: customer.customer_id },
        defaults: {
          customer_id: customer.id,
          full_name: customer.full_name || "",
        },
        transaction,
      });

      if (!created) {
        await customerRecord.update(
          { full_name: `${customer.first_name } ${customer.last_name}` || "" },
          { transaction }
        );
      }
      await fetchCustomerDocuments(customer.customer_id, transaction);
    }

    await transaction.commit();
    log("Customer sync completed successfully", "success");
  } catch (error) {
    await transaction.rollback();
    log(`Customer sync failed: ${error.message}`, "error");
  }
};


// Server initialization
// Add this function at the top with other functions
const validateAndCreateTables = async () => {
  try {
    // Check if tables exist
    const tables = await sequelize.showAllSchemas();
    const hasCustomers = tables.some(t => t.Tables_in_rivhitDB === 'Customers');
    const hasDocuments = tables.some(t => t.Tables_in_rivhitDB === 'Documents');

    if (!hasCustomers || !hasDocuments) {
      log("Some tables are missing. Creating tables...");
      await sequelize.sync({ force: false });
      log("Tables created successfully", "success");
    } else {
      log("All required tables exist", "success");
    }
    return true;
  } catch (error) {
    log(`Table validation failed: ${error.message}`, "error");
    return false;
  }
};

// Replace the server initialization code with this:
sequelize
  .authenticate()
  .then(async () => {
    log("Database connected", "success");
    
    // Validate and create tables if needed
    const tablesReady = await validateAndCreateTables();
    if (!tablesReady) {
      throw new Error("Failed to validate/create tables");
    }

    // Start server and fetch data
    app.listen(port, () => {
      log(`Server running on http://localhost:${port}`, "success");
      fetchCustomers();
      setInterval(fetchCustomers, 300000);
    });
  })
  .catch((err) => {
    log(`Server initialization failed: ${err.message}`, "error");
    process.exit(1);
  });