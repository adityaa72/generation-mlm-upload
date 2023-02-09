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
exports.deletePlan = exports.getPlanData = exports.createPlan = void 0;
const db_1 = __importDefault(require("../../db"));
const errors_1 = require("../../errors");
const Plan_1 = __importStar(require("../../libs/Plan"));
const tables_1 = require("../../tables");
const validate_1 = __importDefault(require("../../utils/validate"));
const createPlan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { planId, planName, price, validity, status, recommended, referralIncome, dailyProfitFrom, dailyProfitUpto, weeklyProfitFrom, weeklyProfitUpto, monthlyProfitFrom, monthlyProfitUpto, } = reqBody;
        (0, validate_1.default)([
            planId,
            planName,
            price,
            validity,
            status,
            recommended,
            referralIncome,
            dailyProfitFrom,
            dailyProfitUpto,
            weeklyProfitFrom,
            weeklyProfitUpto,
            monthlyProfitFrom,
            monthlyProfitUpto,
        ], "body").args();
        (0, validate_1.default)(planName, "Plan Name").required().string().maxLength(30);
        (0, validate_1.default)(price, "Price").required().number();
        (0, validate_1.default)(validity, "Validity").required().number().min(1);
        (0, validate_1.default)(referralIncome, "Referral Income").required().number();
        (0, validate_1.default)(dailyProfitFrom, "Daily Profile From").required().number();
        (0, validate_1.default)(dailyProfitUpto, "Daily Profit Upto").required().number();
        (0, validate_1.default)(weeklyProfitFrom, "Weekly Profile From").required().number();
        (0, validate_1.default)(weeklyProfitUpto, "Weekly Profit Upto").required().number();
        (0, validate_1.default)(monthlyProfitFrom, "Monthly Profile From").required().number();
        (0, validate_1.default)(monthlyProfitUpto, "Monthly Profit Upto").required().number();
        (0, validate_1.default)(status, "Status").required().string().oneOf(Plan_1.PlanStatusEnum);
        (0, validate_1.default)(recommended, "Recommended").required().string().oneOf(["no", "yes"]);
        // mark other plans as not recommended
        if (recommended === "yes") {
            const sql = `UPDATE ${tables_1.PLAN_TBL} SET recommended = ? WHERE recommended = ?`;
            yield db_1.default.execute(sql, ["no", "yes"]);
        }
        const insertModel = {
            planName,
            price: Number(price),
            validity: Number(validity),
            status,
            recommended,
            referralIncome: Number(referralIncome),
            dailyProfitFrom: Number(dailyProfitFrom),
            dailyProfitUpto: Number(dailyProfitUpto),
            weeklyProfitFrom: Number(weeklyProfitFrom),
            weeklyProfitUpto: Number(weeklyProfitUpto),
            monthlyProfitFrom: Number(monthlyProfitFrom),
            monthlyProfitUpto: Number(monthlyProfitUpto),
        };
        let message;
        if (planId === 0) {
            const sql = `INSERT INTO ${tables_1.PLAN_TBL} SET ?`;
            yield db_1.default.query(sql, [insertModel]);
            message = "Plan has been created";
        }
        else {
            yield Plan_1.default.createInstance(planId);
            const sql = `UPDATE ${tables_1.PLAN_TBL} SET ? WHERE planId = ?`;
            yield db_1.default.query(sql, [insertModel, planId]);
            message = "Plan has been updated";
        }
        yield conn.commit();
        return (0, errors_1.sendResponse)(res, message);
    }
    catch (error) {
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createPlan = createPlan;
const getPlanData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield Plan_1.default.getAllRows();
        return res.json(rows);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getPlanData = getPlanData;
const deletePlan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const { id } = req.params;
        (0, validate_1.default)(id, "Plan Id").required().number();
        const planId = Number(id);
        yield Plan_1.default.createInstance(planId);
        // expire user plans
        const planSql = `UPDATE ${tables_1.PLAN_HISTORY_TBL} SET status = ? WHERE planId = ?`;
        yield db_1.default.execute(planSql, ["expired", planId]);
        // delete plan
        const sql = `DELETE FROM ${tables_1.PLAN_TBL} WHERE planId = ?`;
        yield db_1.default.execute(sql, [planId]);
        yield conn.commit();
        return (0, errors_1.sendResponse)(res, "Plan has been deleted");
    }
    catch (error) {
        yield conn.rollback();
        console.log("🚀 ~ file: planSetting.ts:145 ~ deletePlan ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.deletePlan = deletePlan;
