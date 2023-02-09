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
exports.WithdrawGatewayChargeEnum = exports.WithdrawGatewayStatusEnum = void 0;
const is_empty_1 = __importDefault(require("is-empty"));
const db_1 = __importDefault(require("../db"));
const tables_1 = require("../tables");
const errors_1 = require("./../errors");
exports.WithdrawGatewayStatusEnum = ["active", "inactive"];
exports.WithdrawGatewayChargeEnum = ["fixed", "percent"];
class WithdrawGateway {
    constructor(gatewayId, errorText) {
        this.gatewayId = gatewayId;
        if (errorText)
            this.initializeErrorText = errorText;
    }
    static isGatewayId(gatewayId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT gatewayId FROM ${tables_1.WITHDRAW_GATEWAY_TBL} WHERE gatewayId = ?`;
            const [rows] = yield db_1.default.execute(sql, [gatewayId]);
            return rows.length > 0 ? true : false;
        });
    }
    static createInstance(gatewayId, errorText) {
        return __awaiter(this, void 0, void 0, function* () {
            const withdraw = new WithdrawGateway(gatewayId, errorText);
            yield withdraw.initialize();
            return withdraw;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isGatewayId = yield WithdrawGateway.isGatewayId(this.gatewayId);
            if (!isGatewayId)
                throw new errors_1.HttpError(404, errorText || `${this.gatewayId} is not a valid withdraw gateway id`);
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.WITHDRAW_GATEWAY_TBL} WHERE gatewayId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.gatewayId]);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
    minWithdraw() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const minWithdraw = row.minWithdraw;
            return minWithdraw;
        });
    }
    maxWithdraw() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const maxWithdraw = row.maxWithdraw;
            return maxWithdraw;
        });
    }
    charge() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const charge = row.charge;
            return charge;
        });
    }
    chargeType() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const chargeType = row.chargeType;
            return chargeType;
        });
    }
    getCharge(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const charge = yield this.charge();
            const chargeType = yield this.chargeType();
            if ((0, is_empty_1.default)(amount))
                throw new errors_1.ClientError("Amount is empty to calculate charge");
            if (chargeType === "fixed") {
                return charge;
            }
            return (amount * charge) / 100;
        });
    }
    logo() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const logo = row.logo;
            return logo;
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const status = row.status;
            return status;
        });
    }
    processingTime() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const processingTime = row.processingTime;
            return processingTime;
        });
    }
    name() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const name = row.name;
            return name;
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
}
exports.default = WithdrawGateway;
