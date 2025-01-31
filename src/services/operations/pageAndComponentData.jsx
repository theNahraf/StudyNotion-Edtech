import React from "react"
import toast from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { catalogData, categories } from "../apis"


export const getCatalogPageData = async(categoryId)=>{
    const toastId = toast.loading("Loading...")
    let result = []
    try{
        // console.log("hulu", categoryId)
        const response = await apiConnector("POST", catalogData.CATALOGPAGEDATA_API,
            {categoryId:categoryId}
        );
        // console.log("yahan tk to aagye ji ")

        if(!response?.data?.success){
            throw new Error("Could not fetch category page Data")
        }

        result = response?.data;

    }catch(error){
        console.log("catalog page data api errir", error)
        toast.error(error.message)
        result = error.response?.data;
    }
    toast.dismiss(toastId)
    return result;
}