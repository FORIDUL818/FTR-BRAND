const express=require("express");
const {  resitration, emailRecovary, OtpVarification, login, passwordReset,} = require("../Controllers/UserControllers/UserController");
const router=express.Router()

router.post("/resitration",resitration);
router.post("/login",login);
router.post("/email-recovary/:email",emailRecovary);
router.get("/user-otp-varify-recovery/:email/:otp",OtpVarification);
router.post("/resetPassword",passwordReset);

module.exports=router; 