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
const WithdrawGateway_1 = __importDefault(require("./WithdrawGateway"));
const UserWithdrawGateway = class {
    constructor(userId, gatewayId, errorText) {
        this.userId = userId;
        this.gatewayId = gatewayId;
        if (errorText)
            this.initializeErrorText = errorText;
    }
    static isGatewayId(userId, gatewayId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT gatewayId FROM ${tables_1.USER_WITHDRAW_GATEWAY_TBL} WHERE gatewayId = ? AND userId = ?`;
            const [rows] = yield db_1.default.execute(sql, [gatewayId, userId]);
            return rows.length > 0 ? true : false;
        });
    }
    static createInstance(userId, gatewayId, errorText) {
        return __awaiter(this, void 0, void 0, function* () {
            const withdraw = new UserWithdrawGateway(userId, gatewayId, errorText);
            yield withdraw.initialize();
            return withdraw;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isGatewayId = yield UserWithdrawGateway.isGatewayId(this.userId, this.gatewayId);
            if (!isGatewayId)
                throw new errors_1.HttpError(404, errorText || `${this.gatewayId} is not a valid user withdraw gateway id`);
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.USER_WITHDRAW_GATEWAY_TBL} WHERE gatewayId = ? AND userId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.gatewayId, this.userId]);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
    details() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const details = row.details;
            return details;
        });
    }
    parsedDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const details = row.details;
            return JSON.parse(details);
        });
    }
    isUpdated() {
        return __awaiter(this, void 0, void 0, function* () {
            const gateway = yield WithdrawGateway_1.default.createInstance(this.gatewayId);
            const details = yield gateway.parsedDetails();
            const requiredNames = details.map(({ name }) => name);
            const userDetails = yield this.parsedDetails();
            const requestedNames = Object.keys(userDetails);
            return !requiredNames.every((key) => requestedNames.includes(key));
        });
    }
};
exports.default = UserWithdrawGateway;
