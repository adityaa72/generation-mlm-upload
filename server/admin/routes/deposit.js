"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const deposit_1 = require("../controllers/deposit");
router.post("/history/:status", deposit_1.depositHistoryList);
router.get("/fetch/:id", deposit_1.getDepositDetails);
router.post("/approve/:id", deposit_1.approveUserDeposit);
router.post("/reject/:id", deposit_1.rejectUserDeposit);
exports.default = router;
