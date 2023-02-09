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
exports.supportTickets = exports.closeTicket = exports.createTicket = exports.fetchTicket = void 0;
const is_empty_1 = __importDefault(require("is-empty"));
const db_1 = __importDefault(require("../../db"));
const errors_1 = require("../../errors");
const Ticket_1 = __importDefault(require("../../libs/Ticket"));
const tables_1 = require("../../tables");
const fns_1 = require("../../utils/fns");
const format_1 = require("../../utils/format");
const validate_1 = __importStar(require("../../utils/validate"));
const fetchTicket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const { ticketId: id } = req.params;
        const ticketId = Number(id);
        const ticket = yield Ticket_1.default.createInstance(ticketId);
        const ticketUserId = yield ticket.userId();
        if (ticketUserId !== userId)
            throw new errors_1.AuthError();
        const status = yield ticket.status();
        const closedAt = yield ticket.closedAt();
        const closedBy = yield ticket.closedBy();
        const ticketMessages = yield ticket.getTicketMessages();
        return res.json({ status, closedAt, closedBy, ticketMessages });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.fetchTicket = fetchTicket;
const createTicket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    yield conn.beginTransaction();
    try {
        const { userId } = req.locals;
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { isReply, ticketId: id, subject, message, files } = reqBody;
        (0, validate_1.default)([isReply, id, subject, message, files], "body").args();
        (0, validate_1.default)(message, "Message").required().string().maxLength(1000);
        (0, validate_1.default)(files, "Files").array().maxLength(5);
        let currentTicketId;
        let responseText;
        const ticketId = Number(id);
        if (isReply === true) {
            const ticket = yield Ticket_1.default.createInstance(ticketId, "Ticket doesn't exist");
            const status = yield ticket.status();
            const ticketUserId = yield ticket.userId();
            if (ticketUserId !== userId)
                throw new errors_1.AuthError();
            if (status === "closed") {
                throw new errors_1.ClientError("This ticket has been closed");
            }
            currentTicketId = ticketId;
            responseText = "Reply has been added";
        }
        else {
            if ((0, is_empty_1.default)(subject))
                throw new Error("Subject is required");
            const tblRow = {
                userId,
                subject,
                createdAt: (0, fns_1.currentDateTime)(),
                status: "pending",
            };
            const [row] = yield db_1.default.query(`INSERT INTO ${tables_1.TICKET_TBL} SET ?`, tblRow);
            currentTicketId = row.insertId;
            responseText = "Ticket has been created";
        }
        const msgTblRow = {
            ticketId: currentTicketId,
            repliedBy: userId,
            message,
            files: JSON.stringify(files),
            createdAt: (0, fns_1.currentDateTime)(),
        };
        yield db_1.default.query(`INSERT INTO ${tables_1.TICKET_MESSAGE_TBL} SET ?`, msgTblRow);
        yield conn.commit();
        return (0, errors_1.sendResponse)(res, responseText);
    }
    catch (err) {
        yield conn.rollback();
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.createTicket = createTicket;
const closeTicket = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const { ticketId: id } = req.params;
        const ticketId = Number(id);
        const ticket = yield Ticket_1.default.createInstance(ticketId);
        const ticketUserId = yield ticket.userId();
        const status = yield ticket.status();
        if (ticketUserId !== userId)
            throw new errors_1.AuthError();
        const update = {
            status: "closed",
            closedBy: userId,
        };
        const where = {
            ticketId,
            userId,
        };
        if (status !== "closed") {
            const sql = `UPDATE ${tables_1.TICKET_TBL} SET ? WHERE ticketId = ? AND userId = ?`;
            yield db_1.default.query(sql, [update, ...Object.values(where)]);
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
        const { userId } = req.locals;
        const columns = ["ticketId", "userId", "status", "subject", "createdAt", "updatedAt"];
        const { searchFilter, pageIndex, pageSize, sortModel, filterModel } = req.body;
        (0, validate_1.validateDataTableFilter)(columns, { searchFilter, pageIndex, pageSize, sortModel, filterModel });
        let sql = `SELECT *,ticketId as id,createdAt,
    (SELECT createdAt FROM ${tables_1.TICKET_MESSAGE_TBL} WHERE ticketId = ${tables_1.TICKET_TBL}.ticketId ORDER BY createdAt DESC LIMIT 1) as updatedAt
     FROM ${tables_1.TICKET_TBL} HAVING userId = ? `;
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
exports.supportTickets = supportTickets;
