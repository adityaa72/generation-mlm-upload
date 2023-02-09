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
exports.transferPaymentHistory = exports.transferPayment = exports.getTransferPaymentConfig = exports.searchUserTransferPaymentList = void 0;
const is_empty_1 = __importDefault(require("is-empty"));
const db_1 = __importDefault(require("../../db"));
const errors_1 = require("../../errors");
const Email_1 = __importDefault(require("../../libs/Email"));
const Setting_1 = __importDefault(require("../../libs/Setting"));
const Transaction_1 = __importDefault(require("../../libs/Transaction"));
const User_1 = __importDefault(require("../../libs/User"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const format_1 = require("../../utils/format");
const validate_1 = __importStar(require("../../utils/validate"));
const searchUserTransferPaymentList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const { keyword } = req.params;
        const user = yield User_1.default.createInstance(userId);
        const userName = yield user.userName();
        let rows;
        if ((0, is_empty_1.default)(keyword)) {
            const sql = `SELECT userId as agentId,agentId as userId,MAX(createdAt),id,
       (SELECT userName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.PAYMENT_TRANSFER_TBL}.agentId) as userName,
       (SELECT firstName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.PAYMENT_TRANSFER_TBL}.agentId) as firstName,
       (SELECT lastName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.PAYMENT_TRANSFER_TBL}.agentId) as lastName,
       (SELECT avatar FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.PAYMENT_TRANSFER_TBL}.agentId) as avatar
        FROM ${tables_1.PAYMENT_TRANSFER_TBL} WHERE userId = ? AND status = ? GROUP BY agentId ORDER BY createdAt  `;
            [rows] = yield db_1.default.execute(sql, [userId, "transferred"]);
        }
        else {
            const sql = `SELECT userName, userId, firstName, lastName, avatar FROM ${tables_1.USER_TBL} WHERE (userName LIKE ? OR userId LIKE ?) AND userId != ? AND userName != ? LIMIT 10`;
            [rows] = yield db_1.default.execute(sql, [`%${keyword}%`, `%${keyword}%`, userId, userName]);
        }
        return res.json(rows);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.searchUserTransferPaymentList = searchUserTransferPaymentList;
const getTransferPaymentConfig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const setting = new Setting_1.default();
        const balanceTransferCharge = yield setting.balanceTransferCharge();
        const balanceTransferChargeType = yield setting.balanceTransferChargeType();
        return res.json({ charge: balanceTransferCharge, chargeType: balanceTransferChargeType });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getTransferPaymentConfig = getTransferPaymentConfig;
const transferPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        //todo validate status blocked or not
        const { userId } = req.locals;
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { amount: amountText, receiverId } = reqBody;
        (0, validate_1.default)([amountText, receiverId], "body").args();
        (0, validate_1.default)(amountText, "amount")
            .required()
            .number()
            .min(1, `Minimum transfer amount is ${yield (0, format_1.fCurrency)(1)}`);
        (0, validate_1.default)(receiverId, "User Id")
            .required()
            .string()
            .notEqual(userId, "You can't transfer to your own account");
        const isUserId = yield User_1.default.isUserId(receiverId);
        if (!isUserId)
            throw new errors_1.ClientError(`${receiverId} is not a user id`);
        const setting = new Setting_1.default();
        const user = yield User_1.default.createInstance(userId);
        const wallet = yield user.wallet();
        const amount = Number(amountText);
        const charge = yield setting.calculateBalanceTransferCharge(amount);
        (0, validate_1.default)(amount, "Amount")
            .required()
            .number()
            .max(wallet, `Amount exceed than your wallet. You have only ${yield (0, format_1.fCurrency)(wallet)} in your wallet`);
        const netAmount = amount + charge;
        const category = "transfer";
        (0, validate_1.default)(netAmount, "Amount")
            .required()
            .number()
            .max(netAmount, `Amount exceed than your wallet. You have only ${yield (0, format_1.fCurrency)(wallet)} in your wallet`);
        // Insert transfer history
        {
            const description = `transferred to ${receiverId}`;
            const transactionId = Transaction_1.default.generateTransactionId();
            const status = "debit";
            const tRowData = {
                transactionId,
                userId,
                amount,
                charge,
                netAmount,
                category,
                status,
                description,
                createdAt: (0, fns_1.currentDateTime)(),
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const rowData = {
                transactionId,
                userId,
                agentId: receiverId,
                amount,
                charge,
                netAmount,
                status: "transferred",
                createdAt: (0, fns_1.currentDateTime)(),
            };
            const tSql = `INSERT INTO ${tables_1.TRANSACTION_TBL} SET ?`;
            yield db_1.default.query(tSql, [tRowData]);
            const sql = `INSERT INTO ${tables_1.PAYMENT_TRANSFER_TBL} SET ?`;
            yield db_1.default.query(sql, [rowData]);
        }
        // Insert Receive history
        {
            const description = `received from ${userId}`;
            const status = "credit";
            const transactionId = Transaction_1.default.generateTransactionId();
            const tRowData = {
                transactionId,
                userId: receiverId,
                amount: netAmount,
                charge,
                netAmount: amount,
                category,
                status,
                description,
                createdAt: (0, fns_1.currentDateTime)(),
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const rowData = {
                transactionId,
                userId: receiverId,
                agentId: userId,
                amount: netAmount,
                charge,
                netAmount: amount,
                status: "received",
                createdAt: (0, fns_1.currentDateTime)(),
            };
            const tSql = `INSERT INTO ${tables_1.TRANSACTION_TBL} SET ?`;
            yield db_1.default.query(tSql, [tRowData]);
            const sql = `INSERT INTO ${tables_1.PAYMENT_TRANSFER_TBL} SET ?`;
            yield db_1.default.query(sql, [rowData]);
        }
        yield conn.commit();
        const receiverUser = yield User_1.default.createInstance(receiverId);
        const receiverEmail = yield receiverUser.email();
        const userEmail = yield user.email();
        yield Email_1.default.sendTransferPaymentMail(receiverId, userId, receiverEmail, "received", amount);
        yield Email_1.default.sendTransferPaymentMail(userId, receiverId, userEmail, "transferred", netAmount);
        return (0, errors_1.sendResponse)(res, `Successfully transferred ${yield (0, format_1.fCurrency)(amount)}  to ${receiverId}`);
    }
    catch (err) {
        yield conn.rollback();
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.transferPayment = transferPayment;
const transferPaymentHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const columns = [
            "userId",
            "amount",
            "charge",
            "netAmount",
            "transactionId",
            "agentId",
            "status",
            "createdAt",
            "displayName",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT id, userId,transactionId,amount, charge, netAmount, agentId,  createdAt , status,
     (SELECT avatar FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.PAYMENT_TRANSFER_TBL}.agentId) as avatar, 
     (SELECT CONCAT_WS(' ', firstName, lastName) AS displayName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.PAYMENT_TRANSFER_TBL}.agentId) as displayName
      FROM ${tables_1.PAYMENT_TRANSFER_TBL} HAVING userId = ?`;
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
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.transferPaymentHistory = transferPaymentHistory;
