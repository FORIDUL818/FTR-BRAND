const express=require("express")
const cors=require("cors")
const dotenv=require("dotenv")
const bodyParser=require("body-parser")
const mongoConnect = require("./src/db/db")
const router = require("./src/Routes/router")
dotenv.config()
const app=express();

// middleware start
  app.use(cors())
  app.use(bodyParser.json())
  app.use("/api/v1",router)
app.use("*",(req,res)=>{
    res.status(404).json({status:"not found"})
})

// database connecet start
  mongoConnect()
  .then(()=>console.log("db conneced"))
  .catch((err)=>console.log(err))
// database connecet end
// middleware end
module.exports=app;
