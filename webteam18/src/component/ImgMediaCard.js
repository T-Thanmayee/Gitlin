import React, { useState } from 'react';
import './ImgMediaCard.css'
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from "axios"
import { useEffect } from 'react';
export default function ImgMediaCard() {
  let [projects,setprojects]=useState([])
  let [err,setErr]=useState('')

  useEffect(async()=>{
     let data=await axios.get('http://localhost:4000/projectinfo/getprojects')
     console.log(data.data)
     if(data.data.message=='done')
     {
      setprojects([...data.data.data])
     }
     else{
      setErr("i dont know about the error")
     }
  },[])
  console.log(projects)
  return (
    <div>
      {
   projects.map((project)=>
   
    <Card className="card" sx={{ maxWidth: 345 }}>
    <CardMedia
      component="img"
      alt="green iguana"
      height="140"
      image="https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_1280.jpg"
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {project.projectName}
      </Typography>
      <Typography variant="body2" color="text.secondary">
       {project.username}
      </Typography>
    </CardContent>
  </Card>
   
   )
  }
   </div>
  );
  
}
