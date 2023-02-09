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
exports.failPayUTransaction = exports.verifyPayuTransaction = exports.createPayuTransaction = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const form_data_1 = __importDefault(require("form-data"));
const is_empty_1 = __importDefault(require("is-empty"));
const jssha_1 = __importDefault(require("jssha"));
//@ts-ignore
const php_unserialize_1 = __importDefault(require("php-unserialize"));
const config_1 = require("../../../config");
const db_1 = __importDefault(require("../../../db"));
const errors_1 = require("../../../errors");
const AutomaticDepositGateway_1 = __importDefault(require("../../../libs/AutomaticDepositGateway"));
const Deposit_1 = __importDefault(require("../../../libs/Deposit"));
const Transaction_1 = __importDefault(require("../../../libs/Transaction"));
const User_1 = __importDefault(require("../../../libs/User"));
const tables_1 = require("../../../tables");
const fns_1 = require("../../../utils/fns");
const format_1 = require("../../../utils/format");
const validate_1 = __importDefault(require("../../../utils/validate"));
const createPayuTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const PayuConfig = yield AutomaticDepositGateway_1.default.getPayuConfig();
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
        const gatewayId = "Payu";
        const gateway = yield AutomaticDepositGateway_1.default.createInstance(gatewayId);
        const gatewayName = yield gateway.name();
        const charge = yield gateway.getCharge(amount);
        yield gateway.checkStatus();
        const transactionId = Transaction_1.default.generateTransactionId();
        const status = "pending";
        const type = "automatic";
        const netAmount = amount + charge;
        const category = "deposit";
        const description = `deposit - ${gatewayName}`;
        const currency = "INR";
        const productInfo = "code";
        const user = yield User_1.default.createInstance(userId);
        const firstName = yield user.firstName();
        const lastName = yield user.lastName();
        const email = yield user.email();
        const phone = yield user.mobileNumber();
        const PAY_KEY = PayuConfig.KEY;
        const PAY_SALT = PayuConfig.SALT;
        const hashString = `${PAY_KEY}|${transactionId}|${netAmount}|${productInfo}|${firstName}|${email}|||||||||||${PAY_SALT}`;
        const sha = new jssha_1.default("SHA-512", "TEXT");
        sha.update(hashString);
        const hash = sha.getHash("HEX");
        const furl = (0, format_1.formatUrl)("/verify-payment/payu/failed");
        const surl = (0, format_1.formatUrl)("/verify-payment/payu/success");
        const logo = yield gateway.logo();
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
            logo,
        };
        const sql = `INSERT INTO ${tables_1.TRANSACTION_TBL} SET ?`;
        yield db_1.default.query(sql, tRowData);
        const dSql = `INSERT INTO ${tables_1.USER_DEPOSIT_TBL} SET ?`;
        yield db_1.default.query(dSql, rowData);
        yield conn.commit();
        res.json({
            url: "https://test.payu.in/_payment",
            key: PAY_KEY,
            txnid: transactionId,
            productinfo: productInfo,
            amount: netAmount,
            email,
            firstname: firstName,
            lastname: lastName,
            phone: "9771701893",
            hash,
            furl,
            surl,
        });
    }
    catch (error) {
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createPayuTransaction = createPayuTransaction;
const verifyPayuTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const PayuConfig = yield AutomaticDepositGateway_1.default.getPayuConfig();
    const redirectUrl = config_1.DEPOSIT_SUCCESS_URL;
    const conn = yield db_1.default.conn();
    conn.beginTransaction();
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { mihpayid, status, email, firstname, productinfo, amount, txnid, key, hash: reqHash, } = reqBody;
        (0, validate_1.default)([mihpayid, status, email, firstname, productinfo, amount, txnid, key, reqHash], "body").args();
        const PAY_SALT = PayuConfig.SALT;
        const PAY_KEY = PayuConfig.KEY;
        if (key !== PAY_KEY)
            throw new Error("Keys are not matching");
        const transactionId = txnid;
        const deposit = yield Deposit_1.default.createInstance(transactionId, "No transaction record available");
        const dbStatus = yield deposit.status();
        const payableAmount = yield deposit.amount();
        const payuAmount = Number(amount);
        if (payuAmount !== payableAmount) {
            throw new errors_1.ClientError("Transaction amount not matching");
        }
        if (dbStatus === "pending") {
            const hashString = `${PAY_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAY_KEY}`;
            const sha = new jssha_1.default("SHA-512", "TEXT");
            sha.update(hashString);
            const hash = sha.getHash("HEX");
            if (reqHash !== hash)
                throw new Error("Hashing not matching");
            const payUResponseSerialized = yield verifyFromPayuServer(txnid);
            // @ts-ignore
            const payUResponse = php_unserialize_1.default.unserialize(payUResponseSerialized);
            if ((0, is_empty_1.default)(payUResponse))
                throw new Error("Payment Failed");
            if (!(payUResponse === null || payUResponse === void 0 ? void 0 : payUResponse.transaction_details)) {
                throw new Error("Missing required transaction details");
            }
            if (status === "success") {
                const { transaction_amount, net_amount_debit, status } = (_a = payUResponse.transaction_details) === null || _a === void 0 ? void 0 : _a[transactionId];
                const payuAmount = Number(transaction_amount);
                const amountDebit = Number(net_amount_debit);
                if (payuAmount !== payableAmount) {
                    throw new errors_1.ClientError("Transaction amount not matching");
                }
                if (amountDebit !== payableAmount) {
                    throw new errors_1.ClientError("Transaction amount not matching");
                }
                if (status !== "success")
                    throw new Error("Invalid status");
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
            else {
                const update = {
                    status: "failed",
                    updatedAt: (0, fns_1.currentDateTime)(),
                };
                const tUpdate = {
                    status: "failed",
                    updatedAt: (0, fns_1.currentDateTime)(),
                };
                const where = {
                    transactionId,
                    status: "pending",
                };
                const sql = `UPDATE ${tables_1.TRANSACTION_TBL} SET ? WHERE transactionId = ? AND status = ?`;
                yield db_1.default.query(sql, [tUpdate, ...Object.values(where)]);
                const dSql = `UPDATE ${tables_1.USER_DEPOSIT_TBL} SET  ? WHERE transactionId = ? AND status = ?`;
                yield db_1.default.query(dSql, [update, ...Object.values(where)]);
            }
        }
        yield conn.commit();
        return res.redirect(redirectUrl + "?message=" + status);
    }
    catch (error) {
        yield conn.rollback();
        return res.redirect(redirectUrl + "?message=" + (error === null || error === void 0 ? void 0 : error.message));
    }
    finally {
        db_1.default.release();
    }
});
exports.verifyPayuTransaction = verifyPayuTransaction;
const failPayUTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const PayuConfig = yield AutomaticDepositGateway_1.default.getPayuConfig();
    const redirectUrl = config_1.DEPOSIT_SUCCESS_URL;
    const conn = yield db_1.default.conn();
    conn.beginTransaction();
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { mihpayid, status, email, firstname, productinfo, amount, txnid, key, hash: reqHash, } = reqBody;
        (0, validate_1.default)([mihpayid, status, email, firstname, productinfo, amount, txnid, key, reqHash], "body").args();
        const PAY_SALT = PayuConfig.SALT;
        const PAY_KEY = PayuConfig.KEY;
        if (key !== PAY_KEY)
            throw new Error("Keys are not matching");
        const transactionId = txnid;
        const deposit = yield Deposit_1.default.createInstance(transactionId, "No transaction record available");
        const dbStatus = yield deposit.status();
        const payableAmount = yield deposit.amount();
        const payuAmount = Number(amount);
        if (payuAmount !== payableAmount) {
            throw new errors_1.ClientError("Transaction amount not matching");
        }
        if (dbStatus === "pending") {
            const hashString = `${PAY_SALT}|${status}|||||||||||${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAY_KEY}`;
            const sha = new jssha_1.default("SHA-512", "TEXT");
            sha.update(hashString);
            const hash = sha.getHash("HEX");
            if (reqHash !== hash)
                throw new Error("Hashing not matching");
            const payUResponseSerialized = yield verifyFromPayuServer(txnid);
            const payUResponse = php_unserialize_1.default.unserialize(payUResponseSerialized);
            if ((0, is_empty_1.default)(payUResponse))
                throw new Error("Payment Failed");
            if (!(payUResponse === null || payUResponse === void 0 ? void 0 : payUResponse.transaction_details)) {
                throw new Error("Missing required attributes");
            }
            if (status === "failure") {
                const { transaction_amount, status } = (_b = payUResponse.transaction_details) === null || _b === void 0 ? void 0 : _b[transactionId];
                const payuAmount = Number(transaction_amount);
                if (payuAmount !== payableAmount) {
                    throw new errors_1.ClientError("Transaction amount not matching");
                }
                if (status !== "failure")
                    throw new Error("Invalid status");
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
        }
        yield conn.commit();
        return res.redirect(redirectUrl + "?message=" + status);
    }
    catch (err) {
        console.log(err);
        yield conn.rollback();
        return res.redirect(redirectUrl + "?message=" + (err === null || err === void 0 ? void 0 : err.message));
    }
    finally {
        db_1.default.release();
    }
});
exports.failPayUTransaction = failPayUTransaction;
const verifyFromPayuServer = function (txnId) {
    return __awaiter(this, void 0, void 0, function* () {
        const PayuConfig = yield AutomaticDepositGateway_1.default.getPayuConfig();
        const PAY_KEY = PayuConfig.KEY;
        const PAY_SALT = PayuConfig.SALT;
        const command = "verify_payment";
        const hashString = `${PAY_KEY}|${command}|${txnId}|${PAY_SALT}`;
        const sha = new jssha_1.default("SHA-512", "TEXT");
        sha.update(hashString);
        const hash = sha.getHash("HEX");
        const form = new form_data_1.default();
        form.append("key", PAY_KEY);
        form.append("command", "verify_payment");
        form.append("var1", txnId);
        form.append("hash", hash);
        const res = yield (0, cross_fetch_1.default)("https://test.payu.in/merchant/postservice", {
            method: "POST",
            // @ts-ignore
            body: form,
        });
        return yield res.text();
    });
};
