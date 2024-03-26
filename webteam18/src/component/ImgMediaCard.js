import React, { useState } from 'react';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import axios from "axios"
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
export default function ImgMediaCard() {
  let [projects,setprojects]=useState([])
  let [err,setErr]=useState('')
  let navigate=useNavigate()

  useEffect(()=>{
  change1()
  },[])
  async function change1(){
    let data=await axios.get('http://localhost:4000/projectinfo/getprojects')
     console.log(data.data)
     if(data.data.message=='done')
     {
      setprojects([...data.data.data])
      console.log(data.data.data)
     }
     else{
      setErr("i dont know about the error")
     }
  }
      function change(){
    navigate('/Fileupload')
  }

  return (
    <div className='row g-5 mt-5 container mx-auto'>
      <button className='btn btn-primary float-end w-25 display-4' onClick={change}>Create a Project</button>
      {
   projects.map((project)=>
   <div className='col-lg-3 col-1'>
    <Card className="card" sx={{ maxWidth: 345 ,minHeight:'300px'}}>
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
      <Typography variant="body2" color="text.secondary">
       {project.description}
      </Typography>
  
    </CardContent>
  </Card>
  </div>
   )
  }
   </div>
  );
  
}
