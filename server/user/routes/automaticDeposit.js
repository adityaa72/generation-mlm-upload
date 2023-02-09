"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const paypal_1 = require("../payments/controllers/paypal");
const razorpay_1 = require("../payments/controllers/razorpay");
const payu_1 = require("../payments/controllers/payu");
const paytm_1 = require("../payments/controllers/paytm");
const stripe_1 = require("../payments/controllers/stripe");
const razorpay_2 = require("../payments/controllers/razorpay");
const flutterwave_1 = require("../payments/controllers/flutterwave");
const deposit_1 = require("../controllers/deposit");
// routes
router.get("/list", deposit_1.getInstantDepositGatewaysList);
// Paytm
router.post("/Paytm/createTransaction", paytm_1.createPaytmTransaction);
// Payu
router.post("/Payu/createTransaction", payu_1.createPayuTransaction);
// Stripe
router.post("/Stripe/createTransaction", stripe_1.createStripeTransaction);
// razorpay
router.post("/Razorpay/createTransaction", razorpay_1.createRazorpayTransaction);
router.post("/Razorpay/verify", razorpay_2.verifyRazorPayPayment);
router.post("/Razorpay/fail", razorpay_1.failRazorpayPayment);
router.post("/Razorpay/cancel/:orderId", razorpay_1.cancelRazorpayPayment);
// flutterwave
router.post("/flutterwave/verify/:orderId", flutterwave_1.verifyFlutterWavePayment);
router.post("/Flutterwave/createTransaction", flutterwave_1.createFlutterwaveTransaction);
// Paypal
router.post("/Paypal/verify/:orderId", paypal_1.verifyPayPalTxn);
router.post("/Paypal/createTransaction", paypal_1.createPaypalTransaction);
exports.default = router;
