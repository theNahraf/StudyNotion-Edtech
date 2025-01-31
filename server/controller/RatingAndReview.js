const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");
const { response } = require("express");


//creat rating and review
exports.createRating = async(req, res)=>{
    try{
        ///get user id
        const userId =  req.user.id;
        //fetch data from request body 
        const {rating , review, courseId} = req.body;
        ///validation -> check if user is  enrolled or not 
        const courseDetails = await Course.findOne(
                                    {_id:courseId,
                                    studentEnrolled: {$elemMatch : {$eq:userId}},
                                });

        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:"student is not enrolled in the course"
            })
        };

                //check if user already reviewd the course

                const  alreadyReviewed = await RatingAndReview.findOne({
                                                           user:userId,
                                                           course:courseId         
                })
                
            if(alreadyReviewed){
                return res.status(403).json({
                    success:false,
                    message:"Course is already reviewwed by the user"
                })
            }
                              
        //create rating and review in db
        const ratingReview = await RatingAndReview.create({
            rating, review, 
            course:courseId, user:userId
        })

        //attach to with course - > update course with this raitng and review

        //hw ->  //check that we did mistake ??
       const updatedCourseDetails= await Course.findByIdAndUpdate(courseId,
                                    {$push:{
                                        ratingndReviews:ratingReview._id,
                                    }},
                                    {new:true}
        )

        console.log(updatedCourseDetails);

        //return response
        return res.status(200).json({
            success:true,
            message: "Rating and Reivew cretead successfully",
            ratingReview
        })


    }catch(error){
        return res.status(500).json({
            success:false,
            message: error.message
        })
    }
}



//get avg rating
exports.getAverageRating = async(req, res)=>{
    try{

        //get course id
        const courseId = req.body.courseId;
        //or
        //const {courseId} = req.body

        //calculate avg rating
        // aggregate return an array 
        const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Schema.Types.ObjectId(courseId),
                },
            },
            {
                $group:{
                    _id:null,
                    averageRating : {$avg:"$rating"},
                }
            }
        ])

        //return rating 
        if(result.length > 0){
            return res.status(200).json({
                success:true,
                averageRating : result[0].averageRating
            })
        }

        // if no rating/reveoiew  exist 
        return res.status(200).json({
            success:true,
            message:"Average Ratgin is 0, no rating give till now",
            averageRating : 0
        })



    }catch(error){
console.log(error);
return res.status(500).json({
    success:false,
    message:error.message
})
    }
}


//get all rating and review

exports.getALLRating  = async(req, res)=>{
    try{
        const allReveiws = await RatingAndReview.find({})
                                    .sort({rating:"desc"})
                                    .populate({
                                        path:"user",
                                        select:"firstName lastName email ,image"
                                    })
                                    .populate({
                                        path:"course",
                                        select:"courseName"
                                    })
                                    .exec()
                                    
    return res.status(200).json({
        success:true,
        message:"all reviews fetched successfully",
        data : allReveiws
    })

    }catch(error){
        console.log(error);
return res.status(500).json({
    success:false,
    message:error.message
})
    }
}