import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { RxCross2 } from 'react-icons/rx'
import ReactStars from 'react-stars'
import { apiConnector } from '../../../services/apiconnector'
import { courseEndpoints } from '../../../services/apis'
import { toast } from 'react-hot-toast'

const CourseReviewModal = ({ setReviewModal }) => {
    const { user } = useSelector((state) => state.profile)
    const { token } = useSelector((state) => state.auth)
    const { courseEntireData } = useSelector((state) => state.viewCourse)

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        setValue("courseExperience", "")
        setValue("courseRating", 0)
    }, [setValue])

    const ratingChanged = (newRating) => {
        setValue("courseRating", newRating)
    }

    const onSubmit = async (data) => {
        const toastId = toast.loading("Loading...")
        try {
            await apiConnector(
                "POST",
                courseEndpoints.CREATE_RATING_API,
                {
                    courseId: courseEntireData?._id,
                    rating: data.courseRating,
                    review: data.courseExperience,
                },
                {
                    Authorization: `Bearer ${token}`,
                }
            )
            toast.success("Review submitted successfully!")
            setReviewModal(false)
        } catch (error) {
            console.log("CREATE RATING ERROR:", error)
            toast.error(error?.response?.data?.message || "Could not submit review")
        }
        toast.dismiss(toastId)
    }

    return (
        <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
            <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
                {/* Modal Header */}
                <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
                    <p className="text-xl font-semibold text-richblack-5">
                        Add Review
                    </p>
                    <button onClick={() => setReviewModal(false)}>
                        <RxCross2 className="text-2xl text-richblack-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="p-6">
                    <div className="flex items-center justify-center gap-x-4">
                        <img
                            src={
                                user?.image ||
                                user?.user?.image ||
                                `https://api.dicebear.com/5.x/initials/svg?seed=${user?.firstName || user?.user?.firstName}`
                            }
                            alt="user"
                            className="aspect-square w-[50px] rounded-full object-cover"
                        />
                        <div>
                            <p className="font-semibold text-richblack-5">
                                {user?.firstName || user?.user?.firstName}{" "}
                                {user?.lastName || user?.user?.lastName}
                            </p>
                            <p className="text-sm text-richblack-5">Posting Publicly</p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-6 flex flex-col items-center"
                    >
                        <ReactStars
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            color2={"#ffd700"}
                        />

                        <div className="flex w-11/12 flex-col space-y-2 mt-4">
                            <label
                                className="text-sm text-richblack-5"
                                htmlFor="courseExperience"
                            >
                                Add Your Experience <sup className="text-pink-200">*</sup>
                            </label>
                            <textarea
                                id="courseExperience"
                                placeholder="Share your experience..."
                                {...register("courseExperience", { required: true })}
                                className="form-style resize-x-none min-h-[130px] w-full rounded-md bg-richblack-700 p-3 text-richblack-5 border border-richblack-600 outline-none"
                            />
                            {errors.courseExperience && (
                                <span className="ml-2 text-xs tracking-wide text-pink-200">
                                    Please add your experience
                                </span>
                            )}
                        </div>

                        <div className="mt-6 flex w-11/12 justify-end gap-x-2">
                            <button
                                type="button"
                                onClick={() => setReviewModal(false)}
                                className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="flex items-center gap-x-2 rounded-md bg-yellow-50 py-[8px] px-[20px] font-semibold text-richblack-900"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CourseReviewModal
