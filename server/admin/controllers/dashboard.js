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
exports.updateDashboardNotice = exports.getDashboardNotice = exports.getDashboardAnalytics = void 0;
const db_1 = __importDefault(require("../../db"));
const Setting_1 = __importDefault(require("../../libs/Setting"));
const validate_1 = __importDefault(require("../../utils/validate"));
const tables_1 = require("../../tables");
const errors_1 = require("../../errors");
const Dashboard_1 = __importDefault(require("../../libs/Dashboard"));
const getDashboardAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const dashboard = new Dashboard_1.default();
        const activeUsers = yield dashboard.activeUsers();
        const blockedUsers = yield dashboard.blockedUsers();
        const todayJoining = yield dashboard.todayJoining();
        const pendingWithdrawRequest = yield dashboard.pendingWithdrawRequest();
        const pendingWithdraw = yield dashboard.pendingWithdraw();
        const pendingDepositRequest = yield dashboard.pendingDepositRequest();
        const pendingDeposit = yield dashboard.pendingDeposit();
        const totalDeposit = yield dashboard.totalDeposit();
        const totalWithdraw = yield dashboard.totalWithdraw();
        const pendingTickets = yield dashboard.pendingTickets();
        const activeTickets = yield dashboard.activeTickets();
        const closedTickets = yield dashboard.ClosedTickets();
        const totalTickets = yield dashboard.TotalTickets();
        const pendingKyc = yield dashboard.pendingKyc();
        const todayWithdraw = yield dashboard.todayWithdraw();
        const todayDeposit = yield dashboard.todayDeposit();
        const paymentTransfer = yield dashboard.paymentTransfer();
        const transactionsCharge = yield dashboard.transactionsCharge();
        const planSold = yield dashboard.planSold();
        const planSoldCount = yield dashboard.planSoldCount();
        const data = {
            activeUsers,
            blockedUsers,
            todayJoining,
            pendingDepositRequest,
            pendingDeposit,
            todayWithdraw,
            todayDeposit,
            pendingWithdraw,
            transactionsCharge,
            paymentTransfer,
            pendingWithdrawRequest,
            totalDeposit,
            totalWithdraw,
            pendingTickets,
            pendingKyc,
            activeTickets,
            closedTickets,
            totalTickets,
            planSoldCount,
            planSold,
        };
        return res.json(data);
    }
    catch (error) {
        console.log("🚀 ~ file: await dashboard.ts:5 ~ getDashboardAnalytics ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getDashboardAnalytics = getDashboardAnalytics;
const getDashboardNotice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const setting = new Setting_1.default();
        const notice = yield setting.notice();
        return res.json({ notice });
    }
    catch (error) {
        console.log("🚀 ~ file: await dashboard.ts:18 ~ getDashboardNotice ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getDashboardNotice = getDashboardNotice;
const updateDashboardNotice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { notice } = reqBody;
        (0, validate_1.default)(notice, "Notice").required().string().maxLength(5000);
        const sql = `UPDATE ${tables_1.SETTING_TBL} SET notice = ?`;
        yield db_1.default.execute(sql, [notice]);
        return (0, errors_1.sendResponse)(res, "Notice has been updated");
    }
    catch (error) {
        console.log("🚀 ~ file: await dashboard.ts:28 ~ updateDashboardNotice ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateDashboardNotice = updateDashboardNotice;
