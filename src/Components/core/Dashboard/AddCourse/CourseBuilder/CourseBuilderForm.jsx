import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import IconBtn from '../../../../common/IconBtn';
import { useDispatch, useSelector } from 'react-redux';
import {IoAddCircleOutline} from 'react-icons/io5'
import { MdNavigateNext } from 'react-icons/md';
import { setCourse, setEditCourse, setStep } from '../../../../../slices/courseSlice';
import NestedView from './NestedView';
import toast from 'react-hot-toast';
import {updateSection, createSection } from '../../../../../services/operations/courseDetailAPI';
const CourseBuilderForm = () => {


    const {course} = useSelector(state=>state.course)
    const{token}=  useSelector(state=>state.auth)
    const [loading, setLoading] = useState(false)
    const [editSectionName, setEditSectionName] = useState(null)
    const dispatch = useDispatch();

    const{
        register,
        handleSubmit,
        formState:{errors},
        setValue
    } = useForm();



    const onSubmit = async(data)=>{
        setLoading(true);
        let result;
        if(editSectionName){
            // console.log("data in course bilder form for updated sectio ", data);

            result = await updateSection(
                {
                    sectionName : data.sectionName,
                    // sectionId : data.sectionId,
                    sectionId : editSectionName,
                    courseId : course._id,
                },
                token
            )
        
            // console.log("edit in onsubmti in course bilder ", result);
        }

        else {
            result  = await createSection(
                {
                    sectionName : data.sectionName,
                    courseId : course._id
                },
                token
            )
        }

        console.log("section result" , result)
        if(result){
            dispatch(setCourse(result))
            setEditSectionName(null)
            setValue("sectionName",  "")
        }

        setLoading(false)
    }

    const handleChangeEditSectionName = (sectionId, sectionName)=>{
        //  console.log("handle change edit section name in course bilder  - section id",sectionId);

        if(editSectionName===sectionId){
            cancelEdit()
            return 
        }
        setEditSectionName(sectionId)
        setValue("sectionName", sectionName);
        
    }


    const goback= ()=>{
         dispatch(setStep(1))
         dispatch(setEditCourse(true))   
    }
    const goToNext = ()=>{
        if(course.courseContent.length === 0){
            toast.error("Please add atleast one section")
            return 
        }
        if(course.courseContent.some((section)=> section.subSection.length=== 0)){
            toast.error("Please add atleast one Lecture in each section")
            return 
        }

        dispatch(setStep(3));


    }

    const cancelEdit = ()=>{
        setEditSectionName(null)
        setValue("sectionName", "");
    }

  return (
    <div className='space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6'> 
        <p className='text-2xl font-semibold text-richblack-5 '>Course Builder</p>
        <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        <div className='flex flex-col space-y-2'>
            <label htmlFor="sectionName" className='text-sm text-richblack-5'>
                Section Name <sup className='text-pink-200'>*</sup>
            </label>
            <input 
            id='sectionName'
            disabled={loading}
            placeholder='Add a Section to build your course'
            {...register("sectionName", {required:true})}
            className='form-style w-full'
            />
            {
                errors.sectionName && (
                    <span className='ml-2 text-xs tracking-wide text-pink-200'>Section Name is Required</span>
                )
            }
        </div>  

            <div className='flex items-end gap-x-4'>
                <IconBtn
                type="submit"
                disabled={loading}
                text={editSectionName ? "Edit Section Name"  : "Create Section"}
                outline={true}
                >
            <IoAddCircleOutline size={20} className='text-yellow-50'/>
                </IconBtn>
            {
                editSectionName && (
                    <button 
                    type='button'
                    onClick={cancelEdit}
                    className='text-sm text-richblack-300 underline'
                    >
                        Cancel Edit
                    </button>
                )
            }
            </div>
        </form>

        {
            course.courseContent.length > 0 && (
                <NestedView  handleChangeEditSectionName = {handleChangeEditSectionName}/>
            )
        }

        {/* //next prev button  */}
        <div className='flex justify-end gap-x-3'>
            <button
            onClick={goback}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
            >
                Back
            </button>
            <IconBtn
            disabled={loading}
            text="Next"
            onclick={goToNext}
            >
                <MdNavigateNext/>
            </IconBtn>
        </div>

    </div>
  )
}

export default CourseBuilderForm