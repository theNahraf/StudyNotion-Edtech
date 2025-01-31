import React, { useEffect, useState } from 'react'
import RenderSteps from '../AddCourse/RenderSteps'
import { useDispatch, useSelector } from 'react-redux'
// import { getFullCourseDetails } from '../../../../../server/controller/Course'
import { getFullDetilsOfCourse } from '../../../../services/operations/courseDetailAPI'
import { useParams } from 'react-router-dom'
import { setCourse, setEditCourse } from '../../../../slices/courseSlice'
// import { setLoading } from '../../../../slices/authSlice'

const EditCourse = () => {
    const {course} = useSelector(state=>state.course)
    const[loading, setLoading] = useState(false);
    const {token} = useSelector((state)=>state.auth)
    const courseId = useParams()
    const dispatch = useDispatch()



    useEffect( ()=>{
        ;(async()=>{
        setLoading(true);
        const result = await getFullDetilsOfCourse(courseId, token);
        console.log("edit course result ", result)
        if(result?.courseDetails){
            dispatch(setEditCourse(true))
            dispatch(setCourse(result?.courseDetails))
        }

        setLoading(false)
    })()
    },[])

    if(loading){
        return (
            <div className='grid flex-1 place-items-center'>
                <div className="loader"></div>
            </div>
        )
    }

  return (
    <div>
        <h1 className='mb-14 text-3xl font-medium text-richblack-5'>Edit Course</h1>
        <div className='mx-auto max-w-[600px]'>
            {
                course ? (
                    <RenderSteps/>
                )
                : (
                    <p className='mt-14 text-center text-3xl font-semibold text-richblack-100'>Course Not Found</p>
                )
            }
        </div>
    </div>
  )
}

export default EditCourse