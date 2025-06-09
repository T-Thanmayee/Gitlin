const exp=require('express')
const app=exp()
const mongoose = require('mongoose');
const path=require('path')
require('dotenv').config()
const port=process.env.PORT || 5000
//create the client mongobd


const a=process.env.mongodburl

mongoose.connect(a, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));


app.use(exp.static(path.join(__dirname,'../webteam18/build')))

app.use(exp.json())

//create api routes
const usersInfo=require('./API/usersInfoApi');
const projectInfo=require('./API/projectInfoApi');
const postInfo=require('./API/postInfoApi');
const tutorials=require('./API/tutorials')

// //when /userapi is path send to userApp
app.use('/user',usersInfo)
app.use('/projectinfo',projectInfo)
app.use('/postinfo',postInfo)
app.use('/tutorials',tutorials)
//to extract biody of request




// app.use((req,res,next)=>{
//     res.sendFile(path.join(__dirname,'../webteam18/build/index.html'))
//  })
 app.use((err,req,res,next)=>{
    res.send({message:err.message})
})

app.listen(port,()=>console.log(`web server is running on port ${port}`))