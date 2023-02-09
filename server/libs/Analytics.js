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
const db_1 = __importDefault(require("../db"));
const tables_1 = require("../tables");
const User_1 = __importDefault(require("./User"));
const Analytics = class {
    static getUserTeamJoiningNumber(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.createInstance(userId);
            const lft = yield user.lft();
            const rgt = yield user.rgt();
            const sql = `SELECT COUNT(*) as joining, (SELECT createdAt FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_TREE_TBL}.userId ) as createdAt FROM ${tables_1.USER_TREE_TBL} WHERE lft >= ? AND rgt <= ?  GROUP BY id HAVING createdAt BETWEEN ? AND ?`;
            const [rows] = yield db_1.default.execute(sql, [lft, rgt, startDate, endDate]);
            return rows.length;
        });
    }
    static getUserReferralJoiningNumber(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) as joining, (SELECT createdAt FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_TREE_TBL}.userId ) as createdAt FROM ${tables_1.USER_TREE_TBL} WHERE referralId =  ? GROUP BY id HAVING createdAt BETWEEN ? AND ?`;
            const [rows] = yield db_1.default.execute(sql, [userId, startDate, endDate]);
            return rows.length;
        });
    }
    static getJoiningCount(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) as joining FROM ${tables_1.USER_TBL} WHERE createdAt BETWEEN ? AND ?`;
            const [rows] = yield db_1.default.execute(sql, [startDate, endDate]);
            return rows[0].joining;
        });
    }
    static getDepositTransaction(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(netAmount), 0) as deposit FROM ${tables_1.USER_DEPOSIT_TBL} WHERE createdAt BETWEEN ? AND ? AND (status = ? OR status = ?)`;
            const [rows] = yield db_1.default.execute(sql, [
                startDate,
                endDate,
                "approved",
                "credit",
            ]);
            return rows[0].deposit;
        });
    }
    static getWithdrawTransaction(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT IFNULL(SUM(netAmount), 0) as withdraw FROM ${tables_1.USER_WITHDRAW_TBL} WHERE createdAt BETWEEN ? AND ? AND status = ?`;
            const [rows] = yield db_1.default.execute(sql, [startDate, endDate, "success"]);
            return rows[0].withdraw;
        });
    }
};
exports.default = Analytics;
