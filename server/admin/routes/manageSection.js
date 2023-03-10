"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const manageSection_1 = require("./../controllers/manageSection");
// routes
router.route("/about/about-us").get(manageSection_1.getAboutUs).patch(manageSection_1.patchAboutUs);
router.route("/about/our-mission").get(manageSection_1.getAboutUsOurMission).patch(manageSection_1.patchAboutUsOurMission);
router.route("/about/our-vision").get(manageSection_1.getAboutUsOurVision).patch(manageSection_1.patchAboutUsOurVision);
router.route("/hero-section").get(manageSection_1.getHeroSection).patch(manageSection_1.patchHeroSection);
router.get("/faq", manageSection_1.getFaq);
router.get("/faq/list", manageSection_1.getFaqList);
router.get("/privacy-policy", manageSection_1.getPrivacyPolicy);
router.get("/terms-and-conditions", manageSection_1.getTermsAndConditions);
router.get("/refund-policy", manageSection_1.getRefundPolicy);
router.get("/commission-policy", manageSection_1.getCommissionPolicy);
router.get("/contact-us", manageSection_1.getContactUs);
router.get("/social-links", manageSection_1.getSocialLinks);
router.post("/faq", manageSection_1.updateFaq);
router.post("/faq/create", manageSection_1.createFaq);
router.post("/privacy-policy", manageSection_1.updatePrivacyPolicy);
router.post("/terms-and-conditions", manageSection_1.updateTermsAndConditions);
router.put("/refund-policy", manageSection_1.updateRefundPolicy);
router.put("/commission-policy", manageSection_1.updateCommissionPolicy);
router.put("/contact-us", manageSection_1.updateContactUs);
router.patch("/social-links", manageSection_1.updateSocialLinks);
router.delete("/faq/delete/:faqId", manageSection_1.deleteFaq);
exports.default = router;
