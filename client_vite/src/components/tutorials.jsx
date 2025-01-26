import {useState,useEffect} from 'react'
import axios from 'axios'


function Tutorials() {
  let [tutorials,setTutorials]=useState([])
let [err,setErr]=useState('')


useEffect(()=>{
change1()
},[])
async function change1(){
  let data=await axios.get('http://localhost:4000/tutorials/alltutorials')
   console.log(data.data)
   if(data.data.message=='done')
   {
    setTutorials([...data.data.payload])
    console.log(data.data.payload)
    console.log(tutorials)
   }
   else{
    setErr("i dont know about the error")
   }
   
}
  return (
    <div>
      {tutorials.map((tutorial)=>{
          <iframe width="420" height="315"
          src={tutorial.link}>
        </iframe>
      })}
        
    </div>
    
  )
}

export default Tutorials