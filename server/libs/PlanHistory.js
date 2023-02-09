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
class PlanHistory {
    constructor(transactionId, errorText) {
        this.transactionId = transactionId;
        if (errorText)
            this.initializeErrorText = errorText;
    }
    static isTransactionId(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT transactionId from ${tables_1.PLAN_HISTORY_TBL} WHERE transactionId = ?`;
            const [row] = yield db_1.default.execute(sql, [transactionId]);
            return !!row.length;
        });
    }
    static createInstance(transactionId, errorText) {
        return __awaiter(this, void 0, void 0, function* () {
            const planHistory = new PlanHistory(transactionId, errorText);
            yield planHistory.initialize();
            return planHistory;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isTransactionId = yield PlanHistory.isTransactionId(this.transactionId);
            if (!isTransactionId) {
                throw new errors_1.HttpError(404, errorText || `${this.transactionId} is not a valid plan history transaction id`);
            }
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.PLAN_HISTORY_TBL} WHERE transactionId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.transactionId]);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
}
exports.default = PlanHistory;
