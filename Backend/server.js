const exp=require('express')
const app=exp()
const mongoose = require('mongoose');
const path=require('path')
require('dotenv').config()
const port=process.env.PORT || 5000
const cors=require('cors')


app.use(cors({
  origin: [
    'https://literate-space-guide-9766rwg7rj5wh97qx-5173.app.github.dev', // Your frontend origin
    'http://localhost:5173',
    '*', // For local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true, // If you use cookies or authentication
}));

const a=process.env.mongodburl

mongoose.connect(a, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));



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
app.get('/hello',(req,res)=>{
    res.send('Welcome to the backend server')
})
app.listen(port,()=>console.log(`web server is running on port ${port}`))