const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const User=require('../models/user')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const {JWT_SECRET} =require('../config/dev')
const requireSignIn=require('../middlewares/requireSignIn')




router.post('/signup',(req,res)=>{
    const {email,password,name}=req.body
    if(!email || !password ||!name){
       return res.status(422).json({error:'All filed are mandatory'})
    }
  User.findOne({email:email})
  .then(user=>{
      if(user) return res.status(422).json({error:'User already exists'})
      bcrypt.hash(password,12)
      .then(hashedPassword=>{
          req.body.password=hashedPassword
          const newUser=new User(req.body)
          newUser.save()
          .then(savedUser=>res.json({message:'user saved successfully',savedUser}))
          .catch(err=>console.log(err))

      })
     
  })
  .catch(err=>console.log(err))

})


router.post('/signin',(req,res)=>{
    const {email,password}=req.body
    if(!email || !password) return res.status(422).json({error:'Provide email or password lo login'})
    
    User.findOne({email:email})
    .then(user=>{
        if(!user) return res.status(422).json({error:'Invalid email or password'})
        bcrypt.compare(password,user.password)
        .then(match=>{
            if(match){
                // res.json({message:'Signed in successfully'})
                user.password=undefined
                const token=jwt.sign({_id:user._id},process.env.JWT_SECRET)
                res.json({token,user})
            }else{
                res.json({error:'email or password is incorrect'})
            }
        })
    })
    .catch(err=>console.log(err))

})





module.exports=router