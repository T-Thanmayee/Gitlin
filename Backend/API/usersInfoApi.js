const exp=require('express')
const usersInfo=exp.Router();
const bycryptjs=require('bcrypt')
const jwt=require('jsonwebtoken')
const eah=require('express-async-handler')
require('dotenv').config

//const VerfiyToken=require('../Middleware/VerfiyToken')

let usersinfo
let projectinfo
let postinfo
usersInfo.use((req,res,next)=>{
     usersinfo=req.app.get("usersinfo")
     projectinfo=req.app.get("projectinfo")
     postinfo=req.app.get('postinfo')
    next()
})
usersInfo.post('/newuser',eah(
    async(req,res)=>{
        const newuser=req.body;
        console.log(newuser)
        const dbuser=await usersinfo.findOne({username:newuser.username})
        if(dbuser!==null)
        {
            res.send({message:"enter correct username already exist"})
        }
        else{
           const hashedpass= await bycryptjs.hash(newuser.password,6)
           newuser.password=hashedpass
           await usersinfo.insertOne(newuser)
           res.send({message:"user created"})
    
        }
    }
))
usersInfo.post('/login',async(req,res)=>{
    const user=req.body
    const dbuser= await usersinfo.findOne({username:user.username})
    console.log(user,dbuser)
    if(dbuser===null)
    {
        res.send({message:"enter correct username"})
    }
    else{
        const status = await bycryptjs.compare(user.password,dbuser.password)
        console.log(status)
        if(status===false)
        {
            res.send({message:"Invalid password"})
        }
        else{
            const signedToken=jwt.sign({username:dbuser.username},process.env.SECRET_CODE,{expiresIn:300000})
            res.send({message:"done",Token:signedToken,user:dbuser})
        }
    }
})
usersInfo.get('/userproject/:username',eah(async(req,res)=>{
    let usercred=req.params.username
    
    const projectOfUser=await projectinfo.find({username:usercred}).toArray()
    res.send({message:"done",payload:projectOfUser})

    

}))
usersInfo.get('/userpost/:username',eah(async(req,res)=>{
    let usercred=req.params.username
    const projectOfUser=await postinfo.find({username:usercred}).toArray()
    res.send({message:"done",payload:projectOfUser})
}))
module.exports=usersInfo;