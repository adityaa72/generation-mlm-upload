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
exports.roiIncomeHistory = exports.referralIncomeHistory = void 0;
const db_1 = __importDefault(require("../../db"));
const tables_1 = require("../../tables");
const format_1 = require("../../utils/format");
const validate_1 = require("../../utils/validate");
const referralIncomeHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const columns = [
            "userId",
            "referralIncome",
            "placement",
            "status",
            "userName",
            "createdAt",
            "transactionId",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT id, userId,referralId, referralIncome,placement,status,transactionId,
    (SELECT userName FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.USER_REFERRAL_TBL}.userId ) as userName, 
    (SELECT avatar FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.USER_REFERRAL_TBL}.userId ) as avatar, createdAt
     FROM ${tables_1.USER_REFERRAL_TBL} HAVING referralId = ?`;
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
exports.referralIncomeHistory = referralIncomeHistory;
const roiIncomeHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const columns = [
            "userId",
            "planId",
            "amount",
            "planName",
            "createdAt",
            "status",
            "transactionId",
            "type",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT id, userId, planId,planName,status,transactionId, amount,createdAt,type FROM ${tables_1.ROI_TBL} HAVING userId = ?  `;
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
exports.roiIncomeHistory = roiIncomeHistory;
