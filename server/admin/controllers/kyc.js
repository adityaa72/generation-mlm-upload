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
exports.rejectKyc = exports.approveKyc = exports.getKycData = exports.kycList = void 0;
const db_1 = __importDefault(require("../../db"));
const errors_1 = require("../../errors");
const Kyc_1 = __importDefault(require("../../libs/Kyc"));
const User_1 = __importDefault(require("../../libs/User"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const validate_1 = __importStar(require("../../utils/validate"));
const format_1 = require("./../../utils/format");
const kycList = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { status } = req.params;
        const columns = [
            "userId",
            "createdAt",
            "updatedAt",
            "status",
            "userName",
            "email",
            "displayName",
        ];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT kycId as id,userId,
     (SELECT avatar FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_KYC_TBL}.userId) as avatar,
     (SELECT userName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_KYC_TBL}.userId) as userName,
     (SELECT email FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_KYC_TBL}.userId) as email,
     (SELECT CONCAT_WS(' ', firstName, lastName) AS displayName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.USER_KYC_TBL}.userId) as displayName, createdAt,updatedAt,status FROM ${tables_1.USER_KYC_TBL} `;
        if (status === "pending") {
            sql += `HAVING status = 'pending' `;
        }
        else if (status === "approved") {
            sql += `HAVING status = 'approved' `;
        }
        else if (status === "rejected") {
            sql += `HAVING status = 'rejected' `;
        }
        else {
            sql += `HAVING id IS NOT NULL`;
        }
        let sqlParams = [];
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
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.kycList = kycList;
const getKycData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        (0, validate_1.default)(id, "Kyc Id").required().string();
        const kycId = Number(id);
        const kyc = yield Kyc_1.default.createInstance(kycId);
        const userId = yield kyc.userId();
        const kycRow = yield kyc.getRow();
        const user = yield User_1.default.createInstance(userId);
        const userData = yield user.getProfileDetails();
        const contact = yield user.getContactDetails();
        const data = Object.assign(Object.assign({}, userData), { contact });
        return res.json({ kyc: kycRow, user: data });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getKycData = getKycData;
const approveKyc = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        (0, validate_1.default)(id, "Kyc Id").required().string();
        const kycId = Number(id);
        const kyc = yield Kyc_1.default.createInstance(kycId);
        const status = yield kyc.status();
        const userId = yield kyc.userId();
        if (status === "pending") {
            // update kyc table status
            const kycUpdate = {
                status: "approved",
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const kycWhere = {
                kycId,
                status: "pending",
            };
            const kycSql = `UPDATE ${tables_1.USER_KYC_TBL}  SET ? WHERE kycId = ? AND status = ?`;
            yield db_1.default.query(kycSql, [kycUpdate, ...Object.values(kycWhere)]);
            // update user table status
            const userUpdate = {
                kyc: "approved",
            };
            const userWhere = {
                userId,
            };
            const sql = `UPDATE ${tables_1.USER_TBL} SET ? WHERE userId = ?`;
            yield db_1.default.query(sql, [userUpdate, ...Object.values(userWhere)]);
        }
        return (0, errors_1.sendResponse)(res, "Kyc has been approved");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.approveKyc = approveKyc;
const rejectKyc = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        (0, validate_1.default)(id, "Kyc Id").required().string();
        const kycId = Number(id);
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { message } = reqBody;
        (0, validate_1.default)(message, "Message").required().string().maxLength(1000);
        const kyc = yield Kyc_1.default.createInstance(kycId);
        const status = yield kyc.status();
        const userId = yield kyc.userId();
        if (status === "pending") {
            // update kyc table status
            const kycUpdate = {
                status: "rejected",
                rejectedReason: message,
                updatedAt: (0, fns_1.currentDateTime)(),
            };
            const kycWhere = {
                kycId,
                status: "pending",
            };
            const kycSql = `UPDATE ${tables_1.USER_KYC_TBL}  SET ? WHERE kycId = ? AND status = ?`;
            yield db_1.default.query(kycSql, [kycUpdate, ...Object.values(kycWhere)]);
            // update user table status
            const userUpdate = {
                kyc: "rejected",
            };
            const userWhere = {
                userId,
            };
            const sql = `UPDATE ${tables_1.USER_TBL} SET ? WHERE userId = ?`;
            yield db_1.default.query(sql, [userUpdate, ...Object.values(userWhere)]);
        }
        return (0, errors_1.sendResponse)(res, "Kyc has been rejected");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.rejectKyc = rejectKyc;
