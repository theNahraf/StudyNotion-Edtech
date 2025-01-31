import { profileEndpoints } from "../apis"
import toast from "react-hot-toast"
import { setLoading, setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"

const {
    GET_USER_DETAILS_API,
    GET_USER_ENROLLED_COURSES_API,
    GET_INSTRUCTOR_DATA_API
} = profileEndpoints

export async function getUserEnrolledCourses(token){
    const toastId = toast.loading("Loading...")
    let result = []
    const header = {
        Authorization: `Bearer ${token}`
    }
    try{
        const response = await apiConnector("GET", GET_USER_ENROLLED_COURSES_API, null, header)
        // console.log("Calling backedn api for enrooleed courses and response -> ", response);

        if(!response.data.success){
            throw new Error(response.data.message);
        }
        
        result = response.data.data;
        

    }catch(error){
        console.log("Get_User_enrooled Courses api error -> ", error.message)
        toast.error("Could not Enrollec Courses");
    }
    toast.dismiss(toastId)
    return result
}