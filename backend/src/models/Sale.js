const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  // Customer Details
  customerId: String,
  customerName: { type: String, index: true },
  phoneNumber: { type: String, index: true },
  gender: String,
  age: Number,
  customerRegion: String,
  customerType: String,

  // Product Details
  productId: String,
  productName: String,
  brand: String,
  productCategory: { type: String, index: true },
  tags: [String],

  // Transaction Details
  quantity: Number,
  pricePerUnit: Number,
  discountPercentage: Number,
  totalAmount: Number,
  finalAmount: Number,
  
  // Operational Details
  date: { type: Date, index: true },
  paymentMethod: String,
  orderStatus: String,
  deliveryType: String,
  storeId: String,
  storeLocation: String,
  salesPersonId: String,
  employeeName: String
});

// Text Indexes for Search
SaleSchema.index({ customerName: 'text', phoneNumber: 'text' });

// Compound Indexes for Performance Optimization
// These allow MongoDB to filter and sort without scanning the whole collection
SaleSchema.index({ productCategory: 1, date: -1 });
SaleSchema.index({ customerRegion: 1, date: -1 });
SaleSchema.index({ gender: 1, date: -1 });
SaleSchema.index({ paymentMethod: 1, date: -1 });

module.exports = mongoose.model('Sale', SaleSchema);