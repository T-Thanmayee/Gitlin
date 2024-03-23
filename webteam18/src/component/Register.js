import './Register.css'
import {useForm} from 'react-hook-form'
import { useState } from 'react'

function Register(){
    //state
    let [userInfo,setUserInfo]=useState({})
    let [showInfo,setShowInfo]=useState(false)

    let {register,handleSubmit,formState:{errors}}=useForm()

    async()=>{
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
        
        
    

    return(
        <div className='w-50 mx-auto mt-5 mb-5 bg-white p-5 rounded-3 shadow-lg'>
            <form className='d-flex flex-wrap' onSubmit={handleSubmit(displayUserDetails)}>
                <h1 className='display-6 w-100 mb-5 mt-2'>Registration Form</h1>
                <div className='form-group me-5 mb-4'>
                    <label htmlFor="firstName" className='form-label' >First Name</label>
                    <input type="text" className='form-control bg-light' id="firstName" autoComplete='off' {...register('firstName',{required:true,minLength:4,maxLength:6})}/>
                    {errors.firstName?.type==='required' && <p className='text-danger lead'>First Name is required</p>}
                    {errors.firstName?.type==='minLength' && <p className='text-warning lead'>Atleast 4 characters</p>}
                    {errors.firstName?.type==='maxLength' && <p className='text-warning lead'>Atmost 6 characters</p>}
                </div>
                <div className='form-group mb-4'>
                    <label htmlFor="lastName" className='form-label' >Last Name</label>
                    <input type="text" className='form-control bg-light' id="lastName" autoComplete='off'{...register('lastName',{required:true,minLength:4,maxLength:6})}/>
                    {errors.lastName?.type==='required' && <p className='text-danger lead'>Last Name is required</p>}
                    {errors.lastName?.type==='minLength' && <p className='text-warning lead'>Atleast 4 characters</p>}
                    {errors.lastName?.type==='maxLength' && <p className='text-warning lead'>Atmost 6 characters</p>}
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
                <div className='form-group mb-4 w-100'>
                    <label htmlFor="subject" className='form-label' >Subject</label>
                    <select id="subject" className='form-select bg-light' defaultValue={""} {...register('subject',{required:true})} >
                        <option value="math">Mathematics</option>
                        <option value="java">Java</option>
                        <option value="dbms">DataBase Management System</option>
                        <option value="dld">Digital Logic Design</option>
                        <option value="" disabled>Choose Option</option>
                    </select>
                    {errors.subject?.type==='required' && <p className='text-danger lead'>Subject is required</p>}
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