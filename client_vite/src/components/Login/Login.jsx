import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const navigate = useNavigate();
  function onLoginFormSubmit(obj){
    console.log(obj)
  }
  return (
    <div className='w-100'>
      <h1 className='display-3 text-black mb-5 text-center'>Signin</h1>
      <div className='d-flex' style={{ justifyContent: 'center' }}>
        <form className='w-50 m-3 mt-5 mx-auto' onSubmit={handleSubmit(onLoginFormSubmit)}>
          <div className="mb-3 mx-auto col-lg-6 ">
            <label htmlFor="Username" className="form-label">Username</label>
            <input type="text" className="form-control mx-auto" {...register("username", { required: true, minLength: 3, maxLength: 15 })} />
            {errors.username?.type === "required" && <p className='text-danger'>Username is required</p>}
            {errors.username?.type === "minLength" && <p className='text-danger'>Username minimum length of 3</p>}
            {errors.username?.type === "maxLength" && <p className='text-danger'>Username maximum length of 15</p>}
          </div>

          <div className="mb-3 mx-auto col-lg-6">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              {...register("password", { required: true })}
            />
            {errors.password?.type === "required" && (
              <p className='text-danger'>Password is required</p>
            )}
          </div>
          <button
            type="submit"
            className="btn btn-info text-secondary d-block mx-auto fs-5"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login; 
