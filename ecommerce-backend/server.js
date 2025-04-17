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
app.use(cookieParser());
app.use(cors());
app.use('/public',express.static(path.join(__dirname,'views')));

app.use('/api/auth',authRoutes);
app.use('/api/products',productRoutes);
app.use('/api/cart',cartRoutes);
app.use('/api/checkout',orderRoutes);

app.get('/',(req,res)=>{
    res.send("Hello!");
})

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