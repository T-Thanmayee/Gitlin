import { useForm } from 'react-hook-form';
import { useState } from 'react';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const url = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'https://literate-space-guide-9766rwg7rj5wh97qx-4000.app.github.dev/';
console.log('Backend URL:', url);

function Register() {
  const [userInfo, setUserInfo] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const [err, setErr] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm();

  async function displayUserDetails(data) {
    console.log(data);
    try {
      // Hash the password before sending it to the backend
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      // Create a new data object with the hashed password
      const dataWithHashedPassword = {
        ...data,
        password: hashedPassword,
      };

      const response = await axios.post(`${url}user/register`, dataWithHashedPassword, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000, // Prevent hanging
      });
      console.log('Response:', response.data);
      if (response.data.message === 'User registered successfully') {
        setUserInfo(response.data.data);
        setShowInfo(true);
        setErr('');
      } else {
        setErr('Registration failed: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Axios Error:', {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response ? error.response.data : null,
      });
      if (error.code === 'ERR_NETWORK') {
        setErr('Network error: Unable to connect to the server. Please check if the backend is running.');
      } else if (error.response) {
        setErr(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
      } else {
        setErr('Failed to connect to the server: ' + error.message);
      }
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto my-8 bg-white p-8 rounded-xl shadow-lg">
      <form onSubmit={handleSubmit(displayUserDetails)} className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">Registration Form</h1>

        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
          <input
            type="text"
            id="username"
            autoComplete="off"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register('username', { required: true, minLength: 3 })}
          />
          {errors.username?.type === 'required' && (
            <p className="text-red-500 text-sm">Username is required</p>
          )}
          {errors.username?.type === 'minLength' && (
            <p className="text-red-500 text-sm">Username must be at least 3 characters</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="off"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register('password', { required: true, minLength: 8 })}
          />
          {errors.password?.type === 'required' && (
            <p className="text-red-500 text-sm">Password is required</p>
          )}
          {errors.password?.type === 'minLength' && (
            <p className="text-red-500 text-sm">Password must be at least 8 characters</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="birthday" className="block text-sm font-medium text-gray-700">Birthday</label>
          <input
            type="date"
            id="birthday"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register('birthday', { required: true })}
          />
          {errors.birthday?.type === 'required' && (
            <p className="text-red-500 text-sm">Birthday is required</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Gender</label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                value="Male"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                {...register('gender', { required: true })}
              />
              <label htmlFor="male" className="ml-2 text-sm text-gray-700">Male</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                value="Female"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                {...register('gender', { required: true })}
              />
              <label htmlFor="female" className="ml-2 text-sm text-gray-700">Female</label>
            </div>
          </div>
          {errors.gender?.type === 'required' && (
            <p className="text-red-500 text-sm">Gender is required</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            autoComplete="off"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })}
          />
          {errors.email?.type === 'required' && (
            <p className="text-red-500 text-sm">Email is required</p>
          )}
          {errors.email?.type === 'pattern' && (
            <p className="text-red-500 text-sm">Please enter a valid email address</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="number"
            id="phoneNumber"
            autoComplete="off"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register('phoneNumber', { required: true, minLength: 10, maxLength: 10 })}
          />
          {errors.phoneNumber?.type === 'required' && (
            <p className="text-red-500 text-sm">Phone Number is required</p>
          )}
          {(errors.phone?.type === 'minLength' || errors.phone?.type === 'maxLength') && (
            <p className="text-yellow-500 text-sm">Phone Number must be 10 digits</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700">LinkedIn</label>
          <input
            type="text"
            id="linkedin"
            autoComplete="off"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register('linkedin')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="github" className="block text-sm font-medium text-gray-700">GitHub</label>
          <input
            type="text"
            id="github"
            autoComplete="off"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            {...register('github')}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Submit
        </button>
      </form>

      {err && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md">
          <p className="text-sm">{err}</p>
        </div>
      )}

      {showInfo && (
        <div className="mt-6 p-6 bg-gray-800 text-white rounded-md">
          <p className="text-sm">Username: {userInfo.username}</p>
          <p className="text-sm">Birthday: {userInfo.birthday}</p>
          <p className="text-sm">Gender: {userInfo.gender === 'M' ? 'Male' : 'Female'}</p>
          <p className="text-sm">Email: {userInfo.email}</p>
          <p className="text-sm">Phone Number: {userInfo.phone}</p>
          {userInfo.linkedin && <p className="text-sm">LinkedIn: {userInfo.linkedin}</p>}
          {userInfo.github && <p className="text-sm">GitHub: {userInfo.github}</p>}
        </div>
      )}
    </div>
  );
}

export default Register;