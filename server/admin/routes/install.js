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
const express_1 = require("express");
const db_1 = __importDefault(require("../../db"));
const errors_1 = require("../../errors");
const FrontEnd_1 = require("../../libs/FrontEnd");
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const validate_1 = __importDefault(require("../../utils/validate"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const router = (0, express_1.Router)();
router.post("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        // check if installed has place already
        {
            const sql = `SELECT COUNT(*) AS users FROM ${tables_1.USER_TBL} `;
            const [rows] = yield db_1.default.query(sql);
            const userCount = rows[0].users;
            if (userCount > 0)
                throw new Error("Installation has been placed already");
        }
        // create admin
        {
            const reqBody = req.body;
            (0, validate_1.default)(reqBody, "body").object();
            const { userName, email, password, confirmPassword } = reqBody;
            (0, validate_1.default)(userName, "User Name").required().string();
            (0, validate_1.default)(email, "Email").required().string().email();
            (0, validate_1.default)(password, "Password").required().string().minLength(6);
            (0, validate_1.default)(confirmPassword, "Confirm Password")
                .required()
                .string()
                .minLength(6)
                .equal(password, "Passwords are not matching");
            const userId = "1006090";
            const firstName = "";
            const lastName = "";
            const mobileNumber = "";
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            // inserting admin user id
            const userModel = {
                userId,
                email,
                userName,
                firstName,
                lastName,
                password: hashedPassword,
                mobileNumber,
                createdAt: (0, fns_1.currentDateTime)(),
                role: "admin",
                status: "active",
                twoFA: "0",
            };
            const sql = `INSERT INTO ${tables_1.USER_TBL} SET ?`;
            yield db_1.default.query(sql, userModel);
            // create admin tree
            const referralId = "0";
            const placementId = "0";
            const lft = 1;
            const rgt = 2;
            const level = 0;
            const treeData = {
                userId,
                referralId,
                placementId,
                rgt,
                lft,
                level,
            };
            // Insert user to the tree
            const sqlT = `INSERT INTO ${tables_1.USER_TREE_TBL} SET ?`;
            yield db_1.default.query(sqlT, treeData);
        }
        // insert settings
        {
            const appName = "Jamsrmlm";
            const currency = "₹";
            const currencyPosition = "prefix";
            const emailPreferences = {
                registrationSuccess: true,
            };
            const siteConfiguration = {
                registration: true,
            };
            const logo = "/images/logo.png";
            const favicon = "/images/favicon.png";
            const notice = "Welcome to the Jamsrmlm";
            const settingModel = {
                logo,
                favicon,
                appName,
                currency,
                currencyPosition,
                notice,
                emailPreferences: JSON.stringify(emailPreferences),
                siteConfiguration: JSON.stringify(siteConfiguration),
                balanceTransferCharge: 0,
                balanceTransferChargeType: "fixed",
                emailAccountLimit: 0,
            };
            const settingSql = `INSERT INTO ${tables_1.SETTING_TBL} SET ?`;
            yield db_1.default.query(settingSql, settingModel);
        }
        // add frontend settings
        {
            const frontend = {
                hero: FrontEnd_1.DefaultFrontEnd.hero,
                aboutUs: FrontEnd_1.DefaultFrontEnd.aboutUs,
                contactUs: FrontEnd_1.DefaultFrontEnd.contactUs,
                termsAndConditions: FrontEnd_1.DefaultFrontEnd.termsAndConditions,
                socialLinks: FrontEnd_1.DefaultFrontEnd.socialLinks,
                faq: FrontEnd_1.DefaultFrontEnd.faq,
                privacyPolicy: FrontEnd_1.DefaultFrontEnd.privacyPolicy,
                refundPolicy: FrontEnd_1.DefaultFrontEnd.refundPolicy,
                commissionPolicy: FrontEnd_1.DefaultFrontEnd.commissionPolicy,
                ourMission: FrontEnd_1.DefaultFrontEnd.ourMission,
                ourVision: FrontEnd_1.DefaultFrontEnd.ourVision,
            };
            const sql = `INSERT INTO ${tables_1.FRONTEND_SETTING_TBL} SET ?`;
            yield db_1.default.query(sql, frontend);
        }
        // commit transaction
        yield conn.commit();
        return (0, errors_1.sendResponse)(res, "Installation Successful");
    }
    catch (error) {
        yield conn.rollback();
        next(error);
        console.log("🚀 ~ file: install.ts:8 ~ router.post ~ error", error);
    }
    finally {
        db_1.default.release();
    }
}));
exports.default = router;
