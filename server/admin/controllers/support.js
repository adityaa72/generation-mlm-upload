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
exports.supportTickets = exports.closeTicket = exports.getTicketData = exports.replyToTicket = void 0;
const db_1 = __importDefault(require("../../db"));
const errors_1 = require("../../errors");
const Ticket_1 = __importStar(require("../../libs/Ticket"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const format_1 = require("../../utils/format");
const validate_1 = __importDefault(require("../../utils/validate"));
const replyToTicket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    const { adminId } = req.locals;
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { ticketId: id, message, files } = reqBody;
        (0, validate_1.default)(id, "Ticket Id").required().string();
        (0, validate_1.default)(message, "Message").required().string();
        (0, validate_1.default)(files, "Files").array().maxLength(5, "Maximum 5 Files are allowed");
        const ticketId = Number(id);
        const ticket = yield Ticket_1.default.createInstance(ticketId);
        const status = yield ticket.status();
        if (status === "closed") {
            throw new errors_1.ClientError("This ticket has been closed");
        }
        if (status === "pending") {
            const update = {
                status: "active",
            };
            const where = {
                ticketId,
            };
            const sql = `UPDATE ${tables_1.TICKET_TBL} SET ? WHERE ticketId = ?`;
            yield db_1.default.query(sql, [update, ...Object.values(where)]);
        }
        const msgTblRow = {
            ticketId,
            repliedBy: adminId,
            message,
            files: JSON.stringify(files),
            createdAt: (0, fns_1.currentDateTime)(),
        };
        yield db_1.default.query(`INSERT INTO ${tables_1.TICKET_MESSAGE_TBL} SET ?`, msgTblRow);
        yield conn.commit();
        return (0, errors_1.sendResponse)(res, "Reply has been added to  ticket");
    }
    catch (error) {
        console.log("🚀 ~ file: support.ts:16 ~ replyToTicket ~ error", error);
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.replyToTicket = replyToTicket;
const getTicketData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        (0, validate_1.default)(id, "Ticket Id").required().string();
        const ticketId = Number(id);
        const ticket = yield Ticket_1.default.createInstance(ticketId);
        const status = yield ticket.status();
        const closedAt = yield ticket.closedAt();
        const closedBy = yield ticket.closedBy();
        const ticketMessages = yield ticket.getTicketMessages();
        return res.json({ status, closedAt, closedBy, ticketMessages });
    }
    catch (error) {
        console.log("🚀 ~ file: support.ts:14 ~ getTicketData ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getTicketData = getTicketData;
const closeTicket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        (0, validate_1.default)(id, "Ticket Id").required().string();
        const ticketId = Number(id);
        const ticket = yield Ticket_1.default.createInstance(ticketId);
        const status = yield ticket.status();
        if (status !== "closed") {
            const update = {
                status: "closed",
                closedBy: "admin",
            };
            const sql = `UPDATE ${tables_1.TICKET_TBL} SET ? WHERE ticketId = ? `;
            yield db_1.default.query(sql, [update, ticketId]);
        }
        return (0, errors_1.sendResponse)(res, "Ticket has been closed");
    }
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.closeTicket = closeTicket;
const supportTickets = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const params = req.params;
        const { status } = req.params;
        (0, validate_1.default)(status, "Ticket Status")
            .required()
            .string()
            .oneOf([...Ticket_1.TicketStatusEnum, "all"]);
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        let sql = `SELECT *,
    (SELECT avatar FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.TICKET_TBL}.userId) as avatar,
    (SELECT userName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.TICKET_TBL}.userId) as userName,
    ticketId as id,createdAt,
        (SELECT createdAt FROM ${tables_1.TICKET_MESSAGE_TBL} WHERE ticketId = ${tables_1.TICKET_TBL}.ticketId ORDER BY createdAt DESC LIMIT 1) as updatedAt
         FROM ${tables_1.TICKET_TBL} HAVING id IS NOT NULL`;
        let sqlParams = [];
        if (searchFilter) {
            sql += `  AND (
             userId LIKE ? OR
             subject LIKE ? OR
             status LIKE ? OR
             updatedAt LIKE ? OR
             createdAt LIKE ?)`;
            sqlParams = [
                ...sqlParams,
                ...Array(5)
                    .fill(null)
                    .map(() => `%${searchFilter}%`),
            ];
        }
        if (status !== "all") {
            sql += ` AND status = ?`;
            sqlParams = [...sqlParams, status];
        }
        const filterSql = (0, format_1.formatFilterSql)(filterModel);
        if (filterSql)
            sql += ` AND ${filterSql}`;
        const sortSql = (0, format_1.formatSortModel)(sortModel);
        if (sortSql)
            sql += ` ${sortSql}`;
        const [totalRows] = yield db_1.default.execute(sql, sqlParams);
        const rowCount = totalRows.length;
        sql += ` LIMIT ${pageSize} OFFSET ${Number(pageIndex) * pageSize}`;
        const analytics = yield Ticket_1.ATicket.getAnalytics();
        const [rows] = yield db_1.default.execute(sql, sqlParams);
        res.json({ rowCount, rows, analytics });
    }
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.supportTickets = supportTickets;
