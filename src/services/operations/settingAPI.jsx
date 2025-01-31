import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { settingsEndpoints } from "../apis";
import toast from "react-hot-toast";
import { logout } from "./authAPI";



const {
    UPDATE_DISPLAY_PICTURE_API,
    UPDATE_PROFILE_API,
    CHANGE_PASSWORD_API,
    DELETE_PROFILE_API
} =   settingsEndpoints


export function updateDisplayPicture(token , formData){
    for (let pair of formData.entries()) {
        
        console.log("update display picture formdata ", formData);
        console.log(pair[0], pair[1]);  // Should log the key 'displayPicture' and the file object
      }


    return async(dispatch)=>{
        const toastId = toast.loading("Loading...")
        try{
            const headers = {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            };

            console.log("headers - > ", headers);    
            const response = await apiConnector("PUT", UPDATE_DISPLAY_PICTURE_API, formData,headers)
            console.log("after api call")
    
        console.log("Updated display picture api response...", response);
        if(!response.data.success){
            throw new Error(response.data.message)
        }
        toast.success("Display Picture updated Successfully")
        dispatch(setUser(response.data.data))
        }catch(error){
            console.log("error while updating profile display  picture -> ", error.message)
        }
        toast.dismiss(toastId)
    }
}


export function deleteProfile(token, navigate){
    return  async(dispatch)=>{
        const toastId = toast.loading("Loading...")
        const header = {
            Authorization: `Bearer ${token}`
        }
        try{
            const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, header)
            console.log("delete profile api response....", response);

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            toast.success("Profile Deleted Successfully");
            dispatch(logout(navigate))

        }catch(error){
            console.log("Delete_Profile api error -> ", error);
            toast.error("Could not delete Profile")
        }
        toast.dismiss(toastId)
    }

}


export async function changePassword(token, formData){

        const toastId = toast.loading("Loading...")
        const header = {
            Authorization: `Bearer ${token}`
        }
        console.log("formdata -> ", formData);
        try{
            // console.log("formdata for change password in setting api -> ", formData);

            const response =await apiConnector("POST",CHANGE_PASSWORD_API,formData, header)
           
            console.log("change password api response....-> ", response);

            if(!response.data.success){
                throw new Error(response.data.message)
            }
            toast.success("Password updated Successfully");
         
        }catch(error){
            console.log("Error occuring while password Updating ", error.message);
            toast.error("Could not update password")
        }
        toast.dismiss(toastId)
    }



    export function updateProfile(token , formData){
        const toastId = toast.loading("Loading...")
        return async(dispatch) =>{
            try{
                const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
                    Authorization : `Bearer ${token}`
                })
                console.log("Update profile api response...",  response);
                if(!response.data.success){
                    throw new Error(response.data.message)
                }

                const userImage = response.data.updatedUserDetails.image
                ? response.data.updatedUserDetails.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
              dispatch(
                setUser({ ...response.data.updatedUserDetails, image: userImage })
              )

                toast.success("Profile updated Successfully")
                



            }catch(error){
                console.log("error while Updating profile details -> ", error.message);
                toast.error("Could not update Profile")
            }
            toast.dismiss(toastId);
        }
    }

