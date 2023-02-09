"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const deposit_1 = require("../controllers/deposit");
const router = express_1.default.Router();
router.get("/list", deposit_1.getManualDepositGatewayList);
router.post("/history", deposit_1.depositHistory);
router.post("/payment/:id", deposit_1.createManualDepositPayment);
router.get("/fetch/:id", deposit_1.getDepositDetails);
exports.default = router;
