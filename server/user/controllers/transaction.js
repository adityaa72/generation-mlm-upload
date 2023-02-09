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
exports.getTransactionHistory = exports.getTransactionData = void 0;
const db_1 = __importDefault(require("../../db"));
const errors_1 = require("../../errors");
const Deposit_1 = __importDefault(require("../../libs/Deposit"));
const PlanHistory_1 = __importDefault(require("../../libs/PlanHistory"));
const Transaction_1 = __importDefault(require("../../libs/Transaction"));
const Withdraw_1 = __importDefault(require("../../libs/Withdraw"));
const tables_1 = require("../../tables");
const format_1 = require("../../utils/format");
const validate_1 = __importStar(require("../../utils/validate"));
const getTransactionData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const { id: transactionId } = req.params;
        (0, validate_1.default)(transactionId, "Transaction Id").required().string();
        const transaction = yield Transaction_1.default.createInstance(transactionId);
        const transactionUserId = yield transaction.userId();
        if (transactionUserId !== userId)
            throw new errors_1.AuthError();
        const category = yield transaction.category();
        let data;
        switch (category) {
            case "deposit":
                const deposit = yield Deposit_1.default.createInstance(transactionId);
                data = yield deposit.getRow();
                break;
            case "withdraw":
                const withdraw = yield Withdraw_1.default.createInstance(transactionId);
                data = yield withdraw.getRow();
                break;
            case "plan_purchased":
                const planHistory = yield PlanHistory_1.default.createInstance(transactionId);
                data = yield planHistory.getRow();
                break;
            default:
                data = {};
                break;
        }
        return res.json({ data, category });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getTransactionData = getTransactionData;
const getTransactionHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const columns = [
            "transactionId",
            "userId",
            "amount",
            "netAmount",
            "charge",
            "description",
            "createdAt",
            "updatedAt",
            "status",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT *,transactionId as id, createdAt, updatedAt FROM ${tables_1.TRANSACTION_TBL} HAVING userId = ?`;
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
exports.getTransactionHistory = getTransactionHistory;
