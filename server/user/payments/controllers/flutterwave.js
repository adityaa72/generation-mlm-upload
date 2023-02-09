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
exports.verifyFlutterWavePayment = exports.createFlutterwaveTransaction = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const config_1 = require("../../../config");
const db_1 = __importDefault(require("../../../db"));
const errors_1 = require("../../../errors");
const AutomaticDepositGateway_1 = __importDefault(require("../../../libs/AutomaticDepositGateway"));
const Deposit_1 = __importDefault(require("../../../libs/Deposit"));
const Setting_1 = __importDefault(require("../../../libs/Setting"));
const Transaction_1 = __importDefault(require("../../../libs/Transaction"));
const User_1 = __importDefault(require("../../../libs/User"));
const tables_1 = require("../../../tables");
const fns_1 = require("../../../utils/fns");
const validate_1 = __importDefault(require("../../../utils/validate"));
const createFlutterwaveTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
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
        const gatewayId = "Flutterwave";
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
        const currency = "NGN";
        const user = yield User_1.default.createInstance(userId);
        const userName = yield user.userName();
        const email = yield user.email();
        const mobileNumber = yield user.mobileNumber();
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
        const FlutterWaveConfig = yield AutomaticDepositGateway_1.default.getFlutterwaveConfig();
        const setting = new Setting_1.default();
        const webLogo = yield setting.logo();
        const config = {
            public_key: FlutterWaveConfig.PUBLIC_KEY,
            tx_ref: transactionId,
            amount: netAmount,
            currency,
            payment_options: "card,mobilemoney,ussd",
            customer: {
                email,
                phone_number: mobileNumber,
                name: userName,
            },
            customizations: {
                title: config_1.WEB_NAME,
                description: "Deposit",
                logo: webLogo,
            },
        };
        yield conn.commit();
        return res.json(config);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createFlutterwaveTransaction = createFlutterwaveTransaction;
const verifyFlutterWavePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const FlutterWaveConfig = yield AutomaticDepositGateway_1.default.getFlutterwaveConfig();
        const { orderId } = req.params;
        const url = `https://api.flutterwave.com/v3/transactions/${orderId}/verify`;
        const flutterRes = yield (0, cross_fetch_1.default)(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: `${FlutterWaveConfig.SECRET_KEY}`,
            },
        });
        const { data: flutterResJson } = yield flutterRes.json();
        const { tx_ref: transactionId, currency, charged_amount, status } = flutterResJson;
        const deposit = yield Deposit_1.default.createInstance(transactionId, "No transaction record available");
        const dbStatus = yield deposit.status();
        const dbCurrency = yield deposit.currency();
        const netAmount = yield deposit.amount();
        if (dbCurrency.toLowerCase() !== currency.toLowerCase())
            throw new Error("Payment failed invalid currency");
        if (Number(netAmount) !== Number(charged_amount))
            throw new Error("Transaction amount not matching");
        if (dbStatus === "pending") {
            if (status === "successful") {
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
                const dSql = `UPDATE ${tables_1.USER_DEPOSIT_TBL} SET ? WHERE transactionId = ? AND status = ?`;
                yield db_1.default.query(dSql, [update, ...Object.values(where)]);
            }
        }
        return (0, errors_1.sendResponse)(res, "Payment successful");
    }
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.verifyFlutterWavePayment = verifyFlutterWavePayment;
