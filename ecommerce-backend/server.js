const express=require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path=require('path');
const cors=require('cors');

require('dotenv').config();

const app=express();

const authRoutes=require('./routes/authRoutes');
const productRoutes=require('./routes/productRoutes');
const cartRoutes=require('./routes/cartRoutes');
const orderRoutes=require('./routes/orderRoutes');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? 'https://ecommerce-backend-test-tuf5.onrender.com' 
        : 'http://localhost:5500',
    credentials: true,
};

app.use(cors(corsOptions));
app.get('/',(req,res)=>{
    // console.log('entered /')
    res.sendFile(path.resolve(__dirname, 'views', 'register.html'));
})
app.use(express.static(path.join(__dirname,'views')));

app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/checkout',orderRoutes);

if(process.env.NODE_ENV !=='test'){
        mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("MOngoDB connected successfully")
    })
    .catch((err)=>{
        console.log("MongoDB connection failed",err);
    })


    const PORT=process.env.PORT;
    app.listen(PORT,()=>{
        console.log(`Server running on port ${PORT}`);
    })
}



module.exports = app;