import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { getInstructorData } from '../../../../services/operations/profileAPI';
import { fetchInstructorCourses } from '../../../../services/operations/courseDetailAPI';
import InstructorChart from './InstructorChart';
import { Link } from 'react-router-dom';

const Instructor = () => {
    const {token} = useSelector((state)=> state.auth);
    const {user} = useSelector((state)=> state.profile);
    const [loading, setLoading] = useState(false);
    const [instructorData, setInstructorData] = useState(null);
    const [courses, setCourses] = useState([]);

    useEffect(()=> {
        const getFullDetails = async() => {
            setLoading(true);
            const instructorApiData = await getInstructorData(token);
            const result = await fetchInstructorCourses(token);

            if(instructorApiData.length)
                setInstructorData(instructorApiData);

            if(result) {
                setCourses(result);
            }
            setLoading(false);
        }
        getFullDetails();
    },[])

    const totalAmount = instructorData?.reduce((acc,curr)=> acc + curr.totalAmountGenerated, 0);
    const totalStudents = instructorData?.reduce((acc,curr)=> acc + curr.totalStudentsEnrolled, 0);

  return (
    <div className='text-white p-6'>
      <div className='flex flex-col gap-y-2 mb-6'>
        <h1 className='text-3xl font-bold'>Hi {user?.firstName} 👋</h1>
        <p className='text-richblack-300'>Let's start something new</p>
      </div>

      {loading ? (
        <div className='grid place-items-center h-[50vh]'>
            <div className='spinner'></div>
        </div>
      ) : courses.length > 0 ? (
        <div className='flex flex-col gap-y-6'>
            <div className='flex flex-col md:flex-row gap-6 h-[450px]'>
                <InstructorChart courses={instructorData ? instructorData : []} />
                <div className='flex min-w-[250px] flex-col rounded-md bg-richblack-800 p-6'>
                    <p className='text-lg font-bold text-richblack-5'>Statistics</p>
                    <div className='mt-4 flex flex-col gap-y-4'>
                        <div>
                            <p className='text-lg text-richblack-200'>Total Courses</p>
                            <p className='text-3xl font-semibold'>{courses.length}</p>
                        </div>
                        <div>
                            <p className='text-lg text-richblack-200'>Total Students</p>
                            <p className='text-3xl font-semibold'>{totalStudents}</p>
                        </div>
                        <div>
                            <p className='text-lg text-richblack-200'>Total Income</p>
                            <p className='text-3xl font-semibold'>Rs. {totalAmount}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className='rounded-md bg-richblack-800 p-6'>
                {/* Render 3 courses */}
                <div className='flex items-center justify-between'>
                    <p className='text-lg font-bold text-richblack-5'>Your Courses</p>
                    <Link to="/dashboard/my-courses">
                        <p className='text-xs font-semibold text-yellow-50'>View all</p>
                    </Link>
                </div>
                <div className='my-4 flex flex-wrap items-start gap-x-6'>
                    {courses.slice(0, 3).map((course) => (
                        <div key={course._id} className='w-full sm:w-[30%] mb-4'>
                            <img 
                                src={course.thumbnail}
                                alt={course.courseName}
                                className='h-[201px] w-full rounded-md object-cover'
                            />
                            <div className='mt-3 w-full'>
                                <p className='text-sm font-medium text-richblack-50'>{course.courseName}</p>
                                <div className='mt-1 flex items-center gap-x-2 text-xs font-medium text-richblack-300'>
                                    <p>{course.studentEnrolled.length} students</p>
                                    <p>|</p>
                                    <p>Rs {course.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      ) : (
        <div className='mt-20 rounded-md bg-richblack-800 p-6 py-20 text-center'>
            <p className='text-2xl font-bold text-richblack-5'>You have not created any courses yet</p>
            <Link to="/dashboard/add-course">
                <p className='mt-1 text-lg font-semibold text-yellow-50'>Create a course</p>
            </Link>
        </div>
      )}
    </div>
  )
}

export default Instructor
