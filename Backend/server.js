const exp=require('express')
const app=exp()
const path=require('path')
require('dotenv').config()
const port=process.env.PORT || 5000
//create the client mongobd
const mongoclient=require('mongodb').MongoClient;

const a=process.env.DB_URL



app.use(exp.static(path.join(__dirname,'../webteam18/build')))

app.use(exp.json())
//connection of frontend and backend



//when we want to get component through the url path

mongoclient.connect(a)
.then((client)=>{console.log("webs erver connected to database")
const webdb=client.db('webdb')
const usersinfo=webdb.collection('usersinfo')
const postinfo=webdb.collection('postinfo')
const projectinfo=webdb.collection('projectinfo')
const tutorials=webdb.collection('tutorials')

app.set('usersinfo',usersinfo)
app.set('postinfo',postinfo)
app.set('projectinfo',projectinfo)
app.set('tutorials',tutorials)
}
 )
 .catch((err)=>console.log(err,"why"))



//create api routes
const usersInfo=require('./API/usersInfoApi');
const projectInfo=require('./API/projectInfoApi');
const postInfo=require('./API/postInfoApi');
const tutorials=require('./API/tutorials')

// //when /userapi is path send to userApp
app.use('/usersinfo',usersInfo)
app.use('/projectinfo',projectInfo)
app.use('/postinfo',postInfo)
app.use('/tutorials',tutorials)
//to extract biody of request




app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,'../webteam18/build/index.html'))
 })
 app.use((err,req,res,next)=>{
    res.send({message:err.message})
})

app.listen(port,()=>console.log(` web server is running ${port}`))