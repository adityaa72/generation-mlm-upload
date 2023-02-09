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
const fns_1 = require("../utils/fns");
class Dashboard {
    activeUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(userId) AS users FROM ${tables_1.USER_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["active"]);
            return rows[0].users;
        });
    }
    blockedUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(userId) AS users FROM ${tables_1.USER_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["blocked"]);
            return rows[0].users;
        });
    }
    todayJoining() {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = (0, fns_1.currentDate)();
            const endDate = (0, fns_1.getDate)("add", 1, "days");
            const sql = `SELECT COUNT(userId) AS users FROM ${tables_1.USER_TBL} WHERE createdAt BETWEEN ? AND ?`;
            const [rows] = yield db_1.default.execute(sql, [startDate, endDate]);
            return rows[0].users;
        });
    }
    pendingKyc() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) AS requests FROM ${tables_1.USER_KYC_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["pending"]);
            return rows[0].requests;
        });
    }
    pendingDepositRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) AS requests FROM ${tables_1.USER_DEPOSIT_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["review"]);
            return rows[0].requests;
        });
    }
    pendingDeposit() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT SUM(amount) AS amount FROM ${tables_1.USER_DEPOSIT_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["review"]);
            return rows[0].amount;
        });
    }
    totalDeposit() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT SUM(amount) AS amount FROM ${tables_1.USER_DEPOSIT_TBL} WHERE status = ? OR status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["credit", "approved"]);
            return rows[0].amount;
        });
    }
    todayDeposit() {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = (0, fns_1.currentDate)();
            const endDate = (0, fns_1.getDate)("add", 1, "days");
            const sql = `SELECT SUM(amount) AS amount FROM ${tables_1.USER_DEPOSIT_TBL} WHERE (status = ? OR status = ?) AND (createdAt BETWEEN ? AND ?) `;
            const [rows] = yield db_1.default.execute(sql, [
                "credit",
                "approved",
                startDate,
                endDate,
            ]);
            return rows[0].amount;
        });
    }
    totalWithdraw() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT SUM(amount) as amount FROM ${tables_1.USER_WITHDRAW_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["success"]);
            return rows[0].amount;
        });
    }
    todayWithdraw() {
        return __awaiter(this, void 0, void 0, function* () {
            const startDate = (0, fns_1.currentDate)();
            const endDate = (0, fns_1.getDate)("add", 1, "days");
            const sql = `SELECT SUM(amount) AS amount FROM ${tables_1.USER_WITHDRAW_TBL} WHERE status = ?  AND (createdAt BETWEEN ? AND ?) `;
            const [rows] = yield db_1.default.execute(sql, ["success", startDate, endDate]);
            return rows[0].amount;
        });
    }
    pendingWithdrawRequest() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) AS requests FROM ${tables_1.USER_WITHDRAW_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["pending"]);
            return rows[0].requests;
        });
    }
    pendingWithdraw() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT SUM(amount) AS amount FROM ${tables_1.USER_WITHDRAW_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["pending"]);
            return rows[0].amount;
        });
    }
    paymentTransfer() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT SUM(amount) AS amount FROM ${tables_1.PAYMENT_TRANSFER_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["transferred"]);
            return rows[0].amount;
        });
    }
    transactionsCharge() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT SUM(charge) AS charge FROM ${tables_1.TRANSACTION_TBL} WHERE status = ? OR status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["credit", "debit"]);
            return rows[0].charge;
        });
    }
    pendingTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) AS count FROM ${tables_1.TICKET_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["pending"]);
            return rows[0].count;
        });
    }
    activeTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) AS count FROM ${tables_1.TICKET_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["active"]);
            return rows[0].count;
        });
    }
    ClosedTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) AS count FROM ${tables_1.TICKET_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["closed"]);
            return rows[0].count;
        });
    }
    TotalTickets() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) AS count FROM ${tables_1.TICKET_TBL} `;
            const [rows] = yield db_1.default.query(sql);
            return rows[0].count;
        });
    }
    planSold() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT SUM(price) AS amount FROM ${tables_1.PLAN_HISTORY_TBL}`;
            const [rows] = yield db_1.default.query(sql);
            return rows[0].amount;
        });
    }
    planSoldCount() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT COUNT(*) AS investments FROM ${tables_1.PLAN_HISTORY_TBL}`;
            const [rows] = yield db_1.default.query(sql);
            return rows[0].investments;
        });
    }
}
exports.default = Dashboard;
