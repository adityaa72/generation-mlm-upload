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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withdrawHistory = exports.withdrawPayment = exports.deleteUserWithdrawGateway = exports.createUserWithdrawGateway = exports.getWithdrawGatewayData = exports.getUserWithdrawGatewaysList = exports.getWithdrawGatewaysList = exports.getWithdrawTransactionData = void 0;
const db_1 = __importDefault(require("../../db"));
const Email_1 = __importDefault(require("../../libs/Email"));
const Setting_1 = __importDefault(require("../../libs/Setting"));
const Transaction_1 = __importDefault(require("../../libs/Transaction"));
const User_1 = __importDefault(require("../../libs/User"));
const UserWithdrawGateway_1 = __importDefault(require("../../libs/UserWithdrawGateway"));
const Withdraw_1 = __importDefault(require("../../libs/Withdraw"));
const WithdrawGateway_1 = __importDefault(require("../../libs/WithdrawGateway"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const format_1 = require("../../utils/format");
const validate_1 = __importStar(require("../../utils/validate"));
const errors_1 = require("./../../errors");
const getWithdrawTransactionData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const { id: transactionId } = req.params;
        (0, validate_1.default)(transactionId, "Transaction Id").required().string();
        const withdraw = yield Withdraw_1.default.createInstance(transactionId, "Withdraw doesn't exist");
        const transactionUserId = yield withdraw.userId();
        if (transactionUserId !== userId)
            throw new errors_1.AuthError();
        const data = yield withdraw.getRow();
        data.details = (0, fns_1.jsonToArray)(data.details);
        data.chargeData = (0, fns_1.jsonToArray)(data.chargeData);
        return res.json(data);
    }
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.getWithdrawTransactionData = getWithdrawTransactionData;
const getWithdrawGatewaysList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT gatewayId, name, logo, processingTime, minWithdraw, maxWithdraw, charge, chargeType FROM ${tables_1.WITHDRAW_GATEWAY_TBL} WHERE status = ?  `;
        const [rows] = yield db_1.default.execute(sql, ["active"]);
        return res.json(rows);
    }
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.getWithdrawGatewaysList = getWithdrawGatewaysList;
const getUserWithdrawGatewaysList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var e_1, _a;
    try {
        const { userId } = req.locals;
        const sql = `SELECT gatewayId FROM ${tables_1.USER_WITHDRAW_GATEWAY_TBL} WHERE userId = ? `;
        const [rows] = yield db_1.default.execute(sql, [userId]);
        let data = [];
        try {
            for (var rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), !rows_1_1.done;) {
                const { gatewayId } = rows_1_1.value;
                const sql = `SELECT gatewayId,name, logo, processingTime, minWithdraw, maxWithdraw, charge, chargeType FROM ${tables_1.WITHDRAW_GATEWAY_TBL} WHERE ${tables_1.WITHDRAW_GATEWAY_TBL}.gatewayId = ${gatewayId} AND  status = ? `;
                const [row] = yield db_1.default.execute(sql, ["active"]);
                row.length && data.push(row[0]);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) yield _a.call(rows_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return res.json(data);
    }
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.getUserWithdrawGatewaysList = getUserWithdrawGatewaysList;
const getWithdrawGatewayData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req.locals;
        (0, validate_1.default)(id, "Gateway").required().number();
        const gatewayId = Number(id);
        const gateway = yield WithdrawGateway_1.default.createInstance(gatewayId, "Withdraw Gateway doesn't exist");
        const gatewayName = yield gateway.name();
        const row = yield gateway.getRow();
        row.details = JSON.parse(row.details);
        let userData = {};
        let isUpdated;
        const isUserWithdrawGateway = yield UserWithdrawGateway_1.default.isGatewayId(userId, gatewayId);
        if (isUserWithdrawGateway) {
            const userGateway = yield UserWithdrawGateway_1.default.createInstance(userId, gatewayId);
            userData = yield userGateway.parsedDetails();
            isUpdated = yield userGateway.isUpdated();
        }
        const user = yield User_1.default.createInstance(userId);
        const userWallet = yield user.wallet();
        return res.json({ data: row, userData, gatewayName, userWallet, isUpdated });
    }
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.getWithdrawGatewayData = getWithdrawGatewayData;
const createUserWithdrawGateway = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userId } = req.locals;
        const reqBody = req.body;
        const gatewayId = Number(id);
        const gateway = yield WithdrawGateway_1.default.createInstance(gatewayId, "Withdraw Gateway doesn't exist");
        const details = yield gateway.parsedDetails();
        const requiredNames = details.map(({ name }) => name);
        const requestedNames = Object.keys(reqBody);
        const isAllNames = requiredNames.every((key) => requestedNames.includes(key));
        if (!isAllNames)
            throw new errors_1.ClientError("Missing required arguments");
        const isUserWithdrawGateway = yield UserWithdrawGateway_1.default.isGatewayId(userId, gatewayId);
        let message;
        const withdrawGatewayName = yield gateway.name();
        const withdrawDetails = JSON.stringify(reqBody);
        if (isUserWithdrawGateway) {
            const update = {
                details: withdrawDetails,
            };
            const where = {
                gatewayId,
                userId,
            };
            const sql = `UPDATE ${tables_1.USER_WITHDRAW_GATEWAY_TBL} SET ? WHERE gatewayId = ? AND userId = ?`;
            yield db_1.default.query(sql, [update, ...Object.values(where)]);
            message = `${withdrawGatewayName} Withdraw Gateway has been updated`;
        }
        else {
            const rowData = {
                userId,
                gatewayId,
                details: withdrawDetails,
                createdAt: (0, fns_1.currentDateTime)(),
            };
            const sql = `INSERT INTO ${tables_1.USER_WITHDRAW_GATEWAY_TBL} SET ?`;
            yield db_1.default.query(sql, [rowData]);
            message = `${withdrawGatewayName} Withdraw Gateway has been added`;
        }
        return (0, errors_1.sendResponse)(res, message);
    }
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.createUserWithdrawGateway = createUserWithdrawGateway;
const deleteUserWithdrawGateway = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        (0, validate_1.default)(id, "Gateway Id").required().string();
        const { userId } = req.locals;
        const gatewayId = Number(id);
        const gateway = yield WithdrawGateway_1.default.createInstance(gatewayId);
        const gatewayName = yield gateway.name();
        const isUserWithdrawGateway = yield UserWithdrawGateway_1.default.isGatewayId(userId, gatewayId);
        if (isUserWithdrawGateway) {
            const where = {
                userId,
                gatewayId,
            };
            const sql = `DELETE FROM ${tables_1.USER_WITHDRAW_GATEWAY_TBL} WHERE userId = ? AND gatewayId = ?`;
            yield db_1.default.execute(sql, Object.values(where));
        }
        return (0, errors_1.sendResponse)(res, `${gatewayName} Withdraw Gateway has been deleted`);
    }
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.deleteUserWithdrawGateway = deleteUserWithdrawGateway;
const withdrawPayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    conn.beginTransaction();
    try {
        const { id } = req.params;
        (0, validate_1.default)(id, "Gateway Id").required().string();
        const gatewayId = Number(id);
        const { userId } = req.locals;
        const reqBody = req.body;
        yield Setting_1.default.validateWithdraw(userId);
        (0, validate_1.default)(reqBody, "body").object();
        const { amount: amountString } = reqBody;
        (0, validate_1.default)(amountString, "Amount").required().number();
        const amount = Number(amountString);
        const gateway = yield WithdrawGateway_1.default.createInstance(gatewayId, "Withdraw Gateway doesn't exist");
        const gatewayName = yield gateway.name();
        const userGateway = yield UserWithdrawGateway_1.default.createInstance(userId, gatewayId, "You have not details");
        const minWithdraw = yield gateway.minWithdraw();
        const maxWithdraw = yield gateway.maxWithdraw();
        (0, validate_1.default)(amount, "Amount")
            .number()
            .min(minWithdraw, `Minimum withdraw amount is ${yield (0, format_1.fCurrency)(minWithdraw)}`)
            .max(maxWithdraw, `Maximum withdraw amount is ${yield (0, format_1.fCurrency)(maxWithdraw)}`);
        const user = yield User_1.default.createInstance(userId);
        const userWallet = yield user.wallet();
        if (amount > userWallet)
            throw new errors_1.ClientError(`Insufficient amount to withdraw`);
        const category = "withdraw";
        const description = `withdraw - ${gatewayName} `;
        const charge = yield gateway.getCharge(amount);
        const netAmount = amount - charge;
        const parsedDetails = yield userGateway.parsedDetails();
        const details = yield gateway.parsedDetails();
        if (netAmount < 1)
            throw new errors_1.ClientError(`Final Amount must be greater than ${yield (0, format_1.fCurrency)(0)}`);
        const detailsArray = details.map(({ label, name, inputType }) => {
            //@ts-ignore
            return { label, name, inputType, value: parsedDetails[name] };
        });
        const withdrawDetails = JSON.stringify(detailsArray);
        const transactionId = Transaction_1.default.generateTransactionId();
        //get charge data
        const gatewayCharge = yield gateway.charge();
        const gatewayChargeType = yield gateway.chargeType();
        const chargeData = JSON.stringify({ charge: gatewayCharge, type: gatewayChargeType });
        // Insert into transaction table
        const txnData = {
            transactionId,
            userId,
            amount,
            charge,
            netAmount,
            category,
            status: "pending",
            description,
            createdAt: (0, fns_1.currentDateTime)(),
            updatedAt: (0, fns_1.currentDateTime)(),
        };
        const sql = `INSERT INTO ${tables_1.TRANSACTION_TBL} SET ?`;
        yield db_1.default.query(sql, [txnData]);
        // Insert into withdraw table
        const logo = yield gateway.logo();
        const withdrawData = {
            transactionId,
            userId,
            gatewayId,
            gatewayName,
            amount,
            charge,
            netAmount,
            details: withdrawDetails,
            status: "pending",
            actionBy: "user",
            chargeData,
            logo,
            createdAt: (0, fns_1.currentDateTime)(),
        };
        const sqlW = `INSERT INTO ${tables_1.USER_WITHDRAW_TBL} SET ?`;
        yield db_1.default.query(sqlW, [withdrawData]);
        yield conn.commit();
        yield Email_1.default.sendWithdrawMail(userId, transactionId);
        const amountText = yield (0, format_1.fCurrency)(amount);
        return (0, errors_1.sendResponse)(res, `Withdraw of ${amountText} through ${gatewayName} is in pending`);
    }
    catch (err) {
        yield conn.rollback();
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.withdrawPayment = withdrawPayment;
const withdrawHistory = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const columns = [
            "transactionId",
            "userId",
            "gateway",
            "amount",
            "charge",
            "netAmount",
            "createdAt",
            "updatedAt",
            "status",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT id,transactionId,userId,gatewayId,gatewayName as gateway,amount,charge, netAmount, createdAt,updatedAt,status,logo FROM ${tables_1.USER_WITHDRAW_TBL} HAVING userId = ?  `;
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
exports.withdrawHistory = withdrawHistory;
