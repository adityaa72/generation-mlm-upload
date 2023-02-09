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
exports.ManualDepositGatewayStatusEnum = exports.ManualDepositGatewayChargeTypeEnum = void 0;
const is_empty_1 = __importDefault(require("is-empty"));
const db_1 = __importDefault(require("../db"));
const errors_1 = require("../errors");
const tables_1 = require("../tables");
exports.ManualDepositGatewayChargeTypeEnum = ["fixed", "percentage"];
exports.ManualDepositGatewayStatusEnum = ["active", "inactive"];
const ManualDepositGateway = class {
    constructor(gatewayId, errorText) {
        this.gatewayId = gatewayId;
        if (errorText)
            this.initializeErrorText = errorText;
    }
    static isGatewayId(gatewayId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT gatewayId FROM ${tables_1.MANUAL_DEPOSIT_GATEWAY_TBL} WHERE gatewayId = ?`;
            const [rows] = yield db_1.default.execute(sql, [gatewayId]);
            return rows.length > 0 ? true : false;
        });
    }
    static createInstance(gatewayId, errorText) {
        return __awaiter(this, void 0, void 0, function* () {
            const depositGateway = new ManualDepositGateway(gatewayId, errorText);
            yield depositGateway.initialize();
            return depositGateway;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isGatewayId = yield ManualDepositGateway.isGatewayId(this.gatewayId);
            if (!isGatewayId)
                throw new errors_1.HttpError(404, errorText || `${this.gatewayId} is not a valid manual deposit gateway id`);
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.MANUAL_DEPOSIT_GATEWAY_TBL} WHERE gatewayId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.gatewayId]);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
    static getAllRows() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${tables_1.MANUAL_DEPOSIT_GATEWAY_TBL}`;
            const [rows] = yield db_1.default.query(sql);
            return rows;
        });
    }
    static getAllActiveRows() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${tables_1.MANUAL_DEPOSIT_GATEWAY_TBL} WHERE status = ?`;
            const [rows] = yield db_1.default.execute(sql, ["active"]);
            for (const row of rows) {
                row.details = JSON.parse(row.details);
            }
            return rows;
        });
    }
    name() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const name = row.name;
            return name;
        });
    }
    logo() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const logo = row.logo;
            return logo;
        });
    }
    processingTime() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const processingTime = row.processingTime;
            return processingTime;
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const status = row.status;
            return status;
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
    minDeposit() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const minDeposit = row.minDeposit;
            return minDeposit;
        });
    }
    maxDeposit() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const maxDeposit = row.maxDeposit;
            return maxDeposit;
        });
    }
    getCharge(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const charge = yield this.charge();
            const chargeType = yield this.chargeType();
            if (chargeType === "fixed")
                return charge;
            return (amount * charge) / 100;
        });
    }
    details() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const details = row.details;
            return details;
        });
    }
    parseDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const details = yield this.details();
            return JSON.parse(details);
        });
    }
    createdAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const createdAt = row.createdAt;
            return createdAt;
        });
    }
    checkStatus() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.status();
            const name = this.name();
            if (status !== "active")
                throw new errors_1.ClientError(`${name} is currently unavailable`);
        });
    }
};
exports.default = ManualDepositGateway;
