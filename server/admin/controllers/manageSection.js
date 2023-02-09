"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFaq = exports.updateSocialLinks = exports.updateContactUs = exports.updateCommissionPolicy = exports.updateRefundPolicy = exports.updateTermsAndConditions = exports.updatePrivacyPolicy = exports.updateFaq = exports.createFaq = exports.getSocialLinks = exports.getContactUs = exports.getCommissionPolicy = exports.getRefundPolicy = exports.getTermsAndConditions = exports.getPrivacyPolicy = exports.getFaqList = exports.patchAboutUsOurVision = exports.patchAboutUsOurMission = exports.getFaq = exports.getAboutUsOurVision = exports.getAboutUsOurMission = exports.patchHeroSection = exports.patchAboutUs = exports.getHeroSection = exports.getAboutUs = void 0;
const db_1 = __importDefault(require("../../db"));
const Faq_1 = __importDefault(require("../../libs/Faq"));
const FrontEnd_1 = __importDefault(require("../../libs/FrontEnd"));
const tables_1 = require("../../tables");
const validate_1 = __importDefault(require("../../utils/validate"));
const errors_1 = require("./../../errors");
const getAboutUs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const aboutUs = yield frontEnd.aboutUs();
        return res.json(aboutUs);
    }
    catch (error) {
        console.log("🚀 ~ file: manageSection.ts:17 ~ getAboutUs ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getAboutUs = getAboutUs;
const getHeroSection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const hero = yield frontEnd.hero();
        return res.json(hero);
    }
    catch (error) {
        console.log("🚀 ~ file: manageSection.ts:17 ~ getHeroSection ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getHeroSection = getHeroSection;
const patchAboutUs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { description } = reqBody;
        (0, validate_1.default)([description], "body").args();
        (0, validate_1.default)(description, "Description").required().string();
        const data = {
            description,
        };
        const jsonData = JSON.stringify(data);
        const sql = `UPDATE ${tables_1.FRONTEND_SETTING_TBL} SET aboutUs = ? `;
        yield db_1.default.execute(sql, [jsonData]);
        return (0, errors_1.sendResponse)(res, "About Us has been updated");
    }
    catch (error) {
        console.log("🚀 ~ file: manageSection.ts:55 ~ patchAboutUs ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.patchAboutUs = patchAboutUs;
const patchHeroSection = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { title, description, image } = reqBody;
        (0, validate_1.default)([title, description, image], "body").args();
        (0, validate_1.default)(title, "Title").required().string();
        (0, validate_1.default)(description, "Description").required().string();
        (0, validate_1.default)(image, "Image").string().url();
        const data = {
            title,
            description,
            image,
        };
        const jsonData = JSON.stringify(data);
        const sql = `UPDATE ${tables_1.FRONTEND_SETTING_TBL} SET hero = ? `;
        yield db_1.default.execute(sql, [jsonData]);
        return (0, errors_1.sendResponse)(res, "Our Mission has been updated");
    }
    catch (error) {
        console.log("🚀 ~ file: manageSection.ts:23 ~ patchHeroSection ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.patchHeroSection = patchHeroSection;
const getAboutUsOurMission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const ourMission = yield frontEnd.ourMission();
        return res.json(ourMission);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getAboutUsOurMission = getAboutUsOurMission;
const getAboutUsOurVision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const ourVision = yield frontEnd.ourVision();
        return res.json(ourVision);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getAboutUsOurVision = getAboutUsOurVision;
const getFaq = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const faq = yield frontEnd.faq();
        return res.json(faq);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getFaq = getFaq;
const patchAboutUsOurMission = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { title, description, image } = reqBody;
        (0, validate_1.default)([title, description, image], "body").args();
        (0, validate_1.default)(title, "Title").required().string();
        (0, validate_1.default)(description, "Description").required().string();
        (0, validate_1.default)(image, "Image").required().string().url();
        const data = {
            title,
            description,
            image,
        };
        const jsonData = JSON.stringify(data);
        const sql = `UPDATE ${tables_1.FRONTEND_SETTING_TBL} SET ourMission = ? `;
        yield db_1.default.execute(sql, [jsonData]);
        return (0, errors_1.sendResponse)(res, "Our Mission has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.patchAboutUsOurMission = patchAboutUsOurMission;
const patchAboutUsOurVision = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { title, description, image } = reqBody;
        (0, validate_1.default)([title, description, image], "body").args();
        (0, validate_1.default)(title, "Title").required().string();
        (0, validate_1.default)(description, "Description").required().string();
        (0, validate_1.default)(image, "Image").required().string().url();
        const data = {
            title,
            description,
            image,
        };
        const jsonData = JSON.stringify(data);
        const sql = `UPDATE ${tables_1.FRONTEND_SETTING_TBL} SET ourVision = ? `;
        yield db_1.default.execute(sql, [jsonData]);
        return (0, errors_1.sendResponse)(res, "Our Vision has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.patchAboutUsOurVision = patchAboutUsOurVision;
const getFaqList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Faq_1.default.getAllRows();
        return res.json(data);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getFaqList = getFaqList;
const getPrivacyPolicy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const privacyPolicy = yield frontEnd.privacyPolicy();
        return res.json(privacyPolicy);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getPrivacyPolicy = getPrivacyPolicy;
const getTermsAndConditions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const termsAndConditions = yield frontEnd.termsAndConditions();
        return res.json(termsAndConditions);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getTermsAndConditions = getTermsAndConditions;
const getRefundPolicy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const refundPolicy = yield frontEnd.refundPolicy();
        return res.json(refundPolicy);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getRefundPolicy = getRefundPolicy;
const getCommissionPolicy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const commissionPolicy = yield frontEnd.commissionPolicy();
        return res.json(commissionPolicy);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getCommissionPolicy = getCommissionPolicy;
const getContactUs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const contactUs = yield frontEnd.contactUs();
        return res.json(contactUs);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getContactUs = getContactUs;
const getSocialLinks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const socialLinks = yield frontEnd.socialLinks();
        return res.json(socialLinks);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getSocialLinks = getSocialLinks;
const createFaq = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { question, answer, faqId } = reqBody;
        (0, validate_1.default)([question, answer, faqId], "body").args();
        (0, validate_1.default)(question, "Question").required().string();
        (0, validate_1.default)(answer, "Answer").required().string();
        let message;
        if (faqId === 0) {
            const rowData = {
                question,
                answer,
            };
            const sql = `INSERT INTO ${tables_1.FAQ_LIST_TBL} SET ?`;
            yield db_1.default.query(sql, [rowData]);
            message = "Faq has been created.";
        }
        else {
            (0, validate_1.default)(faqId, "faqId").required().number();
            const update = {
                question,
                answer,
            };
            const sql = `UPDATE ${tables_1.FAQ_LIST_TBL} SET ? WHERE faqId = ?`;
            yield db_1.default.query(sql, [update, faqId]);
            message = "Faq has been updated.";
        }
        return (0, errors_1.sendResponse)(res, message);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createFaq = createFaq;
const updateFaq = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { title, subtitle } = reqBody;
        (0, validate_1.default)([title, subtitle], "body").args();
        (0, validate_1.default)(title, "Title").required().string();
        (0, validate_1.default)(subtitle, "Subtitle").string();
        const data = {
            title,
            subtitle,
        };
        const jsonData = JSON.stringify(data);
        const sql = `UPDATE ${tables_1.FRONTEND_SETTING_TBL} SET faq = ? `;
        yield db_1.default.execute(sql, [jsonData]);
        return (0, errors_1.sendResponse)(res, "Faq Section has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateFaq = updateFaq;
const updatePrivacyPolicy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { title, description } = reqBody;
        (0, validate_1.default)([title, description], "body").args();
        (0, validate_1.default)(title, "Title").required().string();
        (0, validate_1.default)(description, "Description").required().string();
        const data = {
            title,
            description,
        };
        const jsonData = JSON.stringify(data);
        const sql = `UPDATE ${tables_1.FRONTEND_SETTING_TBL} SET privacyPolicy = ? `;
        yield db_1.default.execute(sql, [jsonData]);
        return (0, errors_1.sendResponse)(res, "Privacy Policy Section has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updatePrivacyPolicy = updatePrivacyPolicy;
const updateTermsAndConditions = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { title, description } = reqBody;
        (0, validate_1.default)([title, description], "body").args();
        (0, validate_1.default)(title, "Title").required().string();
        (0, validate_1.default)(description, "Description").required().string();
        const data = {
            title,
            description,
        };
        const jsonData = JSON.stringify(data);
        const sql = `UPDATE ${tables_1.FRONTEND_SETTING_TBL} SET termsAndConditions = ? `;
        yield db_1.default.execute(sql, [jsonData]);
        return (0, errors_1.sendResponse)(res, "Terms & Conditions page has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateTermsAndConditions = updateTermsAndConditions;
const updateRefundPolicy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { title, description } = reqBody;
        (0, validate_1.default)([title, description], "body").args();
        (0, validate_1.default)(title, "Title").required().string();
        (0, validate_1.default)(description, "Description").required().string();
        const data = {
            title,
            description,
        };
        const jsonData = JSON.stringify(data);
        const sql = `UPDATE ${tables_1.FRONTEND_SETTING_TBL} SET refundPolicy = ? `;
        yield db_1.default.execute(sql, [jsonData]);
        return (0, errors_1.sendResponse)(res, "Refund Policy page has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateRefundPolicy = updateRefundPolicy;
const updateCommissionPolicy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { title, description } = reqBody;
        (0, validate_1.default)([title, description], "body").args();
        (0, validate_1.default)(title, "Title").required().string();
        (0, validate_1.default)(description, "Description").required().string();
        const data = {
            title,
            description,
        };
        const jsonData = JSON.stringify(data);
        const sql = `UPDATE ${tables_1.FRONTEND_SETTING_TBL} SET commissionPolicy = ? `;
        yield db_1.default.execute(sql, [jsonData]);
        return (0, errors_1.sendResponse)(res, "Commission Policy page has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateCommissionPolicy = updateCommissionPolicy;
const updateContactUs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { title, subtitle, whatsapp, email, location } = reqBody;
        (0, validate_1.default)([title, subtitle, whatsapp, email, location], "body").args();
        (0, validate_1.default)(title, "Title").required().string();
        (0, validate_1.default)(subtitle, "Subtitle").required().string();
        (0, validate_1.default)(whatsapp, "Whatsapp").required().string();
        (0, validate_1.default)(email, "Email").required().string().email();
        (0, validate_1.default)(location, "Location").string();
        const data = {
            title,
            subtitle,
            whatsapp,
            email,
            location,
        };
        const jsonData = JSON.stringify(data);
        const sql = `UPDATE ${tables_1.FRONTEND_SETTING_TBL} SET contactUs = ? `;
        yield db_1.default.execute(sql, [jsonData]);
        return (0, errors_1.sendResponse)(res, "Contact Us Page has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateContactUs = updateContactUs;
const updateSocialLinks = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { discord, facebook, instagram, linkedin, telegram, twitter, whatsapp, youtube } = reqBody;
        (0, validate_1.default)([discord, facebook, instagram, linkedin, telegram, twitter, whatsapp, youtube], "body").args();
        (0, validate_1.default)(discord, "Discord").string().url();
        (0, validate_1.default)(facebook, "Discord").string().url();
        (0, validate_1.default)(instagram, "Discord").string().url();
        (0, validate_1.default)(linkedin, "Discord").string().url();
        (0, validate_1.default)(telegram, "Discord").string().url();
        (0, validate_1.default)(twitter, "Discord").string().url();
        (0, validate_1.default)(youtube, "Discord").string().url();
        const data = {
            discord,
            facebook,
            instagram,
            linkedin,
            telegram,
            twitter,
            whatsapp,
            youtube,
        };
        const jsonData = JSON.stringify(data);
        const sql = `UPDATE ${tables_1.FRONTEND_SETTING_TBL} SET socialLinks = ? `;
        yield db_1.default.execute(sql, [jsonData]);
        return (0, errors_1.sendResponse)(res, "Social Links has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateSocialLinks = updateSocialLinks;
const deleteFaq = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { faqId: id } = req.params;
        (0, validate_1.default)(id, "Faq Id").required().string();
        const faqId = Number(id);
        const sql = `DELETE FROM ${tables_1.FAQ_LIST_TBL} WHERE faqId = ?`;
        yield db_1.default.execute(sql, [faqId]);
        return (0, errors_1.sendResponse)(res, "Faq has been deleted");
    }
    catch (error) {
        console.log("🚀 ~ file: manageSection.ts:646 ~ deleteFaq ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.deleteFaq = deleteFaq;
