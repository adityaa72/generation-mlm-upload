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
const fns_1 = require("../utils/fns");
class LoginSession {
    constructor(token, errorText) {
        this.token = token;
        if (errorText)
            this.initializeErrorText = errorText;
    }
    static isToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT token FROM ${tables_1.LOGIN_SESSION_TBL} WHERE token = ?`;
            const [rows] = yield db_1.default.execute(sql, [token]);
            return rows.length > 0 ? true : false;
        });
    }
    static getTokenById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT token FROM ${tables_1.LOGIN_SESSION_TBL} WHERE tokenId = ? `;
            const [rows] = yield db_1.default.execute(sql, [id]);
            if (!rows.length)
                throw new Error("Login session token not found");
            return rows[0].token;
        });
    }
    static createInstance(token, errorText) {
        return __awaiter(this, void 0, void 0, function* () {
            const loginSession = new LoginSession(token, errorText);
            yield loginSession.initialize();
            return loginSession;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isToken = yield LoginSession.isToken(this.token);
            if (!isToken)
                throw new errors_1.HttpError(404, errorText || `Invalid token`);
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.LOGIN_SESSION_TBL} WHERE token = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.token]);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
    tokenId() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const tokenId = row.tokenId;
            return tokenId;
        });
    }
    userId() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const userId = row.userId;
            return userId;
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const status = row.status;
            return status;
        });
    }
    validTill() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const validTill = row.validTill;
            return validTill;
        });
    }
    isValid() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.status();
            if (status !== "active")
                return false;
            const validTill = yield this.validTill();
            const currentTime = (0, fns_1.currentDateTimeInMoment)();
            const isValid = (0, fns_1.dateToUtc)(validTill).isAfter(currentTime);
            return isValid;
        });
    }
}
exports.default = LoginSession;
