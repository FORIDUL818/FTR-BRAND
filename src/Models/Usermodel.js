const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const userSchima=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        validate:{
            validator:(v)=>{
                let emailRagex=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
                return emailRagex.test(v)

            },
            message:"your email is not corret"
        }
    },
    password:{
        type:String,
        required:true,
        set:(v)=>{
          return bcrypt.hashSync(v,bcrypt.genSaltSync(10))
        }
    }
},{versionKey:false,timestamps:true});

let userModel=mongoose.model("users",userSchima)
module.exports=userModel;