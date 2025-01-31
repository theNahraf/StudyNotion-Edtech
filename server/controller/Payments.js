const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../Utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const mongoose = require("mongoose");


//capture the payment and initaite the razorypay order

exports.capturePayment = async(req, res)=>{
    
        //get course id and user id
        const {courseId} = req.body;
        //login kra ladke ne , aur payload me mil gyi 

        //payload se nikali hai , kyuki login kra hai chore ne aur fr autheticaiton bhi hui hai 
        const userId = req.user.id;
        //validation 

        
        //valid course id
        if(!courseId){
            return res.json({
                success:false,
                message:"Please Provide valid course id"
            })
        }

//valid corse detail /
        let course; 
        try{
            course  = await Course.findById(courseId);
            if(!course){
                return res.json({
                    success:false,
                    message:"could not find the course"
                })
            }

  //user already pay for the same cousre

        const uid = new mongoose.Schema.ObjectId(userId);
        if(course.studentEnrolled.includes(uid)){
            return res.status(400).json({
                success:false,
                message:"Student is already Enrolled"
            })
        }

        }catch(error){  
            return res.status(500).json({
                success:false,
                message:error.message
            })
        }

        
      const amount = course.price;
      const currency = "INR";

      const options= {
        amount : amount*100,
        currency,
        receipt:Math.random(Date.now()).toString(),
        notes:{
            courseId: courseId,
            userId,
        }

      }

        //order create and return resplnse

        try{

            // we have to call funcitn that why 
            //initaite the payment using razorpya
            const paymentResponse = await instance.orders.create(options);

            console.log(paymentResponse);
            return res.status(200).json({
                success:true,
                courseName : course.courseName,
                courseDescription : course.courseDescription,
                thumbnail:course.thumbnail,
                orderId: paymentResponse.id,
                currency : paymentResponse.currency,
                amount : paymentResponse.amount,
            
            })

        }catch(error){
            console.log(error);
            return res.json({
                success:false,
                message:"could not initate order"
            })
        }
 
}


// ye sirf creation hui hai 
// ab  authorisation 

//verify signature of razorpay and server

exports.verifySignature = async(req,res)=>{

    //server signature
    const webhookSecret = "123456";
    
    //razorpya sign
    const signature = req.header["x-razorpay-signature"];

    //hashing  our secret key , we cant  decrypt razorpay secret key

    //not gave indepth clearity by babbar

    //hmac object
   const shasum= crypto.createHmac("sha256", webhookSecret);
   //convert into string
   shasum.update(JSON.stringify(req.body))
    const digest = shasum.digest("hex");
    

    //match signatura and digest
    if(signature === digest){
        console.log("payment is authorised");

        //ab actoin hona chiyae
        // Razorpay ne request kra verify singarire route ko 
        // iss req k andr milega notes ka object
            //

        //fetch ids from notes which was passed in order
        const {courseId, userId} = req.body.payload.payment.entity.notes;

        try{

            //aciotn full fill 
            //student ko enrol kro 

            //find the course and enroll the student in it
            const enrolledCourse = await Course.findOneAndUpdate(
                                    {_id:courseId},
                                    {$push:{studentEnrolled:userId}},
                                    {new:true}
            )

            if(!enrolledCourse){
                return res.status(500).json({
                    success:false,
                    message:"course not found"
                })
            }


            //student ko find krke addd courese kra list of enrooled course ne

            const enrolledStudent = await User.findOneAndUpdate(
                                            {_id:userId},
                                            {$push:{courses:courseId}},
                                            {new:true}
            )

            console.log(enrolledStudent);


            //send email after provid course for connfirmaiton
            const emailResponse = await mailSender(enrolledStudent.email,
                                                    "Congratulation from NSUT Courses",
                                                    "Congratulation , Your are onboarded into new nsut course course"
             );

             console.log(emailResponse);
             return res.status(200).json({
                success:true, 
                message:"Signature verified  and course added"
             })

        }catch(error){
            console.log(error);
            return res.status(500).json({
                success:false,
                message:error.message
            })


        }
         

    }
    else{
        return res.status(400).json({
            success:false,
            message: "invalid request"
        })
    }


}






