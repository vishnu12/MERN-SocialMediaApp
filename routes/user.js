const express=require('express')
const router=express.Router()
const mongoose=require('mongoose')
const User=require('../models/user')
const Post=require('../models/post')
const requireSignIn = require('../middlewares/requireSignIn')




router.get('/user/:userId',requireSignIn,(req,res)=>{
      User.findOne({_id:req.params.userId})
      .select('-password')
      .then(user=>{
          Post.find({postedBy:req.params.userId})
          .populate('postedBy','_id name')
          .then(post=>res.json({user,post}))
          .catch(err=>console.log(err))
      })
      .catch(err=>{
          return res.status(404).json({error:'user not found'})
      })
})

router.put('/follow',requireSignIn,(req,res)=>{
   User.findByIdAndUpdate(req.body.followId,{
       $push:{followers:req.user._id}
   },{new:true},(err,data)=>{
       if(err) return res.status(422).json({error:err})
       User.findByIdAndUpdate(req.user._id,{
           $push:{following:req.body.followId}
       },{new:true})
       .select('-password')
       .then(result=>res.json(result))
       .catch(err=>{
           return res.status(422).json({error:err})
       })
    })
})


router.put('/unfollow',requireSignIn,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{new:true},(err,data)=>{
        if(err) return res.status(422).json({error:err})
        User.findByIdAndUpdate(req.user._id,{
            $pull:{following:req.body.unfollowId}
        },{new:true})
        .select('-password')
        .then(result=>res.json(result))
        .catch(err=>{
            return res.status(422).json({error:err})
        })
     })
 })

 router.put('/updatepic',requireSignIn,(req,res)=>{
     User.findByIdAndUpdate(req.user._id,{
         $set:{pic:req.body.pic}
    
     },{new:true},(err,user)=>{
        if(err) return res.status(422).json({error:err})
        res.json(user)
     })
 })


 router.delete('/user/:userId',requireSignIn,(req,res)=>{
    User.findOneAndRemove({_id:req.params.userId})
    .then(result=>{
        Post.deleteMany({postedBy:result._id},(err,data)=>{
            if(err) return res.json(err)
            res.json({message:'all posts deleted'})
        })
    })
    .catch(err=>res.json(err))
})


module.exports=router