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
exports.withdrawAnalyticsData = exports.depositAnalyticsData = exports.registrationAnalyticsData = exports.getUsersInvestmentList = exports.getPlansInvestmentList = exports.topEarnersList = exports.topSponsorsList = exports.roiIncomeList = exports.referralIncomeList = exports.transactionList = exports.getTransactionData = exports.joiningList = void 0;
const moment_1 = __importDefault(require("moment"));
const mysql2_1 = require("mysql2");
const db_1 = __importDefault(require("../../db"));
const Analytics_1 = __importDefault(require("../../libs/Analytics"));
const Deposit_1 = __importDefault(require("../../libs/Deposit"));
const RoiIncome_1 = require("../../libs/RoiIncome");
const Transaction_1 = __importDefault(require("../../libs/Transaction"));
const Withdraw_1 = __importDefault(require("../../libs/Withdraw"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const validate_1 = __importStar(require("../../utils/validate"));
const format_1 = require("./../../utils/format");
const joiningList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        const columns = [
            "userId",
            "userName",
            "status",
            "email",
            "referralId",
            "displayName",
            "placementId",
            "createdAt",
        ];
        let sql = `SELECT userId as id, status, userId, userName, avatar,createdAt, CONCAT_WS(' ', firstName, lastName) AS displayName,
        (SELECT email FROM ${tables_1.USER_TREE_TBL} WHERE userId = ${tables_1.USER_TBL}.userId ) as email,
        (SELECT referralId FROM ${tables_1.USER_TREE_TBL} WHERE ${tables_1.USER_TREE_TBL}.userId = ${tables_1.USER_TBL}.userId ) as referralId,
        (SELECT placementId FROM ${tables_1.USER_TREE_TBL} WHERE ${tables_1.USER_TREE_TBL}.userId = ${tables_1.USER_TBL}.userId ) as placementId
         FROM ${tables_1.USER_TBL}  HAVING userId IS NOT NULL `;
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
exports.joiningList = joiningList;
const getTransactionData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: transactionId } = req.params;
        (0, validate_1.default)(transactionId, "Transaction Id").required().string();
        const transaction = yield Transaction_1.default.createInstance(transactionId);
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
            default:
                data = {};
                break;
        }
        return res.json({ data, category });
    }
    catch (error) {
        console.log("🚀 ~ file: report.ts:62 ~ getTransactionData ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getTransactionData = getTransactionData;
const transactionList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const columns = [
            "transactionId",
            "userId",
            "amount",
            "charge",
            "netAmount",
            "status",
            "description",
            "createdAt",
            "updatedAt",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT *,
    (SELECT avatar FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.TRANSACTION_TBL}.userId) as avatar,
    (SELECT userName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.TRANSACTION_TBL}.userId) as userName,
    transactionId as id,createdAt,updatedAt FROM ${tables_1.TRANSACTION_TBL} HAVING transactionId IS NOT NULL`;
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
exports.transactionList = transactionList;
const referralIncomeList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const columns = [
            "userId",
            "referralId",
            "referralIncome",
            "placement",
            "plan",
            "status",
            "referralUserName",
            "createdAt",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT id, userId,referralId, referralIncome,placement,status,
        (SELECT userName FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.USER_REFERRAL_TBL}.referralId ) as referralUserName, 
        (SELECT avatar FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.USER_REFERRAL_TBL}.referralId ) as avatar,
        createdAt
         FROM ${tables_1.USER_REFERRAL_TBL}  HAVING id IS NOT NULL  `;
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
exports.referralIncomeList = referralIncomeList;
const roiIncomeList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status = "daily" } = req.params;
        (0, validate_1.default)(status, "Status").required().string().oneOf(RoiIncome_1.RoiEnum);
        const columns = [
            "userId",
            "planId",
            "planName",
            "createdAt",
            "amount",
            "status",
            "transactionId",
            "type",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT id, userId, planId,planName,status,transactionId, createdAt,type,amount,
        (SELECT userName FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.ROI_TBL}.userId ) as userName, 
        (SELECT avatar FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.ROI_TBL}.userId ) as avatar
         FROM ${tables_1.ROI_TBL} HAVING type = ?  `;
        let sqlParams = [status];
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
exports.roiIncomeList = roiIncomeList;
const topSponsorsList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const columns = [
            "userId",
            "userName",
            "avatar",
            "firstName",
            "lastName",
            "email",
            "createdAt",
            "referrals",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        let sql = `SELECT id,referralId as userId, 
    (SELECT userName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_REFERRAL_TBL}.referralId ) as userName,
    (SELECT avatar FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_REFERRAL_TBL}.referralId ) as avatar,
    (SELECT firstName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_REFERRAL_TBL}.referralId ) as firstName,
    (SELECT lastName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_REFERRAL_TBL}.referralId ) as lastName,
    (SELECT email FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_REFERRAL_TBL}.referralId ) as email,
    (SELECT createdAt FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_REFERRAL_TBL}.referralId ) as createdAt,
    COUNT(userId) AS referrals
     FROM ${tables_1.USER_REFERRAL_TBL} GROUP BY referralId HAVING referralId IS NOT NULL`;
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
        console.log("🚀 ~ file: report.ts:317 ~ topSponsorsList ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.topSponsorsList = topSponsorsList;
const topEarnersList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const columns = [
            "userId",
            "userName",
            "avatar",
            "firstName",
            "lastName",
            "email",
            "createdAt",
            "earning",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        let sql = `SELECT id,userId, category,
    (SELECT userName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.TRANSACTION_TBL}.userId ) as userName,
    (SELECT avatar FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.TRANSACTION_TBL}.userId ) as avatar,
    (SELECT firstName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.TRANSACTION_TBL}.userId ) as firstName,
    (SELECT lastName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.TRANSACTION_TBL}.userId ) as lastName,
    (SELECT email FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.TRANSACTION_TBL}.userId ) as email,
    (SELECT createdAt FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.TRANSACTION_TBL}.userId ) as createdAt,
    SUM(netAmount) AS earning
     FROM ${tables_1.TRANSACTION_TBL} WHERE category IN (?) GROUP BY userId HAVING earning > 0`;
        const transactionTypes = ["referral_income", "roi_income"];
        //@ts-ignore
        let sqlParams = [transactionTypes];
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
        const rawSql = (0, mysql2_1.format)(sql, sqlParams);
        const [totalRows] = yield db_1.default.query(rawSql);
        const rowCount = totalRows.length;
        const sortSql = (0, format_1.formatSortModel)(sortModel);
        if (sortSql)
            sql += ` ${sortSql}`;
        sql += ` LIMIT ${pageSize} OFFSET ${Number(pageIndex) * pageSize}`;
        const rawSql2 = (0, mysql2_1.format)(sql, sqlParams);
        const [rows] = yield db_1.default.query(rawSql2);
        return res.json({ rowCount, rows });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.topEarnersList = topEarnersList;
const getPlansInvestmentList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT planId AS id, planId, planName, (SELECT COUNT(*) FROM ${tables_1.PLAN_HISTORY_TBL} WHERE planId = ${tables_1.PLAN_TBL}.planId ) AS investment, (SELECT SUM(price) FROM ${tables_1.PLAN_HISTORY_TBL} WHERE planId = ${tables_1.PLAN_TBL}.planId ) AS amount  FROM ${tables_1.PLAN_TBL} `;
        const [rows] = yield db_1.default.query(sql);
        return res.json(rows);
    }
    catch (error) {
        console.log("🚀 ~ file: report.ts:451 ~ getPlansInvestmentList ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getPlansInvestmentList = getPlansInvestmentList;
const getUsersInvestmentList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const columns = [
            "userId",
            "userName",
            "avatar",
            "firstName",
            "lastName",
            "email",
            "createdAt",
            "price",
            "planName",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        let sql = `SELECT id, userId, createdAt,price,planName,
    (SELECT userName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.PLAN_HISTORY_TBL}.userId ) as userName,
    (SELECT avatar FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.PLAN_HISTORY_TBL}.userId ) as avatar,
    (SELECT firstName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.PLAN_HISTORY_TBL}.userId ) as firstName,
    (SELECT lastName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.PLAN_HISTORY_TBL}.userId ) as lastName,
    (SELECT email FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.PLAN_HISTORY_TBL}.userId ) as email
     FROM ${tables_1.PLAN_HISTORY_TBL} HAVING id IS NOT NULL`;
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
        console.log("🚀 ~ file: report.ts:266 ~ getInvestmentList ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getUsersInvestmentList = getUsersInvestmentList;
// analytics
const registrationAnalyticsData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "Body").object();
        let { startDate, endDate } = reqBody;
        (0, validate_1.default)(startDate, "Start Date").required().string();
        (0, validate_1.default)(endDate, "End Date").required().string();
        const values = [];
        const categories = [];
        const currentMoment = (0, fns_1.dateToUtc)(startDate);
        const endMoment = (0, fns_1.dateToUtc)(endDate).add(1, "day");
        while (currentMoment.isBefore(endMoment, "day")) {
            const startDateTime = (0, moment_1.default)(currentMoment).format("YYYY-MM-DD HH:mm:ss");
            const endDateTime = (0, moment_1.default)(currentMoment)
                .add(1, "day")
                .subtract(1, "second")
                .format("YYYY-MM-DD HH:mm:ss");
            const users = yield Analytics_1.default.getJoiningCount(startDateTime, endDateTime);
            const compareStartTime = (0, moment_1.default)(startDateTime).utcOffset("+00:00", true);
            const compareEndTime = (0, fns_1.dateToUtc)(endDate);
            categories.push(compareStartTime.isAfter(compareEndTime)
                ? compareEndTime.toISOString()
                : compareStartTime.toISOString());
            values.push(users);
            currentMoment.add(1, "day");
        }
        return res.json({ values, categories });
    }
    catch (error) {
        console.log("🚀 ~ file: report.ts:371 ~ analyticsData ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.registrationAnalyticsData = registrationAnalyticsData;
const depositAnalyticsData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "Body").object();
        let { startDate, endDate } = reqBody;
        (0, validate_1.default)(startDate, "Start Date").required().string();
        (0, validate_1.default)(endDate, "End Date").required().string();
        const values = [];
        const categories = [];
        const currentMoment = (0, fns_1.dateToUtc)(startDate);
        const endMoment = (0, fns_1.dateToUtc)(endDate).add(1, "day");
        while (currentMoment.isBefore(endMoment, "day")) {
            const startDateTime = (0, moment_1.default)(currentMoment).format("YYYY-MM-DD HH:mm:ss");
            const endDateTime = (0, moment_1.default)(currentMoment)
                .add(1, "day")
                .subtract(1, "second")
                .format("YYYY-MM-DD HH:mm:ss");
            const deposit = yield Analytics_1.default.getDepositTransaction(startDateTime, endDateTime);
            const compareStartTime = (0, moment_1.default)(startDateTime).utcOffset("+00:00", true);
            const compareEndTime = (0, fns_1.dateToUtc)(endDate);
            categories.push(compareStartTime.isAfter(compareEndTime)
                ? compareEndTime.toISOString()
                : compareStartTime.toISOString());
            values.push(deposit);
            currentMoment.add(1, "day");
        }
        return res.json({ values, categories });
    }
    catch (error) {
        console.log("🚀 ~ file: report.ts:371 ~ analyticsData ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.depositAnalyticsData = depositAnalyticsData;
const withdrawAnalyticsData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "Body").object();
        let { startDate, endDate } = reqBody;
        (0, validate_1.default)(startDate, "Start Date").required().string();
        (0, validate_1.default)(endDate, "End Date").required().string();
        const values = [];
        const categories = [];
        const currentMoment = (0, fns_1.dateToUtc)(startDate);
        const endMoment = (0, fns_1.dateToUtc)(endDate).add(1, "day");
        while (currentMoment.isBefore(endMoment, "day")) {
            const startDateTime = (0, moment_1.default)(currentMoment).format("YYYY-MM-DD HH:mm:ss");
            const endDateTime = (0, moment_1.default)(currentMoment)
                .add(1, "day")
                .subtract(1, "second")
                .format("YYYY-MM-DD HH:mm:ss");
            const withdraw = yield Analytics_1.default.getWithdrawTransaction(startDateTime, endDateTime);
            const compareStartTime = (0, moment_1.default)(startDateTime).utcOffset("+00:00", true);
            const compareEndTime = (0, fns_1.dateToUtc)(endDateTime);
            categories.push(compareStartTime.isAfter(compareEndTime)
                ? compareEndTime.toISOString()
                : compareStartTime.toISOString());
            values.push(withdraw);
            currentMoment.add(1, "day");
        }
        return res.json({ values, categories });
    }
    catch (error) {
        console.log("🚀 ~ file: report.ts:371 ~ analyticsData ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.withdrawAnalyticsData = withdrawAnalyticsData;
