"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.depositHistory = exports.createManualDepositPayment = exports.getManualDepositGatewayList = exports.getInstantDepositGatewaysList = exports.getDepositDetails = void 0;
const db_1 = __importDefault(require("../../db"));
const AutomaticDepositGateway_1 = __importDefault(require("../../libs/AutomaticDepositGateway"));
const Deposit_1 = __importDefault(require("../../libs/Deposit"));
const Email_1 = __importDefault(require("../../libs/Email"));
const ManualDepositGateway_1 = __importDefault(require("../../libs/ManualDepositGateway"));
const Transaction_1 = __importDefault(require("../../libs/Transaction"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const format_1 = require("../../utils/format");
const validate_1 = __importStar(require("../../utils/validate"));
const errors_1 = require("./../../errors");
const format_2 = require("./../../utils/format");
const getDepositDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const { id: transactionId } = req.params;
        (0, validate_1.default)(transactionId, "Transaction Id").required();
        const deposit = yield Deposit_1.default.createInstance(transactionId);
        const depositUserId = yield deposit.userId();
        if (userId !== depositUserId)
            throw new errors_1.AuthError();
        const row = yield deposit.parsedRow();
        return res.json(row);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getDepositDetails = getDepositDetails;
const getInstantDepositGatewaysList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield AutomaticDepositGateway_1.default.getAllActiveRows();
        return res.json(rows);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getInstantDepositGatewaysList = getInstantDepositGatewaysList;
const getManualDepositGatewayList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rows = yield ManualDepositGateway_1.default.getAllActiveRows();
        return res.json(rows);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getManualDepositGatewayList = getManualDepositGatewayList;
const createManualDepositPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const { userId } = req.locals;
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { id } = req.params;
        (0, validate_1.default)(id, "Gateway Id").required().string();
        const gatewayId = Number(id);
        const { amount: amountTxt, transactionId: userTransactionId, paymentImage, transactionDate, } = reqBody;
        (0, validate_1.default)([amountTxt, userTransactionId, paymentImage, transactionDate], "body").args();
        const amount = Number(amountTxt);
        (0, validate_1.default)(amount, "Amount").required().number();
        (0, validate_1.default)(userTransactionId, "Transaction Id").required().string();
        (0, validate_1.default)(paymentImage, "Payment Image").required().string().url();
        (0, validate_1.default)(transactionDate, "Transaction Date").required().string();
        const gateway = yield ManualDepositGateway_1.default.createInstance(gatewayId);
        yield gateway.checkStatus();
        const logo = yield gateway.logo();
        const gatewayName = yield gateway.name();
        const charge = yield gateway.getCharge(amount);
        const minDeposit = yield gateway.minDeposit();
        const maxDeposit = yield gateway.maxDeposit();
        const netAmount = amount + charge;
        const currency = "INR";
        const status = "review";
        const type = "manual";
        const adminDetails = yield gateway.parseDetails();
        const userDetails = {
            amount,
            userTransactionId,
            paymentImage,
            transactionDate,
        };
        const details = JSON.stringify({
            adminDetails,
            userDetails,
        });
        (0, validate_1.default)(amount, "Amount").number().min(minDeposit).max(maxDeposit);
        const transactionId = Transaction_1.default.generateTransactionId();
        const rowData = {
            transactionId,
            userId,
            amount: netAmount,
            charge,
            netAmount: amount,
            currency,
            gatewayName,
            gatewayId,
            details,
            status,
            type,
            actionBy: "user",
            createdAt: (0, fns_1.currentDateTime)(),
            logo,
        };
        const description = `deposit - ${gatewayName}`;
        const category = "deposit";
        const tRowData = {
            transactionId,
            userId,
            amount: netAmount,
            charge,
            netAmount: amount,
            category,
            status: "pending",
            description,
            createdAt: (0, fns_1.currentDateTime)(),
            updatedAt: (0, fns_1.currentDateTime)(),
        };
        const sql = `INSERT INTO ${tables_1.USER_DEPOSIT_TBL} SET ? `;
        yield db_1.default.query(sql, [rowData]);
        const tSql = `INSERT INTO ${tables_1.TRANSACTION_TBL}  SET ? `;
        yield db_1.default.query(tSql, [tRowData]);
        yield conn.commit();
        yield Email_1.default.sendDepositMail(userId, transactionId);
        const amountText = yield (0, format_2.fCurrency)(amount);
        return (0, errors_1.sendResponse)(res, `Deposit of ${amountText} is in review`);
    }
    catch (error) {
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createManualDepositPayment = createManualDepositPayment;
const depositHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const columns = [
            "transactionId",
            "userId",
            "gateway",
            "charge",
            "netAmount",
            "amount",
            "createdAt",
            "updatedAt",
            "status",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT id,transactionId,userId,gatewayName as gateway,gatewayId, amount, charge, netAmount,createdAt,updatedAt,status,type,logo FROM ${tables_1.USER_DEPOSIT_TBL} HAVING userId = ?  `;
        let sqlParams = [userId];
        if (searchFilter) {
            sql += ` AND (${(0, format_1.createSearchQuery)(columns)})`;
            sqlParams = [
                ...sqlParams,
                ...Array(columns.length)
                    .fill(null)
                    .map(() => `%${searchFilter}%`),
            ];
        }
        const filterSql = (0, format_1.formatFilterSql)(filterModel);
        if (filterSql) {
            const { sqlQuery, sqlValues } = filterSql;
            if (sqlQuery) {
                sql += ` AND ${sqlQuery}`;
                sqlParams = [...sqlParams, ...sqlValues];
            }
        }
        const [totalRows] = yield db_1.default.execute(sql, sqlParams);
        const rowCount = totalRows.length;
        const sortSql = (0, format_1.formatSortModel)(sortModel);
        if (sortSql)
            sql += ` ${sortSql}`;
        sql += ` LIMIT ${pageSize} OFFSET ${Number(pageIndex) * pageSize}`;
        const [rows] = yield db_1.default.execute(sql, sqlParams);
        return res.json({ rowCount, rows });
    }
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.depositHistory = depositHistory;
