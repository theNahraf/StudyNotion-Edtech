import React, { useState } from 'react'
import { AiOutlineEye , AiOutlineEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login } from '../../services/operations/authAPI';
import { useDispatch } from 'react-redux';

const LoginForm = () => {
  const [formData, setFormData]= useState({
    email:"",
    password:"",
  })

  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  function changeHandler(event){
    setFormData((prevData)=>(
      {
        ...prevData, 
        [event.target.name] : event.target.value
      } 
    ))

  }

  

  function submitHandler(event){
    event.preventDefault();
    dispatch(login(formData.email, formData.password, navigate))
  }
  return (
  <form onSubmit={submitHandler}
  className='flex flex-col w-full gap-y-4 mt-6'>
    <label className='w-full'>
      <p className='text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem]'>
        Email Address<sup className='text-pink-600'>*</sup>
      </p>

      <input
      required
      type="email"
      value={formData.email}
      onChange={changeHandler}
      placeholder='Enter Email Id'
      name='email'
      className='bg-[#0d161e] outline-none bg-opacity-80 border border-b-blue-400 rounded-[0.5rem] p-[12px] w-full text-gray-400
      focus:border-blue-600'
      />

    </label>
    <label className='w-full relative'>
      <p className='text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem]'>Password<sup className='text-pink-600'>*</sup>
      </p>

      <input
      required
      type= {showPassword ? ('text') : ("password")}
      value={formData.password}
      onChange={changeHandler}
      placeholder='Enter Password'
      name='password'
        className='bg-[#0d161e] outline-none bg-opacity-80 border border-b-blue-400 rounded-[0.5rem] p-[12px] w-full text-gray-400
      focus:border-blue-600'
      />

    <span
    className='absolute right-3 top-[38px] cursor-pointer'
     onClick={()=>setShowPassword(prev=> !prev)}>
      {showPassword ? 

      (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />):
      
      (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}
    </span>

    <Link to='/forgot-password'>
      <p className='text-xs mt-1 text-blue-300 max-w-max ml-auto'>Forgot Password</p>
    </Link>
    </label>

    <button className='bg-yellow-300 text-black  rounded-[8px] font-medium px-[12px] py-[8px] mt-6'
    >Sign In</button>

  </form>
  )
}

export default LoginForm