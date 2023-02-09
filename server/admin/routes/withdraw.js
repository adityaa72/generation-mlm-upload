"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const withdraw_1 = require("../controllers/withdraw");
router.post("/history/:status", withdraw_1.withdrawHistoryList);
router.get("/fetch/:id", withdraw_1.getWithdrawDetails);
router.post("/approve/:id", withdraw_1.approveWithdraw);
router.post("/reject/:id", withdraw_1.rejectWithdraw);
exports.default = router;
