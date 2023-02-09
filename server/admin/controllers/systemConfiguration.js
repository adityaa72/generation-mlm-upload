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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSiteFavicon = exports.updateSiteLogo = exports.deleteKycFormLabel = exports.getKycSettingList = exports.createKycFormLabel = exports.sendTestEmail = exports.updateSiteConfiguration = exports.updateEmailPreferences = exports.updateEmailSetting = exports.updateSiteSetting = exports.getSiteConfiguration = exports.getEmailPreferences = exports.getSiteSetting = exports.getEmailSetting = void 0;
const db_1 = __importDefault(require("../../db"));
const Email_1 = __importDefault(require("../../libs/Email"));
const KycForm_1 = __importStar(require("../../libs/KycForm"));
const Setting_1 = __importDefault(require("../../libs/Setting"));
const tables_1 = require("../../tables");
const validate_1 = __importDefault(require("../../utils/validate"));
const errors_1 = require("./../../errors");
const getEmailSetting = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = new Setting_1.default();
        const emailSettings = yield settings.emailSettings();
        return res.json(emailSettings);
    }
    catch (error) {
        console.log("🚀 ~ file: systemConfiguration.ts:18 ~ getEmailSetting ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getEmailSetting = getEmailSetting;
const getSiteSetting = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = new Setting_1.default();
        const siteSettings = yield settings.siteSettings();
        return res.json(siteSettings);
    }
    catch (error) {
        console.log("🚀 ~ file: systemConfiguration.ts:30 ~ getSiteSetting ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getSiteSetting = getSiteSetting;
const getEmailPreferences = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = new Setting_1.default();
        const emailPreferences = yield settings.emailPreferences();
        return res.json(emailPreferences);
    }
    catch (error) {
        console.log("🚀 ~ file: systemConfiguration.ts:53 ~ getEmailPreferences ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getEmailPreferences = getEmailPreferences;
const getSiteConfiguration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const settings = new Setting_1.default();
        const siteConfiguration = yield settings.siteConfiguration();
        return res.json(siteConfiguration);
    }
    catch (error) {
        console.log("🚀 ~ file: systemConfiguration.ts:66 ~ getSiteConfiguration ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getSiteConfiguration = getSiteConfiguration;
const updateSiteSetting = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { balanceTransferCharge, balanceTransferChargeType, currency, currencyPosition, appName, emailAccountLimit, } = reqBody;
        (0, validate_1.default)([
            balanceTransferCharge,
            balanceTransferChargeType,
            currency,
            currencyPosition,
            appName,
            emailAccountLimit,
        ], "body").args();
        (0, validate_1.default)(appName, "App Name").required().string();
        (0, validate_1.default)(emailAccountLimit, "Account Limited Per Email").required().number();
        (0, validate_1.default)(currency, "Currency").required().string();
        (0, validate_1.default)(currencyPosition, "Currency Position").required().string().oneOf(["prefix", "suffix"]);
        (0, validate_1.default)(balanceTransferCharge, "Balance Transfer Charge").required().number();
        (0, validate_1.default)(balanceTransferChargeType, "Balance Transfer Charge")
            .required()
            .string()
            .oneOf(["fixed", "percent"]);
        const data = {
            appName,
            currency,
            currencyPosition,
            balanceTransferChargeType,
            balanceTransferCharge,
            emailAccountLimit,
        };
        const sql = `UPDATE ${tables_1.SETTING_TBL} SET ? `;
        yield db_1.default.query(sql, [data]);
        return (0, errors_1.sendResponse)(res, "Site Settings have been update");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateSiteSetting = updateSiteSetting;
const updateEmailSetting = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { encryption, host, port, username, password } = reqBody;
        (0, validate_1.default)([encryption, host, port, username, password], "body").args();
        (0, validate_1.default)(encryption, "Encryption").required().string().oneOf(["SSL", "TLS"]);
        (0, validate_1.default)(host, "Host").required().string();
        (0, validate_1.default)(port, "Port").required().number();
        (0, validate_1.default)(username, "Username").required().string();
        (0, validate_1.default)(password, "Password").required().string();
        const rowData = {
            mailEncryption: encryption,
            mailHost: host,
            mailPort: port,
            mailUsername: username,
            mailPassword: password,
        };
        const sql = `UPDATE ${tables_1.SETTING_TBL} SET ?`;
        yield db_1.default.query(sql, rowData);
        return (0, errors_1.sendResponse)(res, "Email Setting has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateEmailSetting = updateEmailSetting;
const updateEmailPreferences = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        const { paymentDeposit, paymentTransfer, registrationSuccess, paymentWithdraw } = reqBody;
        (0, validate_1.default)(paymentDeposit, "Payment Deposit").required().boolean();
        (0, validate_1.default)(paymentTransfer, "Payment Transfer").required().boolean();
        (0, validate_1.default)(registrationSuccess, "Registration Success").required().boolean();
        (0, validate_1.default)(paymentWithdraw, "Payment Withdraw").required().boolean();
        const emailPreferences = JSON.stringify({
            paymentDeposit,
            paymentTransfer,
            registrationSuccess,
            paymentWithdraw,
        });
        const sql = `UPDATE ${tables_1.SETTING_TBL} SET emailPreferences = ?`;
        yield db_1.default.execute(sql, [emailPreferences]);
        return (0, errors_1.sendResponse)(res, "Email settings has been updated");
    }
    catch (error) {
        console.log("🚀 ~ file: systemConfiguration.ts:148 ~ updateEmailPreferences ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateEmailPreferences = updateEmailPreferences;
const updateSiteConfiguration = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        const { contactDetails, kycVerification, registration } = reqBody;
        (0, validate_1.default)(contactDetails, "Contact details").required().boolean();
        (0, validate_1.default)(kycVerification, "Kyc Verification").required().boolean();
        (0, validate_1.default)(registration, "Registration").required().boolean();
        const siteConfiguration = JSON.stringify({
            contactDetails,
            kycVerification,
            registration,
        });
        const sql = `UPDATE ${tables_1.SETTING_TBL} SET siteConfiguration = ?`;
        yield db_1.default.execute(sql, [siteConfiguration]);
        return (0, errors_1.sendResponse)(res, "Site Configuration has been updated");
    }
    catch (error) {
        console.log("🚀 ~ file: systemConfiguration.ts:148 ~ updateEmailPreferences ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateSiteConfiguration = updateSiteConfiguration;
const sendTestEmail = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        const { email } = reqBody;
        (0, validate_1.default)(email, "Email").required().string().email();
        yield Email_1.default.sendTestEmail(email);
        return (0, errors_1.sendResponse)(res, "Test Email has been sent");
    }
    catch (error) {
        console.log("🚀 ~ file: systemConfiguration.ts:241 ~ sendTestEmail ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.sendTestEmail = sendTestEmail;
//kyc settings
const createKycFormLabel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { labelId, label, inputType, required, dropdownOptions, fileExtensions } = reqBody;
        (0, validate_1.default)([labelId, label, inputType, required, dropdownOptions, fileExtensions], "body").args();
        (0, validate_1.default)(label, "Label").required().string();
        (0, validate_1.default)(inputType, "Type").required().string().oneOf(KycForm_1.KycFormTypeEnum);
        (0, validate_1.default)(required, "Required").required().string().oneOf(KycForm_1.KycRequiredEnum);
        if (inputType === "file") {
            (0, validate_1.default)(fileExtensions, "File Extensions")
                .required()
                .array()
                .minLength(1, "Min 1 File Extension is required");
        }
        else if (inputType === "dropdown") {
            (0, validate_1.default)(dropdownOptions, "Options")
                .required()
                .array()
                .minLength(1, "Minimum 1 Dropdown Option is required");
        }
        const jsonOptions = JSON.stringify(dropdownOptions);
        const jsonFileExtensions = JSON.stringify(fileExtensions);
        let message;
        if (labelId !== 0) {
            const updateModel = {
                label,
                inputType,
                required,
                dropdownOptions: jsonOptions,
                fileExtensions: jsonFileExtensions,
            };
            const where = {
                labelId,
            };
            const sql = `UPDATE ${tables_1.KYC_SETTING_TBL} SET ? WHERE labelId = ?`;
            yield db_1.default.query(sql, [updateModel, ...Object.values(where)]);
            message = "Kyc Form Label has been updated";
        }
        else {
            const model = {
                label,
                inputType,
                required,
                dropdownOptions: jsonOptions,
                fileExtensions: jsonFileExtensions,
            };
            const sql = `INSERT INTO ${tables_1.KYC_SETTING_TBL} SET ?`;
            yield db_1.default.query(sql, model);
            if (required === "required") {
                const update = {
                    kyc: null,
                };
                const uSql = `UPDATE ${tables_1.USER_TBL} SET ? WHERE kyc = ? OR kyc = ?`;
                yield db_1.default.query(uSql, [update, "pending", "approved"]);
                const kSql = `DELETE FROM ${tables_1.USER_KYC_TBL} WHERE status = ?`;
                yield db_1.default.execute(kSql, ["pending"]);
            }
            message = "Kyc Form Label has been created";
        }
        yield conn.commit();
        return (0, errors_1.sendResponse)(res, message);
    }
    catch (error) {
        console.log("🚀 ~ file: systemConfiguration.ts:109 ~ createKycFormLabel ~ error", error);
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createKycFormLabel = createKycFormLabel;
const getKycSettingList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    try {
        const sql = `SELECT * FROM ${tables_1.KYC_SETTING_TBL}`;
        const [rows] = yield db_1.default.query(sql);
        try {
            for (var rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), !rows_1_1.done;) {
                const row = rows_1_1.value;
                row.dropdownOptions = JSON.parse(row.dropdownOptions);
                row.fileExtensions = JSON.parse(row.fileExtensions);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) yield _a.call(rows_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return res.json(rows);
    }
    catch (error) {
        console.log("🚀 ~ file: systemConfiguration.ts:181 ~ getKycSettingList ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getKycSettingList = getKycSettingList;
const deleteKycFormLabel = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        (0, validate_1.default)(id, "Kyc Form Label id").required().string();
        const labelId = Number(id);
        const isKycLabelId = yield KycForm_1.default.isLabelId(labelId);
        if (!isKycLabelId)
            throw new Error("Label doesn't exist ");
        const where = {
            labelId,
        };
        const sql = `DELETE FROM ${tables_1.KYC_SETTING_TBL} WHERE labelId = ? `;
        yield db_1.default.execute(sql, Object.values(where));
        return (0, errors_1.sendResponse)(res, "Form Label has been deleted");
    }
    catch (error) {
        console.log("🚀 ~ file: systemConfiguration.ts:205 ~ deleteKycFormLabel ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.deleteKycFormLabel = deleteKycFormLabel;
const updateSiteLogo = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { logo } = req.body;
        (0, validate_1.default)(logo, "Site Logo").required().string();
        const sql = `UPDATE ${tables_1.SETTING_TBL} SET logo = ?`;
        yield db_1.default.execute(sql, [logo]);
        return (0, errors_1.sendResponse)(res, "Logo has been updated");
    }
    catch (error) {
        console.log("🚀 ~ file: systemConfiguration.ts:284 ~ updateSiteLogo ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateSiteLogo = updateSiteLogo;
const updateSiteFavicon = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { favicon } = req.body;
        (0, validate_1.default)(favicon, "Site Favicon").required().string();
        const sql = `UPDATE ${tables_1.SETTING_TBL} SET favicon = ?`;
        yield db_1.default.execute(sql, [favicon]);
        return (0, errors_1.sendResponse)(res, "Logo has been updated");
    }
    catch (error) {
        console.log("🚀 ~ file: systemConfiguration.ts:284 ~ updateSiteLogo ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateSiteFavicon = updateSiteFavicon;
