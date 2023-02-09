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
exports.User = exports.TwoFAEnums = exports.UserStatusEnums = void 0;
const is_empty_1 = __importDefault(require("is-empty"));
const cron_1 = require("../cron");
const db_1 = __importDefault(require("../db"));
const errors_1 = require("../errors");
const tables_1 = require("../tables");
const fns_1 = require("../utils/fns");
const KycForm_1 = __importDefault(require("./KycForm"));
const Plan_1 = __importDefault(require("./Plan"));
const Setting_1 = __importDefault(require("./Setting"));
const Transaction_1 = __importDefault(require("./Transaction"));
// User types start
exports.UserStatusEnums = ["active", "blocked"];
exports.TwoFAEnums = ["0", "1"];
class User {
    /**
     * The constructor function is called when a new instance of the class is created
     * @param {string} userId - string
     */
    constructor(userId, options) {
        if (options === null || options === void 0 ? void 0 : options.email) {
            this.initializeBy = "email";
        }
        else if (options === null || options === void 0 ? void 0 : options.userName) {
            this.initializeBy = "userName";
        }
        else {
            this.initializeBy = "userId";
        }
        if (options === null || options === void 0 ? void 0 : options.error) {
            this.invalidUserErrorText = options.error;
        }
        this.userId = userId;
    }
    /**
     * It checks if the userId is a valid userId, email, or username, and if it's not, it throws an error.
     */
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const error = this.invalidUserErrorText;
            switch (this.initializeBy) {
                case "userId": {
                    const isUserId = yield User.isUserId(this.userId);
                    if (!isUserId) {
                        throw new errors_1.ClientError(error || `${this.userId} is not a valid user id`);
                    }
                    break;
                }
                case "email": {
                    const isUserEmail = yield User.isUserEmail(this.userId);
                    if (!isUserEmail) {
                        throw new errors_1.ClientError(error || `${this.userId} is not a valid user email`);
                    }
                    const userId = yield User.getUserIdByEmail(this.userId);
                    this.userId = userId;
                    break;
                }
                case "userName": {
                    const isUserName = yield User.isUserName(this.userId);
                    if (!isUserName) {
                        throw new errors_1.ClientError(error || `${this.userId} is not a valid user name`);
                    }
                    const userId = yield User.getUserIdByUserName(this.userId);
                    this.userId = userId;
                    break;
                }
                default:
                    throw new errors_1.ClientError(`Unknown initialization type: ${this.initializeBy}`);
            }
        });
    }
    /**
     * Create a new user object, initialize it, and return it.
     * @static
     * @param {string} userId - The user's ID.
     * @returns A promise that resolves to a User object.
     */
    static createInstance(userId, options) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new User(userId, options);
            yield user.initialize();
            return user;
        });
    }
    /**
     * If the email exists in the database, return true, otherwise return false.
     * @static
     * @param {string} email - string - the email address to check
     * @returns The return value is a boolean.
     */
    static isUserEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT email FROM ${tables_1.USER_TBL} WHERE email = ?`;
            const [rows] = yield db_1.default.execute(sql, [email]);
            return rows.length > 0 ? true : false;
        });
    }
    /**
     * If the userId exists in the database, return true, otherwise return false.
     * @static
     * @param {string} userId - string
     * @returns The return value is a boolean.
     */
    static isUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT userId FROM ${tables_1.USER_TBL} WHERE userId = ?`;
            const [rows] = yield db_1.default.execute(sql, [userId]);
            return rows.length > 0 ? true : false;
        });
    }
    /**
     * If the userName exists in the database, return true, otherwise return false.
     * @param {string} userName - string
     * @returns The return value is a boolean.
     */
    static isUserName(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT userName FROM ${tables_1.USER_TBL} WHERE userName = ?`;
            const [rows] = yield db_1.default.execute(sql, [userName]);
            return rows.length > 0 ? true : false;
        });
    }
    /**
     * It returns the userId of the user whose email is passed as a parameter.
     * @static
     * @param {string} email - string
     * @returns The userId of the user with the email address provided.
     */
    static getUserIdByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT userId FROM ${tables_1.USER_TBL} WHERE email = ?`;
            const [rows] = yield db_1.default.execute(sql, [email]);
            return rows[0].userId;
        });
    }
    /**
     * It returns the userId of a user given the userName.
     * @static
     * @param {string} userName - string
     * @returns The userId of the userName that was passed in.
     */
    static getUserIdByUserName(userName) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT userId FROM ${tables_1.USER_TBL} WHERE userName = ?`;
            const [rows] = yield db_1.default.execute(sql, [userName]);
            return rows[0].userId;
        });
    }
    /**
     * "If there are rows in the table, return the last userId + 1, otherwise return the default userId."
     * @static
     * @returns A new user id.
     */
    static createNewUserId() {
        return __awaiter(this, void 0, void 0, function* () {
            let userId = 1006090;
            const sql = `SELECT userId FROM ${tables_1.USER_TBL} ORDER BY id DESC LIMIT 1`;
            const [rows] = yield db_1.default.execute(sql);
            if (rows.length) {
                userId = rows[0].userId;
                return String(++userId);
            }
            else {
                return String(userId);
            }
        });
    }
    /**
     * check if user id is the grand admin id or not.
     * @param {string} userId - string
     * @returns A boolean value.
     */
    static isGrandAdminId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT userId FROM ${tables_1.USER_TBL} WHERE userId = ? AND role = ? ORDER BY id ASC LIMIT 1`;
            const [rows] = yield db_1.default.execute(sql, [userId, "admin"]);
            if (!rows.length)
                return false;
            const row = rows[0];
            if (row.userId === userId)
                return true;
            return false;
        });
    }
    static getAdminId() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT userId FROM ${tables_1.USER_TBL}  ORDER BY id ASC LIMIT 1`;
            const [rows] = yield db_1.default.query(sql);
            const row = rows[0];
            return row.userId;
        });
    }
    /**
     * check if placementId is under the referral id tree
     *
     * @param {string} referralId - The user id of the user who is being referred
     * @param {string} placementId - The placement id for the new user
     * @returns A boolean value.
     */
    static isValidPlacementIdForRegistration(referralId, placementId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (referralId === placementId)
                return true;
            const user = yield User.createInstance(referralId);
            return user.isChild(placementId);
        });
    }
    static accountsRegisteredWithEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) AS users FROM ${tables_1.USER_TBL} WHERE email = ?`;
            const [rows] = yield db_1.default.execute(sql, [email]);
            return rows[0].users;
        });
    }
    static canRegisterWithEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const accountsRegistered = yield User.accountsRegisteredWithEmail(email);
            const setting = new Setting_1.default();
            const emailAccountLimit = yield setting.emailAccountLimit();
            if (emailAccountLimit === 0)
                return true;
            return !(accountsRegistered >= emailAccountLimit);
        });
    }
    static validateRegisterEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const canRegister = yield User.canRegisterWithEmail(email);
            const setting = new Setting_1.default();
            const emailAccountLimit = yield setting.emailAccountLimit();
            if (!canRegister)
                throw new errors_1.ClientError(`Maximum ${emailAccountLimit} accounts are allowed per email`);
        });
    }
    //* user table start
    getFreshRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${tables_1.USER_TBL} WHERE userId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId]);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
    /**
     * It returns the row from the database if it's already been retrieved, otherwise it retrieves it and
     * returns it.
     * @returns The row object.
     */
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const row = yield this.getFreshRow();
            this.row = row;
            return row;
        });
    }
    /**
     * It returns the password of the user with the given user id
     * @returns The password of the user.
     */
    password() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return row.password;
        });
    }
    /**
     * It returns first name of the user
     * @returns A promise that resolves to a string.
     */
    firstName() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return row.firstName;
        });
    }
    /**
     * It returns the last name of the user.
     * @returns A promise that resolves to a string.
     */
    lastName() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return row.lastName;
        });
    }
    /**
     * It returns the display name of the user by adding first name and last name of the user.
     * @returns A promise that resolves to a string.
     */
    displayName() {
        return __awaiter(this, void 0, void 0, function* () {
            const firstName = yield this.firstName();
            const lastName = yield this.lastName();
            return `${firstName} ${lastName}`;
        });
    }
    /**
     * It returns the username of the user.
     * @returns A promise that resolves to a string.
     */
    userName() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return row.userName;
        });
    }
    /**
     * It returns the mobileNumber of the user.
     * @returns A promise that resolves to a string.
     */
    mobileNumber() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return row.mobileNumber;
        });
    }
    twoFA() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const twoFA = row.twoFA;
            return Boolean(Number(twoFA));
        });
    }
    role() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const role = row.role;
            return role;
        });
    }
    /**
     * It returns the avatar of the user.
     * @returns The avatar of the user.
     */
    avatar() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const avatar = row.avatar;
            return avatar;
        });
    }
    /**
     * It returns the email address of the user
     * @returns The email address of the user.
     */
    email() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return row.email;
        });
    }
    /**
     * It returns the registration date of the user.
     * @returns The registeredAt of the user.
     */
    registeredAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return row.createdAt;
        });
    }
    // check plan validity and expire
    validatePlan() {
        return __awaiter(this, void 0, void 0, function* () {
            const dateTime = (0, fns_1.currentDateTimeInMoment)();
            const sql = `SELECT * FROM ${tables_1.PLAN_HISTORY_TBL} WHERE userId = ? AND status = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "active"]);
            if (!rows.length)
                return;
            const validTill = rows[0].validTill;
            const rowId = rows[0].id;
            const validTillTime = (0, fns_1.dateToUtc)(validTill);
            const isExpired = validTillTime.isBefore(dateTime);
            if (isExpired) {
                const sql = `UPDATE ${tables_1.PLAN_HISTORY_TBL} SET status = ? WHERE userId = ? AND status = ? AND id = ?`;
                yield db_1.default.execute(sql, ["expired", this.userId, "active", rowId]);
            }
        });
    }
    isPremium() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validatePlan();
            const sql = `SELECT * FROM ${tables_1.PLAN_HISTORY_TBL} WHERE userId = ? AND status = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "active"]);
            return rows.length > 0;
        });
    }
    getActivePlanId() {
        return __awaiter(this, void 0, void 0, function* () {
            const isPremium = yield this.isPremium();
            if (!isPremium)
                return;
            const sql = `SELECT * FROM ${tables_1.PLAN_HISTORY_TBL} WHERE userId = ? AND status = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "active"]);
            return rows[0].planId;
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return row.status;
        });
    }
    kyc() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            return (_a = row.kyc) !== null && _a !== void 0 ? _a : "unverified";
        });
    }
    createdAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const createdAt = row.createdAt;
            return createdAt;
        });
    }
    kycDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const details = row.kycDetails;
            return details;
        });
    }
    kycParsedDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const details = yield this.kycDetails();
            const data = details ? JSON.parse(details) : [];
            return data;
        });
    }
    updateRow() {
        return __awaiter(this, void 0, void 0, function* () {
            this.row = yield this.getFreshRow();
        });
    }
    getActivePlanDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const planId = yield this.getActivePlanId();
            if ((0, is_empty_1.default)(planId) || !planId)
                return {};
            const isPlanId = yield Plan_1.default.isPlanId(planId);
            if (!isPlanId)
                return {};
            const plan = yield Plan_1.default.createInstance(planId);
            const planName = yield plan.planName();
            const sql = `SELECT * FROM ${tables_1.PLAN_HISTORY_TBL} WHERE planId = ? AND userId = ? AND status = ? `;
            const [rows] = yield db_1.default.execute(sql, [planId, this.userId, "active"]);
            const row = rows[0];
            row.planName = planName;
            return row !== null && row !== void 0 ? row : {};
        });
    }
    // check for roi income
    manageRoiIncome() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            yield this.validatePlan();
            const sql = `SELECT * FROM ${tables_1.PLAN_HISTORY_TBL} WHERE userId = ? AND status = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "active"]);
            if (!rows.length)
                return;
            try {
                for (var rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), !rows_1_1.done;) {
                    const row = rows_1_1.value;
                    yield (0, cron_1.checkRoiIncome)(row);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) yield _a.call(rows_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        });
    }
    //* user table end
    /**
     * It returns a  object containing the address, country, state, city,
     * pinCode and mobileNumber of the user.
     * @returns An object with the properties address, country, state, city, pinCode, mobileNumber.
     */
    getContactDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const { address, country, state, city, pinCode, mobileNumber } = row;
            return { address, country, state, city, pinCode, mobileNumber };
        });
    }
    hasContactDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const { address, country, state, city, pinCode, mobileNumber } = row;
            if ((0, is_empty_1.default)(address))
                return false;
            if ((0, is_empty_1.default)(country))
                return false;
            if ((0, is_empty_1.default)(state))
                return false;
            if ((0, is_empty_1.default)(city))
                return false;
            if ((0, is_empty_1.default)(pinCode))
                return false;
            if ((0, is_empty_1.default)(mobileNumber))
                return false;
            return true;
        });
    }
    getBillingAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            const details = yield this.getContactDetails();
            const displayName = yield this.displayName();
            const { address, country, state, city, pinCode, mobileNumber } = details;
            const receiver = displayName;
            const fullAddress = `${address} - ${city}, ${state}, ${country} - ${pinCode}`;
            const hasContactDetails = yield this.hasContactDetails();
            return { receiver, fullAddress, mobileNumber, hasContactDetails };
        });
    }
    getProfileDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const kycFormData = yield KycForm_1.default.getAllRow();
            return {
                userId: this.userId,
                email: yield this.email(),
                firstName: yield this.firstName(),
                lastName: yield this.lastName(),
                userName: yield this.userName(),
                displayName: yield this.displayName(),
                avatar: yield this.avatar(),
                registeredAt: yield this.registeredAt(),
                status: yield this.status(),
                referralId: yield this.referralIdText(),
                plan: yield this.getActivePlanDetails(),
                kyc: yield this.kyc(),
                twoFA: yield this.twoFA(),
                kycData: {
                    user: yield this.kycParsedDetails(),
                    form: kycFormData,
                },
            };
        });
    }
    // user tree table start
    getTreeRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.treeRow))
                return this.treeRow;
            const sql = `SELECT * FROM ${tables_1.USER_TREE_TBL} WHERE userId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId]);
            const row = rows[0];
            this.treeRow = row;
            return row;
        });
    }
    referralId() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getTreeRow();
            return row.referralId;
        });
    }
    referralIdText() {
        return __awaiter(this, void 0, void 0, function* () {
            const referralId = yield this.referralId();
            if (referralId == "0")
                return "root";
            return referralId;
        });
    }
    placementId() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getTreeRow();
            return row.placementId;
        });
    }
    placementIdText() {
        return __awaiter(this, void 0, void 0, function* () {
            const placementId = yield this.placementId();
            if (placementId == "0")
                return "root";
            return placementId;
        });
    }
    rgt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getTreeRow();
            return row.rgt;
        });
    }
    lft() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getTreeRow();
            return row.lft;
        });
    }
    level() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getTreeRow();
            return row.level;
        });
    }
    getLevelRelativeToParent(parentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const parent = yield User.createInstance(parentId);
            const level = yield parent.level();
            const myLevel = yield this.level();
            return myLevel - level;
        });
    }
    isReadyForKyc() {
        return __awaiter(this, void 0, void 0, function* () {
            const details = yield this.kycParsedDetails();
            const kycData = yield KycForm_1.default.getAllRow();
            let isReady = true;
            kycData.every(({ labelId, required }) => {
                const isRequired = required === "required";
                if (isRequired && (0, is_empty_1.default)(details[labelId])) {
                    isReady = false;
                    return false;
                }
                return true;
            });
            return isReady;
        });
    }
    //* user tree table end
    /**
     * Check if userId is under the tree of the current user instance .
     * @param {string} userId - the userId of the user you want to check if is a child of the current
     * user
     * @returns {Promise<boolean>}.
     */
    isChild(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const isUserId = yield User.isUserId(userId);
            if (!isUserId)
                return false;
            const lft = yield this.lft();
            const rgt = yield this.rgt();
            const sql = `SELECT userId FROM ${tables_1.USER_TREE_TBL} WHERE lft > ? AND rgt < ? AND userId = ?`;
            const [rows] = yield db_1.default.execute(sql, [lft, rgt, userId]);
            return rows.length > 0 ? true : false;
        });
    }
    /**
     * Check if userId is parent of the current user instance .
     * @param {string} userId - the userId of the user you want to check if is a child of the current
     * user
     * @returns {Promise<boolean>}.
     */
    isParent(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User.createInstance(userId);
            const isChild = yield user.isChild(userId);
            return isChild ? true : false;
        });
    }
    //* dashboard functions start
    /**
     * It returns the total referral income of the user
     *
     * @return {*}  {number}
     */
    referralIncome() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(referralIncome),0) AS referralIncome FROM ${tables_1.USER_REFERRAL_TBL} WHERE referralId= ? AND status= ? `;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "credit"]);
            const referralIncome = rows[0].referralIncome;
            return Number(referralIncome);
        });
    }
    roiIncome() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(amount),0) AS amount FROM ${tables_1.ROI_TBL} WHERE userId = ? AND status= ? `;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "credit"]);
            const amount = rows[0].amount;
            return Number(amount);
        });
    }
    packagePurchasedAmount() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(price),0) AS price FROM ${tables_1.PLAN_HISTORY_TBL} WHERE userId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId]);
            const price = rows[0].price;
            return Number(price);
        });
    }
    /**
     * It returns the last referral income of the user
     *
     * @return {*}  {number}
     */
    lastReferralIncome() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT referralIncome FROM ${tables_1.USER_REFERRAL_TBL} WHERE referralId = ? AND status= ? ORDER BY id DESC LIMIT 1`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "credit"]);
            const referralIncome = rows[0].referralIncome;
            return Number(referralIncome);
        });
    }
    /**
     * It returns the total deposit of the user
     *
     * @return {*}  {number}
     */
    deposit() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(netAmount),0) as netAmount FROM ${tables_1.USER_DEPOSIT_TBL} WHERE userId = ? AND (status= ? OR status= ?)`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "credit", "approved"]);
            const amount = rows[0].netAmount;
            return Number(amount);
        });
    }
    /**
     * It returns the last deposit of the user
     *
     * @return {*}  {number}
     */
    lastDeposit() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT netAmount FROM ${tables_1.USER_DEPOSIT_TBL} WHERE userId = ? AND (status= ? OR status= ?) ORDER BY id DESC LIMIT 1`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "credit", "approved"]);
            if (!rows.length)
                return 0;
            const amount = rows[0].netAmount;
            return Number(amount);
        });
    }
    /**
     * It returns the deposit of the user which is in review
     *
     * @return {*}  {number}
     */
    reviewDeposit() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(netAmount),0)  AS netAmount FROM ${tables_1.USER_DEPOSIT_TBL} WHERE userId = ? AND status= ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "review"]);
            if (!rows.length)
                return 0;
            const amount = rows[0].netAmount;
            return Number(amount);
        });
    }
    /**
     * It returns the deposit of the user which has rejected
     *
     * @return {*}  {number}
     */
    rejectedDeposit() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(netAmount),0) as netAmount FROM ${tables_1.USER_DEPOSIT_TBL} WHERE userId = ? AND status= ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "rejected"]);
            const amount = rows[0].netAmount;
            return Number(amount);
        });
    }
    /**
     * It returns the total withdraw of the user
     *
     * @return {*}  {number}
     */
    withdraw() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(amount),0) as amount FROM ${tables_1.USER_WITHDRAW_TBL} WHERE userId = ? AND status= ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "success"]);
            const amount = rows[0].amount;
            return Number(amount);
        });
    }
    /**
     * It returns the last withdraw of the user
     *
     * @return {*}  {number}
     */
    lastWithdraw() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT amount FROM ${tables_1.USER_WITHDRAW_TBL} WHERE userId = ? AND status= ? ORDER BY id DESC LIMIT 1`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "success"]);
            if (!rows.length)
                return 0;
            const amount = rows[0].amount;
            return Number(amount);
        });
    }
    /**
     * It returns the withdraw of the user which is pending
     *
     * @return {*}  {number}
     */
    pendingWithdraw() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(amount),0) as amount FROM ${tables_1.USER_WITHDRAW_TBL} WHERE userId = ? AND status= ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "pending"]);
            const amount = rows[0].amount;
            return Number(amount);
        });
    }
    /**
     * It returns the withdraw of the user which has rejected
     *
     * @return {*}  {number}
     */
    rejectedWithdraw() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(amount),0) as amount FROM ${tables_1.USER_WITHDRAW_TBL} WHERE userId = ? AND status= ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "rejected"]);
            const amount = rows[0].amount;
            return Number(amount);
        });
    }
    /**
     * It returns the total income of the user
     *
     * @return {*}  {number}
     */
    totalIncome() {
        return __awaiter(this, void 0, void 0, function* () {
            const referralIncome = yield this.referralIncome();
            const roiIncome = yield this.roiIncome();
            const totalIncome = referralIncome + roiIncome;
            return totalIncome;
        });
    }
    /**
     * It returns the total received amount to the user
     *
     * @return {*}  {number}
     */
    receivedAmount() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(netAmount),0) as netAmount FROM ${tables_1.PAYMENT_TRANSFER_TBL} WHERE userId = ? AND status= ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "received"]);
            const netAmount = rows[0].netAmount;
            return Number(netAmount);
        });
    }
    /**
     * It returns the total transferred amount by the user
     *
     * @return {*}  {number}
     */
    transferredAmount() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(netAmount),0) as transferredAmount FROM ${tables_1.PAYMENT_TRANSFER_TBL} WHERE userId = ? AND status = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId, "transferred"]);
            const amount = rows[0].transferredAmount;
            return Number(amount);
        });
    }
    walletDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            // credits
            const referralIncome = yield this.referralIncome();
            const receivedAmount = yield this.receivedAmount();
            const deposit = yield this.deposit();
            // debits
            const pendingWithdraw = yield this.pendingWithdraw();
            const transferredAmount = yield this.transferredAmount();
            // final
            const wallet = yield this.wallet();
            return {
                referralIncome,
                receivedAmount,
                deposit,
                pendingWithdraw,
                transferredAmount,
                wallet,
            };
        });
    }
    isFirstPlan() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${tables_1.PLAN_HISTORY_TBL} WHERE userId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId]);
            return rows.length === 0;
        });
    }
    /**
     * It returns the total wallet of the user
     *
     * @return {*}  {number}
     */
    wallet() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.manageRoiIncome();
            // credits
            const referralIncome = yield this.referralIncome();
            const receivedAmount = yield this.receivedAmount();
            const deposit = yield this.deposit();
            const roiIncome = yield this.roiIncome();
            // debits
            const withdraw = yield this.withdraw();
            const pendingWithdraw = yield this.pendingWithdraw();
            const transferredAmount = yield this.transferredAmount();
            const packagePurchasedAmount = yield this.packagePurchasedAmount();
            const totalCredits = deposit + referralIncome + receivedAmount + roiIncome;
            const totalDebits = withdraw + pendingWithdraw + transferredAmount + packagePurchasedAmount;
            const totalWallet = totalCredits - totalDebits;
            const finalWallet = Number(totalWallet.toFixed(2));
            return finalWallet;
        });
    }
    //* registration functions
    totalTeam() {
        return __awaiter(this, void 0, void 0, function* () {
            const lft = yield this.lft();
            const rgt = yield this.rgt();
            const sql = `SELECT COUNT(userId) AS users FROM ${tables_1.USER_TREE_TBL} WHERE lft >= ? AND rgt <= ?`;
            const [rows] = yield db_1.default.execute(sql, [lft, rgt]);
            return rows[0].users;
        });
    }
    directReferral() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(userId) AS users FROM ${tables_1.USER_TREE_TBL} WHERE referralId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.userId]);
            return rows[0].users;
        });
    }
    /**
     * add referral income after registration
     */
    addParentReferralIncome() {
        return __awaiter(this, void 0, void 0, function* () {
            const referralId = yield this.referralId();
            const referralIncome = 0;
            // add to the referral income table
            const referralData = {
                userId: this.userId,
                referralId,
                referralIncome,
                status: "pending",
                createdAt: (0, fns_1.currentDateTime)(),
            };
            const referralSql = `INSERT INTO ${tables_1.USER_REFERRAL_TBL} SET ?`;
            yield db_1.default.query(referralSql, referralData);
        });
    }
    updateParentReferralIncome() {
        return __awaiter(this, void 0, void 0, function* () {
            const { price: planPurchasedPrice } = yield this.getActivePlanDetails();
            const referralId = yield this.referralId();
            const isUserId = yield User.isUserId(referralId);
            if (!isUserId)
                return false;
            const ReferralUser = yield User.createInstance(referralId);
            const isPremium = yield ReferralUser.isPremium();
            const planId = yield ReferralUser.getActivePlanId();
            const plan = yield Plan_1.default.createInstance(planId);
            let referralIncomePercent = yield plan.referralIncome();
            const transactionId = Transaction_1.default.generateTransactionId();
            let referralIncome = (planPurchasedPrice * referralIncomePercent) / 100;
            if (!isPremium) {
                referralIncome = 0;
            }
            const updateRow = {
                referralIncome,
                transactionId,
                updatedAt: (0, fns_1.currentDateTime)(),
                status: "credit",
            };
            // update referral table
            const sql = `UPDATE ${tables_1.USER_REFERRAL_TBL} SET ? WHERE userId = ? AND status = ?`;
            yield db_1.default.query(sql, [updateRow, this.userId, "pending"]);
            if (referralIncome === 0)
                return;
            // add to the transaction table
            const transactionData = {
                userId: referralId,
                amount: referralIncome,
                charge: 0,
                netAmount: referralIncome,
                category: "referral_income",
                createdAt: (0, fns_1.currentDateTime)(),
                description: `referral income - ${this.userId}`,
                status: "credit",
                transactionId,
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const transactionSql = `INSERT INTO ${tables_1.TRANSACTION_TBL} SET ?`;
            yield db_1.default.query(transactionSql, transactionData);
        });
    }
    // dashboard
    getAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = yield this.wallet();
            const totalIncome = yield this.totalIncome();
            const referralIncome = yield this.referralIncome();
            const totalTeam = yield this.totalTeam();
            const directReferral = yield this.directReferral();
            const deposit = yield this.deposit();
            const withdraw = yield this.withdraw();
            const lastDeposit = yield this.lastDeposit();
            const lastWithdraw = yield this.lastWithdraw();
            const depositInReview = yield this.reviewDeposit();
            const pendingWithdraw = yield this.pendingWithdraw();
            return {
                wallet,
                totalIncome,
                totalTeam,
                referralIncome,
                directReferral,
                deposit,
                withdraw,
                lastDeposit,
                lastWithdraw,
                depositInReview,
                pendingWithdraw,
            };
        });
    }
}
exports.User = User;
exports.default = User;
