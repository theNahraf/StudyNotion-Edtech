import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiConnector } from '../services/apiconnector'
import { categories } from '../services/apis'
import { getCatalogPageData } from '../services/operations/pageAndComponentData'
import Footer from '../Components/common/Footer'
import Course_Card from '../Components/Catalog/Course_Card'
import CourseSlider from '../Components/Catalog/CourseSlider'
import '../App.css'
const Catalog = () => {

    const[loading, setLoading] = useState(false)
    const catalogName = useParams() 
    const[categoryId, setCategoryId] = useState("");
    const[catalogPageData, setCatalogPageData] = useState(null);
    const [active, setActive] = useState(1)


    // fetch all categories 
    useEffect(()=>{
        // console.log("catalog param ", catalogName)
        const getCategories = async()=>{
            const response = await apiConnector("GET", categories.CATEGORIES_API);
            console.log("response", response)
            // const category_id = response?.data?.allCategory?.filter((ct) => ct.name.split(" ").join("-").toLowerCase() === catalogName)[0]._id;
            

            const matchingCategories =  response?.data?.allCategory.filter((ct)=>ct.name.split(" ").join("-").toLowerCase()===catalogName.catalogName);
            console.log("Matching categroeis", matchingCategories);

            const category_id = matchingCategories?.[0]?._id || null;

            console.log("category id ", category_id);
            setCategoryId(category_id)
        }
        getCategories()

    }, [catalogName])

    useEffect(()=>{
        const getCategoriesDetails= async()=>{
            try{
                const res  = await getCatalogPageData(categoryId);
                console.log("Priting response in catalog of category page detials", res);
                setCatalogPageData(res);
            }catch(error){
                console.log(error)
            }
        }

        if(categoryId){
            getCategoriesDetails()
        }
    }, [categoryId])


    if(loading || !catalogPageData){
        return (
            <div  className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
                <div className='loader'></div>
            </div>
        )
    }

    console.log("catalogPage data ", catalogPageData?.data)

  return (
    <>
        {/* hero section  */}
        <div className='box-content bg-richblack-800 px-4'>
            <div className='mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent'>
                <p className='text-sm text-richblack-300'>
                    {`Home / Catalog /`}
                    <span className='text-yellow-25'>
                        {catalogPageData?.data?.selectedCategory?.name}
                    </span>
                </p>
                <p className='text-3xl text-richblack-5'>
                    {catalogPageData?.data?.selectedCategory?.name}
                </p>
                <p className='max-w-[870px] text-richblack-200'>
                    {catalogPageData?.data?.selectedCategory?.description}
                </p>
            </div>
        </div>

        {/* section 1 */}
        <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
            <div className='section_heading'>Course to get You started</div>
            <div className='my-4 flex border-b border-b-richblack-600 text-sm'>
                <p
                className={`px-4 py-2 ${
                    active === 1
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={()=> setActive(1)}
                >
                    Most Popular
                </p>
                <p
                 className={`px-4 py-2 ${
                    active === 2
                    ? "border-b border-b-yellow-25 text-yellow-25"
                    : "text-richblack-50"
                } cursor-pointer`}
                onClick={()=> setActive(2)}
                >
                    New
                </p>
            </div>
            <div>
                <CourseSlider Courses ={catalogPageData?.data?.selectedCategory?.courses}/>
            </div>
        </div>

        {/* section 2 */}
        <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
            <div className='section_heading'>Top Courses in {catalogPageData?.data?.differentCategory?.name}</div>
            <div className='py-8'>
            <CourseSlider Courses ={catalogPageData?.data?.differentCategory?.courses}/>
            </div>
        </div>

        {/* section 3 */}
        <div className='mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent'>
            <div className='section_heading'>Frequently Bought</div>
            <div className='py-8 '>
                <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
                    {catalogPageData?.data?.mostSellingCourses
                    ?.slice(0,8)
                    .map((course,i)=>(
                     <Course_Card course={course} key={i} Height={"h-[400px]"}/>   
                    ))
                    }
                </div>
            </div>
        </div>

        <Footer/>
    </>
  )
}

export default Catalog