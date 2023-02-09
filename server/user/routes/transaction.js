"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const transaction_1 = require("../controllers/transaction");
router.post("/", transaction_1.getTransactionHistory);
router.get("/:id", transaction_1.getTransactionData);
exports.default = router;
