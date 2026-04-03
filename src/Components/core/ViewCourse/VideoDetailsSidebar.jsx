import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import { BsChevronDown } from 'react-icons/bs'
import { IoCheckmarkDoneCircle } from 'react-icons/io5'

const VideoDetailsSidebar = ({ setReviewModal }) => {
    const navigate = useNavigate()
    const { sectionId, subSectionId } = useParams()
    const {
        courseSectionData,
        courseEntireData,
        totalNoOfLectures,
        completedLectures,
    } = useSelector((state) => state.viewCourse)

    const [activeStatus, setActiveStatus] = useState("")
    const [videoBarActive, setVideoBarActive] = useState("")

    useEffect(() => {
        if (!courseSectionData?.length) return

        const currentSectionIndex = courseSectionData?.findIndex(
            (section) => section._id === sectionId
        )

        if (currentSectionIndex >= 0) {
            setActiveStatus(courseSectionData?.[currentSectionIndex]?._id)
            setVideoBarActive(subSectionId)
        }
    }, [courseSectionData, sectionId, subSectionId])

    return (
        <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
            {/* Header */}
            <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
                <div className="flex w-full items-center justify-between">
                    <div
                        onClick={() => navigate("/dashboard/enrolled-courses")}
                        className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90 cursor-pointer"
                    >
                        <IoIosArrowBack size={30} />
                    </div>
                    <button
                        onClick={() => setReviewModal(true)}
                        className="rounded-md bg-yellow-50 px-3 py-1 text-sm font-semibold text-richblack-900"
                    >
                        Add Review
                    </button>
                </div>
                <div className="flex flex-col">
                    <p className="text-richblack-5">{courseEntireData?.courseName}</p>
                    <p className="text-sm font-semibold text-richblack-500">
                        {completedLectures?.length} / {totalNoOfLectures} lectures completed
                    </p>
                </div>
            </div>

            {/* Sections */}
            <div className="h-[calc(100vh-5rem)] overflow-y-auto">
                {courseSectionData?.map((section, index) => (
                    <div
                        className="mt-2 cursor-pointer text-sm text-richblack-5"
                        key={section._id}
                        onClick={() => setActiveStatus(section._id)}
                    >
                        {/* Section Header */}
                        <div className="flex flex-row justify-between bg-richblack-600 px-5 py-4">
                            <div className="w-[70%] font-semibold">
                                {section?.sectionName}
                            </div>
                            <div className="flex items-center gap-3">
                                <span
                                    className={`${
                                        activeStatus === section._id ? "rotate-0" : "rotate-180"
                                    } transition-all duration-500`}
                                >
                                    <BsChevronDown />
                                </span>
                            </div>
                        </div>

                        {/* Sub Sections */}
                        {activeStatus === section._id && (
                            <div className="transition-[height] duration-500 ease-in-out">
                                {section?.subSection?.map((subSection) => (
                                    <div
                                        className={`flex gap-3 px-5 py-2 ${
                                            videoBarActive === subSection._id
                                                ? "bg-yellow-200 font-semibold text-richblack-800"
                                                : "hover:bg-richblack-900"
                                        }`}
                                        key={subSection._id}
                                        onClick={() => {
                                            navigate(
                                                `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${subSection?._id}`
                                            )
                                            setVideoBarActive(subSection._id)
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={completedLectures?.includes(subSection?._id)}
                                            onChange={() => {}}
                                            className="cursor-pointer"
                                        />
                                        {subSection?.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VideoDetailsSidebar
