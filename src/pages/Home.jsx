import React from 'react'
import { Link } from 'react-router-dom'
import { FaArrowRight } from 'react-icons/fa'
import HighlightText from '../Components/core/HomePage/HighlightText'
import CTAButton from '../Components/core/HomePage/CTAButton'
import CodeBlocks from '../Components/core/HomePage/CodeBlocks'
import Banner from '../assets/Images/banner.mp4'
import TimelineSection from '../Components/core/HomePage/TimelineSection'
import LearningLanguageSection from '../Components/core/HomePage/LearningLanguageSection'
import InstructorSection from '../Components/core/HomePage/InstructorSection'
import ExploreMore from '../Components/core/HomePage/ExploreMore'
import laptop from  '../assets/Images/laptop png.png'
import '../App.css'
// import person from '../assets/Images/pngegg.png'

export const Home = () => {
  return (
    <div> 

    {/* section 1 */}

    <div className='flex flex-col mx-auto text-white justify-between relative w-11/12 items-center'>
      <Link to={"/signup"}>
      <div className=' mt-16 p-1 group shadow-custon-inset
       mx-auto rounded-full bg-richblack-800 font-bold text-richblack-200 transition-all 
      duration-200 hover:scale-95 w-fit '>
        <div className='flex glow items-center gap-2 rounded-full px-10 py-[5px] group-hover:bg-richblack-900 '>
          <p>Become an Instructor</p>
          <FaArrowRight/>
        </div>
      </div>
      </Link>

    <div className='text-center text-4xl font-semibold mt-7'>
      Empower Your Future with  
      <HighlightText text ={"Coding Skills"}/>
    </div>

    <div className='w-[90%] text-center text-lg font-bold text-richblack-300 mt-4 '>
    With our online coding courses, you can learn at your own pace, from anywhere in the world, and get access to a wealth of resources, including hands-on projects, quizzes, and personalized feedback from instructors. 
    </div>

    <div className='flex flex-row gap-7 mt-8'>
      <CTAButton active={true} linkto={"/signup"}>
        Learn More
      </CTAButton>

      <CTAButton  active={false} linkto={"/login"}>
        Book a Demo
      </CTAButton>
    </div>

    {/* <div className='mx-6 my-14  shadow-[10px_-5px_50px_-5px] shadow-blue-200'>
      <video muted autoPlay loop className='shadow-[20px_20px_rgba(255,255,255)]'>
      <source src={Banner} type='video/mp4'/>
      </video>
    </div> */}


    <div className=' relative flex justify-center w-[75vw] items-center mt-[10vh] mb-[2vh]'>
      <img src={laptop}  />
       <video muted autoPlay loop className='absolute w-[56vw]  ml-3'>
      <source src={Banner} type='video/mp4'/>
      </video>
    </div>

    {/* code section 1 */}
    <div className='w-[90%] mx-auto'>
      <CodeBlocks
      position={"lg:flex-row"}
      heading={
        <div className='text-4xl font-semibold'>
          Unlock Your 
          <HighlightText text={"Coding Potential"}/>
          with our online Courses
          </div>
      }

      subheading={
        "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing their knowledge with you."
      }
       ctabtn1={
        {
          btnText : "Try it Yourself",
          linkto: "/signup",
          active : true
        }
       }

       ctabtn2={
        {
          btnText : "learn More",
          linkto : "/login",
          active : false
        }
       }
       codeblock={`<!DOCTYPE html>\n<html>\n<head> <title>Example</title><linkrel="stylesheet"href="styles.css">
        </head>\n<body>\n<h1><a href="/">Header</a>\n</h1>
        <nav><a href="one/">One</a><ahref="two/">Two</a><a href="three/">Three</a>
        </nav>`}

        codeColor={"text-yellow-25"}

        backgroundGradient={<div className='codeblock1 absolute'> </div>}
    
       />
    </div>


    {/* code section 2 */}
    <div className='w-[90%] mx-auto'>
      <CodeBlocks
      position={"lg:flex-row-reverse"}
      heading={
        <div className='text-4xl font-semibold'>
         Start
          <HighlightText text={"Coding in seconds"}/>
          
          </div>
      }

      subheading={
        "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
      }
       ctabtn1={
        {
          btnText : "Continue Lesson",
          linkto: "/signup",
          active : true
        }
       }

       ctabtn2={
        {
          btnText : ":earn More",
          linkto : "/login",
          active : false
        }
       }
       codeblock={`import React from "react";\n import CTAButton from "./Button";\nimport TypeAnimation from "react-type";\nimport { FaArrowRight } from "react-icons/fa";\n\nconst Home = () => {\nreturn (\n<div>Home</div>\n)\n}\nexport default Home;`}


        codeColor={"text-[#00FFFF]"}

        backgroundGradient={<div className='codeblock2 absolute'> </div>}
    
       />
    </div>

      <ExploreMore/>

    </div>


    {/* section 2 */}
    <div className='bg-pure-greys-5 text-richblack-700 '>
       <div className='homepage_bg h-[310px]'>

        <div className='w-11/12 max-w-maxContent flex items-center justify-center gap-5 mx-auto '>
        <div className='h-[300px]'></div>
       <div className='flex flex-row gap-7 text-white lg:mt-[200px]'>
            <CTAButton active={true} linkto={'/signup'}>
              <div className='flex items-center gap-3'>
              Explore Full Catalog
              <FaArrowRight/>
              </div>
            </CTAButton>
            <CTAButton active={false} linkto={'/singup'}>
                <div>
                  Learn More
                </div>
            </CTAButton>
       </div>
        </div>
       </div>

      <div className='mx-auto w-11/12 max-w-maxContent flex flex-col items-center justify-between
      gap-7'>

        <div className='flex flex-row gap-5 mb-10 mt-[95px]'>
            <div className='text-4xl font-semibold'> 
              Get the Skills you need for a 
              <HighlightText text={"Job That is in demand"}/>
            </div>

          <div className='flex flex-col items-start gap-10 w-[40%]'>
            <div className='text-[16px]'>
            The modern StudyNotion is the dictates its own terms. Today, to be a competitive specialist requires more than professional skills.
            </div>
            <CTAButton active={true} linkto={"/signup"}>
            Learn More
            </CTAButton>
          </div>
          
        </div>


        <TimelineSection />
        <LearningLanguageSection/>


      </div>
    </div>

    {/* section 3 */}

    <div className='w-11/12 max-w-maxContent mx-auto flex flex-col items-center justify-between gap-8
     bg-richblack-900 text-white'>

      <InstructorSection/>

       <h2 className='text-center text-4xl font-semibold mt-10'>Reviews From Others Learners</h2>

        {/* revies slider here  */}

    </div>

    {/* section 4 */}
      

    </div>
  )
}
