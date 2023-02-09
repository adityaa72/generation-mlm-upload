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
exports.KycRequiredEnum = exports.KycFileExtensionsEnum = exports.KycFormTypeEnum = void 0;
const is_empty_1 = __importDefault(require("is-empty"));
const db_1 = __importDefault(require("../db"));
const errors_1 = require("../errors");
const tables_1 = require("../tables");
exports.KycFormTypeEnum = ["textarea", "input", "dropdown", "file", "date"];
exports.KycFileExtensionsEnum = [
    "JPG",
    "JPEG",
    "PNG",
    "WEBP",
    "PDF",
    "DOC",
    "DOCX",
    "TXT",
    "XLX",
    "XLSX",
    "CSV",
];
exports.KycRequiredEnum = ["required", "optional"];
const KycForm = class {
    constructor(labelId, errorText) {
        this.labelId = labelId;
        if (errorText)
            this.initializeErrorText = errorText;
    }
    static isLabelId(labelId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT labelId FROM ${tables_1.KYC_SETTING_TBL} WHERE labelId = ?`;
            const [rows] = yield db_1.default.execute(sql, [labelId]);
            return rows.length > 0 ? true : false;
        });
    }
    static createInstance(labelId, errorText) {
        return __awaiter(this, void 0, void 0, function* () {
            const deposit = new KycForm(labelId, errorText);
            yield deposit.initialize();
            return deposit;
        });
    }
    initialize() {
        return __awaiter(this, void 0, void 0, function* () {
            const errorText = this.initializeErrorText;
            const isKycId = yield KycForm.isLabelId(this.labelId);
            if (!isKycId)
                throw new errors_1.HttpError(404, errorText || `${this.labelId} is not a valid kyc form id`);
        });
    }
    getRow() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(0, is_empty_1.default)(this.row))
                return this.row;
            const sql = `SELECT *, labelId as id FROM ${tables_1.KYC_SETTING_TBL} WHERE labelId = ?`;
            const [rows] = yield db_1.default.execute(sql, [this.labelId]);
            const row = rows[0];
            this.row = row;
            return row;
        });
    }
    static getAllRow() {
        var e_1, _a;
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT * FROM ${tables_1.KYC_SETTING_TBL}`;
            const [rows] = yield db_1.default.query(sql);
            try {
                for (var rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), !rows_1_1.done;) {
                    const row = rows_1_1.value;
                    row.dropdownOptions = JSON.parse(row.dropdownOptions);
                    row.fileExtensions = JSON.parse(row.fileExtensions);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) yield _a.call(rows_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return rows;
        });
    }
    label() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const label = row.label;
            return label;
        });
    }
    inputType() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const type = row.inputType;
            return type;
        });
    }
    required() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const required = row.required;
            return required;
        });
    }
    dropdownOptions() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const dropdownOptions = row.dropdownOptions;
            return dropdownOptions;
        });
    }
    fileExtensions() {
        return __awaiter(this, void 0, void 0, function* () {
            const row = yield this.getRow();
            const fileExtensions = row.fileExtensions;
            return fileExtensions;
        });
    }
};
exports.default = KycForm;
