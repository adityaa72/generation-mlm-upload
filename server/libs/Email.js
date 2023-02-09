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
exports.emailPurposes = void 0;
const db_1 = __importDefault(require("../db"));
const ContactUs_1 = __importDefault(require("../email/ContactUs"));
const DepositMail_1 = __importDefault(require("../email/DepositMail"));
const EmailTesting_1 = __importDefault(require("../email/EmailTesting"));
const FAMail_1 = __importDefault(require("../email/FAMail"));
const LoginVerification_1 = __importDefault(require("../email/LoginVerification"));
const RegistrationSuccessful_1 = __importDefault(require("../email/RegistrationSuccessful"));
const RegistrationVerification_1 = __importDefault(require("../email/RegistrationVerification"));
const ResetPassword_1 = __importDefault(require("../email/ResetPassword"));
const TransferPayment_1 = __importDefault(require("../email/TransferPayment"));
const WithdrawMail_1 = __importDefault(require("../email/WithdrawMail"));
const tables_1 = require("../tables");
const fns_1 = require("../utils/fns");
const FrontEnd_1 = __importDefault(require("./FrontEnd"));
const SendEmail_1 = __importDefault(require("./SendEmail"));
const Setting_1 = __importDefault(require("./Setting"));
const User_1 = __importDefault(require("./User"));
var emailPurposes;
(function (emailPurposes) {
    emailPurposes["register"] = "register";
    emailPurposes["resetPassword"] = "resetPassword";
    emailPurposes["twoFA"] = "twoFA";
    emailPurposes["login"] = "login";
})(emailPurposes = exports.emailPurposes || (exports.emailPurposes = {}));
class Email {
    /**
     * It checks if there's an OTP in the database for the given email and purpose, if there is, it updates
     * the validTill column and returns the OTP, if there isn't, it generates a new OTP and returns it.
     * @static
     * @param {string} email - string,
     * @param {emailPurposes} purpose - emailPurposes
     * @returns A promise.
     */
    static getOtp(email, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT otp FROM ${tables_1.OTP_TBL} WHERE otpSender = ? AND status = ? AND purpose = ? ORDER BY id DESC `;
            const [rows] = yield db_1.default.execute(sql, [email, "valid", purpose]);
            if (!rows.length)
                return this.generateOtp(email, purpose);
            const validTill = (0, fns_1.getDateTime)("add", 15, "minutes");
            const sql2 = `UPDATE ${tables_1.OTP_TBL} SET validTill = ? WHERE otpSender = ? AND status = ? AND purpose = ? ORDER BY id DESC`;
            yield db_1.default.execute(sql2, [validTill, email, "valid", purpose]);
            const otp = rows[0].otp;
            return otp;
        });
    }
    /**
     * It generates a random 6 digit number, checks if it exists in the database, if it does, it calls
     * itself again, if it doesn't, it inserts it into the database and returns it.
     * @static
     * @param {string} email - string,
     * @param {emailPurposes} purpose - emailPurposes
     * @returns A promise that resolves to a string.
     */
    static generateOtp(email, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            const otp = (0, fns_1.generateRandomNumber)(100000, 999999);
            const sql = `SELECT otp FROM ${tables_1.OTP_TBL} WHERE otp = ? AND status = ? AND purpose = ?`;
            const [rows] = yield db_1.default.execute(sql, [otp, "valid", purpose]);
            if (rows.length)
                return this.generateOtp(email, purpose);
            const validTill = (0, fns_1.getDateTime)("add", 15, "minutes");
            const sqlSchema = {
                otp,
                otpSender: email,
                validTill,
                status: "valid",
                purpose,
            };
            const sql2 = `INSERT INTO ${tables_1.OTP_TBL} SET ?`;
            yield db_1.default.query(sql2, sqlSchema);
            return otp;
        });
    }
    /**
     * It checks if the otp is valid or not.
     * @param {number} otp - string,
     * @param {string} email - string,
     * @param {emailPurposes} purpose - emailPurposes
     * @returns A boolean value.
     */
    static isOtpValid(otp, email, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT validTill FROM ${tables_1.OTP_TBL} WHERE otp = ? AND otpSender = ? AND status = ? AND purpose = ?`;
            const [rows] = yield db_1.default.execute(sql, [otp, email, "valid", purpose]);
            if (!rows.length)
                return false;
            const validTill = rows[0].validTill;
            const isValid = (0, fns_1.dateToUtc)(validTill).isAfter((0, fns_1.currentDateTimeInMoment)());
            return isValid;
        });
    }
    static sendRegisterVerificationMail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, SendEmail_1.default)(email, "Registration Verification Email", (0, RegistrationVerification_1.default)(otp));
        });
    }
    static sendTwoFAMail(email, otp, twoFA) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, SendEmail_1.default)(email, "Two FA verification", (0, FAMail_1.default)(otp, twoFA));
        });
    }
    static sendLoginVerificationMail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, SendEmail_1.default)(email, "Login Verification Email", (0, LoginVerification_1.default)(otp));
        });
    }
    static sendRegistrationSuccessfulMail(email, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = new Setting_1.default();
            const emailPreferences = yield setting.emailPreferences();
            const { registrationSuccess } = emailPreferences;
            if (registrationSuccess !== true)
                return;
            const message = yield (0, RegistrationSuccessful_1.default)(userId);
            yield (0, SendEmail_1.default)(email, "Registration Successful", message);
        });
    }
    static sendTransferPaymentMail(userId, agentId, email, event, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = new Setting_1.default();
            const emailPreferences = yield setting.emailPreferences();
            const { paymentTransfer } = emailPreferences;
            if (paymentTransfer !== true)
                return;
            const message = yield (0, TransferPayment_1.default)(userId, agentId, amount, event);
            yield (0, SendEmail_1.default)(email, "Payment Transfer", message);
        });
    }
    static sendDepositMail(userId, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = new Setting_1.default();
            const emailPreferences = yield setting.emailPreferences();
            const { paymentDeposit } = emailPreferences;
            if (paymentDeposit !== true)
                return;
            const user = yield User_1.default.createInstance(userId);
            const email = yield user.email();
            const html = yield (0, DepositMail_1.default)(transactionId);
            if (html)
                yield (0, SendEmail_1.default)(email, "Payment Deposit", html);
        });
    }
    static sendWithdrawMail(userId, transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const setting = new Setting_1.default();
            const emailPreferences = yield setting.emailPreferences();
            const { paymentWithdraw } = emailPreferences;
            if (paymentWithdraw !== true)
                return;
            const user = yield User_1.default.createInstance(userId);
            const email = yield user.email();
            const html = yield (0, WithdrawMail_1.default)(transactionId);
            if (html)
                yield (0, SendEmail_1.default)(email, "Payment Withdraw", html);
        });
    }
    /**
     * This function sends an email to the user with the otp to reset the password.
     * @static
     * @param {string} email - The email address of the user who is requesting a password reset.
     * @param {number} otp - string - The one time password that will be sent to the user.
     * @returns Nothing.
     */
    static sendResetPasswordEmail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, SendEmail_1.default)(email, "Reset Password Email", (0, ResetPassword_1.default)(otp));
        });
    }
    static sendTestEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (0, SendEmail_1.default)(email, `Email Testing`, (0, EmailTesting_1.default)());
        });
    }
    static sendContactUsMail({ email, firstName, lastName, phone, message, }) {
        return __awaiter(this, void 0, void 0, function* () {
            const frontEnd = new FrontEnd_1.default();
            const contactUs = yield frontEnd.contactUs();
            yield (0, SendEmail_1.default)(contactUs.email, `Contact Us`, (0, ContactUs_1.default)({ email, firstName, lastName, phone, message }));
        });
    }
    /**
     * It deletes an OTP from the database
     * @param {string} otp - string, email: string, purpose: emailPurposes
     * @param {string} email - string,
     * @param {emailPurposes} purpose - emailPurposes
     */
    static deleteOTP(otp, email, purpose) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `DELETE FROM ${tables_1.OTP_TBL} WHERE otp = ? AND otpSender = ? AND status = ? AND purpose = ?`;
            yield db_1.default.execute(sql, [otp, email, "valid", purpose]);
        });
    }
}
exports.default = Email;
