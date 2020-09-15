const express=require('express')
const router=express.Router()
const Post =require('../models/post')
const requireSignIn = require('../middlewares/requireSignIn')



router.get('/allposts',requireSignIn,(req,res)=>{
    Post.find()
    .populate('postedBy','_id name email')
    .populate('comments.postedBy','_id name')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>console.log(err))
})



router.post('/createpost',requireSignIn,(req,res)=>{
    const {title,body,pic}=req.body
    if(!title || !body ||!pic) return res.status(422).json({error:'Please add all the fields'})
   
    const post=new Post({
        title,
        body,
        photo:pic,
        postedBy:req.user
    })

    post.save()
    .then(result=>res.json({post:result}))
    .catch(err=>console.log(err))
})


router.get('/myposts',requireSignIn,(req,res)=>{

    Post.find({postedBy:req.user._id})
    .populate('postedBy','_id name')
    .then(posts=>res.json({posts}))
    .catch(err=>console.log(err))
})

//post can be used
router.put('/like',requireSignIn,(req,res)=>{
    Post.findByIdAndUpdate({_id:req.body.postId},{
        $push:{likes:req.user._id}
       
    },{new:true})
    .exec((err,data)=>{
        if(err) return res.status(422).json({error:'err'})
        res.json(data)
    })

})


router.put('/unlike',requireSignIn,(req,res)=>{
    Post.findByIdAndUpdate({_id:req.body.postId},{
        $pull:{likes:req.user._id}
       
    },{new:true})
    .exec((err,data)=>{
        if(err) return res.status(422).json({error:'err'})
        res.json(data)
    })

})

router.put('/comment',requireSignIn,(req,res)=>{

    const comment={
       text:req.body.text,
       postedBy:req.user._id
    }

    Post.findByIdAndUpdate({_id:req.body.postId},{
        $push:{comments:comment}
       
    },{new:true})
    .populate('comments.postedBy','_id name')
    .populate('postedBy','_id name')
    .exec((err,data)=>{
        if(err) return res.status(422).json({error:'err'})
        res.json(data)
    })

})


router.delete('/deletepost/:postId',requireSignIn,(req,res)=>{
    Post.findOne({_id:req.params.postId})
    .populate('postedBy','_id')
    .exec((err,post)=>{
        if(err || !post) return res.status(422).json({error:'err'})
        if(post.postedBy._id.toString()===req.user._id.toString()){
          post.remove()
          .then(result=>res.json(result))
          .catch(err=>console.log(err))
        }
    })
})

router.put('/deletecomment/:postId/:commentId',requireSignIn,(req,res)=>{
    console.log(req.headers)
    const postId=req.params.postId
    const commentId=req.params.commentId
    Post.findOneAndUpdate({_id:postId},{
        $pull:{comments:{_id:commentId}}
       
    },{new:true})
    .populate('comments.postedBy','_id name')
    .exec((err,data)=>{
        if(err) return res.status(422).json({error:err})
        res.json(data)
    })
})


router.get('/getFollowPost',requireSignIn,(req,res)=>{
    Post.find({postedBy:{$in:req.user.following}})
    .populate('postedBy','_id name email')
    .populate('comments.postedBy','_id name')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>console.log(err))
})



module.exports=router