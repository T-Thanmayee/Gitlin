const exp=require('express')
const postInfo=exp.Router();
const eah=require('express-async-handler')
let postinfo
postInfo.use((req,res,next)=>{
    postinfo=req.app.get("postinfo")
   next()
})
postInfo.post('/newpost',eah(async(req,res)=>{
    const newpost=req.body
    const result=await postinfo.insertOne(newpost)
    console.log(result)
}))
module.exports=postInfo