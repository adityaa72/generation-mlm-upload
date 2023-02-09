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
exports.upgradePlan = exports.fetchPlanList = void 0;
const db_1 = __importDefault(require("../../db"));
const errors_1 = require("../../errors");
const Plan_1 = __importDefault(require("../../libs/Plan"));
const RoiIncome_1 = require("../../libs/RoiIncome");
const Transaction_1 = __importDefault(require("../../libs/Transaction"));
const User_1 = __importDefault(require("../../libs/User"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const validate_1 = __importDefault(require("../../utils/validate"));
const fetchPlanList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const user = yield User_1.default.createInstance(userId);
        const rows = yield Plan_1.default.getAllRows();
        // const userPlanId = await user.getActivePlanId();
        return res.json(rows);
    }
    catch (err) {
        db_1.default.release();
        next(err);
    }
});
exports.fetchPlanList = fetchPlanList;
const upgradePlan = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const { userId } = req.locals;
        const user = yield User_1.default.createInstance(userId);
        const { id } = req.params;
        const planId = Number(id);
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").required().object();
        const { incomeType } = reqBody;
        (0, validate_1.default)(incomeType, "Income Type").required().string().oneOf(RoiIncome_1.RoiEnum);
        const userPlanId = yield user.getActivePlanId();
        const plan = yield Plan_1.default.createInstance(planId);
        const planName = yield plan.planName();
        if (planId === userPlanId) {
            throw new errors_1.ClientError(`Plan ${planName} is already activated`);
        }
        const price = yield plan.price();
        const wallet = yield user.wallet();
        if (price > wallet)
            throw new errors_1.ClientError("Insufficient amount to purchase plan");
        const isFirstPlan = yield user.isFirstPlan();
        const validity = yield plan.validity();
        const validityInDays = validity * 30;
        const validTill = (0, fns_1.convertToDateTime)((0, fns_1.dateToUtc)((0, fns_1.getDate)("add", validityInDays, "days")).subtract(1, "second"));
        const transactionId = Transaction_1.default.generateTransactionId();
        //expired active plans
        {
            const sql = `UPDATE ${tables_1.PLAN_HISTORY_TBL} SET status = ? WHERE userId = ? AND status = ?`;
            yield db_1.default.execute(sql, ["expired", userId, "active"]);
        }
        // insert into plan history table
        const createdAt = (0, fns_1.currentDateTime)();
        {
            const planRow = {
                userId,
                planId,
                planName,
                price,
                status: "active",
                validTill,
                transactionId,
                createdAt,
                type: incomeType,
            };
            const sql = `INSERT INTO ${tables_1.PLAN_HISTORY_TBL} SET ? `;
            yield db_1.default.query(sql, [planRow]);
        }
        // insert into transaction table
        {
            const amount = price;
            const charge = 0;
            const netAmount = amount - charge;
            const updatedAt = createdAt;
            const description = `${planName} plan purchased`;
            const transactionRow = {
                transactionId,
                userId,
                amount,
                charge,
                netAmount,
                createdAt,
                updatedAt,
                category: "plan_purchased",
                description,
                status: "debit",
            };
            const sql = `INSERT INTO ${tables_1.TRANSACTION_TBL} SET ? `;
            yield db_1.default.query(sql, [transactionRow]);
        }
        yield user.updateRow();
        if (isFirstPlan) {
            yield user.updateParentReferralIncome();
        }
        const planDetails = yield user.getActivePlanDetails();
        yield conn.commit();
        return (0, errors_1.sendResponse)(res, `You have upgraded to ${planName}`, { plan: planDetails });
    }
    catch (err) {
        yield conn.rollback();
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.upgradePlan = upgradePlan;
