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
exports.getDashboardNotice = exports.dashboardAnalytics = void 0;
const db_1 = __importDefault(require("../../db"));
const Setting_1 = __importDefault(require("../../libs/Setting"));
const User_1 = __importDefault(require("../../libs/User"));
const dashboardAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const user = yield User_1.default.createInstance(userId);
        const analytics = yield user.getAnalytics();
        return res.json(analytics);
    }
    catch (error) {
        console.log("🚀 ~ file: dashboard.ts:5 ~ dashboardAnalytics ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.dashboardAnalytics = dashboardAnalytics;
const getDashboardNotice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const setting = new Setting_1.default();
        const notice = yield setting.notice();
        return res.json({ notice });
    }
    catch (error) {
        console.log("🚀 ~ file: dashboard.ts:25 ~ getDashboardNotice ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getDashboardNotice = getDashboardNotice;
