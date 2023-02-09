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
exports.withdrawHistoryList = exports.rejectWithdraw = exports.approveWithdraw = exports.getWithdrawDetails = void 0;
const db_1 = __importDefault(require("../../db"));
const Email_1 = __importDefault(require("../../libs/Email"));
const Withdraw_1 = __importDefault(require("../../libs/Withdraw"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const validate_1 = __importStar(require("../../utils/validate"));
const errors_1 = require("./../../errors");
const format_1 = require("./../../utils/format");
const getWithdrawDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: transactionId } = req.params;
        (0, validate_1.default)(transactionId, "Id").required().string();
        const withdraw = yield Withdraw_1.default.createInstance(transactionId, "Withdraw does not exist");
        const row = yield withdraw.getRow();
        row.details = (0, fns_1.jsonToArray)(row.details);
        row.chargeData = (0, fns_1.jsonToArray)(row.chargeData);
        return res.json(row);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getWithdrawDetails = getWithdrawDetails;
const approveWithdraw = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const { id: transactionId } = req.params;
        (0, validate_1.default)(transactionId, "Id").required().string();
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { message } = reqBody;
        (0, validate_1.default)(message, "message").string().maxLength(1000);
        const withdraw = yield Withdraw_1.default.createInstance(transactionId, "Withdraw does not exist");
        const status = yield withdraw.status();
        const userId = yield withdraw.userId();
        if (status === "rejected")
            throw new errors_1.ClientError("Withdraw has been rejected already");
        if (status === "pending") {
            const update = {
                status: "success",
                message,
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const where = {
                transactionId,
                status: "pending",
            };
            const sql = `UPDATE ${tables_1.USER_WITHDRAW_TBL} SET  ? WHERE transactionId = ? AND status = ?`;
            yield db_1.default.query(sql, [update, ...Object.values(where)]);
            const txnUpdate = {
                status: "debit",
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
        yield Email_1.default.sendWithdrawMail(userId, transactionId);
        return (0, errors_1.sendResponse)(res, "Withdraw has been approved");
    }
    catch (error) {
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.approveWithdraw = approveWithdraw;
const rejectWithdraw = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const { id: transactionId } = req.params;
        (0, validate_1.default)(transactionId, "Id").required().string();
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { message } = reqBody;
        (0, validate_1.default)(message, "message").required().string().maxLength(3000);
        const withdraw = yield Withdraw_1.default.createInstance(transactionId, "Withdraw does not exist");
        const status = yield withdraw.status();
        const userId = yield withdraw.userId();
        if (status === "success")
            throw new errors_1.ClientError("Withdraw has been approved already");
        if (status === "pending") {
            const update = {
                status: "rejected",
                message,
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const where = {
                transactionId,
                status: "pending",
            };
            const sql = `UPDATE ${tables_1.USER_WITHDRAW_TBL} SET  ? WHERE transactionId = ? AND status = ?`;
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
        yield Email_1.default.sendWithdrawMail(userId, transactionId);
        return (0, errors_1.sendResponse)(res, "Withdraw has been rejected");
    }
    catch (error) {
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.rejectWithdraw = rejectWithdraw;
const withdrawHistoryList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.params;
        const columns = [
            "transactionId",
            "status",
            "userId",
            "gateway",
            "amount",
            "charge",
            "netAmount",
            "createdAt",
            "updatedAt",
            "userName",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT id,transactionId,userId,
    (SELECT avatar FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_WITHDRAW_TBL}.userId) as avatar,
    (SELECT userName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_WITHDRAW_TBL}.userId) as userName,
    gatewayName as gateway,amount,charge, netAmount, createdAt,updatedAt,status FROM ${tables_1.USER_WITHDRAW_TBL}  `;
        if (status === "all") {
            sql += `HAVING userId IS NOT NULL`;
        }
        else if (status === "pending") {
            sql += `HAVING status = 'pending' `;
        }
        else if (status === "rejected") {
            sql += `HAVING status = 'rejected' `;
        }
        else {
            sql += `HAVING status = 'success'`;
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
exports.withdrawHistoryList = withdrawHistoryList;
