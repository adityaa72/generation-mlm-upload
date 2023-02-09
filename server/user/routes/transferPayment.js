"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const transferPayment_1 = require("../controllers/transferPayment");
// routes
router.post("/transfer", transferPayment_1.transferPayment);
router.post("/history", transferPayment_1.transferPaymentHistory);
router.get("/get-config", transferPayment_1.getTransferPaymentConfig);
router.get("/search-user/:keyword?", transferPayment_1.searchUserTransferPaymentList);
exports.default = router;
