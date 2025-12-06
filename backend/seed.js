const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const Sale = require('./src/models/Sale');

// REPLACE WITH YOUR CONNECTION STRING
const MONGO_URI = 'mongodb+srv://divyam:pass@cluster0.nwthydx.mongodb.net/?appName=Cluster0'; 

mongoose.connect(MONGO_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

const BATCH_SIZE = 5000;
let batch = [];
let counter = 0;

// Helper: safe number parsing (returns null if invalid, not 0)
const parseNumber = (val) => {
  if (!val || val === '') return null;
  const num = Number(val);
  return isNaN(num) ? null : num;
};

// Helper: safe date parsing
const parseDate = (val) => {
  if (!val) return null;
  const date = new Date(val);
  // Check if date is "Invalid Date"
  return isNaN(date.getTime()) ? null : date;
};

// Helper: map CSV headers to Schema keys
const mapKey = (key) => {
  const map = {
    'Customer ID': 'customerId',
    'Customer Name': 'customerName',
    'Phone Number': 'phoneNumber',
    'Gender': 'gender',
    'Age': 'age',
    'Customer Region': 'customerRegion',
    'Customer Type': 'customerType',
    'Product ID': 'productId',
    'Product Name': 'productName',
    'Brand': 'brand',
    'Product Category': 'productCategory',
    'Tags': 'tags',
    'Quantity': 'quantity',
    'Price per Unit': 'pricePerUnit',
    'Discount Percentage': 'discountPercentage',
    'Total Amount': 'totalAmount',
    'Final Amount': 'finalAmount',
    'Date': 'date',
    'Payment Method': 'paymentMethod',
    'Order Status': 'orderStatus',
    'Delivery Type': 'deliveryType',
    'Store ID': 'storeId',
    'Store Location': 'storeLocation',
    'Salesperson ID': 'salesPersonId',
    'Employee Name': 'employeeName'
  };
  return map[key] || key;
};

const insertBatch = async (data) => {
  try {
    // ordered: false prevents the whole batch from failing if 1 document is bad
    await Sale.insertMany(data, { ordered: false });
    process.stdout.write(`.`); 
  } catch (err) {
    // If it's a write error (duplicate key etc), we just log it and move on
    if (err.writeErrors) {
       console.log(`\nWarning: Skipped ${err.writeErrors.length} bad entries in this batch.`);
    } else {
       console.error('\nCritical Error:', err);
    }
  }
};

const run = async () => {
  console.log('Clearing old data...');
  try {
      await Sale.deleteMany({});
  } catch(e) {
      console.log("No data to clear or connection issue");
  }
  
  console.log('Old data cleared. Starting stream...');

  const stream = fs.createReadStream('truestate_assignment_dataset.csv')
    .pipe(csv({ mapHeaders: ({ header }) => mapKey(header.trim()) }));

  for await (const data of stream) {
    
    // 1. Clean Tags
    if (data.tags) {
      if (typeof data.tags === 'string') {
        data.tags = data.tags.split(',').map(t => t.trim()).filter(t => t !== '');
      }
    } else {
      data.tags = [];
    }

    // 2. Clean Numbers (Handle empty strings, "N/A", etc)
    data.age = parseNumber(data.age);
    data.quantity = parseNumber(data.quantity);
    data.pricePerUnit = parseNumber(data.pricePerUnit);
    data.discountPercentage = parseNumber(data.discountPercentage);
    data.totalAmount = parseNumber(data.totalAmount);
    data.finalAmount = parseNumber(data.finalAmount);

    // 3. Clean Date
    data.date = parseDate(data.date);

    // 4. Handle Missing Strings
    data.customerName = data.customerName || "Unknown";
    
    // Only add to batch if we have at least a date and amount (Business Logic)
    // You can remove this 'if' if you want to keep absolutely everything
    if (data.date) {
        batch.push(data);
        counter++;
    }

    if (batch.length >= BATCH_SIZE) {
      await insertBatch(batch);
      batch = [];
      console.log(` Processed ${counter} records`);
    }
  }

  if (batch.length > 0) {
    await insertBatch(batch);
  }

  console.log('\nSUCCESS: Data import finished!');
  process.exit();
};

run();