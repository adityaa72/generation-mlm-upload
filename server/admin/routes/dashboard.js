"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboard_1 = require("../controllers/dashboard");
const router = (0, express_1.Router)();
router.get("/analytics", dashboard_1.getDashboardAnalytics);
router.get("/notice", dashboard_1.getDashboardNotice);
router.patch("/notice", dashboard_1.updateDashboardNotice);
exports.default = router;
