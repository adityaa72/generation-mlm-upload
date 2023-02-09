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
const db_2 = __importDefault(require("../db"));
const errors_1 = require("../errors");
const tables_1 = require("../tables");
const User_1 = __importDefault(require("./User"));
const Kyc = class {
    constructor(kycId, errorText) {
        this.kycId = kycId;
        if (errorText)
            this.initializeErrorText = errorText;
    }
    static isKycId(kycId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT kycId FROM ${tables_1.USER_KYC_TBL} WHERE kycId = ?`;
            const [rows] = yield db_2.default.execute(sql, [kycId]);
            return rows.length > 0 ? true : false;
        });
    }
    static createInstance(kycId, errorText) {
        return __awaiter(this, void 0, void 0, function* () {
            const deposit = new Kyc(kycId, errorText);
            yield deposit.initialize();
            return deposit;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isKycId = yield Kyc.isKycId(this.kycId);
            if (!isKycId)
                throw new errors_1.HttpError(404, errorText || `${this.kycId} is not a valid kyc id`);
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.USER_KYC_TBL} WHERE kycId = ?`;
            const [rows] = yield db_2.default.execute(sql, [this.kycId]);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
    requestedAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const requestedAt = row.createdAt;
            return requestedAt;
        });
    }
    processedAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const processedAt = row.updatedAt;
            return processedAt;
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const status = row.status;
            return status;
        });
    }
    rejectedReason() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const rejectedReason = row.rejectedReason;
            return rejectedReason;
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
    static getUserLastKyc(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${tables_1.USER_KYC_TBL} WHERE userId = ? ORDER BY createdAt DESC LIMIT 1`;
            const [rows] = yield db_1.default.execute(sql, [userId]);
            return rows[0];
        });
    }
};
exports.default = Kyc;
