import eah from "express-async-handler";

import Product from "../models/product.js";

// @desc   Fetch all products
// @route  GET /api/products
// @access Public
export const getProducts = eah(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize) });
});

// @desc   Fetch single product
// @route  GET /api/products/:id
// @access Public
export const getProductById = eah(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  res.json(product);
});

// @desc   Delete product
// @route  DELETE /api/products/:id
// @access Private/Admin
export const deleteProduct = eah(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.remove();
  res.json({ message: "Product Removed" });
});

// @desc   Create product
// @route  POST /api/products
// @access Private/Admin
export const createProduct = eah(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "sample category",
    countInStock: 0,
    numReviews: 0,
    description: "Sample description",
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

// @desc   Update product
// @route  PUT /api/products/:id
// @access Private/Admin
export const updateProduct = eah(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  product.name = name;
  product.price = price;
  product.description = description;
  product.image = image;
  product.brand = brand;
  product.category = category;
  product.countInStock = countInStock;

  const updateProduct = await product.save();
  res.status(201).json(updateProduct);
});

// @desc   Create new review
// @route  POST /api/products/:id/reviews
// @access Private
export const createProductReview = eah(async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating) {
    throw new Error("Please choose a valid rating");
  }
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  const isReviewed = product.reviews.some((r) => r.user.toString() === req.user._id.toString());

  if (isReviewed) {
    res.status(400);
    throw new Error("Product already reviewed");
  }

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  product.reviews.push(review);
  product.numReviews = product.reviews.length;
  product.rating = product.reviews.reduce((acc, review) => review.rating + acc, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review Added" });
});

// @desc   Get top rated products
// @route  GET /api/products/top
// @access Public
export const getTopProducts = eah(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);
  res.json(products);
});
