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
exports.generateLoginToken = exports.updateUserKyc = exports.subtractBalanceFromUser = exports.addBalanceToUser = exports.updateUserStatus = exports.usersList = exports.getUserProfile = void 0;
const is_empty_1 = __importDefault(require("is-empty"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_ipinfo_1 = __importDefault(require("node-ipinfo"));
const db_1 = __importDefault(require("../../db"));
const errors_1 = require("../../errors");
const KycForm_1 = __importDefault(require("../../libs/KycForm"));
const Transaction_1 = __importDefault(require("../../libs/Transaction"));
const User_1 = __importStar(require("../../libs/User"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const validate_1 = __importStar(require("../../utils/validate"));
const format_1 = require("./../../utils/format");
const getUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        (0, validate_1.default)(userId, "User Id").required().string();
        const user = yield User_1.default.createInstance(userId);
        const data = yield user.getProfileDetails();
        const contact = yield user.getContactDetails();
        return res.json(Object.assign(Object.assign({}, data), { contact }));
    }
    catch (error) {
        console.log("🚀 ~ file: user.ts:13 ~ getOrderProfile ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getUserProfile = getUserProfile;
const usersList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.params;
        const columns = [
            "userId",
            "status",
            "userName",
            "email",
            "kyc",
            "createdAt",
            "displayName",
            "level",
            "lft",
            "referralId",
            "placementId",
            "referralDisplayName",
            "placementDisplayName",
            "plan",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT userId as id, status, userId, userName, avatar,email,kyc, createdAt, CONCAT_WS(' ', firstName, lastName) AS displayName,
        (SELECT level FROM ${tables_1.USER_TREE_TBL} WHERE ${tables_1.USER_TREE_TBL}.userId = ${tables_1.USER_TBL}.userId ) as level,
        (SELECT lft FROM ${tables_1.USER_TREE_TBL} WHERE ${tables_1.USER_TREE_TBL}.userId = ${tables_1.USER_TBL}.userId ) as lft,
        (SELECT referralId FROM ${tables_1.USER_TREE_TBL} WHERE ${tables_1.USER_TREE_TBL}.userId = ${tables_1.USER_TBL}.userId ) as referralId,
        (SELECT placementId FROM ${tables_1.USER_TREE_TBL} WHERE ${tables_1.USER_TREE_TBL}.userId = ${tables_1.USER_TBL}.userId ) as placementId,
        (SELECT CONCAT_WS(' ', firstName, lastName) AS displayName FROM ${tables_1.USER_TBL} WHERE userId = referralId ) as referralDisplayName,
        (SELECT CONCAT_WS(' ', firstName, lastName) AS displayName FROM ${tables_1.USER_TBL} WHERE userId = placementId ) as placementDisplayName,
        IFNULL((SELECT planName FROM ${tables_1.PLAN_HISTORY_TBL} WHERE userId = ${tables_1.USER_TBL}.userId ORDER BY id DESC LIMIT 1),'NA') as plan
        FROM ${tables_1.USER_TBL} `;
        if (status === "all") {
            sql += `HAVING userId IS NOT NULL`;
        }
        else if (status === "active") {
            sql += `HAVING status = 'active' `;
        }
        else {
            sql += `HAVING status = 'blocked'`;
        }
        let sqlParams = ["active"];
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
exports.usersList = usersList;
const updateUserStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "Body").object();
        const { status } = reqBody;
        (0, validate_1.default)(status, "Status").required().string().oneOf(User_1.UserStatusEnums);
        const user = yield User_1.default.createInstance(userId);
        const userStatus = yield user.status();
        if (yield User_1.default.isGrandAdminId(userId))
            throw new errors_1.ClientError("You can't block an administrator");
        let message;
        if (status === "active")
            message = "User has been blocked";
        else
            message = "User has been unlocked";
        const updateStatus = status === "active" ? "blocked" : "active";
        if (status === userStatus) {
            const sql = `UPDATE ${tables_1.USER_TBL} SET status = ? WHERE userId = ?`;
            yield db_1.default.execute(sql, [updateStatus, userId]);
        }
        return (0, errors_1.sendResponse)(res, message);
    }
    catch (error) {
        console.log("🚀 ~ file: user.ts:106 ~ updateUserStatus ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateUserStatus = updateUserStatus;
const addBalanceToUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const { adminId } = req.locals;
        const { userId } = req.params;
        (0, validate_1.default)(userId, "User Id").required().string();
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "Body").object();
        const { message, amount } = reqBody;
        (0, validate_1.default)(message, "Message").required().string().maxLength(1000);
        (0, validate_1.default)(amount, "Amount").required().number().min(1);
        const transactionId = Transaction_1.default.generateTransactionId();
        // Insert into transaction table
        const charge = 0;
        const netAmount = amount - charge;
        const transactionRow = {
            userId,
            transactionId,
            amount,
            charge,
            netAmount,
            category: "deposit",
            createdAt: (0, fns_1.currentDateTime)(),
            description: "deposit by admin",
            status: "credit",
            updatedAt: (0, fns_1.currentDateTime)(),
        };
        const sql = `INSERT INTO ${tables_1.TRANSACTION_TBL} SET ? `;
        yield db_1.default.query(sql, transactionRow);
        const admin = yield User_1.default.createInstance(adminId);
        const logo = (_a = yield admin.avatar()) !== null && _a !== void 0 ? _a : "";
        // Insert into deposit table
        const depositRow = {
            userId,
            status: "credit",
            amount,
            charge,
            netAmount,
            gatewayId: 0,
            gatewayName: "Admin",
            createdAt: (0, fns_1.currentDateTime)(),
            actionBy: "admin",
            transactionId,
            currency: "₹",
            type: "admin",
            message,
            updatedAt: (0, fns_1.currentDateTime)(),
            logo,
        };
        const depositSql = `INSERT INTO ${tables_1.USER_DEPOSIT_TBL} SET ? `;
        yield db_1.default.query(depositSql, depositRow);
        yield conn.commit();
        const amountText = yield (0, format_1.fCurrency)(amount);
        return (0, errors_1.sendResponse)(res, `${amountText} has been deposited to ${userId}`);
    }
    catch (error) {
        yield conn.rollback();
        console.log("🚀 ~ file: user.ts:134 ~ addBalanceToUser ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.addBalanceToUser = addBalanceToUser;
const subtractBalanceFromUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const { adminId } = req.locals;
        const { userId } = req.params;
        (0, validate_1.default)(userId, "User Id").required().string();
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "Body").object();
        const { message, amount } = reqBody;
        (0, validate_1.default)(message, "Message").required().string().maxLength(1000);
        (0, validate_1.default)(amount, "Amount").required().number().min(1);
        const user = yield User_1.default.createInstance(userId);
        const wallet = yield user.wallet();
        const walletText = yield (0, format_1.fCurrency)(wallet);
        if (amount > wallet)
            throw new errors_1.ClientError(`Insufficient balance. Withdraw amount is greater than wallet ${walletText} `);
        const transactionId = Transaction_1.default.generateTransactionId();
        // Insert into transaction table
        const charge = 0;
        const netAmount = amount - charge;
        const transactionRow = {
            userId,
            transactionId,
            amount,
            charge,
            netAmount,
            category: "withdraw",
            createdAt: (0, fns_1.currentDateTime)(),
            description: "withdraw by admin",
            status: "debit",
            updatedAt: (0, fns_1.currentDateTime)(),
        };
        const sql = `INSERT INTO ${tables_1.TRANSACTION_TBL} SET ? `;
        yield db_1.default.query(sql, transactionRow);
        // Insert into deposit table
        const chargeData = JSON.stringify([{}]);
        const details = JSON.stringify([{}]);
        const gatewayId = 0;
        const admin = yield User_1.default.createInstance(adminId);
        const logo = yield admin.avatar();
        const withdrawRow = {
            userId,
            status: "success",
            amount,
            charge,
            netAmount,
            gatewayId: 0,
            gatewayName: "Admin",
            createdAt: (0, fns_1.currentDateTime)(),
            actionBy: "admin",
            transactionId,
            message,
            chargeData,
            details,
            updatedAt: (0, fns_1.currentDateTime)(),
            logo,
        };
        const depositSql = `INSERT INTO ${tables_1.USER_WITHDRAW_TBL} SET ? `;
        yield db_1.default.query(depositSql, withdrawRow);
        yield conn.commit();
        const amountText = yield (0, format_1.fCurrency)(amount);
        return (0, errors_1.sendResponse)(res, `${amountText} has been withdrawn from ${userId}`);
    }
    catch (error) {
        console.log("🚀 ~ file: user.ts:147 ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.subtractBalanceFromUser = subtractBalanceFromUser;
const updateUserKyc = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        (0, validate_1.default)(userId, "User Id").required().string();
        const reqBody = req.body;
        const { kyc } = reqBody;
        const user = yield User_1.default.createInstance(userId);
        const userKyc = yield user.kyc();
        const kycData = yield KycForm_1.default.getAllRow();
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
        let update = {
            kycDetails,
        };
        const where = {
            userId,
        };
        const sql = `UPDATE ${tables_1.USER_TBL} SET ? WHERE userId = ?`;
        yield db_1.default.query(sql, [update, ...Object.values(where)]);
        return (0, errors_1.sendResponse)(res, "Profile details has been updated");
    }
    catch (error) {
        console.log("🚀 ~ file: user.ts:356 ~ updateUserKyc ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateUserKyc = updateUserKyc;
const generateLoginToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        (0, validate_1.default)(userId, "User Id").required().string();
        const user = yield User_1.default.createInstance(userId);
        const token = jsonwebtoken_1.default.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
            expiresIn: 30 * 60,
        });
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
        const validTill = (0, fns_1.getDateTime)("add", 10, "minutes");
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
            loginBy: "admin",
        };
        const sql = `INSERT INTO ${tables_1.LOGIN_SESSION_TBL} SET ?`;
        yield db_1.default.query(sql, [sessionData]);
        return (0, errors_1.sendResponse)(res, "Login successful", {
            accessToken: token,
        });
    }
    catch (error) {
        console.log("🚀 ~ file: user.ts:382 ~ generateLoginToken ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.generateLoginToken = generateLoginToken;
