import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector'
import { courseEndpoints } from '../services/apis'
import { buyCourse } from '../services/operations/studentFeaturesAPI'
import GetAvgRating from '../utils/avgRating'
import RatingStars from '../Components/common/RatingStars'
import Footer from '../Components/common/Footer'
import { BiInfoCircle } from 'react-icons/bi'
import { HiOutlineGlobeAlt } from 'react-icons/hi'
import { IoVideocamOutline } from 'react-icons/io5'
import { toast } from 'react-hot-toast'
import { ACCOUNT_TYPE } from '../utils/constants'
import ConfirmationModal from '../Components/common/ConfirmationModal'

const CourseDetails = () => {
  const { courseId } = useParams()
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [courseData, setCourseData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const [totalLectures, setTotalLectures] = useState(0)
  const [isActive, setIsActive] = useState([])

  useEffect(() => {
    const getCourseDetails = async () => {
      setLoading(true)
      try {
        const response = await apiConnector("POST", courseEndpoints.COURSE_DETAILS_API, {
          courseId: courseId,
        })
        if (response?.data?.success) {
          setCourseData(response.data.data)
        }
      } catch (error) {
        console.log("Could not fetch course details", error)
      }
      setLoading(false)
    }
    getCourseDetails()
  }, [courseId])

  useEffect(() => {
    if (courseData) {
      const count = GetAvgRating(courseData?.ratingAndReviews)
      setAvgReviewCount(count)

      let lectures = 0
      courseData?.courseContent?.forEach((sec) => {
        lectures += sec?.subSection?.length || 0
      })
      setTotalLectures(lectures)
    }
  }, [courseData])

  const handleActive = (id) => {
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e !== id)
    )
  }

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to purchase this course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!courseData) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <p className="text-richblack-5 text-3xl">Course Not Found</p>
      </div>
    )
  }

  const {
    courseName,
    courseDescription,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentEnrolled,
    price,
    thumbnail,
    createdAt,
  } = courseData

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            
            {/* Mobile thumbnail */}
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt={courseName}
                className="aspect-auto w-full"
              />
            </div>

            <div className="z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5">
              <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                {courseName}
              </p>
              <p className="text-richblack-200">{courseDescription}</p>

              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <span>{`(${ratingAndReviews?.length || 0} reviews)`}</span>
                <span>{`${studentEnrolled?.length || 0} students enrolled`}</span>
              </div>

              <div>
                <p>Created By {instructor?.firstName} {instructor?.lastName}</p>
              </div>

              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  <BiInfoCircle /> Created at {new Date(createdAt).toLocaleDateString("en-US", {
                    month: "long", day: "numeric", year: "numeric"
                  })}
                </p>
                <p className="flex items-center gap-2">
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>

            {/* Desktop Price Card */}
            <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute lg:block">
              <div className="flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5">
                <img
                  src={thumbnail}
                  alt={courseName}
                  className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
                />
                <div className="px-4">
                  <div className="space-x-3 pb-4 text-3xl font-semibold">
                    Rs. {price}
                  </div>
                  <div className="flex flex-col gap-4">
                    <button
                      className="cursor-pointer rounded-md bg-yellow-50 px-[20px] py-[8px] font-semibold text-richblack-900"
                      onClick={
                        user && studentEnrolled?.includes(user?.user?._id || user?._id)
                          ? () => navigate("/dashboard/enrolled-courses")
                          : handleBuyCourse
                      }
                    >
                      {user && studentEnrolled?.includes(user?.user?._id || user?._id)
                        ? "Go to Course"
                        : "Buy Now"}
                    </button>
                    {(!user || !studentEnrolled?.includes(user?.user?._id || user?._id)) && (
                      <button
                        onClick={() => {
                          // Add to cart logic
                          toast.success("Added to cart")
                        }}
                        className="cursor-pointer rounded-md bg-richblack-800 px-[20px] py-[8px] font-semibold text-richblack-5 border border-richblack-600"
                      >
                        Add to Cart
                      </button>
                    )}
                  </div>
                  <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
                    30-Day Money-Back Guarantee
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Price Section */}
      <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden px-4">
        <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
          Rs. {price}
        </p>
        <button
          className="cursor-pointer rounded-md bg-yellow-50 px-[20px] py-[8px] font-semibold text-richblack-900"
          onClick={handleBuyCourse}
        >
          Buy Now
        </button>
      </div>

      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What you will learn */}
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you&apos;ll learn</p>
            <div className="mt-5">
              <p className="whitespace-pre-line">{whatYouWillLearn}</p>
            </div>
          </div>

          {/* Course Content */}
          <div className="max-w-[830px]">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2 text-richblack-300">
                  <span>{courseContent?.length || 0} section(s)</span>
                  <span>{totalLectures} lecture(s)</span>
                </div>
                <button
                  className="text-yellow-25"
                  onClick={() => setIsActive([])}
                >
                  Collapse all sections
                </button>
              </div>
            </div>

            {/* Course Sections Accordion */}
            <div className="py-4">
              {courseContent?.map((section) => (
                <div
                  className="overflow-hidden border border-solid border-richblack-600 bg-richblack-700 text-richblack-5 last:mb-0"
                  key={section._id}
                >
                  {/* Section header */}
                  <div
                    className="flex cursor-pointer items-start justify-between bg-opacity-20 px-7 py-6 transition-[0.3s]"
                    onClick={() => handleActive(section._id)}
                  >
                    <div className="flex items-center gap-2">
                      <i className={isActive.includes(section._id) ? "rotate-180" : "rotate-0"}>
                        ▼
                      </i>
                      <p>{section?.sectionName}</p>
                    </div>
                    <div className="space-x-4">
                      <span className="text-yellow-25">
                        {section?.subSection?.length || 0} lecture(s)
                      </span>
                    </div>
                  </div>

                  {/* Sub Sections */}
                  {isActive.includes(section._id) && (
                    <div className="transition-[height] duration-200 ease-in-out">
                      {section?.subSection?.map((subSec) => (
                        <div
                          key={subSec._id}
                          className="flex items-center gap-3 px-8 py-3 border-b border-richblack-600"
                        >
                          <IoVideocamOutline className="text-yellow-50" />
                          <p>{subSec?.title}</p>
                          {subSec?.timeDuration && (
                            <span className="text-richblack-300 ml-auto text-sm">
                              {Math.round(subSec?.timeDuration / 60)} min
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Author */}
          <div className="mb-12 py-4">
            <p className="text-[28px] font-semibold">Author</p>
            <div className="flex items-center gap-4 py-4">
              <img
                src={
                  instructor?.image ||
                  `https://api.dicebear.com/5.x/initials/svg?seed=${instructor?.firstName} ${instructor?.lastName}`
                }
                alt="Author"
                className="h-14 w-14 rounded-full object-cover"
              />
              <p className="text-lg">
                {instructor?.firstName} {instructor?.lastName}
              </p>
            </div>
            <p className="text-richblack-50">
              {instructor?.additionalDetails?.about || ""}
            </p>
          </div>
        </div>
      </div>

      <Footer />

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails