import { apiConnector } from "../apiconnector";
import { courseEndpoints } from "../apis";
import {toast} from "react-hot-toast";


const {
    COURSE_CATEGORIES_API,
    CREATE_COURSE_API,
    EDIT_COURSE_API,
    CREATE_SECTION_API,
    UPDATE_SECTION_API,
    DELETE_SECTION_API,
    CREATE_SUBSECTION_API,
    UPDATE_SUBSECTION_API,
    DELETE_SUBSECTION_API,
    DELETE_COURSE_API,
    GET_ALL_INSTRUCTOR_COURSES_API,
    GET_FULL_COURSE_DETAILS_AUTHENTICATED
} = courseEndpoints

export const fetchCourseCategories = async ()=>{
    let result=[]
    try{
        // console.log("going fr api call")
        const response  = await  apiConnector("GET", COURSE_CATEGORIES_API)
        // console.log("course categories api response......", response)

        if(!response?.data?.success){
            throw new Error("Could not fetch course categories")
        }
        result = response?.data?.allCategory
    }catch(error){
        console.log("Coursee category api error.......", error.message)
        toast.error(error.message);

    }
    return result
}


export const addCourseDetails = async(data, token)=>{
    let result  = null
    const toastId = toast.loading("Loading...")
    try{
        const response =  await apiConnector("POST", CREATE_COURSE_API, data, {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })

        // console.log("CREATE COURSE API RESPONSE-----> ", response);
        if(!response?.data?.success){
            throw new Error("Could not Add course Details")
        }
        toast.success("Course Details added Successfully")
        result = response?.data?.data
    }catch(error){
        console.log("Create Course api error -> ",error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}

export const editCourseDetails  =async(data, token)=>{
    let result = null
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("POST", EDIT_COURSE_API , data,{
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
        })

        console.log("edit course api response.... ", response);
        if(!response?.data?.success){
            throw new Error("Could not update Course Details")
        }

        toast.success("Course detils updated successfully")
        result = response?.data?.data

    }catch(error){
        console.log("EDIT COURSE Api Error....", error)
        toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
}



//crate a section 

export const createSection  = async(data, token)=>{
    let result = null
    const toastId = toast.loading("Loading...")
    try{
        const response = await apiConnector("POST", CREATE_SECTION_API, data, {
            Authorization : `Bearer ${token}`,

        })
        // console.log("CREATE SECTION API RESPONSE ....", response);

        if(!response?.data?.success){
            throw new Error("Could not crteate section ");
        }

        toast.success("Course Section created")

        result = response?.data?.updatedCourseDetails
    }catch(error){

        console.log("Create SECTION API ERROR...". error)
        toast.error(error.message);

    }
    toast.dismiss(toastId);
    return result

}



export const createSubSection =  async (data, token)=>{
    let result = null
    const toastId = toast.loading("Loading...")
   
  // If data is FormData, print its contents
//   console.log("FormData for creating subsection:");
//   data.forEach((value, key) => {
//     console.log(`${key}: ${value}`);
//   });
    try{
        const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
            Authorization : `Bearer ${token}`,

        })

        // console.log("CREATE sub SECTION API RESPONSE ....", response);

        if(!response?.data?.success){
            throw new Error("Could not add lecture ");
        }

        toast.success("Lecture added")
        result = response?.data?.updatedSection

    }catch(error){

        console.log(" create sub- SECTION API ERROR...". error)
        toast.error(error.message);

    }
    toast.dismiss(toastId);
    return result   
}


export const updateSection = async(data, token)=>{
    let result = null
    const toastId = toast.loading("Loading...")
    // console.log("data in updated section api ", data);
    try{
        const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
            Authorization : `Bearer ${token}`,
        })

    // console.log("update section api response....", response);
    if(!response?.data?.success){
        throw new Error("Could not update Section ")
    }

    toast.success("course Section Updated")

    result = response?.data?.data

    }catch(error)
    {
        console.log("Updarte section API ERROR.....", error);
        toast.error(error.message);
    }

    toast.dismiss(toastId);
    return result
}


// update a subsection
export const updateSubSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
        Authorization: `Bearer ${token}`,
      })
      // console.log("UPDATE SUB-SECTION API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Update Lecture")
      }
      toast.success("Lecture Updated")
      result = response?.data?.data
    } catch (error) {
      console.log("UPDATE SUB-SECTION API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }
  




  
// delete a section
export const deleteSection = async (data, token) => {
    let result = null
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("POST", DELETE_SECTION_API, data, {
        Authorization: `Bearer ${token}`,
      })

      // console.log("DELETE SECTION API RESPONSE............", response)
      if (!response?.data?.success) {
        throw new Error("Could Not Delete Section")
      }
      toast.success("Course Section Deleted")
      result = response?.data?.data
    } catch (error) {
      console.log("DELETE SECTION API ERROR............", error)
      toast.error(error.message)
    }
    toast.dismiss(toastId)
    return result
  }





// delete a subsection
export const deleteSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    console.log("DELETE SUB-SECTION API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    toast.success("Lecture Deleted")
    result = response?.data?.data
  } catch (error) {
    console.log("DELETE SUB-SECTION API ERROR............", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}



//fetching all course under a specificc instructor 

export const fetchInstructorCourses = async(token)=>{
  let result = []
  const toastId = toast.loading("Loading...")
  try{
    const response = await apiConnector("GET", GET_ALL_INSTRUCTOR_COURSES_API, null, 
      {
        Authorization: `Bearer ${token}`
      }
     )

     console.log("instructor course api response....", response);
     if(!response?.data?.success){
      throw new Error("Could not fetch Instructor courses")  
    }
    result = response?.data?.data

  }catch(error){
    console.log("Instructor Course api error....", error)
    toast.error(error.message)
  }

  toast.dismiss(toastId)
  return result

}

//delete a course

export const deleteCourse = async(data, token)=>{
  const toastId = toast.loading("Loading...")
  try{
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data,
      {
        Authorization: `Bearer ${token}`
      }
    )

    console.log("delete  course api response", response);
    
    if(!response?.data?.success){
      throw new Error("Could Not Delete Course")

    }

    toast.success("Course Deleted")

  }catch(error){
    console.log("delete course api error", error)
    toast.error(error.message)
  }
  toast.dismiss(toastId);
}



//get full course detail of a course
export const getFullDetilsOfCourse = async(courseId, token)=>{
  let result = null
  const toastId = toast.loading("Loading...")
  try{
    // console.log("enter ")

    const response= await apiConnector("POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      {
        courseId,
      },
      {
        Authorization: `Bearer ${token}`
      }
    )
    console.log("course full details api response...", response);

    if(!response.data.success){
      throw new Error("Could Not Fetch Course Details")
    }

    result =  response?.data?.data
  }catch(error){
    console.log("COURSE_FULL_DETAILS_API API ERROR............", error)
    result = error.response.data
    // toast.error(error.response.data.message);
  }
  toast.dismiss(toastId)
  //   dispatch(setLoading(false));
  return result
}