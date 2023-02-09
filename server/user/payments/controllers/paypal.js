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
exports.verifyPayPalTxn = exports.createPaypalTransaction = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const db_1 = __importDefault(require("../../../db"));
const errors_1 = require("../../../errors");
const AutomaticDepositGateway_1 = __importDefault(require("../../../libs/AutomaticDepositGateway"));
const Deposit_1 = __importDefault(require("../../../libs/Deposit"));
const Transaction_1 = __importDefault(require("../../../libs/Transaction"));
const tables_1 = require("../../../tables");
const fns_1 = require("../../../utils/fns");
const validate_1 = __importDefault(require("../../../utils/validate"));
const base = "https://api-m.sandbox.paypal.com";
const createPaypalTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    conn.beginTransaction();
    try {
        const { userId } = req.locals;
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { amount: amountString } = reqBody;
        (0, validate_1.default)(amountString, "Amount").required().number().min(1);
        (0, validate_1.default)([amountString], "body").args();
        const amount = Number(amountString);
        const gatewayId = "Paypal";
        const gateway = yield AutomaticDepositGateway_1.default.createInstance(gatewayId);
        const gatewayName = yield gateway.name();
        const charge = yield gateway.getCharge(amount);
        const logo = yield gateway.logo();
        yield gateway.checkStatus();
        const PaypalConfig = yield AutomaticDepositGateway_1.default.getPaypalConfig();
        const transactionId = Transaction_1.default.generateTransactionId();
        const status = "pending";
        const type = "automatic";
        const netAmount = amount + charge;
        const category = "deposit";
        const description = `deposit - ${gatewayName}`;
        const currency = "USD";
        const order = yield createOrder({ amount: netAmount, currency });
        const paypalId = order.id;
        const CLIENT_ID = PaypalConfig.CLIENT_ID;
        const tRowData = {
            transactionId,
            userId,
            amount: netAmount,
            charge,
            netAmount: amount,
            category,
            status,
            description,
            createdAt: (0, fns_1.currentDateTime)(),
            updatedAt: (0, fns_1.currentDateTime)(),
        };
        const rowData = {
            transactionId,
            userId,
            amount: netAmount,
            charge,
            netAmount: amount,
            currency,
            gatewayName,
            gatewayId,
            status,
            type,
            actionBy: "user",
            createdAt: (0, fns_1.currentDateTime)(),
            paypalId,
            logo,
        };
        const sql = `INSERT INTO ${tables_1.TRANSACTION_TBL} SET ?`;
        yield db_1.default.query(sql, tRowData);
        const dSql = `INSERT INTO ${tables_1.USER_DEPOSIT_TBL} SET ?`;
        yield db_1.default.query(dSql, rowData);
        yield conn.commit();
        res.json({ CLIENT_ID, order });
    }
    catch (error) {
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createPaypalTransaction = createPaypalTransaction;
const verifyPayPalTxn = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    conn.beginTransaction();
    try {
        const { orderId } = req.params;
        const captureData = yield capturePayment(orderId);
        (0, validate_1.default)(orderId, "Order Id").required();
        const isPaypalId = yield Deposit_1.default.isPaypalId(orderId);
        if (!isPaypalId)
            throw new Error(`No transaction details available for ${orderId}`);
        const transactionId = yield Deposit_1.default.getTransactionIdByPalpalId(orderId);
        const deposit = yield Deposit_1.default.createInstance(transactionId);
        const status = yield deposit.status();
        const { status: PAYPAL_STATUS } = captureData;
        if (status === "pending" && PAYPAL_STATUS === "COMPLETED") {
            const tUpdate = {
                status: "credit",
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const update = {
                status: "credit",
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const where = {
                transactionId,
                status: "pending",
            };
            const sql = `UPDATE ${tables_1.TRANSACTION_TBL} SET ? WHERE transactionId = ? AND status = ?`;
            yield db_1.default.query(sql, [tUpdate, ...Object.values(where)]);
            const dSql = `UPDATE ${tables_1.USER_DEPOSIT_TBL} SET ? WHERE transactionId = ? AND status = ?`;
            yield db_1.default.query(dSql, [update, ...Object.values(where)]);
        }
        yield conn.commit();
        return (0, errors_1.sendResponse)(res, "Transaction successful");
    }
    catch (error) {
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.verifyPayPalTxn = verifyPayPalTxn;
function createOrder({ amount, currency }) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = yield generateAccessToken();
        const url = `${base}/v2/checkout/orders`;
        const response = yield (0, cross_fetch_1.default)(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency,
                            value: amount,
                        },
                    },
                ],
            }),
        });
        return handleResponse(response);
    });
}
function capturePayment(orderId) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = yield generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderId}/capture`;
        const response = yield (0, cross_fetch_1.default)(url, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });
        return handleResponse(response);
    });
}
function generateAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const PaypalConfig = yield AutomaticDepositGateway_1.default.getPaypalConfig();
        const CLIENT_ID = PaypalConfig.CLIENT_ID;
        const APP_SECRET = PaypalConfig.CLIENT_SECRET;
        const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64");
        const response = yield (0, cross_fetch_1.default)(`${base}/v1/oauth2/token`, {
            method: "post",
            body: "grant_type=client_credentials",
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        const jsonData = yield handleResponse(response);
        return jsonData.access_token;
    });
}
function handleResponse(response) {
    return __awaiter(this, void 0, void 0, function* () {
        if (response.status === 200 || response.status === 201) {
            return response.json();
        }
        const errorMessage = yield response.text();
        throw new Error(errorMessage);
    });
}
