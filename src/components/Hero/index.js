"use client";
import { GET_EMPLOYEE_DETAILS } from '@/utils/gql/GQL_QUERIES';
import { useQuery } from '@apollo/client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const Index = () => {
  const [formData, setFormData] = useState({
    employeeID: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  useEffect(() => {
    localStorage.removeItem('employeeData');
  }, []);

  const [queryVariables, setQueryVariables] = useState(null); // To trigger the query
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_EMPLOYEE_DETAILS, {
    variables: queryVariables,
    skip: !queryVariables, // Skip query if no variables are set
    onCompleted: (data) => {
      if (data.getEmployeeDetails) {
        // Store employee data in local storage
        localStorage.setItem('employeeData', JSON.stringify(data.getEmployeeDetails));
        // Redirect to home page
        router.push('/EnrollmentForm');
      } else {
        alert('Please enter correct Employee ID and password');
      }
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    // Set the query variables
    setQueryVariables({
      employeeID: formData.employeeID,
      password: formData.password,
    });
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the password visibility
  };

  return (
    <div className='flex flex-col md:flex-row h-full lg:h-screen'>
      <div className='w-full md:w-2/3 flex justify-center'>
        <Image
          src='/Background/hero.jpg'
          alt='Pic'
          height={700}
          width={800}
        />
      </div>
      <div className='w-full md:w-1/3 bg-[#312e81] flex items-center justify-center h-full'>
        <div className='w-3/4'>
          <h1 className='text-md lg:text-3xl text-center mb-3 text-white'>Employee Login Form:</h1>
          <form className='flex flex-col bg-white p-4 rounded-md' onSubmit={handleSubmit}>
            <label className='mb-1 mt-6 text-black'><b>Enter Your Employee Id:</b></label>
            <input 
              type="text"
              name='employeeID'
              id='employeeID'
              onChange={handleOnChange}
              value={formData.employeeID}
              placeholder='Enter Your Employee ID'
              className='border-2 border-black p-2 mb-4 hover:bg-blue-100 rounded-sm text-black'
            />
            <label className='mb-1 text-black'><b>Enter Your Password:</b></label>
            <div className='relative'>
              <input 
                type={showPassword ? 'text' : 'password'} // Toggle between password and text input
                name='password'
                id='password'
                onChange={handleOnChange}
                value={formData.password}
                placeholder='Enter Your Password'
                className='border-2 border-black p-2 mb-4 hover:bg-blue-100 rounded-sm w-full text-black'
              />
              <button 
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-2 text-gray-500"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <button type='submit' className='bg-gray-600 text-white rounded-md p-3 hover:bg-[#172554]' disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <span className='text-red-500 hover:text-red-800 mt-1'> <Link href='/'>Forgot Password</Link></span>
          </form>
          {error && <p className='text-red-500'>{error.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Index;
