const express=require('express')
require('dotenv').config()
const app=express()
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
const cors=require('cors')

app.use(express.json())
app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(cors())

const authRoute=require('./routes/auth')
const postRoute=require('./routes/post')
const userRoute=require('./routes/user')

//const {ATLAS_URI}=require('./config/dev')
mongoose.connect(process.env.ATLAS_URI,{useNewUrlParser:true,useCreateIndex:true,useUnifiedTopology:true});
const connection=mongoose.connection;
connection.once('open',()=>{console.log('mongoDB connection established')})

app.use('/',authRoute)
app.use('/',postRoute)
app.use('/',userRoute)

const port=process.env.PORT || 3001

if(process.env.NODE_ENV=='production'){
    app.use(express.static('client/build'))
    const path=require('path')
    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(__dirname,'client','build','index.html'))
    })
}

app.listen(port,()=>console.log(`server is running on port ${port}`))