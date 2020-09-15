
const express=require('express')
const mongoose=require('mongoose')
const {ObjectId}=mongoose.Schema.Types

const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    pic:{
        type:String,
        default:'https://res.cloudinary.com/vishnuj/image/upload/v1599971835/download_p3amcz.png'
    },
    followers:[{type:ObjectId,ref:'User'}],
    following:[{type:ObjectId,ref:'User'}]
},{timestamps:true})





module.exports=mongoose.model('User',userSchema)