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
exports.InstantPaymentGatewaysEnums = void 0;
const is_empty_1 = __importDefault(require("is-empty"));
const db_1 = __importDefault(require("../db"));
const errors_1 = require("../errors");
const tables_1 = require("../tables");
const format_1 = require("../utils/format");
exports.InstantPaymentGatewaysEnums = [
    "Paytm",
    "Paypal",
    "Payu",
    "Razorpay",
    "Stripe",
    "Flutterwave",
];
const InstantDepositGateway = class {
    constructor(gatewayId, errorText) {
        this.gatewayId = gatewayId;
        if (errorText)
            this.initializeErrorText = errorText;
    }
    static isGatewayId(gatewayId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT gatewayId FROM ${tables_1.AUTOMATIC_DEPOSIT_GATEWAY_TBL} WHERE gatewayId = ?`;
            const [rows] = yield db_1.default.execute(sql, [gatewayId]);
            return rows.length > 0 ? true : false;
        });
    }
    static createInstance(gatewayId, errorText) {
        return __awaiter(this, void 0, void 0, function* () {
            const depositGateway = new InstantDepositGateway(gatewayId, errorText);
            yield depositGateway.initialize();
            return depositGateway;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isGatewayId = yield InstantDepositGateway.isGatewayId(this.gatewayId);
            if (!isGatewayId)
                throw new errors_1.HttpError(404, errorText || `${this.gatewayId} is not a valid manual deposit gateway id`);
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.AUTOMATIC_DEPOSIT_GATEWAY_TBL} WHERE gatewayId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.gatewayId]);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
    static getAllRows() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${tables_1.AUTOMATIC_DEPOSIT_GATEWAY_TBL}`;
            const [rows] = yield db_1.default.query(sql);
            return rows;
        });
    }
    static getAllActiveRows() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${tables_1.AUTOMATIC_DEPOSIT_GATEWAY_TBL} WHERE status = ? `;
            const [rows] = yield db_1.default.execute(sql, ["active"]);
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
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const status = row.status;
            return status;
        });
    }
    isActive() {
        return __awaiter(this, void 0, void 0, function* () {
            const status = yield this.status();
            return status === "active";
        });
    }
    createdAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const createdAt = row.createdAt;
            return createdAt;
        });
    }
    config() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const config = row.config;
            return JSON.parse(config);
        });
    }
    details() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const details = row.details;
            return JSON.parse(details);
        });
    }
    charge() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const charge = row.charge;
            return Number(charge);
        });
    }
    id() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const id = row.id;
            return id;
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
            if (chargeType === "fixed")
                return charge;
            return (amount * charge) / 100;
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
    static getPaytmConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const gatewayId = "Paytm";
            const gateway = yield InstantDepositGateway.createInstance(gatewayId);
            const details = yield gateway.details();
            const { MID, MERCHANT_KEY, ENVIRONMENT } = details;
            const PaytmConfig = {
                MID,
                MERCHANT_KEY,
                WEBSITE: "WEBSTAGING",
                CHANNEL_ID: "WEB",
                INDUSTRY_TYPE_ID: "Retail",
                CALLBACK_URL: (0, format_1.formatUrl)("/verify-payment/paytm"),
                PAYTM_TXN_URL: ENVIRONMENT !== "production"
                    ? "https://securegw-stage.paytm.in/theia/processTransaction"
                    : "https://securegw.paytm.in/theia/processTransaction",
                VERIFY_STATUS_URL: ENVIRONMENT !== "production"
                    ? "https://securegw-stage.paytm.in/v3/order/status"
                    : "https://securegw.paytm.in/v3/order/status",
            };
            return PaytmConfig;
        });
    }
    static getPaypalConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const gatewayId = "Paypal";
            const gateway = yield InstantDepositGateway.createInstance(gatewayId);
            const details = yield gateway.details();
            const { email, CLIENT_ID, CLIENT_SECRET } = details;
            return { email, CLIENT_ID, CLIENT_SECRET };
        });
    }
    static getFlutterwaveConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const gatewayId = "Flutterwave";
            const gateway = yield InstantDepositGateway.createInstance(gatewayId);
            const details = yield gateway.details();
            const { PUBLIC_KEY, SECRET_KEY } = details;
            return { PUBLIC_KEY, SECRET_KEY };
        });
    }
    static getRazorpayConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const gatewayId = "Razorpay";
            const gateway = yield InstantDepositGateway.createInstance(gatewayId);
            const details = yield gateway.details();
            const { PUBLIC_KEY, SECRET_KEY } = details;
            return { PUBLIC_KEY, SECRET_KEY, THEME: "#F37254" };
        });
    }
    static getPayuConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const gatewayId = "Payu";
            const gateway = yield InstantDepositGateway.createInstance(gatewayId);
            const details = yield gateway.details();
            const { KEY, SALT } = details;
            return { KEY, SALT };
        });
    }
    static getStripeConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const gatewayId = "Stripe";
            const gateway = yield InstantDepositGateway.createInstance(gatewayId);
            const details = yield gateway.details();
            const { PUBLISHABLE_KEY, SECRET_KEY } = details;
            return { PUBLISHABLE_KEY, SECRET_KEY };
        });
    }
};
exports.default = InstantDepositGateway;
