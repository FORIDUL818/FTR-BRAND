// ragistration start
const userModel = require("../../Models/Usermodel");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken");
const SendEmailUtility = require("../../Utility/SendMailUtility");
const OtpModel = require("../../Models/OtpModel");

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
// send otp start
  const emailRecovary=async (req,res) => {
    try {
        const email = req.params.email;
        const otp = Math.floor(Math.random() * 1000000); // Generate a random OTP

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(200).json({ status: "fail", data:"User not found" });
        }

        // Create a new entry in the OtpModel to store the OTP
        const createdOtp = await OtpModel.create({email,otp});

        // Send the OTP via email
        const sendMailResult = await SendEmailUtility(email, `Your OTP for account recovery: ${otp}`, "Account Recovery OTP");

        return res.status(200).json({
            status: "success",
            data: "Email and OTP verification sent successfully",
             sendMailResult: sendMailResult,
             createdOtp:createdOtp
        });
    } catch (err) {
        res.status(200).json({ status: "failed", data: err.message });
    }
  }
// send otp end

// otp varification start 
const OtpVarification = async (req, res) => {
    try {
        const { email, otp } = req.params; // Extract email and otp from request parameters
        const status = 0; // Default status for unused OTP
        const statusUpdate = 1; // Status update to mark OTP as used

        // Check if OTP exists and has the correct status
        const otpCheck = await OtpModel.aggregate([
            {
                $match: {
                    email: email,
                    otp: otp,
                    status: status
                }
            },
            {
                $count: "total"
            }
        ]);

        // If OTP record found
        if (otpCheck.length > 0 && otpCheck[0].total > 0) {
            // Update OTP status
            const otpUpdate = await OtpModel.updateOne(
                { email: email, otp: otp, status: status },
                { $set: { status: statusUpdate } }
            );

            // Return success response
            return res.status(200).json({ 
                status: "success", 
                message: "OTP verified successfully.", 
                data: otpUpdate 
            });
        } else {
            // OTP not found or already used
            return res.status(400).json({ 
                status: "failed", 
                message: "Invalid or expired OTP." 
            });
        }
    } catch (err) {
        // Handle unexpected errors
        return res.status(500).json({ 
            status: "failed", 
            message: "An error occurred during OTP verification.", 
            error: err.message 
        });
    }
};

// Exporting the module

const passwordReset= async(req,res)=>{
    let email=req.body.email;
    let otp=req.body.otp;
    let statusUpdate=1
    let newPassword=req.body.password
  try{
let otpchack=await OtpModel.aggregate(
    [
        {$match:{email:email,otp:otp,status:statusUpdate}},
        {$count:"total"}
      ]
     )
     if(otpchack.length>0){
     let updatePassword=await userModel.updateOne({email:email},{password:newPassword})
     res.status(200).json({status:"success",data:updatePassword})
    }
}
catch(err){
res.status(200).status({status:"faild",data:err})
}
}

module.exports = {
    login,
    resitration, // Assuming this is defined elsewhere
    OtpVarification, 
    emailRecovary,
    passwordReset // Assuming this is defined elsewhere
};
