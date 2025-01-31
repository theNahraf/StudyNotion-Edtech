import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { RxCross2 } from 'react-icons/rx';
import Upload from '../Upload';
import { useDispatch, useSelector } from 'react-redux';
import IconBtn from '../../../../common/IconBtn';
import { createSubSection, updateSubSection } from '../../../../../services/operations/courseDetailAPI';
import { setCourse } from '../../../../../slices/courseSlice';
import toast from 'react-hot-toast';

const SubSectionModal = ({
    modalData, 
    setModalData, 
    add =false,
    view = false,
    edit = false
}) => {

    const {
        register,
        handleSubmit,
        setValue,
    formState : {errors},
        getValues,
    } = useForm();

    const dispatch = useDispatch()
    const [loading, setLoading] = useState(false)
    const{token} = useSelector((state)=>state.auth)
    const {course} = useSelector ( (state)=>state.course);


    useEffect(()=>{
        if(view || edit){
        // console.log("modal data in subsection modal... ", modalData);
        setValue("lectureTitle", modalData.title);
        setValue("lectureDesc", modalData.description)
        setValue("lectureVideo", modalData.videoUrl)    
        }
    },[])


    //detect whereater the form update or not 
    const isFormUpdated = ()=>{
        const currentValues = getValues(); 
        // console.log("Changes after editing form values.. ", currentValues);

        if(currentValues.lectureTitle !==  modalData.title || 
            currentValues.lectureDesc !== modalData.description || 
            currentValues.lectureVideo !== modalData.videoUrl
        ){
            return true
        }
        return false
    }


    const handleEditSubsection = async()=>{
        
        const currentValues = getValues();
        
        // console.log("changes formdata editing form values..", currentValues)

        const formData = new FormData();
        formData.append("sectionId", modalData.sectionId);
        formData.append("subSectionId", modalData._id)



        if(currentValues.lectureTitle !== modalData.title){
            formData.append("title", currentValues.lectureTitle)
        }

        if(currentValues.lectureDesc !== modalData.description){
            formData.append("description", currentValues.lectureDesc)
        }
        if(currentValues.lectureVideo !== modalData.videoUrl){
            formData.append("video", currentValues.lectureVideo)
        }


        // console.log("form data in subsectinalmodal in editname",  formData)
        // Assume formData is populated with fields

            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });
            


        setLoading(true)

        const result = await updateSubSection(formData, token)
        
        if(result){
            // console.log("result form data after updatedsubsection in subsection modal ", result);

            ///upate the struture of course

            const updatedCourseContent = course.courseContent.map((section)=>(
                section._id === modalData.sectionId ? result : section
            ))


            const updatedCourse = {...course, courseContent : updatedCourseContent}
            dispatch(setCourse(updatedCourse))   
        }

        setModalData(null);
        setLoading(false)
    }



    const onSubmit = async(data)=>{
        if(view) return

        if(edit){
            if(!isFormUpdated()){
                toast.error("NO Changes Made to the Form")
            }
            else{
                handleEditSubsection();
            }
            return
        }

        const formData = new FormData()
        formData.append("sectionId", modalData)
        formData.append("title", data.lectureTitle);
        formData.append("description", data.lectureDesc);
        formData.append("video", data.lectureVideo);

        // console.log("printing  subsection formdata in subsection modAL")
        // formData.forEach((value, key) => {
        //     console.log(`${key}: ${value}`);
        // });

        setLoading(true)
        const result = await createSubSection(formData, token)
        // console.log("subsection modal result idhar hai ", result);
        if(result) {
            //update the struture of cporse n
            const updatedCourseContent = course.courseContent.map((section)=>(
                section._id === modalData ? result :section
            ))
            
            const updatedCourse = {...course, courseContent: updatedCourseContent}

            // course ko update kr rhe hai with updated section and subsectin 
            dispatch(setCourse(updatedCourse))
        }
        setModalData(null)
        setLoading(false)
    }   


  return (
    <div className='fixed inset-0 z-[1000] !mt-0 grid-h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm'>
        <div className='my-10 w-11/12 max-w-[700px] rounded-lg border  border-richblack-400 bg-richblack-800'>
            {/* modal header  */}
            <div className='flex items-center justify-between rounded-t-lg bg-richblack-700 p-5'>
                <p className='text-xl font-semibold text-richblack-5'>
                    {view && "Viewing "} {add && "Adding"} {edit && "Editing"} Lecture
                </p>
                <button
                onClick={()=>(!loading ? setModalData(null) : {})}
                >
                    <RxCross2 className='text-2xl text-richblack-5'/>
                </button>
            </div>
            {/* modal form  */}
            <form onSubmit={handleSubmit(onSubmit)} 
            className='space-y-8 px-8 py-10'
            >
                {/* lecture video uplaod  */}
                <Upload 
                name= "lectureVideo"
                label="Lecture Video"
                register={register}
                setValue={setValue}
                errors={errors}
                video = {true}
                viewData={view ? modalData.videoUrl : null}
                editData={edit ? modalData.videoUrl : null}
                />

                {/* lecture title  */}
                <div className='flex flex-col space-y-2'>
                    <label htmlFor="lectureTitle" className='text-sm text-richblack-5'>
                        Lecture Title {!view && <sup className='text-pink-200'>*</sup>}
                    </label>
                    <input
                    disabled = {view || loading}
                    id='lectureTitle'
                    placeholder='Enter lecture Title'
                    {...register("lectureTitle", {required:true})}
                    className='form-style  w-full'
                    />
                    {
                        errors.lectureTitle && (
                            <span className='ml-2 text-xs tracking-wide text-pink-200'>
                                Lecture Title is required
                            </span>)}
                </div>
                {/* lecture description  */}
                <div className='flex flex-col space-y-2'>
                    <label className='text-sm text-richblack-5' htmlFor='lectureDesc'> 
                        Lecture Description{" "}
                        {!view && <sup className='text-pink-200'>*</sup>}
                    </label>    

                     <textarea 
                    disabled={view || loading}
                    id='lectureDesc'
                    placeholder='Enter Lecture Description'
                    {...register("lectureDesc", {required:true})}
                    className='form-style w-full resize-x-none min-h-[130px]'
                     />
                     {
                        errors.lectureDesc && (
                            <span className='ml-2 text-xs tracking-wide text-pink-200'>Lecture Description is required</span>
                        )} 
                </div>
                {
                    !view && (
                        <div className='flex justify-end'>
                            <IconBtn
                            // type="submit"
                            disabled={loading}
                            text = {loading ? "Loading..." : edit ? "Save Changes" : "Save" }
                            />
                        </div>
                    )
                }

            </form>
        </div>
    </div>
  )
}

export default SubSectionModal