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
exports.setTwoAuthVerification = exports.expireAllLoginSessionToken = exports.expireLoginSessionToken = exports.getLoginSessionData = exports.createUserVerifyKyc = exports.updateContactDetails = exports.getContactDetails = exports.changePassword = exports.updateProfile = exports.getProfile = exports.getWalletDetails = exports.updateAvatar = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const is_empty_1 = __importDefault(require("is-empty"));
const db_1 = __importDefault(require("../../db"));
const errors_1 = require("../../errors");
const Email_1 = __importStar(require("../../libs/Email"));
const Kyc_1 = __importDefault(require("../../libs/Kyc"));
const KycForm_1 = __importDefault(require("../../libs/KycForm"));
const LoginSession_1 = __importDefault(require("../../libs/LoginSession"));
const User_1 = __importDefault(require("../../libs/User"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const format_1 = require("../../utils/format");
const validate_1 = __importStar(require("../../utils/validate"));
// update user avatar
const updateAvatar = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { avatar } = reqBody;
        (0, validate_1.default)([avatar], "body").args();
        (0, validate_1.default)(avatar, "avatar").required().string().url();
        const sql = `UPDATE ${tables_1.USER_TBL} SET avatar = ? WHERE userId = ? `;
        yield db_1.default.execute(sql, [avatar, userId]);
        return (0, errors_1.sendResponse)(res, "Avatar has been update");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateAvatar = updateAvatar;
// get wallet details
const getWalletDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const user = yield User_1.default.createInstance(userId);
        const details = yield user.walletDetails();
        return res.json(details);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getWalletDetails = getWalletDetails;
// get profile
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, token } = req.locals;
        const session = yield LoginSession_1.default.createInstance(token);
        const tokenId = yield session.tokenId();
        const user = yield User_1.default.createInstance(userId);
        const details = yield user.getProfileDetails();
        const lastKyc = yield Kyc_1.default.getUserLastKyc(userId);
        const data = Object.assign(Object.assign({}, details), { lastKyc, loginSessionId: tokenId });
        return res.json(data);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getProfile = getProfile;
// patch profile
const updateProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const user = yield User_1.default.createInstance(userId);
        const reqBody = req.body;
        const { firstName, lastName, kyc } = reqBody;
        (0, validate_1.default)(firstName, "First Name").required().string().maxLength(15);
        (0, validate_1.default)(lastName, "Last Name").required().string().maxLength(15);
        const userKyc = yield user.kyc();
        let update;
        const kycData = yield KycForm_1.default.getAllRow();
        if (userKyc !== "approved") {
            kycData.forEach(({ labelId, label, inputType, required, dropdownOptions, fileExtensions }) => {
                const userVal = kyc[labelId];
                const isRequired = required === "required";
                let verify;
                if (isRequired) {
                    verify = (0, validate_1.default)(userVal, `Kyc ${label}`).required().string();
                }
                else {
                    verify = (0, validate_1.default)(userVal, `Kyc ${label}`).string();
                }
                switch (inputType) {
                    case "dropdown":
                        if (
                        //@ts-ignore
                        !dropdownOptions.map(({ option }) => option).includes(userVal) &&
                            !(0, is_empty_1.default)(userVal)) {
                            throw new Error(`Kyc ${label} value is invalid`);
                        }
                        break;
                    case "file":
                        if (!(0, is_empty_1.default)(userVal)) {
                            verify.url();
                        }
                        break;
                    case "date":
                        if (!(0, is_empty_1.default)(userVal)) {
                            verify.date();
                        }
                        break;
                    case "input":
                        verify.maxLength(30);
                        break;
                    case "textarea":
                        verify.maxLength(1000);
                        break;
                    default:
                        throw new errors_1.ClientError(`Unknown input type ${inputType}`);
                }
            });
            const kycDetails = JSON.stringify(kyc);
            update = {
                firstName,
                lastName,
                kycDetails,
            };
        }
        else {
            const kycDetails = yield user.kycParsedDetails();
            kycData.forEach(({ labelId, label, inputType, required, dropdownOptions, fileExtensions }) => {
                const userVal = kyc[labelId];
                const isRequired = required === "required";
                let verify;
                if (!isRequired) {
                    verify = (0, validate_1.default)(userVal, `Kyc ${label}`).string();
                    switch (inputType) {
                        case "dropdown":
                            if (
                            //@ts-ignore
                            !dropdownOptions.map(({ option }) => option).includes(userVal) &&
                                !(0, is_empty_1.default)(userVal)) {
                                throw new Error(`Kyc ${label} value is invalid`);
                            }
                            break;
                        case "file":
                            if (!(0, is_empty_1.default)(userVal)) {
                                verify.url();
                            }
                            break;
                        case "date":
                            if (!(0, is_empty_1.default)(userVal)) {
                                verify.date();
                            }
                            break;
                        case "input":
                            verify.maxLength(30);
                            break;
                        case "textarea":
                            verify.maxLength(1000);
                            break;
                        default:
                            throw new errors_1.ClientError(`Unknown input type ${inputType}`);
                    }
                    kycDetails[labelId] = userVal;
                }
            });
            update = {
                kycDetails: JSON.stringify(kycDetails),
                firstName,
                lastName,
            };
        }
        const where = {
            userId,
        };
        const sql = `UPDATE ${tables_1.USER_TBL} SET ? WHERE userId = ?`;
        yield db_1.default.query(sql, [update, ...Object.values(where)]);
        yield user.updateRow();
        return (0, errors_1.sendResponse)(res, "Profile details has been updated", {
            user: yield user.getProfileDetails(),
        });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateProfile = updateProfile;
// post change password
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { password, newPassword, confirmNewPassword } = reqBody;
        (0, validate_1.default)([password, newPassword, confirmNewPassword], "body").args();
        if (userId === "1006090")
            throw new Error("Action not allowed in demo for this account");
        (0, validate_1.default)(password, "Password").required().string();
        (0, validate_1.default)(newPassword, "Password").required().string().minLength(6).maxLength(15);
        (0, validate_1.default)(confirmNewPassword, "Password")
            .required()
            .string()
            .minLength(6)
            .maxLength(15)
            .equal(newPassword, "New Password and New Confirm Password are not matching");
        const user = yield User_1.default.createInstance(userId);
        const userPassword = yield user.password();
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, userPassword);
        if (!isPasswordCorrect)
            throw new errors_1.ClientError("Current Password is not correct");
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        const where = {
            password: hashedPassword,
            userId,
        };
        // change password
        const sql = `UPDATE ${tables_1.USER_TBL} SET password = ? WHERE userId = ? `;
        yield db_1.default.execute(sql, Object.values(where));
        // expire all login tokens
        const tokenSql = `UPDATE ${tables_1.LOGIN_SESSION_TBL} SET status = ? WHERE userId = ? `;
        yield db_1.default.execute(tokenSql, ["expired", userId]);
        return (0, errors_1.sendResponse)(res, "Password changed successful");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.changePassword = changePassword;
