import React, { useEffect, useState } from 'react'
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from 'react-redux';
import {getUserEnrolledCourses} from '../../../services/operations/profileAPI'
import '../../../App.css'

const EnrolledCourses = () => {
    const[enrolledCourses, setEnrolledCourses]= useState(null);
    const {token} = useSelector((state)=>state.auth)


    const getEnrolledCourses = async()=>{
        
        try{
            
            const response = await getUserEnrolledCourses(token);
            // console.log("response from enrolled courses...", response);
            setEnrolledCourses(response);

        }catch(error){
            console.log("coule not fetcch Enrolled Courses. ")
        }
    }
    
    useEffect(()=>{
        getEnrolledCourses();
    },[])


  return (
    <>
    <div className='text-3xl text-richblack-50'>Enrolled Courses</div>
    {
        !enrolledCourses ? (
            <div className='grid min-h-[calc(100vh-3.5rem)] place-items-center'>
                <div className='loader'></div>
            </div>
        )
        :   !enrolledCourses.length ? (
            <p className='text-white'>You Have to Enrolled in any Courses yet</p>
        ) :(<div>
            <div>
                <p>Course Name</p>
                <p>Duration</p>
                <p>Progress</p>
            </div>
            {
                enrolledCourses.map((course, index, arr)=>{
                    return (
                        <div key={index}>
                            <div>
                                <img src={course?.thumbnail} 
                                alt="course_img"
                                className='h-14 w-14 rounded-lg object-cover' />
                                
                                <div>
                                    <p>{course?.courseName}</p>
                                    <p>{course?.courseDescription.length > 50 
                                        ? `${course?.courseDescription.slice(0, 50)}`
                                        :  course?.courseDescription}</p>
                                </div>
                            </div>
                            <div>{course?.totalDuration}</div>
                            <div>
                                <p>Progress: {course?.progressPercentage || 0}%</p>
                                <ProgressBar
                                completed={course.progressPercentage || 0}
                                height = "8px"
                                 isLableVisible={false}       
                                />
                            </div>
                        </div>
                    )
                })
            }
        </div>)
    }
    </>

  )
}

export default EnrolledCourses