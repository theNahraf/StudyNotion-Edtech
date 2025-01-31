import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {RxDropdownMenu} from 'react-icons/rx'
import { MdEdit } from 'react-icons/md'
import {RiDeleteBin6Line} from 'react-icons/ri'
import {AiFillCaretDown} from 'react-icons/ai'
import { deleteSection, deleteSubSection } from '../../../../../services/operations/courseDetailAPI'
import { setCourse } from '../../../../../slices/courseSlice'
import { FaPlus } from 'react-icons/fa'
import SubSectionModal from './SubSectionModal'
import ConfirmationModal from '../../../../common/ConfirmationModal'
// import {FaCaretDown} from 'react-icons/fa6'
import{MdDelete} from 'react-icons/md'
import {IoMdArrowDropright} from 'react-icons/io'
const NestedView = ({handleChangeEditSectionName}) => {
    const {course} = useSelector(state=> state.course)
    const {token} = useSelector(state=>state.auth);
    const dispatch = useDispatch();
    const [addSubSection, setAddSubSection]= useState(null)
    const [viewSubSection , setViewSubSection] = useState(null)
    const [editSubSection, setEditSubSection] = useState(null);
    
    //to keep track  of confirmation modal 
    const [confirmationModal, setConfirmationModal]  = useState(null);

const handleDeleteSection =  async(sectionId)=>{

    const section = course.courseContent.find(sec => sec._id === sectionId);

    //check if the section has subsection before trying to delte them 
    if(section?.subSection?.length > 0) {
        for(const subSection of section.subSection){
            await deleteSubSection({subSectionId : subSection._id, sectionId}, token)
        }
    }


   const result = await deleteSection({
    sectionId,
    courseId : course._id,
    },
    token
)

// console.log("deleted section in nested view result", result);


   if(result){
    dispatch(setCourse(result))
   }

   setConfirmationModal(null)
}

const handleDeleteSubSection  = async(subSectionId, sectionId )=>{

    const result = await deleteSubSection({subSectionId, sectionId, token})

    // console.log("result in nested view subsection delete ", result);

    if(result){
        //update the structure of  course
        const updateCourseContent = course.courseContent.map((section)=>{
          return (  section._id === sectionId ? result : section
               )})

        const updatedCourse = {...course, courseContent: updateCourseContent}
        // console.log("in nested view , subsection deltedmrender ", updatedCourse);

        dispatch(setCourse(updatedCourse));
    }

    setConfirmationModal(null)


}

// console.log("course content in nested view", course?.courseContent)

  return (
    <>
    
    <div className='rounded-lg bg-richblack-700 p-6 px-8 '
    id='nestedViewContainer'
    >
        
        {course?.courseContent?.map((section)=>(
            // section dropdown 
            <details key={section._id} open>
                {/* //section dropdown content  */}

                <summary  className='flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2'> 
                    <div className='flex items-center gap-x-3'  >
                        <RxDropdownMenu className='text-2xl text-richblack-50' />
                        <p className='font-semibold text-richblack-50'>
                            {section.sectionName}
                        </p>
                    </div>
                    <div className='flex items-center gap-x-3'>
                        <button
                        onClick={()=>
                            handleChangeEditSectionName(section._id, section.sectionName)
                        }
                        >
                            <MdEdit className='text-xl text-richblack-300'/>
                        </button>

                        <button
                        onClick={()=>
                            setConfirmationModal({
                                text1 : "Delete this Section ?",
                                text2: "All the lecture in this section will be deleted",
                                btn1Text : "Delete",
                                btn2Text : "Cancel",
                                btn1Handler : ()=> handleDeleteSection(section._id),
                                btn2Handler : ()=> setConfirmationModal(null),
                            })
                            
                        }
                        >
                            <RiDeleteBin6Line className="text-xl text-richblack-300" />
                        </button>
                        <span className='font-medium text-richblack-300'>|</span>
                        <AiFillCaretDown className={`text-xl text-richblack-300`} />
                    </div>
                </summary>
                        
                {/* render all subsection within a section  */}
                <div className='px-6 pb-4'>
                    { section.subSection && 
                        section.subSection.map((data)=>(
                            <div key={data?._id} className='flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2'>
                            <div 
                            onClick={()=>setViewSubSection(data)}
                                        >
                               {/* { console.log("this is subsecction data in neste view", data)} */}
                                   <div className='flex items-center gap-x-1 py-2'>
                                     <IoMdArrowDropright className='text-2xl text-richblack-50' />   
                                     <p className='font-semibold text-richblack-50'> 
                                        {data.title}
                                     </p>
                                    </div>  
                            </div>
                            <div className='flex items-center gap-x-3 py-2'>
                                    <button
                                    onClick={()=> setEditSubSection({...data, sectionId:section._id})}
                                    className='flex items-center gap-x-3'
                                    >
                                        <MdEdit className='text-xl text-richblack-300'/>
                                    </button>

                                    <button
                                    onClick={()=>
                                        setConfirmationModal({
                                            text1 : "Delete this Subsection ?",
                                            text2 : "This lecture will be deleted",
                                            btn1Text : "Delete",
                                            btn2Text : "Cancel",
                                            btn1Handler: ()=>
                                            handleDeleteSubSection(data._id, section._id),
                                            btn2Handler : ()=> setConfirmationModal(null)
                                        })
                                    }
                                    >
                                    <MdDelete  className="text-xl text-richblack-300" />
                                    </button>
                                    </div>
                            </div>

                        ))}

                        {/* add new lecture to section  */}
                        <button 
                        onClick={()=> setAddSubSection(section._id)}
                        className='mt-3 flex items-center gap-x-1 text-yellow-50'
                        >
                            <FaPlus className='text-lg'/>
                            <p>Add Lecture</p>
                        </button>
                </div>
            </details>
        ))}
    </div>

        {/* modal display  , modal last me daalte hai  */}
        {
            addSubSection ? (
                <SubSectionModal
                modalData={addSubSection}
                setModalData={setAddSubSection}
                add={true}
                />
            ) : viewSubSection ? (
                <SubSectionModal
                modalData={viewSubSection}
                setModalData={setViewSubSection}
                view={true}
                />
            ) : editSubSection ? (
                <SubSectionModal
                modalData={editSubSection}
                setModalData={setEditSubSection}
                edit={true}
                />
            ): (
                <></>
            )}

            {/* confirmation modal  */}
            {
                confirmationModal ? (
                    <ConfirmationModal modalData={confirmationModal}/>
                ) : (<></>)
            }
    </>
  )
}

export default NestedView