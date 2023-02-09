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
const is_empty_1 = __importDefault(require("is-empty"));
const db_1 = __importDefault(require("../db"));
const errors_1 = require("../errors");
const tables_1 = require("../tables");
const User_1 = __importDefault(require("./User"));
const Deposit = class {
    constructor(transactionId, error) {
        error && (this.initializeErrorText = error);
        this.transactionId = transactionId;
    }
    static isRazorpayId(razorpayId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT transactionId FROM ${tables_1.USER_DEPOSIT_TBL} WHERE razorpayId = ?`;
            const [rows] = yield db_1.default.execute(sql, [razorpayId]);
            return rows.length > 0 ? true : false;
        });
    }
    static isPaypalId(paypalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT transactionId FROM ${tables_1.USER_DEPOSIT_TBL} WHERE paypalId = ?`;
            const [rows] = yield db_1.default.execute(sql, [paypalId]);
            return rows.length > 0 ? true : false;
        });
    }
    static isStripeId(stripeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT transactionId FROM ${tables_1.USER_DEPOSIT_TBL} WHERE stripeId = ?`;
            const [rows] = yield db_1.default.execute(sql, [stripeId]);
            return rows.length > 0 ? true : false;
        });
    }
    static getTransactionIdByRazorpayId(razorpayId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT transactionId FROM ${tables_1.USER_DEPOSIT_TBL} WHERE razorpayId = ?`;
            const [rows] = yield db_1.default.execute(sql, [razorpayId]);
            return rows[0].transactionId;
        });
    }
    static getTransactionIdByPalpalId(paypalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT transactionId FROM ${tables_1.USER_DEPOSIT_TBL} WHERE paypalId = ?`;
            const [rows] = yield db_1.default.execute(sql, [paypalId]);
            return rows[0].transactionId;
        });
    }
    static getTransactionIdByStripeId(stripeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT transactionId FROM ${tables_1.USER_DEPOSIT_TBL} WHERE stripeId = ?`;
            const [rows] = yield db_1.default.execute(sql, [stripeId]);
            return rows[0].transactionId;
        });
    }
    static isTransactionId(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT transactionId FROM ${tables_1.USER_DEPOSIT_TBL} WHERE transactionId = ?`;
            const [rows] = yield db_1.default.execute(sql, [transactionId]);
            return rows.length > 0 ? true : false;
        });
    }
    static createInstance(transactionId, error) {
        return __awaiter(this, void 0, void 0, function* () {
            const deposit = new Deposit(transactionId, error);
            yield deposit.initialize();
            return deposit;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isTxnId = yield Deposit.isTransactionId(this.transactionId);
            if (!isTxnId)
                throw new errors_1.HttpError(404, errorText || `${this.transactionId} is not a valid deposit transaction id`);
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.USER_DEPOSIT_TBL} WHERE transactionId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.transactionId]);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
    parsedRow() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            if (row.details)
                row.details = JSON.parse(row.details);
            return row;
        });
    }
    userId() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const userId = row.userId;
            return userId;
        });
    }
    user() {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = yield this.userId();
            return yield User_1.default.createInstance(userId);
        });
    }
    amount() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const amount = row.amount;
            return amount;
        });
    }
    charge() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const charge = row.charge;
            return charge;
        });
    }
    netAmount() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const netAmount = row.netAmount;
            return netAmount;
        });
    }
    currency() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const currency = row.currency;
            return currency;
        });
    }
    gatewayName() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const gatewayName = row.gatewayName;
            return gatewayName;
        });
    }
    createdAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const createdAt = row.createdAt;
            return createdAt;
        });
    }
    updatedAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const updatedAt = row.updatedAt;
            return updatedAt;
        });
    }
    message() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const message = row.message;
            return message;
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const status = row.status;
            return status;
        });
    }
    actionBy() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const actionBy = row.actionBy;
            return actionBy;
        });
    }
    type() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const type = row.type;
            return type;
        });
    }
    gatewayId() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const gatewayId = row.gatewayId;
            return gatewayId;
        });
    }
};
exports.default = Deposit;
