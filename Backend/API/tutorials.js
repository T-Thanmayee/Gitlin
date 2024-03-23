const exp=require('express')
const tutorials=exp.Router();
const bycryptjs=require('bcrypt')
const jwt=require('jsonwebtoken')
const eah=require('express-async-handler')
require('dotenv').config
let tutorial
tutorials.use((req,res,next)=>{
    tutorial=req.app.get("tutorials")
    
   next()
})

tutorials.post('/newtutorial',eah(async(req,res)=>{
    const newtutorial=req.body
    await tutorial.insertOne(newtutorial)
    res.send({message:"done"})
}))
tutorials.get('/alltutorials',eah(async(req,res)=>{
    let alltutorials=await tutorial.find({status:true}).toArray()
    res.send({message:"done",payload:alltutorials})
}))
module.exports=tutorials;