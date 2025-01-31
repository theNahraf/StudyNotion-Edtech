import React from 'react'
import frameImage from '../../assets/Images/frame.png'
import SignupForm from './SignupForm'
import LoginForm from './LoginForm'
import { FcGoogle } from 'react-icons/fc'

const Template = ({title, desc1, desc2, image, formtype, setIsLoggedIn}) => {
  return (
    <div className='text-white flex justify-between w-11/12 max-w-[1160px] py-12 mx-auto gap-x-12 gap-y-0'>


      <div className='w-11/12 max-w-[450px]'>
       <h1 className='text-white font-semibold text-[1.875rem] 
       leading-[2.375rem] '>
        {title}</h1>
       <p className='text-[1.125rem] leading-[1.625rem] mt-4'>
        <span className='text-white text-opacity-50'>{desc1}</span>
        <br />
        <span className='text-blue-400 italic text-[1rem]'>{desc2}</span>
       </p>

       {formtype==="signup" ?
        (<SignupForm setIsLoggedIn={setIsLoggedIn}/>):
        (<LoginForm setIsLoggedIn={setIsLoggedIn}/>)
       }

       <div className='flex w-full items-center my-4 gap-x-2 '>
        <div className='h-[1px] w-full bg-gray-600'></div>
        <p className='text-gray-500 font-medium leading-[1.375rem]'>OR</p>
        <div className='h-[1px] w-full bg-gray-600'></div>
       </div>

        <button className='w-full flex justify-center gap-1 items-center rounded-[8px]
        font-medium text-gray-200 border border-gray-500 px-[12px] py-[8px] '>
        <FcGoogle fontSize={20}/>
          <p>Sign up with Google</p>
        </button>

        </div>


       {/* images area */}
        <div className='relative w-11/12 max-w-[450px]'>
          <img src={frameImage} alt="pattern" 
           width={558} 
           height={504}
           loading='lazy'
          />

          
          <img src={image} alt="students" 
           width={558} 
           height={490}
           loading='lazy'
           className='absolute -top-4 right-4'
          />


        </div>

    </div>
  )
}

export default Template