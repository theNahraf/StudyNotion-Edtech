import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { AiOutlineEye , AiOutlineEyeInvisible } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ACCOUNT_TYPE } from '../../utils/constants';
import { useDispatch } from 'react-redux';
import { setSignupData } from '../../slices/authSlice';
import { sendOtp } from '../../services/operations/authAPI';
import Tab from '../common/Tab';

const SignupForm = () => {
  const navigate = useNavigate();
  const  dispatch = useDispatch();

const [formData, setFormData] = useState(
  {
    firstName:"",
    lastName:"",
    email:"",
    password: "",
    confirmPassword:""
  }
)


const[showPassword, setShowPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false)
const [accountType, setAccountType] = useState(ACCOUNT_TYPE.STUDENT);



//handle input firld when some value change 
function changeHandler(event){
  setFormData((prevData)=>(
    {
      ...prevData, 
      [event.target.name] : event.target.value
    } 
  ))
}

//handle form submission 
function submitHandler(event){
  event.preventDefault();
  if(formData.password !== formData.confirmPassword){
    toast.error("Password do not match")
    return ;
  }
    
  const signupData = {
    ...formData,
    accountType
  }

  //setting singup data to state
  //to be used after otp varification 
  dispatch(setSignupData(signupData));
  //send otp to user for verification 
  dispatch(sendOtp(formData.email, navigate));

  //reset kro form data
  setFormData({
    firstName:"",
    lastName:"",
    email:"",
    password:"",
    confirmPassword:""
  })

  setAccountType(accountType.STUDENT)

}


  const tabData = [
    {
      id:1, 
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT
    },
    {
      id:2, 
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR
    }
  ] 

  
  return (
    <div>

        {/* tab  */}
      {/* student instructor tab  */}
        <Tab tabData={tabData} field={accountType} setField={setAccountType}/>
        {/* tab */}
      <form onSubmit={submitHandler}
      className='flex flex-col gap-3'>
        {/* first name and last Name */}


      <div className='flex gap-x-4'>
      <label className='w-full'>
    <p className='text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem]'
    >First Name<sup className='text-pink-600'>*</sup></p>
    <input 
    required
    type="text"
    name='firstName'
    onChange={changeHandler}
    placeholder='Enter First Name'
    value={formData.firstName}
     className='bg-[#0d161e] outline-none bg-opacity-80 border border-b-blue-400 rounded-[0.5rem] p-[12px] w-full text-gray-400
      focus:border-blue-600'
    />
    </label>

    
    <label className='w-full'>
    <p className='text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem]'
    >Last Name<sup className='text-pink-600'>*</sup></p>
    <input 
    required
    type="text"
    name='lastName'
    onChange={changeHandler}
    placeholder='Enter Last Name'
    value={formData.lastName}
     className='bg-[#0d161e] outline-none bg-opacity-80 border border-b-blue-400 rounded-[0.5rem] p-[12px] w-full text-gray-400
      focus:border-blue-600'
    />
    </label>


      </div>



    {/* email */}
      <label>
        <p className='text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem]'
        >Email Address<sup className='text-pink-600'>*</sup></p>
        <input 
        required
        type="email"
        name='email'
        placeholder='Enter Email address'
        onChange={changeHandler}
        value={formData.email}
         className='bg-[#0d161e] outline-none bg-opacity-80 border border-b-blue-400 rounded-[0.5rem] p-[12px] w-full text-gray-400
      focus:border-blue-600'
        />
      </label>

    {/* password and confirm password  */}
    <div className='flex gap-x-4'>
      <label className='w-full'>
    <p className='text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem]'
    >Create Password<sup className='text-pink-600'>*</sup></p>
        <input 
        required
        type= {showPassword ? ("text") : ("password")}
        name='password'
        placeholder='Enter Password'
        onChange={changeHandler}
        value={formData.password}
         className='bg-[#0d161e] outline-none bg-opacity-80 border border-b-blue-400 rounded-[0.5rem] p-[12px] w-full text-gray-400
      focus:border-blue-600'
        />
     </label>


      <label className='relative w-full'>
    <p className='text-[0.875rem] text-gray-100 mb-1 leading-[1.375rem]'
    >Confirm Password<sup className='text-pink-600'>*</sup></p>
        <input 
        required
        type= {showConfirmPassword ? ("text") : ("password")}
        name='confirmPassword'
        placeholder='Confirm Password'
        onChange={changeHandler}
        value={formData.confirmPassword}
         className='bg-[#0d161e] outline-none bg-opacity-80 border border-b-blue-400 rounded-[0.5rem] p-[12px] w-full text-gray-400
      focus:border-blue-600'
        />

     <span
    className='absolute right-3 top-[38px] cursor-pointer'
     onClick={()=>setShowConfirmPassword(prev=> !prev)}>
      {showConfirmPassword ? 

      (<AiOutlineEyeInvisible fontSize={24} fill='#AFB2BF' />):
      
      (<AiOutlineEye fontSize={24} fill='#AFB2BF'/>)}
    </span>

     </label>



    </div>

    <button
    type='Submit'
    className='bg-yellow-300 text-black w-full rounded-[8px] font-medium px-[12px] py-[8px] mt-6'>
      Create Account
    </button>

      </form>
    </div>
  )
}

export default SignupForm