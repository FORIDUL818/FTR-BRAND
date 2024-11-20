// ragistration start
const userModel = require("../../Models/Usermodel");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")
const resitration=async (req,res) => {
    try {
        let {firstName,lastName,email,password}=req.body;
        const userVarification=await userModel.findOne({email})
        if(userVarification){
            return res.status(401).json({status:"your Email already in use"})
        }
        let userData=await userModel.create({firstName,lastName,email,password});
        if (!userData) {
            return res.status(401).json({status:"something went rong"})
        }
        res.status(200).json({status:"success",data:userData})
    } catch (err) {
        res.status(401).json({status:"fail",data:err.message})
    }
    
}
// ragistration end

// login start
 const login=async (req,res) => {
    try {
        let {email,password}=req.body;

        const userData=await userModel.findOne({email})
        if(!userData){
            return res.status(401).json({status:"user not found"})
        }
        let ispassowrd=await bcrypt.compare(password,userData.password)
        if(!ispassowrd){
            return res.status(401).json({status:"your password is not found"})
        }
        else{
            let payload = { exp: Math.floor(Date.now() / 1000) + (60 * 60*24), data: userData.email };
            let token = jwt.sign(payload, process.env.JWT_SECRET);
            res.status(200).json({ status: "success", data: userData, Token: token});
        }
    } catch (error) {
        res.status(401).json({status:"fail",data:error})
    }
    
 }
// login end

module.exports={
    resitration,
    login
}