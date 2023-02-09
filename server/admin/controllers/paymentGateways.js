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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteInstantDepositGateway = exports.deleteManualDepositGateway = exports.getManualDepositGatewayDetails = exports.createManualDepositGateway = exports.updateManualDepositGatewayStatus = exports.getManualDepositGatewayList = exports.getAutomaticDepositGatewayDetails = exports.getAutomaticDepositGatewayList = exports.updateAutomaticDepositGatewayStatus = exports.createAutomaticDepositGateway = exports.getAutomaticDepositGatewayCreateList = exports.deleteWithdrawGateway = exports.getWithdrawDetails = exports.updateWithdrawStatus = exports.withdrawList = exports.createWithdrawGateway = void 0;
const crypto_1 = __importDefault(require("crypto"));
const db_1 = __importDefault(require("../../db"));
const AutomaticDepositGateway_1 = __importDefault(require("../../libs/AutomaticDepositGateway"));
const ManualDepositGateway_1 = __importStar(require("../../libs/ManualDepositGateway"));
const WithdrawGateway_1 = __importStar(require("../../libs/WithdrawGateway"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const validate_1 = __importDefault(require("../../utils/validate"));
const deposit_1 = require("../api/deposit");
const errors_1 = require("./../../errors");
// *Withdraw
const createWithdrawGateway = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { gatewayId, logo, name, processingTime, minWithdraw, maxWithdraw, charge, chargeType, status, details, } = reqBody;
        (0, validate_1.default)(logo, "Gateway Image").required().string().url();
        (0, validate_1.default)(name, "Gateway Name").required().string();
        (0, validate_1.default)(processingTime, "Processing Time").required().string();
        (0, validate_1.default)(minWithdraw, "Minimum Withdraw").required().number();
        (0, validate_1.default)(maxWithdraw, "Maximum Withdraw")
            .required()
            .number()
            .min(minWithdraw, "Maximum Withdraw should be greater than Minimum Withdraw");
        (0, validate_1.default)(charge, "Withdraw Charge").required().number();
        (0, validate_1.default)(chargeType, "Withdraw Charge Type")
            .required()
            .string()
            .oneOf(WithdrawGateway_1.WithdrawGatewayChargeEnum);
        (0, validate_1.default)(status, "Status").required().string().oneOf(WithdrawGateway_1.WithdrawGatewayStatusEnum);
        (0, validate_1.default)(details, "Payment Requirements").required().array();
        // @ts-ignore
        details.forEach((row) => {
            !!row.name || (row.name = crypto_1.default.randomBytes(6).toString("hex"));
        });
        const labels = JSON.stringify(details);
        const rowData = {
            name,
            logo,
            processingTime,
            status,
            details: labels,
            minWithdraw,
            maxWithdraw,
            charge,
            chargeType,
            createdAt: (0, fns_1.currentDateTime)(),
        };
        let message;
        if (gatewayId === 0) {
            const sql = `INSERT INTO ${tables_1.WITHDRAW_GATEWAY_TBL} SET ?`;
            yield db_1.default.query(sql, [rowData]);
            message = "Withdraw Gateway has been created";
        }
        else {
            const isGatewayId = yield WithdrawGateway_1.default.isGatewayId(Number(gatewayId));
            if (!isGatewayId)
                throw new errors_1.ClientError("Withdraw Gateway doesn't exist");
            const sql = `UPDATE ${tables_1.WITHDRAW_GATEWAY_TBL} SET ? WHERE gatewayId = ?`;
            yield db_1.default.query(sql, [rowData, gatewayId]);
            message = "Withdraw Gateway has been updated";
        }
        return (0, errors_1.sendResponse)(res, message);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createWithdrawGateway = createWithdrawGateway;
const withdrawList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let sql = `SELECT gatewayId as id, name, logo, processingTime, status, createdAt, minWithdraw, maxWithdraw, charge, chargeType FROM ${tables_1.WITHDRAW_GATEWAY_TBL} HAVING id IS NOT NULL `;
        const [totalRows] = yield db_1.default.query(sql);
        res.json(totalRows);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.withdrawList = withdrawList;
const updateWithdrawStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { id: gatewayId } = req.params;
        const { status } = reqBody;
        (0, validate_1.default)(status, "Status").required().string().oneOf(["active", "inactive"]);
        const isGatewayId = yield WithdrawGateway_1.default.isGatewayId(Number(gatewayId));
        if (!isGatewayId)
            throw new errors_1.ClientError("Withdraw Gateway doesn't exist");
        const updateStatus = status === "active" ? "inactive" : "active";
        const sql = `UPDATE ${tables_1.WITHDRAW_GATEWAY_TBL} SET status = ? WHERE gatewayId = ?`;
        yield db_1.default.execute(sql, [updateStatus, gatewayId]);
        return (0, errors_1.sendResponse)(res, "Status has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateWithdrawStatus = updateWithdrawStatus;
const getWithdrawDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { id: gatewayId } = req.params;
        const withdrawGateway = yield WithdrawGateway_1.default.createInstance(Number(gatewayId), "Withdraw Gateway doesn't exist");
        const row = yield withdrawGateway.getRow();
        row.details = JSON.parse(row.details);
        return res.json(row);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getWithdrawDetails = getWithdrawDetails;
const deleteWithdrawGateway = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: gatewayId } = req.params;
        const isGatewayId = yield WithdrawGateway_1.default.isGatewayId(Number(gatewayId));
        if (!isGatewayId)
            throw new errors_1.ClientError("Withdraw Gateway doesn't exist");
        const sql = `DELETE FROM ${tables_1.WITHDRAW_GATEWAY_TBL}  WHERE gatewayId = ?`;
        yield db_1.default.query(sql, [gatewayId]);
        return (0, errors_1.sendResponse)(res, "Gateway has been deleted");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.deleteWithdrawGateway = deleteWithdrawGateway;
// *Instant Deposit
const getAutomaticDepositGatewayCreateList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.json(deposit_1.PaymentMethods);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getAutomaticDepositGatewayCreateList = getAutomaticDepositGatewayCreateList;
const createAutomaticDepositGateway = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: clientGatewayId } = req.params;
        (0, validate_1.default)(clientGatewayId, "Payment Method").required().string().oneOf(deposit_1.InstantPaymentMethods);
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { charge, chargeType } = reqBody;
        (0, validate_1.default)(charge, "ChargeType").required().number();
        (0, validate_1.default)(chargeType, "ChargeType").required().string().oneOf(["fixed", "percent"]);
        const paymentMethods = deposit_1.PaymentMethods.filter(({ gatewayId }) => clientGatewayId === gatewayId);
        if (!paymentMethods.length)
            throw new errors_1.ClientError("Payment Method doesn't exits");
        const paymentMethod = paymentMethods[0];
        const paymentConfig = paymentMethod.config;
        const requiredKeys = paymentConfig.map(({ key }) => key);
        const labels = paymentConfig.map(({ label }) => label);
        const requestedKeys = Object.keys(reqBody);
        const isKeysSame = requiredKeys.every((item) => requestedKeys.includes(item));
        if (!isKeysSame)
            throw new errors_1.ClientError("Missing required details");
        const entries = Object.entries(reqBody);
        entries.forEach(([key, value], index) => {
            const label = labels[index];
            (0, validate_1.default)(value, label)
                .required()
                .string();
        });
        const { gatewayId, name, logo, image, config } = paymentMethod;
        const isGatewayId = yield AutomaticDepositGateway_1.default.isGatewayId(gatewayId);
        let message;
        if (isGatewayId) {
            const details = JSON.stringify(reqBody);
            const update = {
                details,
                chargeType,
                charge,
            };
            const where = {
                gatewayId,
            };
            const sql = `UPDATE ${tables_1.AUTOMATIC_DEPOSIT_GATEWAY_TBL} SET  ? WHERE gatewayId = ?`;
            yield db_1.default.query(sql, [update, ...Object.values(where)]);
            message = name + " Gateway has been updated";
        }
        else {
            const rowData = {
                gatewayId,
                name,
                logo,
                image,
                config: JSON.stringify(config),
                details: JSON.stringify(reqBody),
                status: "active",
                charge,
                chargeType,
                createdAt: (0, fns_1.currentDateTime)(),
            };
            const sql = `INSERT INTO ${tables_1.AUTOMATIC_DEPOSIT_GATEWAY_TBL} SET ?`;
            yield db_1.default.query(sql, [rowData]);
            message = name + " Gateway has been created";
        }
        return (0, errors_1.sendResponse)(res, message);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createAutomaticDepositGateway = createAutomaticDepositGateway;
const updateAutomaticDepositGatewayStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { id: gatewayId } = req.params;
        const { status } = reqBody;
        (0, validate_1.default)(status, "Status").required().string().oneOf(["active", "inactive"]);
        const isGatewayId = yield AutomaticDepositGateway_1.default.isGatewayId(gatewayId);
        if (!isGatewayId)
            throw new errors_1.ClientError("Deposit Gateway doesn't exist");
        const updateStatus = status === "active" ? "inactive" : "active";
        const update = {
            status: updateStatus,
        };
        const where = {
            gatewayId,
        };
        const sql = `UPDATE ${tables_1.AUTOMATIC_DEPOSIT_GATEWAY_TBL} SET ? WHERE gatewayId = ?`;
        yield db_1.default.query(sql, [update, ...Object.values(where)]);
        return (0, errors_1.sendResponse)(res, "Status has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateAutomaticDepositGatewayStatus = updateAutomaticDepositGatewayStatus;
const getAutomaticDepositGatewayList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const row = yield AutomaticDepositGateway_1.default.getAllRows();
        return res.json(row);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getAutomaticDepositGatewayList = getAutomaticDepositGatewayList;
const getAutomaticDepositGatewayDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: gatewayId } = req.params;
        const gateway = yield AutomaticDepositGateway_1.default.createInstance(gatewayId, "Deposit Gateway doesn't exist");
        const name = yield gateway.name();
        const config = yield gateway.config();
        const details = yield gateway.details();
        return res.json({ name, gatewayId, config, details });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getAutomaticDepositGatewayDetails = getAutomaticDepositGatewayDetails;
// *Manual Deposit
const getManualDepositGatewayList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const row = yield ManualDepositGateway_1.default.getAllRows();
        return res.json(row);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getManualDepositGatewayList = getManualDepositGatewayList;
const updateManualDepositGatewayStatus = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { id: gatewayId } = req.params;
        const { status } = reqBody;
        (0, validate_1.default)(status, "Status").required().string().oneOf(["active", "inactive"]);
        const isGatewayId = yield ManualDepositGateway_1.default.isGatewayId(Number(gatewayId));
        if (!isGatewayId)
            throw new errors_1.ClientError("Deposit Gateway doesn't exist");
        const updateStatus = status === "active" ? "inactive" : "active";
        const sql = `UPDATE ${tables_1.MANUAL_DEPOSIT_GATEWAY_TBL} SET status = ? WHERE gatewayId = ?`;
        yield db_1.default.execute(sql, [updateStatus, gatewayId]);
        return (0, errors_1.sendResponse)(res, "Status has been updated");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.updateManualDepositGatewayStatus = updateManualDepositGatewayStatus;
const createManualDepositGateway = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { gatewayId, logo, name, processingTime, minDeposit, maxDeposit, charge, chargeType, status, details, } = reqBody;
        (0, validate_1.default)([
            gatewayId,
            logo,
            name,
            processingTime,
            minDeposit,
            maxDeposit,
            charge,
            chargeType,
            status,
            details,
        ], "body").args();
        (0, validate_1.default)(logo, "Gateway Image").required().string().url();
        (0, validate_1.default)(name, "Gateway Name").required().string();
        (0, validate_1.default)(processingTime, "Processing Time").required().string();
        (0, validate_1.default)(minDeposit, "Minimum Deposit").required().number();
        (0, validate_1.default)(maxDeposit, "Maximum Deposit")
            .required()
            .number()
            .min(minDeposit, "Maximum Deposit should be greater than Minimum Deposit");
        (0, validate_1.default)(charge, "Withdraw Charge").required().number();
        (0, validate_1.default)(chargeType, "Withdraw Charge Type")
            .required()
            .string()
            .oneOf(ManualDepositGateway_1.ManualDepositGatewayChargeTypeEnum);
        (0, validate_1.default)(status, "Status").required().string().oneOf(ManualDepositGateway_1.ManualDepositGatewayStatusEnum);
        (0, validate_1.default)(details, "Details").required().array();
        const detailsInput = JSON.stringify(details);
        const rowData = {
            name,
            logo,
            processingTime,
            status,
            minDeposit,
            maxDeposit,
            charge,
            chargeType,
            details: detailsInput,
            createdAt: (0, fns_1.currentDateTime)(),
        };
        let message;
        if (gatewayId === 0) {
            const sql = `INSERT INTO ${tables_1.MANUAL_DEPOSIT_GATEWAY_TBL} SET ?`;
            yield db_1.default.query(sql, [rowData]);
            message = "Deposit Gateway has been created";
        }
        else {
            const isGatewayId = yield ManualDepositGateway_1.default.isGatewayId(Number(gatewayId));
            if (!isGatewayId)
                throw new errors_1.ClientError("Deposit Gateway doesn't exist");
            const { createdAt } = rowData, updateData = __rest(rowData, ["createdAt"]);
            const sql = `UPDATE ${tables_1.MANUAL_DEPOSIT_GATEWAY_TBL} SET ? WHERE gatewayId = ?`;
            yield db_1.default.query(sql, [updateData, gatewayId]);
            message = "Deposit Gateway has been updated";
        }
        return (0, errors_1.sendResponse)(res, message);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createManualDepositGateway = createManualDepositGateway;
const getManualDepositGatewayDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        (0, validate_1.default)(id, "Gateway Id").required().string();
        const gatewayId = Number(id);
        const gateway = yield ManualDepositGateway_1.default.createInstance(gatewayId, "Deposit Gateway doesn't exist");
        const row = yield gateway.getRow();
        row.details = JSON.parse(row.details);
        return res.json(row);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getManualDepositGatewayDetails = getManualDepositGatewayDetails;
const deleteManualDepositGateway = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        (0, validate_1.default)(id, "Gateway Id").required().string();
        const gatewayId = Number(id);
        const gateway = yield ManualDepositGateway_1.default.createInstance(gatewayId, "Deposit Gateway doesn't exist");
        const gatewayName = yield gateway.name();
        const sql = `DELETE FROM ${tables_1.MANUAL_DEPOSIT_GATEWAY_TBL} WHERE gatewayId = ?`;
        yield db_1.default.query(sql, [gatewayId]);
        return (0, errors_1.sendResponse)(res, `${gatewayName} Gateway has been deleted`);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.deleteManualDepositGateway = deleteManualDepositGateway;
const deleteInstantDepositGateway = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gatewayId } = req.params;
        (0, validate_1.default)(gatewayId, "Gateway Id").required().string();
        const gateway = yield AutomaticDepositGateway_1.default.createInstance(gatewayId, "Deposit Gateway doesn't exist");
        const gatewayName = yield gateway.name();
        const sql = `DELETE FROM ${tables_1.AUTOMATIC_DEPOSIT_GATEWAY_TBL} WHERE gatewayId = ?`;
        yield db_1.default.query(sql, [gatewayId]);
        return (0, errors_1.sendResponse)(res, `${gatewayName} Gateway has been deleted`);
    }
    catch (error) {
        console.log("🚀 ~ file: paymentGateways.ts:572 ~ deleteInstantDepositGateway ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.deleteInstantDepositGateway = deleteInstantDepositGateway;
