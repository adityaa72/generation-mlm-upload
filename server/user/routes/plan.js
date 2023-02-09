"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const plan_1 = require("../controllers/plan");
// routes
router.patch("/upgrade-plan/:id", plan_1.upgradePlan);
router.get("/fetch-list", plan_1.fetchPlanList);
exports.default = router;
