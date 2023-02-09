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
exports.cancelRazorpayPayment = exports.failRazorpayPayment = exports.verifyRazorPayPayment = exports.createRazorpayTransaction = void 0;
const crypto_1 = __importDefault(require("crypto"));
const razorpay_1 = __importDefault(require("razorpay"));
const config_1 = require("../../../config");
const db_1 = __importDefault(require("../../../db"));
const errors_1 = require("../../../errors");
const AutomaticDepositGateway_1 = __importDefault(require("../../../libs/AutomaticDepositGateway"));
const Deposit_1 = __importDefault(require("../../../libs/Deposit"));
const Transaction_1 = __importDefault(require("../../../libs/Transaction"));
const User_1 = __importDefault(require("../../../libs/User"));
const tables_1 = require("../../../tables");
const fns_1 = require("../../../utils/fns");
const validate_1 = __importDefault(require("../../../utils/validate"));
const createRazorpayTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const gatewayId = "Razorpay";
        const gateway = yield AutomaticDepositGateway_1.default.createInstance(gatewayId);
        const gatewayName = yield gateway.name();
        const charge = yield gateway.getCharge(amount);
        yield gateway.checkStatus();
        const logo = yield gateway.logo();
        const transactionId = Transaction_1.default.generateTransactionId();
        const status = "pending";
        const type = "automatic";
        const netAmount = amount + charge;
        const category = "deposit";
        const description = `deposit - ${gatewayName}`;
        const currency = "INR";
        const user = yield User_1.default.createInstance(userId);
        const userName = yield user.userName();
        const email = yield user.email();
        const mobileNumber = yield user.mobileNumber();
        const RazorpayConfig = yield AutomaticDepositGateway_1.default.getRazorpayConfig();
        const instance = new razorpay_1.default({
            key_id: RazorpayConfig.PUBLIC_KEY,
            key_secret: RazorpayConfig.SECRET_KEY,
        });
        const options = {
            amount: netAmount * 100,
            currency,
        };
        const orderDetails = yield instance.orders.create(options);
        const { id: razorpayId, amount: amountNew } = orderDetails;
        const order = {
            key: RazorpayConfig.PUBLIC_KEY,
            amount: amountNew,
            currency: currency,
            name: config_1.WEB_NAME,
            description: "Deposit",
            order_id: razorpayId,
            retry: false,
            prefill: {
                name: userName,
                email,
                contact: mobileNumber,
            },
            theme: {
                color: RazorpayConfig.THEME,
            },
        };
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
            razorpayId,
            logo,
        };
        const sql = `INSERT INTO ${tables_1.TRANSACTION_TBL} SET ?`;
        yield db_1.default.query(sql, tRowData);
        const dSql = `INSERT INTO ${tables_1.USER_DEPOSIT_TBL} SET ?`;
        yield db_1.default.query(dSql, rowData);
        yield conn.commit();
        return res.json(order);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createRazorpayTransaction = createRazorpayTransaction;
const verifyRazorPayPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = reqBody;
        (0, validate_1.default)([razorpay_payment_id, razorpay_order_id, razorpay_signature], "body").args();
        (0, validate_1.default)(razorpay_payment_id, "Razorpay Payment Id").required().string();
        (0, validate_1.default)(razorpay_order_id, "Razorpay Order Id").required().string();
        (0, validate_1.default)(razorpay_signature, "Razorpay Signature").required().string();
        const RazorpayConfig = yield AutomaticDepositGateway_1.default.getRazorpayConfig();
        const hashString = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto_1.default
            .createHmac("sha256", RazorpayConfig.SECRET_KEY)
            .update(hashString.toString())
            .digest("hex");
        if (expectedSignature !== razorpay_signature)
            throw new errors_1.ClientError("Payment failed");
        const orderId = razorpay_order_id;
        const isRazorpayId = yield Deposit_1.default.isRazorpayId(orderId);
        if (!isRazorpayId)
            throw new Error(`No transaction details available for ${orderId}`);
        const transactionId = yield Deposit_1.default.getTransactionIdByRazorpayId(orderId);
        const deposit = yield Deposit_1.default.createInstance(transactionId);
        const status = yield deposit.status();
        const details = JSON.stringify({ razorpay_payment_id, razorpay_order_id, razorpay_signature });
        if (status === "pending") {
            const tUpdate = {
                status: "credit",
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const update = {
                details,
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
        return (0, errors_1.sendResponse)(res, "Payment Successful");
    }
    catch (err) {
        console.log("🚀 ~ file: razorpay.ts:164 ~ verifyRazorPayPayment ~ err", err);
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.verifyRazorPayPayment = verifyRazorPayPayment;
const failRazorpayPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { order_id: orderId, payment_id } = (_a = reqBody === null || reqBody === void 0 ? void 0 : reqBody.error) === null || _a === void 0 ? void 0 : _a.metadata;
        (0, validate_1.default)([orderId, payment_id], "body").args();
        const isRazorpayId = yield Deposit_1.default.isRazorpayId(orderId);
        if (!isRazorpayId)
            throw new Error(`No transaction details available for ${orderId}`);
        const transactionId = yield Deposit_1.default.getTransactionIdByRazorpayId(orderId);
        const deposit = yield Deposit_1.default.createInstance(transactionId);
        const status = yield deposit.status();
        if (status === "pending") {
            const tUpdate = {
                status: "failed",
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const update = {
                status: "failed",
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
        return (0, errors_1.sendResponse)(res, "Payment failed");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.failRazorpayPayment = failRazorpayPayment;
// todo
const cancelRazorpayPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { orderId } = req.params;
        const isRazorpayId = yield Deposit_1.default.isRazorpayId(orderId);
        if (!isRazorpayId)
            throw new Error(`No transaction details available for ${orderId}`);
        const transactionId = yield Deposit_1.default.getTransactionIdByRazorpayId(orderId);
        const deposit = yield Deposit_1.default.createInstance(transactionId);
        const status = yield deposit.status();
        if (status === "pending") {
            const sql = `UPDATE ${tables_1.TRANSACTION_TBL} SET status = ? WHERE transactionId = ? AND status = ?`;
            yield db_1.default.execute(sql, ["failed", transactionId, "pending"]);
            const dSql = `UPDATE ${tables_1.USER_DEPOSIT_TBL} SET status = ? WHERE transactionId = ? AND status = ?`;
            yield db_1.default.execute(dSql, ["failed", transactionId, "pending"]);
        }
        return (0, errors_1.sendResponse)(res, "Payment cancelled");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.cancelRazorpayPayment = cancelRazorpayPayment;
