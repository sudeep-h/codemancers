const User = require('../models/User');
const jwt = require('jsonwebtoken');

const createToken=(user)=>{
    return jwt.sign(
        {id:user._id,role:user.role},
        process.env.JWT_SECRET,
        {expiresIn:'1d'}
    );
};

exports.registerUser=async (req,res)=>{
    try{
        const{email,password,role}=req.body;
        // console.log({email,password,role});
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"Email already registered"});
        }

        const user=await User.create({email,password,role});

        const token=createToken(user);

        res.cookie('token',token,{httpOnly:true});
        res.status(201).json({message:"Registered Successfully",user:{email:user.email,role:user.role}});
    
    }catch(err){
        res.status(500).json({message:"Server Error",error:err.message});
    }
};

exports.loginUser=async(req,res)=>{
    try{
        const {email,password}=req.body;
        console.log({email,password})
        const user=await User.findOne({email});
        console.log("user",user);
        if(!user || !(await user.comparePassword(password))){
            return res.status(401).json({message:"Invalid Credentials"});
        }

        const token=createToken(user);

        // res.cookie('token',token,{httpOnly:true});
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax'
        });
          

        res.status(200).json({token,message:`Hello,${user.email}`,user:{email:user.email,role:user.role }});
    }catch(err){
        res.status(500).json({message:"Server Error",error:err.message});
    }
}

exports.logoutUser=async(req,res)=>{
    res.clearCookie('token');
    res.status(200).json({message:"Logged out successfully"});
}