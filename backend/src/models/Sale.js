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

SaleSchema.index({ customerName: 'text', phoneNumber: 'text' });

module.exports = mongoose.model('Sale', SaleSchema);