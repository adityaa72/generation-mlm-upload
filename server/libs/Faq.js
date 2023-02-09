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
const is_empty_1 = __importDefault(require("is-empty"));
const db_1 = __importDefault(require("../db"));
const errors_1 = require("../errors");
const tables_1 = require("../tables");
const Faq = class {
    constructor(faqId, errorText) {
        this.faqId = faqId;
        if (errorText)
            this.initializeErrorText = errorText;
    }
    static isFaqId(faqId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT faqId FROM ${tables_1.FAQ_LIST_TBL} WHERE faqId = ?`;
            const [rows] = yield db_1.default.execute(sql, [faqId]);
            return rows.length > 0 ? true : false;
        });
    }
    static createInstance(faqId, errorText) {
        return __awaiter(this, void 0, void 0, function* () {
            const faq = new Faq(faqId, errorText);
            yield faq.initialize();
            return faq;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isFaqId = yield Faq.isFaqId(this.faqId);
            if (!isFaqId)
                throw new errors_1.HttpError(404, errorText || `${this.faqId} is not a valid faq id`);
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT * FROM ${tables_1.FAQ_LIST_TBL} WHERE ticketId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.faqId]);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
    static getAllRows() {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${tables_1.FAQ_LIST_TBL}`;
            const [rows] = yield db_1.default.query(sql);
            return rows;
        });
    }
    question() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const question = row.question;
            return question;
        });
    }
    answer() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const answer = row.answer;
            return answer;
        });
    }
};
exports.default = Faq;
