const express = require("express");
const router = express.Router();

//import controller
const {capturePayment, verifySignature, sendPaymentSuccessEmail} = require("../controller/Payments");
const {auth, isStudent} = require("../middlewares/auth");

router.post("/capturePayment", auth, isStudent, capturePayment);
router.post("/verifyPayment", auth, isStudent, verifySignature);
router.post("/sendPaymentSuccessEmail", auth, isStudent, sendPaymentSuccessEmail);

module.exports = router;
