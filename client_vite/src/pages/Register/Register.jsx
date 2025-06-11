import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import bcrypt from 'bcryptjs';

const url = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'https://solid-sniffle-4jqqqqx79prv3j74w-4000.app.github.dev/';
console.log('Backend URL:', url);

function Register() {
  const [userInfo, setUserInfo] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const [err, setErr] = useState('');
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();

  async function displayUserDetails(data) {
    console.log('Form data:', data);
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const dataWithHashedPassword = {
        ...data,
        password: hashedPassword,
      };

      const response = await axios.post(`${url}user/register`, dataWithHashedPassword, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 5000,
      });
      console.log('Response:', response.data);
      if (response.data.message === 'User registered successfully') {
        setUserInfo(response.data.data);
        setShowInfo(true);
        setErr('');
        setShowSuccessPopup(true);
      } else {
        setErr('Registration failed: ' + (response.data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Axios Error:', {
        message: error.message,
        code: error.code,
        config: error.config,
        response: error.response?.data,
      });
      if (error.code === 'ERR_NETWORK') {
        setErr('Network error: Unable to connect to the server. Please check if the backend is running.');
      } else if (error.response) {
        setErr(`Server error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else {
        setErr('Failed to connect to the server: ' + error.message);
      }
    }
  }

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    navigate('/login');
  };

  return (
    <div className="w-full max-w-2xl mx-auto my-8 bg-white p-8 rounded-lg shadow-lg dark:bg-gray-800">
      <form onSubmit={handleSubmit(displayUserDetails)} className="space-y-6">
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-6">Registration Form</h1>

        <div className="space-y-2">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input
            type="text"
            id="username"
            autoComplete="username"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Username must be at least 3 characters' } })}
          />
          {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            id="password"
            autoComplete="new-password"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            {...register('password', { required: 'Password is required', minLength: { value: 8, message: 'Password must be at least 8 characters' } })}
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Birthday</label>
          <input
            type="date"
            id="birthday"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            {...register('birthday', { required: 'Birthday is required' })}
          />
          {errors.birthday && <p className="text-red-500 text-sm">{errors.birthday.message}</p>}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Gender</label>
          <div className="flex space-x-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="male"
                value="Male"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                {...register('gender', { required: 'Gender is required' })}
              />
              <label htmlFor="male" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Male</label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="female"
                value="Female"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:bg-gray-700 dark:border-gray-600"
                {...register('gender', { required: 'Gender is required' })}
              />
              <label htmlFor="female" className="ml-2 text-sm text-gray-700 dark:text-gray-300">Female</label>
            </div>
          </div>
          {errors.gender && <p className="text-red-500 text-sm">{errors.gender.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            id="email"
            autoComplete="email"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            {...register('email', { 
              required: 'Email is required', 
              pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Please enter a valid email address' }
            })}
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone Number</label>
          <input
            type="text"
            id="phoneNumber"
            autoComplete="tel"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            {...register('phoneNumber', { 
              required: 'Phone number is required', 
              minLength: { value: 10, message: 'Phone number must be exactly 10 digits' }, 
              maxLength: { value: 10, message: 'Phone number must be exactly 10 digits' }, 
              pattern: { value: /^[0-9]{10}$/, message: 'Phone number must contain only digits' }
            })}
          />
          {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
        </div>

        <div className="space-y-2">
          <label htmlFor="linkedin" className="block text-sm font-medium text-gray-700 dark:text-gray-300">LinkedIn</label>
          <input
            type="text"
            id="linkedin"
            autoComplete="url"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            {...register('linkedin')}
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="github" className="block text-sm font-medium text-gray-700 dark:text-gray-300">GitHub</label>
          <input
            type="text"
            id="github"
            autoComplete="url"
            className="w-full p-2 border border-gray-300 rounded-md bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            {...register('github')}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          Submit
        </button>
      </form>

      {err && (
        <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-md dark:bg-red-900 dark:text-red-200">
          <p className="text-sm">{err}</p>
        </div>
      )}

      {showInfo && (
        <div className="mt-6 p-6 bg-gray-800 text-white rounded-md dark:bg-gray-900">
          <p className="text-sm">Username: {userInfo.username}</p>
          <p className="text-sm">Birthday: {userInfo.birthday}</p>
          <p className="text-sm">Gender: {userInfo.gender}</p>
          <p className="text-sm">Email: {userInfo.email}</p>
          <p className="text-sm">Phone Number: {userInfo.phoneNumber}</p>
          {userInfo.linkedin && <p className="text-sm">LinkedIn: {userInfo.linkedin}</p>}
          {userInfo.github && <p className="text-sm">GitHub: {userInfo.github}</p>}
        </div>
      )}

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Registration Successful!</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6">Your account has been created. You can now log in.</p>
            <button
              onClick={handleClosePopup}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;