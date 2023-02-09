"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const kyc_1 = require("../controllers/kyc");
router.post("/list/:status", kyc_1.kycList);
router.get("/fetch-data/:id", kyc_1.getKycData);
router.patch("/approve-kyc/:id", kyc_1.approveKyc);
router.patch("/reject-kyc/:id", kyc_1.rejectKyc);
exports.default = router;
