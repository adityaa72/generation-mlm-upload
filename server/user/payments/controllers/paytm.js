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
exports.verifyPaytmTransaction = exports.createPaytmTransaction = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const config_1 = require("../../../config");
const db_1 = __importDefault(require("../../../db"));
const AutomaticDepositGateway_1 = __importDefault(require("../../../libs/AutomaticDepositGateway"));
const Deposit_1 = __importDefault(require("../../../libs/Deposit"));
const Transaction_1 = __importDefault(require("../../../libs/Transaction"));
const tables_1 = require("../../../tables");
const fns_1 = require("../../../utils/fns");
const validate_1 = __importDefault(require("../../../utils/validate"));
const PaytmChecksum_1 = __importDefault(require("../Paytm/PaytmChecksum"));
const paytmConfig_1 = __importDefault(require("../Paytm/paytmConfig"));
const service_1 = require("../Paytm/service");
const createPaytmTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const gatewayId = "Paytm";
        const gateway = yield AutomaticDepositGateway_1.default.createInstance(gatewayId);
        const gatewayName = yield gateway.name();
        const gatewayInsertId = yield gateway.id();
        const charge = yield gateway.getCharge(amount);
        yield gateway.checkStatus();
        const logo = yield gateway.logo();
        const transactionId = Transaction_1.default.generateTransactionId();
        const customerId = userId;
        const status = "pending";
        const type = "automatic";
        const netAmount = amount + charge;
        const category = "deposit";
        const description = `deposit - ${gatewayName}`;
        const currency = "INR";
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
        const amountToString = netAmount.toString();
        const data = yield (0, service_1.initializePayment)(amountToString, transactionId, customerId);
        yield conn.commit();
        return res.json(data);
    }
    catch (err) {
        yield conn.rollback();
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.createPaytmTransaction = createPaytmTransaction;
const verifyPaytmTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const redirectUrl = config_1.DEPOSIT_SUCCESS_URL;
    const conn = yield db_1.default.conn();
    conn.beginTransaction();
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { ORDERID, MID, TXNID, TXNAMOUNT, CURRENCY, STATUS } = reqBody;
        if (MID !== paytmConfig_1.default.MID)
            throw new Error("MID is not matching");
        (0, validate_1.default)([ORDERID, MID, TXNID, TXNAMOUNT, CURRENCY, STATUS], "body").args();
        const isValid = yield (0, service_1.validatePaytmPayment)(reqBody);
        if (!isValid)
            throw new Error("Payment failed invalid details");
        const transactionId = ORDERID;
        const deposit = yield Deposit_1.default.createInstance(transactionId, "No transaction record available");
        const dbStatus = yield deposit.status();
        const dbCurrency = yield deposit.currency();
        const payableAmount = yield deposit.amount();
        const verifiedStatus = yield verifyPaytmTxnStatus(reqBody);
        console.log("🚀 ~ file: paytm.ts:117 ~ verifyPaytmTransaction ~ verifiedStatus", verifiedStatus);
        console.log("🚀 ~ file: paytm.ts:119 ~ verifyPaytmTransaction ~ STATUS", STATUS);
        if (STATUS !== verifiedStatus)
            throw new Error("Status not matching plz try again letter");
        if (dbCurrency.toLowerCase() !== CURRENCY.toLowerCase())
            throw new Error("Payment failed invalid currency");
        if (Number(payableAmount) !== Number(TXNAMOUNT))
            throw new Error("Transaction amount not matching");
        if (dbStatus === "pending") {
            if (STATUS === "TXN_SUCCESS") {
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
                const dSql = `UPDATE ${tables_1.USER_DEPOSIT_TBL} SET  ? WHERE transactionId = ? AND status = ?`;
                yield db_1.default.query(dSql, [update, ...Object.values(where)]);
            }
        }
        return res.redirect(redirectUrl);
    }
    catch (error) {
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.verifyPaytmTransaction = verifyPaytmTransaction;
const verifyPaytmTxnStatus = function (paytmResponse) {
    return __awaiter(this, void 0, void 0, function* () {
        const paytmParams = {};
        paytmParams.body = {
            mid: paytmConfig_1.default.MID,
            orderId: paytmResponse.ORDERID,
        };
        const checksum = yield PaytmChecksum_1.default.generateSignature(JSON.stringify(paytmParams.body), paytmConfig_1.default.MERCHANT_KEY);
        paytmParams.head = {
            signature: checksum,
        };
        const postData = JSON.stringify(paytmParams);
        const res = yield (0, cross_fetch_1.default)(paytmConfig_1.default.VERIFY_STATUS_URL, {
            method: "POST",
            body: postData,
            headers: {
                "Content-Type": "application/json",
            },
        });
        if (res.status >= 400) {
            throw new Error("Invalid transaction");
        }
        const resText = yield res.json();
        const { mid, txnAmount } = resText.body;
        const { resultStatus } = resText.body.resultInfo;
        return resultStatus;
    });
};
