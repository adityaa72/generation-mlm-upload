"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const payu_1 = require("../payments/controllers/payu");
const express_1 = __importDefault(require("express"));
const paytm_1 = require("../payments/controllers/paytm");
const router = express_1.default.Router();
router.post("/paytm", paytm_1.verifyPaytmTransaction);
router.post("/payu/success", payu_1.verifyPayuTransaction);
router.post("/payu/failed", payu_1.failPayUTransaction);
exports.default = router;
