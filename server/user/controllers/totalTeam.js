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
exports.getTotalTeamList = void 0;
const db_1 = __importDefault(require("../../db"));
const User_1 = __importDefault(require("../../libs/User"));
const tables_1 = require("../../tables");
const format_1 = require("../../utils/format");
const validate_1 = require("../../utils/validate");
const getTotalTeamList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    try {
        const { userId } = req.locals;
        const user = yield User_1.default.createInstance(userId);
        const lft = yield user.lft();
        const rgt = yield user.rgt();
        const columns = [
            "userId",
            "level",
            "displayName",
            "referralId",
            "referralDisplayName",
            "email",
            "kyc",
            "plan",
            "status",
            "userName",
            "createdAt",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT userId as id, userId, level,referralId,
    (SELECT CONCAT_WS(' ', firstName, lastName) AS displayName FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.USER_TREE_TBL}.referralId ) as referralDisplayName,
    (SELECT CONCAT_WS(' ', firstName, lastName) AS displayName FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.USER_TREE_TBL}.userId ) as displayName,
     (SELECT avatar FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.USER_TREE_TBL}.userId ) as avatar, 
     (SELECT email FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.USER_TREE_TBL}.userId ) as email, 
     (SELECT kyc FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.USER_TREE_TBL}.userId ) as kyc, 
     (SELECT status FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.USER_TREE_TBL}.userId ) as status, 
     (SELECT userName FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.USER_TREE_TBL}.userId ) as userName, 
     IFNULL((SELECT planName FROM ${tables_1.PLAN_TBL} WHERE planId = (SELECT planId FROM ${tables_1.PLAN_HISTORY_TBL} WHERE ${tables_1.PLAN_HISTORY_TBL}.userId = ${tables_1.USER_TREE_TBL}.userId AND ${tables_1.PLAN_HISTORY_TBL}.status = 'active' ORDER BY id DESC LIMIT 1 )),'NA') as plan,
     (SELECT createdAt FROM ${tables_1.USER_TBL} WHERE ${tables_1.USER_TBL}.userId = ${tables_1.USER_TREE_TBL}.userId ) as createdAt
       FROM ${tables_1.USER_TREE_TBL} WHERE lft >= ? AND rgt <= ? HAVING userId IS NOT NULL`;
        const level = yield user.level();
        let sqlParams = [lft, rgt];
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
        try {
            for (var rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), !rows_1_1.done;) {
                const row = rows_1_1.value;
                const { userId: referredId } = row;
                const isId = yield User_1.default.isUserId(referredId);
                if (isId) {
                    row.myLevel = level;
                }
                else {
                    row.myLevel = 0;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) yield _a.call(rows_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        res.json({ rowCount, rows });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getTotalTeamList = getTotalTeamList;
