const express=require("express");
const { test } = require("../Controllers/UserControllers/UserController");
const router=express.Router()

router.get("/test",test);

module.exports=router;