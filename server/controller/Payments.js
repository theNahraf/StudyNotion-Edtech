const {instance} = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../Utils/mailSender");
const {courseEnrollmentEmail} = require("../mail/templates/courseEnrollmentEmail");
const {paymentSuccessEmail} = require("../mail/templates/paymentSuccessEmail");
const mongoose = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

// Capture payment and initiate Razorpay order
exports.capturePayment = async(req, res) => {
    const {courses} = req.body;
    const userId = req.user.id;

    if(!courses || courses.length === 0) {
        return res.json({
            success: false,
            message: "Please provide course ID"
        });
    }

    let total_amount = 0;

    for(const course_id of courses) {
        let course;
        try {
            course = await Course.findById(course_id);
            if(!course) {
                return res.status(200).json({
                    success: false,
                    message: "Could not find the course"
                });
            }

            const uid = new mongoose.Types.ObjectId(userId);
            if(course.studentEnrolled.includes(uid)) {
                return res.status(200).json({
                    success: false,
                    message: "Student is already enrolled"
                });
            }

            total_amount += course.price;
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    const options = {
        amount: total_amount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    };

    try {
        const paymentResponse = await instance.orders.create(options);
        res.json({
            success: true,
            data: paymentResponse,
        });
    } catch(error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Could not initiate order"
        });
    }
};

// Verify payment signature
exports.verifySignature = async(req, res) => {
    const razorpay_order_id = req.body?.razorpay_order_id;
    const razorpay_payment_id = req.body?.razorpay_payment_id;
    const razorpay_signature = req.body?.razorpay_signature;
    const courses = req.body?.courses;
    const userId = req.user.id;

    if(!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !courses || !userId) {
        return res.status(200).json({
            success: false,
            message: "Payment failed"
        });
    }

    let body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_SECRET)
        .update(body.toString())
        .digest("hex");

    if(expectedSignature === razorpay_signature) {
        // Enroll student
        await enrollStudents(courses, userId, res);
        return res.status(200).json({
            success: true,
            message: "Payment Verified"
        });
    }

    return res.status(200).json({
        success: false,
        message: "Payment verification failed"
    });
};

// Enroll students helper
const enrollStudents = async(courses, userId, res) => {
    if(!courses || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide courses and user ID"
        });
    }

    for(const courseId of courses) {
        try {
            const enrolledCourse = await Course.findOneAndUpdate(
                {_id: courseId},
                {$push: {studentEnrolled: userId}},
                {new: true}
            );

            if(!enrolledCourse) {
                return res.status(500).json({
                    success: false,
                    message: "Course not found"
                });
            }

            // Create course progress
            const courseProgress = await CourseProgress.create({
                courseId: courseId,
                userId: userId,
                completedVideos: [],
            });

            // Find student and add course
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    }
                },
                {new: true}
            );

            // Send enrollment email
            const emailResponse = await mailSender(
                enrolledStudent.email,
                `Successfully Enrolled into ${enrolledCourse.courseName}`,
                courseEnrollmentEmail(enrolledCourse.courseName, `${enrolledStudent.firstName} ${enrolledStudent.lastName}`)
            );

            console.log("Email sent successfully: ", emailResponse?.response);
        } catch(error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
};

// Send payment success email
exports.sendPaymentSuccessEmail = async(req, res) => {
    const {orderId, paymentId, amount} = req.body;
    const userId = req.user.id;

    if(!orderId || !paymentId || !amount || !userId) {
        return res.status(400).json({
            success: false,
            message: "Please provide all the details"
        });
    }

    try {
        const enrolledStudent = await User.findById(userId);

        await mailSender(
            enrolledStudent.email,
            "Payment Received",
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100,
                orderId,
                paymentId
            )
        );

        return res.status(200).json({
            success: true,
            message: "Email sent successfully"
        });
    } catch(error) {
        console.log("error in sending mail", error);
        return res.status(400).json({
            success: false,
            message: "Could not send email"
        });
    }
};
