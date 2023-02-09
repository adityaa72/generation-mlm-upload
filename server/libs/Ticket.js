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
exports.ATicket = exports.TicketStatusEnum = void 0;
const is_empty_1 = __importDefault(require("is-empty"));
const db_1 = __importDefault(require("../db"));
const db_2 = __importDefault(require("../db"));
const errors_1 = require("../errors");
const tables_1 = require("../tables");
exports.TicketStatusEnum = ["pending", "active", "closed"];
class Ticket {
    constructor(ticketId, errorText) {
        this.ticketId = ticketId;
        if (errorText)
            this.initializeErrorText = errorText;
    }
    static isTicketId(ticketId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT ticketId FROM ${tables_1.TICKET_TBL} WHERE ticketId = ?`;
            const [rows] = yield db_1.default.execute(sql, [ticketId]);
            return rows.length > 0 ? true : false;
        });
    }
    static createInstance(ticketId, errorText) {
        return __awaiter(this, void 0, void 0, function* () {
            const ticket = new Ticket(ticketId, errorText);
            yield ticket.initialize();
            return ticket;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isTicketId = yield Ticket.isTicketId(this.ticketId);
            if (!isTicketId)
                throw new errors_1.HttpError(404, errorText || `${this.ticketId} is not a valid ticket id`);
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.TICKET_TBL} WHERE ticketId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.ticketId]);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
    userId() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const createdBy = row.userId;
            return createdBy;
        });
    }
    subject() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const subject = row.subject;
            return subject;
        });
    }
    createdAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const createdAt = row.createdAt;
            return createdAt;
        });
    }
    status() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const status = row.status;
            return status;
        });
    }
    lastReplyOn() {
        return __awaiter(this, void 0, void 0, function* () {
            // const row = await this.getRow();
            // const lastReplyOn = row.lastReplyOn;
            // return lastReplyOn;
        });
    }
    closedAt() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const closedAt = row.closedAt;
            return closedAt;
        });
    }
    closedBy() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const closedBy = row.closedBy;
            return closedBy;
        });
    }
    getTicketMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT *,
     (SELECT userName FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.TICKET_MESSAGE_TBL}.repliedBy) as displayName,
     (SELECT avatar FROM ${tables_1.USER_TBL} WHERE userId = ${tables_1.TICKET_MESSAGE_TBL}.repliedBy) as avatar
      FROM ${tables_1.TICKET_MESSAGE_TBL} WHERE ticketId = ? ORDER BY createdAt DESC `;
            const [rows] = yield db_2.default.execute(sql, [this.ticketId]);
            return rows;
        });
    }
}
class ATicket extends Ticket {
    constructor(ticketId, errorText) {
        super(ticketId, errorText);
    }
    static ticketsCount(status) {
        return __awaiter(this, void 0, void 0, function* () {
            let rows;
            if (status !== "all") {
                const where = {
                    status,
                };
                const sql = `SELECT COUNT(*) AS tickets FROM ${tables_1.TICKET_TBL} WHERE status = ?`;
                [rows] = yield db_2.default.query(sql, Object.values(where));
            }
            else {
                const sql = `SELECT COUNT(*) AS tickets FROM ${tables_1.TICKET_TBL}`;
                [rows] = yield db_2.default.query(sql);
            }
            return rows[0].tickets;
        });
    }
    static getAnalytics() {
        return __awaiter(this, void 0, void 0, function* () {
            const allTicketsCount = yield ATicket.ticketsCount("all");
            const activeTicketsCount = yield ATicket.ticketsCount("active");
            const pendingTicketsCount = yield ATicket.ticketsCount("pending");
            const closedTicketsCount = yield ATicket.ticketsCount("closed");
            return {
                all: allTicketsCount,
                active: activeTicketsCount,
                pending: pendingTicketsCount,
                closed: closedTicketsCount,
            };
        });
    }
}
exports.ATicket = ATicket;
exports.default = Ticket;
