import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Outlet, useParams } from 'react-router-dom'
import { getFullDetilsOfCourse } from '../services/operations/courseDetailAPI'
import {
    setCourseSectionData,
    setEntireCourseData,
    setCompletedLectures,
    setTotalNoOfLectures,
} from '../slices/viewCourseSlice'
import VideoDetailsSidebar from '../Components/core/ViewCourse/VideoDetailsSidebar'
import CourseReviewModal from '../Components/core/ViewCourse/CourseReviewModal'

const ViewCourse = () => {
    const { courseId } = useParams()
    const { token } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const [reviewModal, setReviewModal] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const setCourseSpecificDetails = async () => {
            const courseData = await getFullDetilsOfCourse(courseId, token)
            if (courseData) {
                dispatch(setCourseSectionData(courseData?.courseDetails?.courseContent))
                dispatch(setEntireCourseData(courseData?.courseDetails))
                dispatch(setCompletedLectures(courseData?.completedVideos || []))
                let lectures = 0
                courseData?.courseDetails?.courseContent?.forEach((sec) => {
                    lectures += sec?.subSection?.length || 0
                })
                dispatch(setTotalNoOfLectures(lectures))
            }
            setLoading(false)
        }
        setCourseSpecificDetails()
    }, [courseId, token, dispatch])

    if (loading) {
        return (
            <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className="spinner text-white text-3xl">Loading...</div>
            </div>
        )
    }

    return (
        <>
            <div className="relative flex min-h-[calc(100vh-3.5rem)]">
                <VideoDetailsSidebar setReviewModal={setReviewModal} />
                <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
                    <div className="mx-6">
                        <Outlet />
                    </div>
                </div>
            </div>
            {reviewModal && <CourseReviewModal setReviewModal={setReviewModal} />}
        </>
    )
}

export default ViewCourse
