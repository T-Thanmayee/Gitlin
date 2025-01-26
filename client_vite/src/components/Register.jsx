//import './Register.css'
import {useForm} from 'react-hook-form'
import { useState } from 'react'
import axios from 'axios'
function Register(){
    //state
    let [userInfo,setUserInfo]=useState({})
    let [showInfo,setShowInfo]=useState(false)
    let [err,setErr]=useState('')

    let {register,handleSubmit,formState:{errors}}=useForm()

    async function displayUserDetails(data1){
        let data=await axios.post('http://localhost:4000/usersinfo/newuser',data1)
        console.log(data)
        if(data.data.message=='done')
        {
         
         console.log(data.data.data)
        }
        else{
         setErr("i dont know about the error")
        }
     }
        
        
    

    return(
        <div className='w-50 mx-auto mt-5 mb-5 bg-white p-5 rounded-3 shadow-lg'>
            <form className='d-flex flex-wrap' onSubmit={handleSubmit(displayUserDetails)}>
                <h1 className='display-6 w-100 mb-5 mt-2'>Registration Form</h1>
                <div className='form-group me-5 mb-4'>
                    <label htmlFor="username" className='form-label' >Username</label>
                    <input type="text" className='form-control bg-light' id="username" autoComplete='off' {...register('username',{required:true})}/>
                    {errors.username?.type==='required' && <p className='text-danger lead'>First Name is required</p>}
                    </div>
                <div className=' mb-4 w-100'>
                    <label htmlFor="password" className='form-label' >Password</label>
                    <input type="password" className='form-control bg-light' id="password" autoComplete='off' {...register('password',{required:true})}/>
                    {errors.password?.type==='required' && <p className='text-danger lead'>Password is required</p>}
                    
                </div>
                <div className='form-group me-5 mb-4'>
                    <label htmlFor="birthday" className='form-label' >Birthday</label>
                    <input type="date" className='form-control bg-light' id="birthday" {...register('birthday',{required:true})}/>
                    {errors.birthday?.type==='required' && <p className='text-danger lead'>BirthDate is required</p>}
                </div>
                <div className='form-group mb-4 d-flex flex-wrap'>
                    <label className='form-label w-100' >Gender</label>
                    <div className='form-check me-5'>
                        <input type="radio" className='form-check-input' id="male" value="M" {...register('gender',{required:true})}/>
                        <label htmlFor="male" className="form-check-label">Male</label>
                    </div>
                    <div className='form-check'>
                        <input type="radio" className='form-check-input' id="female" value="F" {...register('gender',{required:true})}/>
                        <label htmlFor="female" className="form-check-label">Female</label>
                    </div>
                    {errors.gender?.type==='required' && <p className='text-danger lead'>Gender is required</p>}
                </div>
                <div className='form-group me-5 mb-4'>
                    <label htmlFor="email" className='form-label' >Email</label>
                    <input type="email" className='form-control bg-light' id="email" autoComplete='off' {...register('email',{required:true})}/>
                    {errors.email?.type==='required' && <p className='text-danger lead'>Email is required</p>}
                </div>
                <div className='form-group mb-4'>
                    <label htmlFor="phone" className='form-label' >Phone Number</label>
                    <input type="number" className='form-control bg-light' id="phone" autoComplete='off' {...register('phone',{required:true,minLength:10,maxLength:10})}/>
                    {errors.phone?.type==='required' && <p className='text-danger lead'>Phone Number is required</p>}
                    {errors.phone?.type==='minLength' && <p className='text-warning lead'>Phone Number is 10 digits</p>}
                    {errors.phone?.type==='maxLength' && <p className='text-warning lead'>Phone Number is 10 digits</p>}

                </div>
                <div className='form-group me-5 mb-4'>
                    <label htmlFor="linkedin" className='form-label' >LinkedIn</label>
                    <input type="text" className='form-control bg-light' id="linkedin" autoComplete='off' {...register('linkedin')}/>
                    
                </div>
                <div className='form-group mb-4'>
                    <label htmlFor="github" className='form-label' >GitHub</label>
                    <input type="text" className='form-control bg-light' id="github" autoComplete='off' {...register('github')}/>

                </div>
                <button type="submit" className='btn btn-primary w-25 mt-3'>Submit</button>
            </form>
            {showInfo===true && <div className="bg-dark text-white p-3 mt-5 rounded-3">
                    <p className='lead mt-2'>Name : {userInfo.firstName} {userInfo.lastName} ({userInfo.gender})</p>
                    <p className='lead'>Birthday: {userInfo.birthday}</p>
                    <p className='lead'>Email: {userInfo.email}</p>
                    <p className='lead'>Phone Number: {userInfo.phone}</p>
                    <p className='lead'>Subject: {userInfo.subject}</p>
            </div>} 
        </div>
    )
}

export default Register