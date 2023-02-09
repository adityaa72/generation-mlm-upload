"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const withdraw_1 = require("../controllers/withdraw");
// routes
router.get("/transaction/:id", withdraw_1.getWithdrawTransactionData);
router.post("/withdraw-payment/:id", withdraw_1.withdrawPayment);
router.post("/history", withdraw_1.withdrawHistory);
router.get("/user-gateways-list", withdraw_1.getUserWithdrawGatewaysList);
router.get("/gateways-list", withdraw_1.getWithdrawGatewaysList);
router.get("/gateway/:id", withdraw_1.getWithdrawGatewayData);
router.post("/create-user-gateway/:id", withdraw_1.createUserWithdrawGateway);
router.delete("/delete-user-gateway/:id", withdraw_1.deleteUserWithdrawGateway);
exports.default = router;
