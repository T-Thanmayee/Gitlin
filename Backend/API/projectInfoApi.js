const exp=require('express')
const projectInfo=exp.Router();
const bycryptjs=require('bcrypt')
const jwt=require('jsonwebtoken')
const eah=require('express-async-handler')
require('dotenv').config

//const VerfiyToken=require('../Middleware/VerfiyToken')

let usersinfo
let projectinfo
projectInfo.use((req,res,next)=>{
     
     projectinfo=req.app.get("projectinfo")
    next()
})              
projectInfo.post('/newproject',eah(async(req,res)=>{
    const projectdetails=req.body
    const r=await projectinfo.insertOne(projectdetails)
    res.send({message:"done"})
}))
projectInfo.get('/getprojects',eah(async(req,res)=>{
    const projects=await projectinfo.find({status:true}).toArray()
    console.log(projects)
    res.send({message:"done",data:projects})
}))
module.exports=projectInfo;
// Define a Mongoose schema for the uploaded files