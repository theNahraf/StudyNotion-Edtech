const User = require("../models/User");
const mailSender = require("../Utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

//resetPassword token
exports.resetPasswordToken = async(req, res)=>{
    try{
        //get email from req. body
        const{email} = req.body 

        // chck email validation 
        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({
                success:false,
                message:"Your Email is not registered with us"
            })
        }

        //generate token 

        const token = crypto.randomUUID();


        //update user by adding token add expiration time....?

        const updatedDetails = await User.findOneAndUpdate
                                            ({email:email},{
                                                token :token, 
                                                resetPasswordExpires: Date.now() + 5*60*1000,
                                            },
                                        {new:true});

        //create url 

         const url = `http://localhost:3000/update-password/${token}`

        //send mail containing the url 

        await mailSender(email, 
                        "Password Reset Link", 
                               `Password Reset Link: ${url}`);
             
        //return resonse

        return res.json({
            success:true, 
            message:"Email send successfully, please Check email and change password "
        })

        


       
    }
    catch(error){
        console.log("error in reset password", error)
        return res.status(500).json({
            message:false, 
            message:"Error occuring while reset passowrd Token  "
        })
    }
}

//after cicking the resetlink 
//reset password and new db entry 
exports.resetPassword = async(req, res)=>{
    try{

        //fetch new password and confirm new password
        //frontend ne teeno cheez pakdi aur body me daal di 

        const{password, confirmPassword, token} = req.body;
        //validation 

        if(password!==confirmPassword){
            return res.json({
                success:false,
                message:"Password not matching"
            })
        }

        //get user Details from db using token  
        //token se user ko dhond rhe hai , if token is invalid , user will not found 
        const userDetails = await User.findOne({token:token});


        //if no entry - invalid token 
        if(!userDetails){
            return res.json({
                success:false, 
                message:"TOken invalid"
            })
        }

        //token time check 
        if(userDetails.resetPasswordExpires < Date.now()){
                return res.json({
                    success:false,
                    message:"Link is Expired, Try again "
                })
        }

        //password ko hash kro 

        const hashedPassword = await bcrypt.hash(password, 10); 


        //password ko db me upadte krna hai 
        await User.findOneAndUpdate(
            {token:token},
            {password:hashedPassword},
            {new:true}
        )

        //return respones
        return res.status(200).json({
            success:true, 
            message:"Password Reset Successful"
        })
        
    }catch(error){
        console.log("error while reseting passowrd", error);
        return res.status(500).json({
            success:false,
            message:"error occuring while reseting password"
        })
    }
}
