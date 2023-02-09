"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const planSetting_1 = require("../controllers/planSetting");
const router = express_1.default.Router();
router.post("/create-plan", planSetting_1.createPlan);
router.get("/plan-list", planSetting_1.getPlanData);
router.delete("/delete-plan/:id", planSetting_1.deletePlan);
exports.default = router;
