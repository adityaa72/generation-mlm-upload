"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripe_1 = require("../payments/controllers/stripe");
const router = express_1.default.Router();
// http:localhost:8080/verify-payment/stripe
http: router.post("/stripe", express_1.default.raw({ type: "application/json" }), stripe_1.verifyStripePayment);
exports.default = router;
