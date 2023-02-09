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
exports.PlanStatusEnum = void 0;
const is_empty_1 = __importDefault(require("is-empty"));
const db_1 = __importDefault(require("../db"));
const errors_1 = require("../errors");
const tables_1 = require("../tables");
exports.PlanStatusEnum = ["active", "inactive"];
const Plan = class {
    constructor(planId, errorText) {
        this.planId = planId;
        if (errorText)
            this.initializeErrorText = errorText;
    }
    static isPlanId(planId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT planId FROM ${tables_1.PLAN_TBL} WHERE planId = ?`;
            const [rows] = yield db_1.default.execute(sql, [planId]);
            return rows.length > 0 ? true : false;
        });
    }
    static createInstance(planId, errorText) {
        return __awaiter(this, void 0, void 0, function* () {
            const planI = new Plan(planId, errorText);
            yield planI.initialize();
            return planI;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isPlanId = yield Plan.isPlanId(this.planId);
            if (!isPlanId)
                throw new errors_1.HttpError(404, errorText || `${this.planId} is not a valid plan id`);
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.PLAN_TBL} WHERE planId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.planId]);
            this.row = rows[0];
            return this.row;
        });
    }
    static getAllRows() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${tables_1.PLAN_TBL}`;
            const [rows] = yield db_1.default.query(sql);
            try {
                for (var rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), !rows_1_1.done;) {
                    const row = rows_1_1.value;
                    const isPremium = row.planId === "premium";
                    row.isPremium = isPremium;
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) yield _a.call(rows_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return rows;
        });
    }
    referralIncome() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const referralIncome = row.referralIncome;
            return Number(referralIncome);
        });
    }
    // start
    planName() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const name = row.planName;
            return name;
        });
    }
    price() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const price = row.price;
            return Number(price);
        });
    }
    validity() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const validity = row.validity;
            return Number(validity);
        });
    }
    dailyProfitFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const dailyProfitFrom = row.dailyProfitFrom;
            return Number(dailyProfitFrom);
        });
    }
    dailyProfitUpto() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const dailyProfitUpto = row.dailyProfitUpto;
            return Number(dailyProfitUpto);
        });
    }
    weeklyProfitFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const weeklyProfitFrom = row.weeklyProfitFrom;
            return Number(weeklyProfitFrom);
        });
    }
    weeklyProfitUpto() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const weeklyProfitUpto = row.weeklyProfitUpto;
            return Number(weeklyProfitUpto);
        });
    }
    monthlyProfitFrom() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const monthlyProfitFrom = row.monthlyProfitFrom;
            return Number(monthlyProfitFrom);
        });
    }
    monthlyProfitUpto() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const monthlyProfitUpto = row.monthlyProfitUpto;
            return Number(monthlyProfitUpto);
        });
    }
    randomNumber(min, max, decimalPlaces = 2) {
        const rand = Math.random() < 0.5
            ? (1 - Math.random()) * (max - min) + min
            : Math.random() * (max - min) + min;
        const power = Math.pow(10, decimalPlaces);
        return Math.floor(rand * power) / power;
    }
    getDailyIncome(price) {
        return __awaiter(this, void 0, void 0, function* () {
            const dailyProfitFrom = yield this.dailyProfitFrom();
            const dailyProfitUpto = yield this.dailyProfitUpto();
            const random = this.randomNumber(dailyProfitFrom, dailyProfitUpto);
            const percent = (price * random) / 100;
            const amount = Number(percent.toFixed(2));
            return amount;
        });
    }
    getWeeklyIncome(price) {
        return __awaiter(this, void 0, void 0, function* () {
            const weeklyProfitFrom = yield this.weeklyProfitFrom();
            const weeklyProfitUpto = yield this.weeklyProfitUpto();
            const random = this.randomNumber(weeklyProfitFrom, weeklyProfitUpto);
            const percent = (price * random) / 100;
            const amount = Number(percent.toFixed(2));
            return amount;
        });
    }
    getMonthlyIncome(price) {
        return __awaiter(this, void 0, void 0, function* () {
            const monthlyProfitFrom = yield this.monthlyProfitFrom();
            const monthlyProfitUpto = yield this.monthlyProfitUpto();
            const random = this.randomNumber(monthlyProfitFrom, monthlyProfitUpto);
            const percent = (price * random) / 100;
            const amount = Number(percent.toFixed(2));
            return amount;
        });
    }
    getRoiIncome(price, type) {
        return __awaiter(this, void 0, void 0, function* () {
            if (type === "daily")
                return yield this.getDailyIncome(price);
            if (type === "weekly")
                return yield this.getWeeklyIncome(price);
            if (type === "monthly")
                return yield this.getMonthlyIncome(price);
            throw new Error("Unknown type: " + type);
        });
    }
};
exports.default = Plan;
