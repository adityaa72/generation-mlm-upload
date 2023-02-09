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
exports.depositHistoryList = exports.rejectUserDeposit = exports.approveUserDeposit = exports.getDepositDetails = void 0;
const db_1 = __importDefault(require("../../db"));
const errors_1 = require("../../errors");
const Deposit_1 = __importDefault(require("../../libs/Deposit"));
const Email_1 = __importDefault(require("../../libs/Email"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const validate_1 = __importStar(require("../../utils/validate"));
const format_1 = require("./../../utils/format");
const getDepositDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: transactionId } = req.params;
        (0, validate_1.default)(transactionId, "Transaction id").required().string();
        const deposit = yield Deposit_1.default.createInstance(transactionId);
        const row = yield deposit.parsedRow();
        return res.json(row);
    }
    catch (error) {
        console.log("🚀 ~ file: deposit.ts:13 ~ getManualDepositDetails ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getDepositDetails = getDepositDetails;
const approveUserDeposit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const { id: transactionId } = req.params;
        (0, validate_1.default)(transactionId, "Transaction id").required().string();
        const reqBody = req.body;
        const { message } = reqBody;
        (0, validate_1.default)([message], "body").args();
        (0, validate_1.default)(message, "Message").string().maxLength(3000);
        const deposit = yield Deposit_1.default.createInstance(transactionId);
        const status = yield deposit.status();
        const userId = yield deposit.userId();
        if (status === "review") {
            const update = {
                status: "approved",
                message,
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const sql = `UPDATE ${tables_1.USER_DEPOSIT_TBL} SET ? WHERE transactionId = ?`;
            yield db_1.default.query(sql, [update, transactionId]);
            const txnUpdate = {
                status: "credit",
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const txnWhere = {
                transactionId,
                status: "pending",
            };
            const txnSql = `UPDATE ${tables_1.TRANSACTION_TBL} SET ? WHERE transactionId = ? AND status = ?`;
            yield db_1.default.query(txnSql, [txnUpdate, ...Object.values(txnWhere)]);
        }
        yield conn.commit();
        yield Email_1.default.sendDepositMail(userId, transactionId);
        return (0, errors_1.sendResponse)(res, "Deposit has been approved");
    }
    catch (error) {
        yield conn.rollback();
        console.log("🚀 ~ file: deposit.ts:13 ~ getManualDepositDetails ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.approveUserDeposit = approveUserDeposit;
const rejectUserDeposit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const { id: transactionId } = req.params;
        (0, validate_1.default)(transactionId, "Transaction id").required().string();
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { message } = reqBody;
        (0, validate_1.default)([message], "body").args();
        (0, validate_1.default)(message, "Message").required().string().maxLength(1000);
        const deposit = yield Deposit_1.default.createInstance(transactionId);
        const status = yield deposit.status();
        const userId = yield deposit.userId();
        if (status === "review") {
            const update = {
                status: "rejected",
                message,
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const where = {
                transactionId,
            };
            const sql = `UPDATE ${tables_1.USER_DEPOSIT_TBL} SET  ? WHERE transactionId = ?`;
            yield db_1.default.query(sql, [update, ...Object.values(where)]);
            const txnUpdate = {
                status: "failed",
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const txnWhere = {
                transactionId,
                status: "pending",
            };
            const txnSql = `UPDATE ${tables_1.TRANSACTION_TBL} SET ? WHERE transactionId = ? AND status = ?`;
            yield db_1.default.query(txnSql, [txnUpdate, ...Object.values(txnWhere)]);
        }
        yield conn.commit();
        yield Email_1.default.sendDepositMail(userId, transactionId);
        return (0, errors_1.sendResponse)(res, "Deposit has been rejected");
    }
    catch (error) {
        yield conn.rollback();
        console.log("🚀 ~ file: deposit.ts:13 ~ getManualDepositDetails ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.rejectUserDeposit = rejectUserDeposit;
const depositHistoryList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.params;
        const columns = [
            "transactionId",
            "userId",
            "userName",
            "gateway",
            "amount",
            "charge",
            "netAmount",
            "createdAt",
            "updatedAt",
            "status",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT id,transactionId,userId,
    (SELECT avatar FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_DEPOSIT_TBL}.userId) as avatar,
    (SELECT userName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_DEPOSIT_TBL}.userId) as userName,gatewayName as gateway,amount,charge, netAmount,createdAt,updatedAt,status, type FROM ${tables_1.USER_DEPOSIT_TBL} `;
        if (status === "automatic") {
            sql += `HAVING type = 'automatic' `;
        }
        else if (status === "pending") {
            sql += `HAVING status = 'pending' `;
        }
        else if (status === "approved") {
            sql += `HAVING status = 'approved' `;
        }
        else if (status === "rejected") {
            sql += `HAVING status = 'rejected' `;
        }
        else if (status === "review") {
            sql += `HAVING status = 'review' `;
        }
        else {
            sql += `HAVING transactionId IS NOT NULL`;
        }
        let sqlParams = [];
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
exports.depositHistoryList = depositHistoryList;
