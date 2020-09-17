const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const User=require('../models/user')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const nodemailer=require('nodemailer')
const sendGridTransport=require('nodemailer-sendgrid-transport')

const transporter=nodemailer.createTransport({
    auth:{
        api_key:'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'
    }
})

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
          .then(savedUser=>{
              transporter.sendMail({
                  to:savedUser.email,
                  from:'no-reply@instagram.com',
                  subject:'signup success',
                  html:'<h1>Welcome to Instagram</h1>'
              })
              res.json({message:'user saved successfully',savedUser})
            })
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