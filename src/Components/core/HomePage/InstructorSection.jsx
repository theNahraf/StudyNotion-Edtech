import React from 'react'
import Instructor from '../../../assets/Images/Instructor.png'
import HighlightText from './HighlightText'
import CTAButton from './CTAButton'
import { FaArrowRight } from 'react-icons/fa'
const InstructorSection = () => {
  return (
    <div className='mt-16'>
        <div className='flex flex-row gap-20 items-center'>
           
        <div className='relative shadow-blue-200 w-[50%]  shadow-[10px_-5px_50px_-5px]'>
        <img src={Instructor}  alt="" 
          className='shadow-white object-cover h-fit shadow-[20px_20px_rgba(255,255,255)]'/>
          </div>


            <div className='w-[50%] flex flex-col gap-10'>
            <div className='text-4xl font-semibold'>
                Become an <br />
                <HighlightText text={"Instructor"}/>
            </div>
            <p className='text-richblack-300 font-medium text-[16px] w-[80%]'>
            Instructors from around the world teach millions of students on StudyNotion. We provide the tools and skills to teach what you love.
            </p>

            <div className='w-fit'>
            <CTAButton active={true} linkto={"/signup"} >
           <div className='flex flex-row items-center gap-2'>
             Start Teaching Today
            <FaArrowRight/>
            </div>
            </CTAButton>
            </div>

            </div>
            
        </div>
    </div>
  )
}

export default InstructorSection