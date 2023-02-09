"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.deleteLoginSessionToken = exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_ipinfo_1 = __importDefault(require("node-ipinfo"));
const validator_1 = __importDefault(require("validator"));
const db_1 = __importDefault(require("../../db"));
const errors_1 = require("../../errors");
const Email_1 = __importStar(require("../../libs/Email"));
const Setting_1 = __importDefault(require("../../libs/Setting"));
const User_1 = __importDefault(require("../../libs/User"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const validate_1 = __importDefault(require("../../utils/validate"));
//* ----------------------------------------------------------------
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    conn.beginTransaction();
    try {
        yield Setting_1.default.validateRegistration();
        const reqBody = req.body;
        // validate if the request body is json
        (0, validate_1.default)(reqBody, "body").object();
        const { referralId, userName, firstName, lastName, mobileNumber, email, password, confirmPassword, step, verificationCode, } = reqBody;
        // validate if the all the values are present in the body
        (0, validate_1.default)([referralId, userName, firstName, lastName, mobileNumber, email, password, confirmPassword], "body").args();
        // validate  all the values
        (0, validate_1.default)(step, "Step").required().number().oneOf([1, 2]);
        (0, validate_1.default)(referralId, "Referral Id").required().string();
        (0, validate_1.default)(userName, "User Name").required().string().userName().minLength(2).maxLength(15);
        (0, validate_1.default)(firstName, "First Name").required().string().minLength(2).maxLength(10);
        (0, validate_1.default)(lastName, "Last Name").required().string().minLength(2).maxLength(10);
        (0, validate_1.default)(mobileNumber, "Mobile Number").required().string().maxLength(25);
        (0, validate_1.default)(email, "Email").required().string().email().maxLength(50);
        (0, validate_1.default)(password, "Password").required().string().minLength(6).maxLength(15);
        (0, validate_1.default)(confirmPassword, "Confirm Password")
            .required()
            .string()
            .minLength(6)
            .maxLength(15)
            .equal(password, "Passwords are not matching");
        const isUserName = yield User_1.default.isUserName(userName);
        if (isUserName)
            throw new errors_1.ClientError("Username already exists");
        const isReferralId = yield User_1.default.isUserId(referralId);
        if (!isReferralId)
            throw new errors_1.ClientError("Referral Id doesn't exist");
        yield User_1.default.validateRegisterEmail(email);
        const placementId = referralId;
        if (step === 1) {
            const otp = yield Email_1.default.getOtp(email, Email_1.emailPurposes.register);
            yield Email_1.default.sendRegisterVerificationMail(email, otp);
            yield conn.commit();
            return (0, errors_1.sendResponse)(res, "Otp has been sent", {
                email,
            });
        }
        if (step === 2) {
            (0, validate_1.default)(verificationCode, "Verification Code").required().string().length(6);
            const isOtpValid = yield Email_1.default.isOtpValid(verificationCode, email, Email_1.emailPurposes.register);
            if (!isOtpValid)
                throw new errors_1.ClientError("Otp is not valid");
        }
        // create new user db structure
        const userId = yield User_1.default.createNewUserId();
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const role = "user";
        const status = "active";
        const userData = {
            userId,
            email,
            userName,
            firstName,
            lastName,
            mobileNumber,
            role,
            password: hashedPassword,
            status,
            twoFA: "0",
            createdAt: (0, fns_1.currentDateTime)(),
        };
        // Insert user to the database
        const sql = `INSERT INTO ${tables_1.USER_TBL} SET ?`;
        yield db_1.default.query(sql, userData);
        const PlacementUser = yield User_1.default.createInstance(placementId);
        let lft = yield PlacementUser.lft();
        let rgt = yield PlacementUser.rgt();
        lft = rgt;
        rgt = lft + 1;
        const lftSql = `UPDATE ${tables_1.USER_TREE_TBL} SET lft = lft + ? WHERE lft >= ? `;
        const rgtSql = `UPDATE ${tables_1.USER_TREE_TBL} SET rgt = rgt + ? WHERE rgt >= ? `;
        yield db_1.default.execute(lftSql, [2, lft]);
        yield db_1.default.execute(rgtSql, [2, lft]);
        const placementUserLevel = yield PlacementUser.level();
        const userLevel = placementUserLevel + 1;
        // create user tree db structure
        const treeData = {
            userId,
            referralId,
            placementId,
            rgt,
            lft,
            level: userLevel,
        };
        // Insert user to the tree
        const sqlT = `INSERT INTO ${tables_1.USER_TREE_TBL} SET ?`;
        yield db_1.default.query(sqlT, treeData);
        const user = yield User_1.default.createInstance(userId);
        // Add referral income
        yield user.addParentReferralIncome();
        yield Email_1.default.deleteOTP(verificationCode, email, Email_1.emailPurposes.register);
        yield conn.commit();
        yield Email_1.default.sendRegistrationSuccessfulMail(email, userId);
        return (0, errors_1.sendResponse)(res, "Registration successful", { userId });
    }
    catch (error) {
        console.log("🚀 ~ file: auth.ts:223 ~ register ~ error", error);
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        // validate if the request body is json
        (0, validate_1.default)(reqBody, "body").object();
        const { userId, password, remember, step, verificationCode } = reqBody;
        // validate if the all the values are present in the body
        (0, validate_1.default)([userId, password, remember], "body").args();
        (0, validate_1.default)(userId, "User Id").required().string();
        (0, validate_1.default)(password, "Password").required().string();
        (0, validate_1.default)(remember, "Remember me").required().boolean();
        (0, validate_1.default)(step, "Step").required().number().oneOf([1, 2]);
        const isEmail = validator_1.default.isEmail(userId);
        const user = yield User_1.default.createInstance(userId, {
            error: "User does not exist",
            userName: isNaN(Number(userId)) ? true : false,
            email: isEmail, //  login with email
        });
        const dbPassword = yield user.password();
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, dbPassword);
        if (!isPasswordCorrect)
            throw new errors_1.ClientError("Password is incorrect");
        const userStatus = yield user.status();
        if (userStatus === "blocked")
            throw new errors_1.ClientError("Your account has blocked. Contact support for further processing");
        const twoFA = yield user.twoFA();
        if (twoFA) {
            const email = yield user.email();
            if (step === 1) {
                const otp = yield Email_1.default.getOtp(email, Email_1.emailPurposes.login);
                yield Email_1.default.sendLoginVerificationMail(email, otp);
                return (0, errors_1.sendResponse)(res, "Verify the code to login", { twoFA, email });
            }
            else {
                (0, validate_1.default)(verificationCode, "OTP").required().string().length(6);
                // check if otp is valid
                const isOtpValid = yield Email_1.default.isOtpValid(verificationCode, email, Email_1.emailPurposes.login);
                if (!isOtpValid)
                    throw new errors_1.ClientError("Otp is not valid");
                yield Email_1.default.deleteOTP(verificationCode, email, Email_1.emailPurposes.login);
            }
        }
        const originalUserId = user.userId;
        const token = jsonwebtoken_1.default.sign({ id: originalUserId }, process.env.JWT_SECRET_KEY, {
            expiresIn: remember ? "7d" : "1d",
        });
        // delete the last session if more than 100
        {
            const MAX_LOGIN_SESSION = 100;
            const sql = `SELECT COUNT(*) AS sessions FROM ${tables_1.LOGIN_SESSION_TBL} WHERE userId = ?`;
            const [rows] = yield db_1.default.execute(sql, [userId]);
            const sessions = rows[0].sessions;
            console.log("🚀 ~ file: auth.ts:325 ~ login ~ sessions", sessions);
            if (sessions >= MAX_LOGIN_SESSION) {
                const sql = `DELETE FROM ${tables_1.LOGIN_SESSION_TBL} WHERE userId = ? ORDER BY tokenId ASC LIMIT 1 `;
                yield db_1.default.execute(sql, [userId]);
            }
        }
        let browser = "", os = "", device = "", country = "", region = "", city = "", ip = req.ip;
        try {
            const ipinfoWrapper = new node_ipinfo_1.default("d425c4a12ffbf4");
            const response = yield ipinfoWrapper.lookupIp(ip);
            if (response.country)
                country = response.country;
            if (response.region)
                region = response.region;
            if (response.city)
                city = response.city;
        }
        catch (error) { }
        const userAgent = req.useragent;
        if (userAgent) {
            const { isMobile, isTablet, isiPad, isiPod, isiPhone, isAndroid, isDesktop, browser: browserText, os: osText, } = userAgent;
            browser = browserText;
            os = osText;
            if (isMobile)
                device = "Mobile";
            if (isTablet)
                device = "Tablet";
            if (isiPad)
                device = "IPad";
            if (isiPod)
                device = "IPod";
            if (isiPhone)
                device = "Phone";
            if (isAndroid)
                device = "Android";
            if (isDesktop)
                device = "Computer";
        }
        const validTill = (0, fns_1.getDateTime)("add", remember ? 7 : 1, "days");
        const sessionData = {
            userId,
            token,
            createdAt: (0, fns_1.currentDateTime)(),
            validTill,
            ip,
            country,
            region,
            city,
            status: "active",
            agent: "user",
            browser,
            os,
            device,
            loginBy: "user",
        };
        const sql = `INSERT INTO ${tables_1.LOGIN_SESSION_TBL} SET ?`;
        const [row] = yield db_1.default.query(sql, [sessionData]);
        const tokenId = row.insertId;
        const details = yield user.getProfileDetails();
        return (0, errors_1.sendResponse)(res, "Login successful", {
            accessToken: token,
            user: Object.assign(Object.assign({}, details), { loginSessionId: tokenId }),
        });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.login = login;
const forgotPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        // validate if the request body is json
        (0, validate_1.default)(reqBody, "body").object();
        const { userId } = reqBody;
        // validate if the all the values are present in the body
        (0, validate_1.default)([userId], "body").args();
        (0, validate_1.default)(userId, "User Id").required().string();
        const isEmail = validator_1.default.isEmail(userId);
        const user = yield User_1.default.createInstance(userId, {
            error: "User does not exist",
            userName: isNaN(Number(userId)) ? true : false,
            email: isEmail, //  login with email
        });
        const email = yield user.email();
        const otp = yield Email_1.default.getOtp(email, Email_1.emailPurposes.resetPassword);
        yield Email_1.default.sendResetPasswordEmail(email, otp);
        return (0, errors_1.sendResponse)(res, "Otp has been sent", {
            email,
            userId,
        });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        // validate if the request body is json
        (0, validate_1.default)(reqBody, "body").object();
        const { userId, otp: reqOtp, password, confirmPassword } = reqBody;
        // validate if the all the values are present in the body
        (0, validate_1.default)([userId, reqOtp, password, confirmPassword], "body").args();
        (0, validate_1.default)(userId, "User Id").required().string();
        (0, validate_1.default)(reqOtp, "Otp").required().number().length(6);
        (0, validate_1.default)(password, "Password").required().string().minLength(6).maxLength(15);
        (0, validate_1.default)(confirmPassword, "Confirm Password")
            .required()
            .string()
            .minLength(6)
            .maxLength(15)
            .equal(password, "Passwords are not matching");
        const isEmail = validator_1.default.isEmail(userId);
        const user = yield User_1.default.createInstance(userId, {
            error: "User does not exist",
            userName: isNaN(Number(userId)) ? true : false,
            email: isEmail, //  login with email
        });
        const email = yield user.email();
        const otp = reqOtp;
        // check if otp is valid
        const isOtpValid = yield Email_1.default.isOtpValid(otp, email, Email_1.emailPurposes.resetPassword);
        if (!isOtpValid)
            throw new errors_1.ClientError("Otp is not valid");
        // change password
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const where = {
            password: hashedPassword,
            userId,
        };
        const sql = `UPDATE ${tables_1.USER_TBL} SET password = ? WHERE userId = ? `;
        yield db_1.default.execute(sql, Object.values(where));
        // expire all login tokens
        const tokenSql = `UPDATE ${tables_1.LOGIN_SESSION_TBL} SET status = ? WHERE userId = ? `;
        yield db_1.default.execute(tokenSql, ["expired", userId]);
        yield Email_1.default.deleteOTP(otp, email, Email_1.emailPurposes.resetPassword);
        return (0, errors_1.sendResponse)(res, "Password has been changed");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.resetPassword = resetPassword;
const deleteLoginSessionToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const sql = `UPDATE ${tables_1.LOGIN_SESSION_TBL} SET status = ? WHERE token = ?`;
        yield db_1.default.execute(sql, ["expired", token]);
        return (0, errors_1.sendResponse)(res, "Logout Successful");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.deleteLoginSessionToken = deleteLoginSessionToken;
