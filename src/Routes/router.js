const express=require("express");
const {  resitration,login } = require("../Controllers/UserControllers/UserController");
const router=express.Router()

router.post("/resitration",resitration);
router.post("/login",login);

module.exports=router;