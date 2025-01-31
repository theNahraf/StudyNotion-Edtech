const mailSender = require("../Utils/mailSender")
const {contactUsEmail} =require("../mail/templates/contactFormRes");
const adminEmail = "farhanahmad12345786@gmail.com"

exports.contactUsController = async(req, res)=>{
    
    const{email, firstname, lastname, message, phoneNo, countrycode} = req.body
    console.log("req body ", req.body);
    try{
        const emailRes = await mailSender(
            email, 
            "Your Data Send Successfuly",
            contactUsEmail(email, firstname, lastname, message, phoneNo,countrycode)
        )

        console.log("email res", emailRes);

           // Send notification email to yourself (admin)
    const adminEmailRes = await mailSender(
        adminEmail,  // Send to your email address
        "New Contact Form Submission",  // Subject for the email sent to you
        `You have received a new contact form submission:
         Name: ${firstname} ${lastname}
         Email: ${email}
         Phone: ${countrycode} ${phoneNo}
         Message: ${message}`
      );
  
      console.log("Admin email res", adminEmailRes);


        return res.json({
            success:true, 
            message:"Email Send Successfully"
        })
    }catch(error){
        console.log("Error", error);
        console.log("Error Message : ", error.message);
        return res.json({
            success:false,
            message:"Something went wrong",
        })
    }
}