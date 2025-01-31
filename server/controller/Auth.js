const User = require("../models/User")
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config()
const Profile = require("../models/Profile");
const sendMail = require("../Utils/mailSender")

//send otp
exports.sendOTP = async(req, res)=>{
    try{
        //fetch email from request
        const {email} = req.body;

        //checkk if user already exits
        const checkUserPresent = await User.findOne({email});

        //if user already exist  then send the response
        if(checkUserPresent){
            return res.status(401).json({
                success:false,
                message:"User Already registered"
            })
        }
        

        // we have to check again again in db entry 
        //otp generator
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
        });
        
        console.log("OTP generator -> ", otp);

        //check unique otp or not 
        let result  = await OTP.findOne({otp: otp});
        
        //otp check for uniqueness 
        while(result){ 
            otp = otpGenerator.generate(6, {
                upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false
            })
             //yahan bhi check krna pad rhra hai 

            result  = await OTP.findOne({otp: otp});
        }

        //OTP KI entry db me kro

        const otpPayload ={email, otp};

        // create an entry in db for otp

        //entry create homme se pehle woh pre. save wala middleware triggered ho jyegea
        //or otp send ho jyega
        
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);


        // return response successfullly

        res.status(200).json({
            success:true,
            message:"OTp sent successfully", 
            otp,
        })


    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false, 
            message:error.message
        })

    }
}


//sign up 
exports.signUp = async(req, res)=>{
    try{
        //data fetcch from request ki body 
        const {
            firstName, 
            lastName, 
            email, 
            password, 
            confirmPassword, 
            accountType,
            contactNumber,
            otp
        } = req.body;



        //validation kro 
        if(!firstName ||!lastName || !email || !password || !confirmPassword || !otp){
            return res.status(403).json({
                success:false,
                message:"All fields are required"
            })
        }

        //2 password check 

        if(password!==confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Password and Confirm password value Does Not match , pls Try again"
            })
        }

        const existingUser = await User.findOne({email});

        //check user already existr or not
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User is already Registered"
            })
        }


    //find most recent otp stord for the user
    const recentOtp = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1);
        console.log("recent otp is ", recentOtp);

        //validate otp 

        if(recentOtp.length===0){
            //otp not found
            return res.status(400).json({
                success:false,
                message:"OTP not Found",
                
            })
        }

        //otp is not ccorrect
        //response
        else if(otp!==recentOtp[0].otp){
            //invalid otp
            return res.status(400).json({
                success:false,
                message:"OTP not matched, Invalid OTP"
            })
        }
        //otp is correct
        //now hash password

        const hashedPassword = await bcrypt.hash(password, 10);

        //entry create in db

        //creating a profile detaills

        const profileDetails = await Profile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null,
        })
        
        const user = await User.create({
            firstName,
            lastName,
            email,
            contactNumber,
            password:hashedPassword,
            accountType,

            //id pass krna hai jisme id assign ki gyi ho 
            additionalDetails:profileDetails._id,
            image:`https://ui-avatars.com/api/?name=${firstName}+${lastName}`
        })

        //signup successfylluy respnose
        res.status(200).json({
            success:true, 
            message:"User is Registered successfully",
            user,
        })

    
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false, 
            message:"User Cannot be registered , Please Try again"
        })
    }
}



//login 
exports.login = async(req, res)=>{
try{

//data fetch 
    const{email, password}  = req.body;

 //validate
 if(!email || !password){
    return res.status(403).json({
        success:false,
        message:"All fields are required"
    })
 }

 //check valid  user , pura user detail aajuyega
 const user = await User.findOne({email}).populate("additionalDetails")
 if(!user){
    return res.status(401).json({
        success:false, 
        message:"User is not Registered, please sign up first"
    })
 }



 //generate JWT , after password match 
//  user.password jo hashedPassword hai 
 if(await bcrypt.compare(password, user.password)){
    const payload = {
        user: user,
        email : user.email,
        id:user._id,
        accountType:user.accountType
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET,{
        expiresIn:"2h"
    });

    user.token = token;
    user.password = undefined;

    


 //create cookie and send res ponse

 const options= {
    expires : new Date(Date.now() +3*24*60*60*1000),
    //to stop cookie hijactking
    httpOnly :true
 }

 res.cookie("token", token , options).status(200).json({
    success:true,
    message:"Logged in Successfully",
    payload,
 })

}

else{
    return res.status(401).json({
        success:false, 
        message:"Password is Incorrect"
    })
}
       
} catch(error){
    console.log(error);
    return res.status(500).json({
        success:false, 
        message:"Login failed , please try again"
    })
}

}

//changePassword

//todo homework 

exports.changePassword = async(req, res)=>{
    //get data from req body
    const {oldPassword , newPassword} = req.body;

    //yahan ek baar check kr lena theek se 
    const userID = req.user.id

    console.log("auth me user id", userID);
    
    //get oldpassword, new passowrd , confirm ne passwrod


    //validation ->password empty, password match 
    
    if(!oldPassword || !newPassword){
        return res.status(400).json({
            success:false,
            message:"Field are required in Password"
        })
    }

    
    const user  = await User.findById(userID);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"User is not registered"
        })
    }
    
    if(await bcrypt.compare(oldPassword, user.password)){

        //change password wale ko hash kro 
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        //update password in database
        //we should save in db instaed of create , because we are upadting
    
        const updateUserDetails = await User.findByIdAndUpdate(
                                                    req.user.id,
                                                    {password:hashedPassword},
                                                    {new:true}
        )
    
        //send mail - password upadated
        try{

            await sendMail(user.email, "Password Change Successfuly", `Your Password has Change, kindly login by New password for this email ${user.email}`)

        }
        catch(error){
            console.error("Erroe while sending mail of password change")
           return res.status(500).json({
                success:false,
                message:"erroro while sending password chage mail",
                error : error.message
            })
        }
      
    
        //return respnse

        return res.status(200).json({
            success:true,
            message:"Password Changed Successfully "
        })
    }
    else{
        return res.status(500).json({
            success:false,
            message:'for password change , your current Password is incorrect'
        })
    }

}




