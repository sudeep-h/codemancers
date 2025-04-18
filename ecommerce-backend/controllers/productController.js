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
    // console.log("req.hearders",req.headers);
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

exports.getAllProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to get product', error: error.message });
    }
};

// Super Admin: Update product by ID
exports.updateProduct = async (req, res) => {
    // console.log("Entered")
    const { id } = req.params;
    const { title, description, price } = req.body;
    console.log("req.body",req.body);
  
    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
    
        if (title) product.title = title;
        if (description) product.description = description;
        if (price) product.price = price;
    
        await product.save();
    
        res.status(200).json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to update product', error: error.message });
    }
};


// Super Admin: Delete product by ID
exports.deleteProduct = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid product ID' });
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
        return res.status(404).json({ message: 'Product not found' });
        }

        if (product.image) {
            const urlParts=product.image.split('/');
            const filePathWithExt=urlParts[urlParts.length-1];
            const publicId=filePathWithExt.split('.')[0];

            await cloudinary.uploader.destroy(`user_uploads/${publicId}`);
        }

        await product.deleteOne();
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to delete product', error: error.message });
    }
};
