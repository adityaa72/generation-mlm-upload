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
const is_empty_1 = __importDefault(require("is-empty"));
const db_1 = __importDefault(require("../db"));
const errors_1 = require("../errors");
const tables_1 = require("../tables");
const User_1 = __importDefault(require("./User"));
const Setting = class {
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.SETTING_TBL}`;
            const [rows] = yield db_1.default.query(sql);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
    mailEncryption() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return (_a = row.mailEncryption) !== null && _a !== void 0 ? _a : "";
        });
    }
    mailHost() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return (_a = row.mailHost) !== null && _a !== void 0 ? _a : "";
        });
    }
    mailUsername() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return (_a = row.mailUsername) !== null && _a !== void 0 ? _a : "";
        });
    }
    mailPort() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return (_a = row.mailPort) !== null && _a !== void 0 ? _a : "";
        });
    }
    mailPassword() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return (_a = row.mailPassword) !== null && _a !== void 0 ? _a : "";
        });
    }
    emailSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const encryption = yield this.mailEncryption();
            const host = yield this.mailHost();
            const port = yield this.mailPort();
            const username = yield this.mailUsername();
            const password = yield this.mailPassword();
            return { encryption, host, port, username, password };
        });
    }
    getGlobalConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            const currency = yield this.currency();
            const currencyPosition = yield this.currencyPosition();
            const appName = yield this.appName();
            const logo = yield this.logo();
            const favicon = yield this.favicon();
            return {
                currency,
                currencyPosition,
                appName,
                logo,
                favicon,
            };
        });
    }
    siteSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            const balanceTransferCharge = yield this.balanceTransferCharge();
            const balanceTransferChargeType = yield this.balanceTransferChargeType();
            const currency = yield this.currency();
            const currencyPosition = yield this.currencyPosition();
            const appName = yield this.appName();
            const emailAccountLimit = yield this.emailAccountLimit();
            return {
                balanceTransferCharge,
                balanceTransferChargeType,
                currency,
                currencyPosition,
                appName,
                emailAccountLimit,
            };
        });
    }
    appName() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const appName = row.appName;
            return appName;
        });
    }
    currency() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const currency = row.currency;
            return currency;
        });
    }
    emailAccountLimit() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const emailAccountLimit = row.emailAccountLimit;
            return Number(emailAccountLimit);
        });
    }
    notice() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return row.notice;
        });
    }
    balanceTransferCharge() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const balanceTransferCharge = row.balanceTransferCharge;
            return Number(balanceTransferCharge);
        });
    }
    balanceTransferChargeType() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const balanceTransferChargeType = row.balanceTransferChargeType;
            return balanceTransferChargeType;
        });
    }
    calculateBalanceTransferCharge(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const charge = yield this.balanceTransferCharge();
            const type = yield this.balanceTransferChargeType();
            if (type === "percent") {
                return (amount * charge) / 100;
            }
            return charge;
        });
    }
    currencyPosition() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return row.currencyPosition;
        });
    }
    logo() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            //todo
            return (_a = row.logo) !== null && _a !== void 0 ? _a : "";
        });
    }
    favicon() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            //todo
            return (_a = row.favicon) !== null && _a !== void 0 ? _a : "";
        });
    }
    emailPreferences() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const emailPreferences = row.emailPreferences;
            if ((0, is_empty_1.default)(emailPreferences))
                return {};
            return JSON.parse(emailPreferences);
        });
    }
    siteConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const siteConfiguration = row.siteConfiguration;
            if ((0, is_empty_1.default)(siteConfiguration))
                return {};
            return JSON.parse(siteConfiguration);
        });
    }
    static validateRegistration() {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = new Setting();
            const siteConfiguration = yield setting.siteConfiguration();
            const { registration } = siteConfiguration;
            if (!registration)
                throw new errors_1.HttpError(503, "Registration is currently unavailable");
        });
    }
    static validateWithdraw(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = new Setting();
            const siteConfiguration = yield setting.siteConfiguration();
            const { contactDetails, kycVerification } = siteConfiguration;
            const user = yield User_1.default.createInstance(userId);
            const kyc = yield user.kyc();
            const { address, city, country, state, pinCode, mobileNumber } = yield user.getContactDetails();
            if (kycVerification) {
                if (kyc !== "approved")
                    throw new errors_1.HttpError(503, "You must have Kyc approved to withdraw payment");
            }
            if (contactDetails) {
                if ((0, is_empty_1.default)(address) ||
                    (0, is_empty_1.default)(city) ||
                    (0, is_empty_1.default)(country) ||
                    (0, is_empty_1.default)(state) ||
                    (0, is_empty_1.default)(mobileNumber) ||
                    (0, is_empty_1.default)(pinCode))
                    throw new errors_1.HttpError(503, "You must have submit your contact details to withdraw payment");
            }
        });
    }
};
exports.default = Setting;
