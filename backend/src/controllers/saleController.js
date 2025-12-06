const Sale = require('../models/Sale');
const cache = require('../utils/cache');

exports.getSales = async (req, res) => {
  try {
    const cacheKey = JSON.stringify(req.query);
    const cachedData = cache.get(cacheKey);
    if (cachedData) return res.json(cachedData);

    const { 
      page = 1, limit = 10, search, 
      regions, categories, paymentMethods, genders, tags,
      minAge, maxAge, startDate, endDate, 
      sortBy = 'customerName', sortOrder 
    } = req.query;

    const query = {};

    // 1. Search Logic
    if (search) {
      const terms = search.trim().split(/\s+/);
      const regexConditions = terms.map(term => ({
        $or: [
          { customerName: new RegExp(term, 'i') },
          { phoneNumber: new RegExp(term, 'i') },
          { email: new RegExp(term, 'i') }
        ]
      }));
      query.$and = regexConditions;
    }

    // 2. Filter Logic
    if (regions) query.customerRegion = { $in: regions.split(',') };
    if (categories) query.productCategory = { $in: categories.split(',') };
    if (paymentMethods) query.paymentMethod = { $in: paymentMethods.split(',') };
    if (genders) query.gender = { $in: genders.split(',') };
    if (tags) query.tags = { $in: tags.split(',') };

    if (minAge || maxAge) {
      query.age = {};
      if (minAge) query.age.$gte = Number(minAge);
      if (maxAge) query.age.$lte = Number(maxAge);
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // 3. Sorting Logic
    const sortOptions = {};
    const sortKeyMap = { date: 'date', quantity: 'quantity', customerName: 'customerName', amount: 'totalAmount' };
    const dbSortKey = sortKeyMap[sortBy] || 'date';
    
    let direction = -1; 
    if (sortOrder) {
      direction = sortOrder === 'asc' ? 1 : -1;
    } else {
      direction = sortBy === 'customerName' ? 1 : -1;
    }
    sortOptions[dbSortKey] = direction;

    // 4. Pagination Config
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // 5. Execution: Get Data with Projection
    // Only fetch fields actually used by the Frontend to save bandwidth
    const projection = {
        _id: 1,
        date: 1,
        customerId: 1,
        customerName: 1,
        phoneNumber: 1,
        gender: 1,
        age: 1,
        productCategory: 1,
        productName: 1, 
        quantity: 1,
        totalAmount: 1,
        tags: 1
    };

    const sales = await Sale.find(query)
      .select(projection)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    const total = await Sale.countDocuments(query);

    // 6. Execution: Get Stats (Aggregation)
    const statsPipeline = [
      { $match: query },
      {
        $group: {
          _id: null,
          totalUnits: { $sum: "$quantity" },
          totalAmount: { $sum: "$totalAmount" },
          totalDiscount: { $sum: "$discountPercentage" } 
        }
      }
    ];

    const statsResult = await Sale.aggregate(statsPipeline);
    const stats = statsResult[0] || { totalUnits: 0, totalAmount: 0, totalDiscount: 0 };

    const response = {
      data: sales,
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum), limit: limitNum },
      stats: {
        units: stats.totalUnits,
        amount: stats.totalAmount,
        discount: stats.totalDiscount
      }
    };

    cache.set(cacheKey, response);
    res.json(response);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server Error' });
  }
};