// get profile
const getContactDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const user = yield User_1.default.createInstance(userId);
        const data = yield user.getContactDetails();
        return res.json(data);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getContactDetails = getContactDetails;
// patch profile
const updateContactDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { address, country, state, city, pinCode, mobileNumber } = reqBody;
        (0, validate_1.default)([address, country, state, city, pinCode, mobileNumber], "body").args();
        (0, validate_1.default)(address, "Address").required().string().maxLength(200);
        (0, validate_1.default)(country, "Country").required().string().maxLength(50);
        (0, validate_1.default)(state, "State").required().string().maxLength(50);
        (0, validate_1.default)(city, "City").required().string().maxLength(50);
        (0, validate_1.default)(pinCode, "Pin code").required().number().minLength(4).maxLength(8);
        (0, validate_1.default)(mobileNumber, "Mobile Number").required().string().mobileNumber();
        const updatedData = {
            address,
            state,
            city,
            pinCode,
            mobileNumber,
            country,
        };
        const sql = `UPDATE ${tables_1.USER_TBL} SET ? WHERE userId = ?`;
        yield db_1.default.query(sql, [updatedData, userId]);
        return (0, errors_1.sendResponse)(res, "Contact details has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateContactDetails = updateContactDetails;
// kyc
const createUserVerifyKyc = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const { userId } = req.locals;
        const user = yield User_1.default.createInstance(userId);
        const isReadyForKyc = yield user.isReadyForKyc();
        if (!isReadyForKyc)
            throw new errors_1.ClientError("Please fill all the required information");
        const kycStatus = yield user.kyc();
        if (kycStatus === "approved")
            throw new errors_1.ClientError("Kyc has been already approved");
        if (kycStatus !== "pending") {
            // update user kyc status to pending
            const update = {
                kyc: "pending",
            };
            const where = {
                userId,
            };
            const sql = `UPDATE ${tables_1.USER_TBL} SET ? WHERE userId = ?`;
            yield db_1.default.query(sql, [update, ...Object.values(where)]);
            // insert into kyc table for check by admin
            const kycRow = {
                userId,
                status: "pending",
                createdAt: (0, fns_1.currentDateTime)(),
            };
            const kycSql = `INSERT INTO ${tables_1.USER_KYC_TBL} SET ? `;
            yield db_1.default.query(kycSql, [kycRow]);
            yield conn.commit();
        }
        yield user.updateRow();
        const userKyc = yield user.kyc();
        return (0, errors_1.sendResponse)(res, "Kyc has been sent for verification", { userKyc });
    }
    catch (error) {
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createUserVerifyKyc = createUserVerifyKyc;
//login session
const getLoginSessionData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const columns = ["userId", "status", "createdAt", "ip", "device", "location"];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT ip,userId, tokenId as id,CONCAT_WS('- ', city, region, country) AS location,
    CONCAT_WS('- ', browser, device, os) AS device,createdAt, status FROM ${tables_1.LOGIN_SESSION_TBL} HAVING userId = ?  `;
        let sqlParams = [userId];
        if (searchFilter) {
            sql += ` AND (${(0, format_1.createSearchQuery)(columns)})`;
            sqlParams = [
                ...sqlParams,
                ...Array(columns.length)
                    .fill(null)
                    .map(() => `%${searchFilter}%`),
            ];
        }
        const filterSql = (0, format_1.formatFilterSql)(filterModel);
        if (filterSql) {
            const { sqlQuery, sqlValues } = filterSql;
            if (sqlQuery) {
                sql += ` AND ${sqlQuery}`;
                sqlParams = [...sqlParams, ...sqlValues];
            }
        }
        const [totalRows] = yield db_1.default.execute(sql, sqlParams);
        const rowCount = totalRows.length;
        const sortSql = (0, format_1.formatSortModel)(sortModel);
        if (sortSql)
            sql += ` ${sortSql}`;
        sql += ` LIMIT ${pageSize} OFFSET ${Number(pageIndex) * pageSize}`;
        const [rows] = yield db_1.default.execute(sql, sqlParams);
        return res.json({ rowCount, rows });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getLoginSessionData = getLoginSessionData;
// expire token
const expireLoginSessionToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        (0, validate_1.default)(id, "Id").required().string();
        const tokenId = Number(id);
        const { userId } = req.locals;
        const token = yield LoginSession_1.default.getTokenById(tokenId);
        const session = yield LoginSession_1.default.createInstance(token);
        const sessionUserId = yield session.userId();
        const status = yield session.status();
        if (userId !== sessionUserId)
            throw new errors_1.AuthError();
        if (status === "active") {
            const sql = `UPDATE ${tables_1.LOGIN_SESSION_TBL} SET status = ? WHERE userId = ? AND tokenId = ?`;
            yield db_1.default.execute(sql, ["expired", userId, tokenId]);
        }
        return (0, errors_1.sendResponse)(res, "Session has been expired");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.expireLoginSessionToken = expireLoginSessionToken;
const expireAllLoginSessionToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, token } = req.locals;
        const sql = `UPDATE ${tables_1.LOGIN_SESSION_TBL} SET status = ? WHERE userId = ? AND token != ?`;
        yield db_1.default.execute(sql, ["expired", userId, token]);
        return (0, errors_1.sendResponse)(res, "All Login Sessions have expired");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.expireAllLoginSessionToken = expireAllLoginSessionToken;
const setTwoAuthVerification = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const reqBody = req.body;
        const user = yield User_1.default.createInstance(userId);
        const twoFA = yield user.twoFA();
        const { status, step, verificationCode } = reqBody;
        (0, validate_1.default)(status, "Status").required().boolean();
        (0, validate_1.default)(step, "Step").required().number().oneOf([1, 2]);
        const message = twoFA
            ? "Two Authentication has been disabled."
            : "Two Authentication has been enabled.";
        if (twoFA !== status)
            return (0, errors_1.sendResponse)(res, message);
        const email = yield user.email();
        if (step === 1) {
            const otp = yield Email_1.default.getOtp(email, Email_1.emailPurposes.twoFA);
            yield Email_1.default.sendTwoFAMail(email, otp, twoFA);
            return res.json(null);
        }
        (0, validate_1.default)(verificationCode, "Verification Code").required().string().length(6);
        const isOtpValid = yield Email_1.default.isOtpValid(verificationCode, email, Email_1.emailPurposes.twoFA);
        if (!isOtpValid)
            throw new errors_1.ClientError("Otp is not valid");
        const update = {
            twoFA: twoFA ? "0" : "1",
        };
        const sql = `UPDATE ${tables_1.USER_TBL} SET ? WHERE userId = ?`;
        yield db_1.default.query(sql, [update, userId]);
        yield Email_1.default.deleteOTP(verificationCode, email, Email_1.emailPurposes.twoFA);
        yield user.updateRow();
        const newTwoFA = yield user.twoFA();
        return (0, errors_1.sendResponse)(res, message, { twoFA: newTwoFA });
    }
    catch (error) {
        console.log("🚀 ~ file: users.ts:481 ~ setTwoAuthVerification ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.setTwoAuthVerification = setTwoAuthVerification;
