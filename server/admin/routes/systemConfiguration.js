"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const systemConfiguration_1 = require("../controllers/systemConfiguration");
// routes
router.get("/email-setting", systemConfiguration_1.getEmailSetting);
router.post("/email-setting", systemConfiguration_1.updateEmailSetting);
router.get("/site-setting", systemConfiguration_1.getSiteSetting);
router.get("/email-preferences", systemConfiguration_1.getEmailPreferences);
router.get("/site-configuration", systemConfiguration_1.getSiteConfiguration);
router.post("/site-setting", systemConfiguration_1.updateSiteSetting);
router.post("/send-test-email", systemConfiguration_1.sendTestEmail);
router.patch("/email-preferences", systemConfiguration_1.updateEmailPreferences);
router.patch("/site-configuration", systemConfiguration_1.updateSiteConfiguration);
//kyc-setting
router.post("/kyc-setting/create-form-label", systemConfiguration_1.createKycFormLabel);
router.delete("/kyc-setting/delete-form-label/:id", systemConfiguration_1.deleteKycFormLabel);
router.get("/kyc-setting/list", systemConfiguration_1.getKycSettingList);
router.patch("/logo/logo", systemConfiguration_1.updateSiteLogo);
router.patch("/logo/favicon", systemConfiguration_1.updateSiteFavicon);
exports.default = router;
