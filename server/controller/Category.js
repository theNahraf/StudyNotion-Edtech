const Category = require("../models/Category");
const Course = require("../models/Course");

function getRandomInt(max){
    return Math.floor(Math.random()*max)
}


//craeta a Category ka handler  fcniton 

///naam change krna hai tags to category 

exports.createCategory = async(req, res)=>{
    try{
        //fetch data
        const {name, description }=  req.body;

        //validation 
        
        if(!name || !description){
           return res.status(400).json({
            success:false,
            message:"All fields are Required"
           }) 
        }
        //create entry in db 

        const categoryDetails  = await Category.create({
            name:name,
            description:description
        })

        console.log(categoryDetails);

        //return response
        return res.status(200).json({
            success:true,
            message:"Category Created Successfully"
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Error while Creating Category"
        })
    }

}


exports.showAllcategory = async (req, res) => {
	try {
        // console.log("INSIDE SHOW ALL CATEGORIES");
		const allCategory = await Category.find({});
		res.status(200).json({
			success: true,
			allCategory,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};



//get all category fnction 
exports.categoryPageDetails = async(req, res)=>{
    try{
        const {categoryId} = req.body;
        console.log("category id ", categoryId);

        // get courses for the specifed category 
        const selectedCategory = await Category.findById(categoryId)
        .populate({
            path:"courses",
            match: {status : "Published"},
            populate:{
                path:"instructor"
            }
        }).exec()


        console.log("selected course ", selectedCategory);

        if(!selectedCategory){
            console.log("Category not found")
            return res.status(404).json({
                success:flase,
                message: "Category not found "
            })
        }
        

        // handle the case when theres no course 

        if(selectedCategory.courses.length === 0){
            console.log("No courses found for this category")
            return res.status(404).json({
                success:false,
                message:"No course found for the selected category "
            })
        }


        //get course from other categories

        const categoriesExceptSelected = await Category.find({
            _id :{$ne :categoryId},
        })


        let differentCategory  =  await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id   
        )
        .populate({
            path:"courses",
            match:{status:"Published"},
            populate:{
                path:"instructor",
            }
        })
        .exec()

        //get top seeling course acrooss all categoris
        const allCategories = await Category.find()
        .populate({
            path:"courses",
            match:{status:"Published"},
            populate:{
                path:"instructor",
            }
        })
        .exec()

        const allCourses = allCategories.flatMap((category)=>category.courses)

        const mostSellingCourses =  allCourses
        .sort((a,b)=> b.sold - a.sold)
        .slice(0, 10)

            
        return res.status(200).json({
            success:true,
            data :{
                selectedCategory,
                differentCategory,
                mostSellingCourses
            },
            // console.log("data of courses category", data)
            
        })

    }
    catch(error){
            return res.status(500).json({
                success:false,
                message:"error are in get category dtail ",
                error:error.message
            })
    }
}