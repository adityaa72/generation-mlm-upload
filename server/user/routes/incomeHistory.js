"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const incomeHistory_1 = require("../controllers/incomeHistory");
const router = express_1.default.Router();
router.post("/referral-income", incomeHistory_1.referralIncomeHistory);
router.post("/roi-income", incomeHistory_1.roiIncomeHistory);
exports.default = router;
