const mongoose =require("mongoose");
const mailSender = require("../Utils/mailSender");


const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true,
    },

    createdAt:{
        type:Date,
        default:Date.now(),
        expires : 5*60
    }
})


// otp ko mail me send krte hai 
//function -> to send emails\
async function sendVerificationEmail( email, otp){

    try{
        const mailResponse = mailSender(email, "Verification Email From StudyNotion", otp )
        console.log("email sent Successfully", mailResponse);

    }
    catch(error){
        console.log("error occurs during mail send", error)
    }
}

//middle ware
OTPSchema.pre("save", async function(next){
    await sendVerificationEmail(this.email, this.otp);
    next();
    
} ) 


module.exports = mongoose.model("OTP", OTPSchema);
