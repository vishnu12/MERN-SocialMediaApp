const jwt=require('jsonwebtoken')
//const {JWT_SECRET}=require('../config/dev')
const User=require('../models/user')


module.exports=(req,res,next)=>{
    
    const {authorization}=req.headers
  
    if(!authorization) return res.status(401).json({error:'You must login first'})
    const token=authorization.split(" ")[1] 
    jwt.verify(token,process.env.JWT_SECRET,(err,data)=>{
        if(err) return res.status(401).json({error:'Invalid token'})
    const {_id}=data
    User.findById(_id)
    .then(user=>{
        req.user=user
        req.user.password=undefined
        next()
    })
    
    })

}