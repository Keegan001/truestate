const express = require('express');
const router = express.Router();
const { getSales } = require('../controllers/saleController');

router.get('/', getSales);

module.exports = router;