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
const User_1 = __importDefault(require("../libs/User"));
const tables_1 = require("../tables");
const Withdraw = class {
    constructor(transactionId, errorText) {
        this.transactionId = transactionId;
        if (errorText)
            this.initializeErrorText = errorText;
    }
    static isTransactionId(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT transactionId FROM ${tables_1.USER_WITHDRAW_TBL} WHERE transactionId = ?`;
            const [rows] = yield db_1.default.execute(sql, [transactionId]);
            return rows.length > 0 ? true : false;
        });
    }
    static createInstance(transactionId, errorText) {
        return __awaiter(this, void 0, void 0, function* () {
            const withdraw = new Withdraw(transactionId, errorText);
            yield withdraw.initialize();
            return withdraw;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isTransactionId = yield Withdraw.isTransactionId(this.transactionId);
            if (!isTransactionId)
                throw new errors_1.HttpError(404, errorText || `${this.transactionId} is not a valid withdraw transaction id`);
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.USER_WITHDRAW_TBL} WHERE transactionId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.transactionId]);
            const row = rows[0];
            this.row = row;
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
            const user = yield User_1.default.createInstance(userId);
            return user;
        });
    }
    gatewayId() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const gatewayId = row.gatewayId;
            return gatewayId;
        });
    }
    gatewayName() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const gatewayName = row.gatewayName;
            return gatewayName;
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
    createdAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const requestedDate = row.createdAt;
            return requestedDate;
        });
    }
    updatedAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const processedDate = row.updatedAt;
            return processedDate;
        });
    }
    actionBy() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const actionBy = row.actionBy;
            return actionBy;
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
    // todo ⬇️
    // analytics
    withdrawCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
    withdrawAmount() {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
    withdrawAmountText() {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
    todayWithdrawAmount() {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
    todayWithdrawAmountText() {
        return __awaiter(this, void 0, void 0, function* () {
            return 0;
        });
    }
};
exports.default = Withdraw;
