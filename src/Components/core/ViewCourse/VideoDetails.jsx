import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { updateCompletedLectures } from '../../../slices/viewCourseSlice'
import { apiConnector } from '../../../services/apiconnector'
import { courseEndpoints } from '../../../services/apis'
import { toast } from 'react-hot-toast'
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi'

const VideoDetails = () => {
    const { courseId, sectionId, subSectionId } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const videoRef = useRef(null)
    const { token } = useSelector((state) => state.auth)
    const { courseSectionData, courseEntireData, completedLectures } =
        useSelector((state) => state.viewCourse)

    const [videoData, setVideoData] = useState(null)
    const [videoEnded, setVideoEnded] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!courseSectionData?.length) return
        if (!courseId || !sectionId || !subSectionId) {
            navigate("/dashboard/enrolled-courses")
            return
        }

        const filteredSection = courseSectionData?.find(
            (section) => section._id === sectionId
        )
        const filteredVideo = filteredSection?.subSection?.find(
            (sub) => sub._id === subSectionId
        )

        if (filteredVideo) {
            setVideoData(filteredVideo)
            setVideoEnded(false)
        }
    }, [courseSectionData, courseId, sectionId, subSectionId, location.pathname, navigate])

    const isFirstVideo = () => {
        const currentSectionIndex = courseSectionData?.findIndex(
            (section) => section._id === sectionId
        )
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(
            (sub) => sub._id === subSectionId
        )
        return currentSectionIndex === 0 && currentSubSectionIndex === 0
    }

    const isLastVideo = () => {
        const currentSectionIndex = courseSectionData?.findIndex(
            (section) => section._id === sectionId
        )
        const noOfSubSections = courseSectionData?.[currentSectionIndex]?.subSection?.length
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(
            (sub) => sub._id === subSectionId
        )
        return (
            currentSectionIndex === courseSectionData?.length - 1 &&
            currentSubSectionIndex === noOfSubSections - 1
        )
    }

    const goToNextVideo = () => {
        const currentSectionIndex = courseSectionData?.findIndex(
            (section) => section._id === sectionId
        )
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(
            (sub) => sub._id === subSectionId
        )
        const noOfSubSections = courseSectionData?.[currentSectionIndex]?.subSection?.length

        if (currentSubSectionIndex !== noOfSubSections - 1) {
            const nextSubSectionId = courseSectionData?.[currentSectionIndex]?.subSection?.[currentSubSectionIndex + 1]?._id
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`)
        } else {
            const nextSectionId = courseSectionData?.[currentSectionIndex + 1]?._id
            const nextSubSectionId = courseSectionData?.[currentSectionIndex + 1]?.subSection?.[0]?._id
            navigate(`/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`)
        }
    }

    const goToPrevVideo = () => {
        const currentSectionIndex = courseSectionData?.findIndex(
            (section) => section._id === sectionId
        )
        const currentSubSectionIndex = courseSectionData?.[currentSectionIndex]?.subSection?.findIndex(
            (sub) => sub._id === subSectionId
        )

        if (currentSubSectionIndex !== 0) {
            const prevSubSectionId = courseSectionData?.[currentSectionIndex]?.subSection?.[currentSubSectionIndex - 1]?._id
            navigate(`/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`)
        } else {
            const prevSectionId = courseSectionData?.[currentSectionIndex - 1]?._id
            const prevSubSectionLength = courseSectionData?.[currentSectionIndex - 1]?.subSection?.length
            const prevSubSectionId = courseSectionData?.[currentSectionIndex - 1]?.subSection?.[prevSubSectionLength - 1]?._id
            navigate(`/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`)
        }
    }

    const handleLectureCompletion = async () => {
        setLoading(true)
        try {
            const res = await apiConnector(
                "POST",
                courseEndpoints.LECTURE_COMPLETION_API,
                { courseId, subSectionId },
                { Authorization: `Bearer ${token}` }
            )
            if (res?.data?.success) {
                dispatch(updateCompletedLectures(subSectionId))
                toast.success("Lecture completed!")
            }
        } catch (error) {
            console.log("Could not mark lecture as complete", error)
            toast.error("Could not mark as complete")
        }
        setLoading(false)
    }

    if (!videoData) {
        return (
            <div className="grid h-full place-items-center">
                <p className="text-richblack-5 text-2xl">No Video Found</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-5 text-white py-6">
            <div className="relative">
                <video
                    ref={videoRef}
                    src={videoData?.videoUrl}
                    className="h-full w-full rounded-md"
                    controls
                    autoPlay
                    onEnded={() => setVideoEnded(true)}
                >
                    Your browser does not support the video tag.
                </video>

                {videoEnded && (
                    <div className="absolute inset-0 z-10 grid place-content-center bg-richblack-900 bg-opacity-70 rounded-md">
                        {!completedLectures?.includes(subSectionId) && (
                            <button
                                disabled={loading}
                                onClick={handleLectureCompletion}
                                className="cursor-pointer rounded-md bg-yellow-50 px-4 py-2 font-semibold text-richblack-900 mb-4"
                            >
                                {loading ? "Loading..." : "Mark As Completed"}
                            </button>
                        )}
                        <button
                            disabled={loading}
                            onClick={() => {
                                if (videoRef.current) {
                                    videoRef.current.currentTime = 0
                                    videoRef.current.play()
                                    setVideoEnded(false)
                                }
                            }}
                            className="cursor-pointer rounded-md bg-richblack-700 px-4 py-2 font-semibold text-richblack-5 mb-4"
                        >
                            Rewatch
                        </button>
                        <div className="flex items-center justify-center gap-4">
                            {!isFirstVideo() && (
                                <button
                                    disabled={loading}
                                    onClick={goToPrevVideo}
                                    className="cursor-pointer rounded-md bg-richblack-600 px-3 py-2 font-semibold text-richblack-5 flex items-center gap-1"
                                >
                                    <BiSkipPrevious size={20} /> Prev
                                </button>
                            )}
                            {!isLastVideo() && (
                                <button
                                    disabled={loading}
                                    onClick={goToNextVideo}
                                    className="cursor-pointer rounded-md bg-richblack-600 px-3 py-2 font-semibold text-richblack-5 flex items-center gap-1"
                                >
                                    Next <BiSkipNext size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
            <p className="pt-2 pb-6 text-richblack-200">{videoData?.description}</p>
        </div>
    )
}

export default VideoDetails
