const Razorpay = require("razorpay");
require("dotenv").config();

let instance;
try {
    instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY,
        key_secret: process.env.RAZORPAY_SECRET
    });
    console.log("Razorpay initialized successfully");
} catch(error) {
    console.log("Razorpay initialization failed:", error.message);
    instance = null;
}

exports.instance = instance;
