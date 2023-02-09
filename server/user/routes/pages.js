"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const pages_1 = require("../controllers/pages");
// routes
router.get("/plans", pages_1.getPlansList);
router.get("/home", pages_1.getHomePage);
router.get("/terms-and-condition", pages_1.termsAndCondition);
router.get("/faq", pages_1.getFaqList);
router.get("/privacy-policy", pages_1.privacyPolicy);
router.get("/refund-policy", pages_1.getRefundPolicy);
router.get("/commission-policy", pages_1.getCommissionPolicy);
router.post("/contact-us", pages_1.sendContactEmail);
router.get("/contact-us", pages_1.getContactUs);
router.get("/social-links", pages_1.getSocialLinks);
exports.default = router;
