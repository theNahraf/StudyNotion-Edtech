import React, { useState } from 'react'
import {HomePageExplore} from '../../../data/homepage-explore'
import HighlightText from './HighlightText';
import CourseCard from './CourseCard'
const tabName= [
    "Free", 
    "New to coding",
    "Most popular",
    "Skills paths",
    "Career paths"
]


const ExploreMore = () => {
    const [currentTab, setCurrentTab] = useState(tabName[0]);
    const[courses, setCourses] = useState(HomePageExplore[0].courses)
    const [currentCard, setCurrentCard] = useState(HomePageExplore[0].courses[0].heading)


    //value is my selected tab

    const setMyCards = (value)=>{
        setCurrentTab(value);
        const result = HomePageExplore.filter((courses)=> courses.tag === value);
        setCourses(result[0].courses);
        setCurrentCard(result[0].courses[0].heading);
    }

  return (
    <div className=''>
        <div className='text-4xl font-semibold text-center'>
            Unlock the 
            <HighlightText text={"Power of Code"}/>
        </div> 
    <p className='text-richblack-300 text-center text-lg mt-3'>
        Learn to build anything You can Imagine
    </p>
    
    <div className='flex gap-2 bg-richblack-800 rounded-full px-3 py-2 mt-5 mb-5 border-richblack-100'>
        {
            tabName.map((element, index) => {
                return (
                     <div key={index}
                     className={`text-[16px] flex flex-row items-center gap-2
                     ${currentTab=== element ? "bg-richblack-900 text-richblack-5 font-medium" 
                        : "text-richblack-200 "} rounded-full transition-all duration-200 cursor-pointer
                       hover:bg-richblack-900 hover:text-richblack-5 px-4 py-2
                     } `}
                     onClick={()=>{setMyCards(element)}}
                     >
                        {element}
                    </div>
                    )
            })
        }
    </div>

        <div className='lg:h-[80px]'></div>
    <div className='lg:h-[150px]'>

        {/* course card k group */}

        <div className='flex flex-row absolute gap-10 justify-between w-full left-0'>
            {
                courses.map((element, index)=>{
                    return(
                       <CourseCard
                       key={index}
                       cardData={element}
                       currentCard={currentCard}
                       setCurrentCard={setCurrentCard}
                       />
                    )
                })
            }
        </div>

        </div>

    </div>
  )
}

export default ExploreMore