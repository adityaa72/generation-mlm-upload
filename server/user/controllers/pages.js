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
exports.getHomePage = exports.getPlansList = exports.getSocialLinks = exports.getContactUs = exports.getCommissionPolicy = exports.getRefundPolicy = exports.getFaqList = exports.sendContactEmail = exports.privacyPolicy = exports.termsAndCondition = void 0;
const db_1 = __importDefault(require("../../db"));
const Email_1 = __importDefault(require("../../libs/Email"));
const Faq_1 = __importDefault(require("../../libs/Faq"));
const FrontEnd_1 = __importDefault(require("../../libs/FrontEnd"));
const Plan_1 = __importDefault(require("../../libs/Plan"));
const validate_1 = __importDefault(require("../../utils/validate"));
const errors_1 = require("./../../errors");
const termsAndCondition = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const data = yield frontEnd.termsAndConditions();
        return res.json(data);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.termsAndCondition = termsAndCondition;
const privacyPolicy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const data = yield frontEnd.privacyPolicy();
        return res.json(data);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.privacyPolicy = privacyPolicy;
const sendContactEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { email, firstName, lastName, message, phone } = reqBody;
        (0, validate_1.default)([email, firstName, lastName, message, phone], "body").args();
        (0, validate_1.default)(email, "Email").required().string().email();
        (0, validate_1.default)(firstName, "First Name").required().string().maxLength(20);
        (0, validate_1.default)(lastName, "Last Name").required().string().maxLength(20);
        (0, validate_1.default)(message, "Message").required().string().maxLength(5000);
        (0, validate_1.default)(phone, "Phone").required().string();
        yield Email_1.default.sendContactUsMail({ email, firstName, lastName, message, phone });
        return (0, errors_1.sendResponse)(res, "Thanks for contacting us. We will response in few hrs.");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.sendContactEmail = sendContactEmail;
const getFaqList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield Faq_1.default.getAllRows();
        const frontEnd = new FrontEnd_1.default();
        const faq = yield frontEnd.faq();
        return res.json({
            section: faq,
            faqs: data,
        });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getFaqList = getFaqList;
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
const getPlansList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield Plan_1.default.getAllRows();
        return res.json(rows);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getPlansList = getPlansList;
const getHomePage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const frontEnd = new FrontEnd_1.default();
        const hero = yield frontEnd.hero();
        const aboutUs = yield frontEnd.aboutUs();
        const ourMission = yield frontEnd.ourMission();
        const ourVision = yield frontEnd.ourVision();
        return res.json({ hero, aboutUs, ourMission, ourVision });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getHomePage = getHomePage;
