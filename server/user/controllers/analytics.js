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
exports.teamAndMyJoiningAnalytics = void 0;
const moment_1 = __importDefault(require("moment"));
const db_1 = __importDefault(require("../../db"));
const Analytics_1 = __importDefault(require("../../libs/Analytics"));
const fns_1 = require("../../utils/fns");
const validate_1 = __importDefault(require("../../utils/validate"));
const teamAndMyJoiningAnalytics = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "Body").object();
        let { startDate, endDate } = reqBody;
        (0, validate_1.default)(startDate, "Start Date").required().string();
        (0, validate_1.default)(endDate, "End Date").required().string();
        const { userId } = req.locals;
        const currentMoment = (0, fns_1.dateToUtc)(startDate);
        const endMoment = (0, fns_1.dateToUtc)(endDate).add(1, "day");
        const team = [];
        const referral = [];
        const categories = [];
        while (currentMoment.isBefore(endMoment, "day")) {
            const startDateTime = (0, moment_1.default)(currentMoment).format("YYYY-MM-DD HH:mm:ss");
            const endDateTime = (0, moment_1.default)(currentMoment)
                .add(1, "day")
                .subtract(1, "second")
                .format("YYYY-MM-DD HH:mm:ss");
            const teamJoining = yield Analytics_1.default.getUserTeamJoiningNumber(userId, startDateTime, endDateTime);
            const referralJoining = yield Analytics_1.default.getUserReferralJoiningNumber(userId, startDateTime, endDateTime);
            const compareStartTime = (0, moment_1.default)(startDateTime).utcOffset("+00:00", true);
            const compareEndTime = (0, fns_1.dateToUtc)(endDate);
            categories.push(compareStartTime.isAfter(compareEndTime)
                ? compareEndTime.toISOString()
                : compareStartTime.toISOString());
            team.push(teamJoining - referralJoining);
            referral.push(referralJoining);
            currentMoment.add(1, "day");
        }
        return res.json({ team, referral, categories });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.teamAndMyJoiningAnalytics = teamAndMyJoiningAnalytics;
