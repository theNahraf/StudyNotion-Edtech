const mongoose = require("mongoose");
const mailSender = require("../Utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5 * 60
    }
});

// Send OTP via email before saving
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email From StudyNotion",
            emailTemplate(otp)
        );
        console.log("OTP email sent successfully:", mailResponse?.messageId);
    } catch (error) {
        console.log("Error sending OTP email:", error.message);
        // Don't throw - let OTP still save so user can retry
    }
}

// Pre-save middleware
OTPSchema.pre("save", async function (next) {
    if (this.isNew) {
        await sendVerificationEmail(this.email, this.otp);
    }
    next();
});

module.exports = mongoose.model("OTP", OTPSchema);
