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
exports.manageCron = exports.checkRoiIncome = void 0;
const db_1 = __importDefault(require("./db"));
const Plan_1 = __importDefault(require("./libs/Plan"));
const Transaction_1 = __importDefault(require("./libs/Transaction"));
const tables_1 = require("./tables");
const fns_1 = require("./utils/fns");
const checkRoiIncome = (row) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("cron run at");
    console.log(new Date());
    const dateTime = (0, fns_1.currentDateTimeInMoment)();
    const { validTill, id, createdAt, type, planId, transactionId: planTransactionId, userId, price, } = row;
    const validTillTime = (0, fns_1.dateToUtc)(validTill);
    const isExpired = validTillTime.isBefore(dateTime);
    // validate plan expiry
    if (isExpired) {
        const sql = `UPDATE ${tables_1.PLAN_HISTORY_TBL} SET status = ? WHERE  status = ? AND id = ?`;
        yield db_1.default.execute(sql, ["expired", "active", id]);
        return;
    }
    let lastIncomeDate;
    // check roi income
    const sql = `SELECT createdAt FROM ${tables_1.ROI_TBL} WHERE planId = ? AND planTransactionId = ? ORDER BY createdAt DESC LIMIT 1`;
    const [rows] = yield db_1.default.execute(sql, [planId, planTransactionId]);
    if (!rows.length) {
        lastIncomeDate = (0, fns_1.dateToUtc)(createdAt);
        lastIncomeDate = lastIncomeDate.subtract(1, "day");
    }
    else {
        lastIncomeDate = (0, fns_1.dateToUtc)(rows[0].createdAt);
    }
    let interval;
    if (type === "daily")
        interval = 1 * 86400;
    else if (type === "weekly")
        interval = 7 * 86400;
    else
        interval = 30 * 86400;
    const currentTime = dateTime.valueOf() / 1000;
    const lastIncomeTime = lastIncomeDate.valueOf() / 1000;
    const nextIncomeTime = lastIncomeTime + interval;
    const plan = yield Plan_1.default.createInstance(planId);
    const planName = yield plan.planName();
    for (let i = nextIncomeTime; i <= currentTime; i += interval) {
        const transactionId = Transaction_1.default.generateTransactionId();
        const dateTimeSql = (0, fns_1.convertToDateTime)((0, fns_1.dateToUtc)(i * 1000));
        const roiIncome = yield plan.getRoiIncome(price, type);
        const roiSql = `INSERT INTO ${tables_1.ROI_TBL} SET ?`;
        const roiRow = {
            userId: userId,
            amount: roiIncome,
            transactionId,
            planTransactionId,
            createdAt: dateTimeSql,
            planId,
            planName,
            status: "credit",
            type,
        };
        yield db_1.default.query(roiSql, roiRow);
        // add into transaction
        const txnSql = `INSERT INTO ${tables_1.TRANSACTION_TBL} SET ?`;
        const txnRow = {
            transactionId,
            userId,
            amount: roiIncome,
            charge: 0,
            netAmount: roiIncome,
            createdAt: dateTimeSql,
            category: "roi_income",
            description: "roi income",
            status: "credit",
            updatedAt: dateTimeSql,
        };
        yield db_1.default.query(txnSql, txnRow);
    }
});
exports.checkRoiIncome = checkRoiIncome;
const manageCron = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        // check for plans validation
        const sql = `SELECT * FROM ${tables_1.PLAN_HISTORY_TBL} WHERE status = ?`;
        const [rows] = yield db_1.default.execute(sql, ["active"]);
        if (!rows.length)
            return res.json({ message: "cronjob run successfully" });
        try {
            for (var rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), !rows_1_1.done;) {
                const row = rows_1_1.value;
                yield (0, exports.checkRoiIncome)(row);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) yield _a.call(rows_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        // check for roi incomes
        yield conn.commit();
        return res.json({ message: "cronjob run successfully" });
    }
    catch (error) {
        yield conn.rollback();
        console.log("🚀 ~ file: cron.ts:5 ~ manageCron ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.manageCron = manageCron;
