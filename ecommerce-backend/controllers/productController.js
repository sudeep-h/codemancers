const Product = require('../models/Product');
const uploadToCloudinary=require('../middlewares/cloudinaryMiddleware');
const cloudinary = require('cloudinary').v2;
const mongoose=require('mongoose');

// Super Admin: Create a new product
exports.createProduct = async (req, res) => {
    try {
        const { title, description, price } = req.body;

        if (!title || !description || !price) {
            return res.status(400).json({ message: 'Title, description, and price are required' });
        }

        let imageUrl = null;

        if (req.file) {
            const uploadResult = await uploadToCloudinary(req.file.path);
            imageUrl = uploadResult.secure_url;
        }

        const newProduct = new Product({
            title,
            description,
            price,
            image: imageUrl,
        });

        await newProduct.save();
        res.status(201).json({ message: 'Product created successfully', product: newProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create product', error: error.message });
    }
};

// Super Admin / User: Get all products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        if (products.length === 0) {
        return res.status(404).json({ message: 'No products found' });
        }
        res.status(200).json({ products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get products', error: error.message });
    }
};