const express=require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path=require('path');

require('dotenv').config();

const app=express();

const authRoutes=require('./routes/authRoutes');

app.use(express.json());
app.use(cookieParser());
app.use('/public',express.static(path.join(__dirname,'public')));

app.use('/api/auth',authRoutes);

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