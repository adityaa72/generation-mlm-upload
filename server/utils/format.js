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
exports.createSearchQuery = exports.formatSortModel = exports.formatFilterSql = exports.formatUrl = exports.fCurrency = exports.unformatDate = exports.formatDate = void 0;
const moment_1 = __importDefault(require("moment"));
const config_1 = require("../config");
const Setting_1 = __importDefault(require("../libs/Setting"));
const formatDate = (date) => {
    return (0, moment_1.default)(date).format("YYYY-MM-DD HH:mm:ss");
};
exports.formatDate = formatDate;
const unformatDate = (date) => {
    return (0, moment_1.default)(date);
};
exports.unformatDate = unformatDate;
const fCurrency = (amount) => __awaiter(void 0, void 0, void 0, function* () {
    const setting = new Setting_1.default();
    const currency = yield setting.currency();
    const currencyPosition = yield setting.currencyPosition();
    if (currencyPosition === "prefix") {
        return `${currency}${amount}`;
    }
    return `${amount}${currency}`;
});
exports.fCurrency = fCurrency;
const formatUrl = (url) => {
    return config_1.API_URL + url;
};
exports.formatUrl = formatUrl;
const formatFilterSql = (filterModel) => {
    var _a;
    const filter = (_a = filterModel === null || filterModel === void 0 ? void 0 : filterModel.items) === null || _a === void 0 ? void 0 : _a[0];
    if (!filter)
        return;
    let { columnField, value, operatorValue } = filter;
    let sqlQuery;
    let sqlValues = [];
    switch (operatorValue) {
        case "contains":
            if (value) {
                sqlQuery = `${columnField} LIKE ? `;
                sqlValues = [`%${value}%`];
            }
            break;
        case "equals":
            if (value) {
                sqlQuery = `${columnField} = ?`;
                sqlValues = [value];
            }
            break;
        case "startsWith":
            if (value) {
                sqlQuery = `${columnField} LIKE ? `;
                sqlValues = [`${value}%`];
            }
            break;
        case "endsWith":
            if (value) {
                sqlQuery = `${columnField} LIKE  ?`;
                sqlValues = [`%${value}`];
            }
            break;
        case "isEmpty":
            sqlQuery = `${columnField} =  NULL`;
            break;
        case "isNotEmpty":
            sqlQuery = `${columnField} IS NOT NULL`;
            break;
        case "isAnyOf":
            // todo
            // if (Array.isArray(value) && value.length > 0) {
            //   value = value.join(", ");
            //   sqlQuery = `${columnField} IN ?`;
            //   sqlValues = [`(${value})`];
            // }
            break;
    }
    return { sqlQuery, sqlValues };
};
exports.formatFilterSql = formatFilterSql;
const formatSortModel = (sortModel) => {
    if (!Array.isArray(sortModel))
        return;
    const sorts = sortModel[0];
    if (!sorts)
        return;
    const { field, sort } = sorts;
    return ` ORDER BY ${field} ${sort}`;
};
exports.formatSortModel = formatSortModel;
const createSearchQuery = (columns) => {
    return columns.join(" LIKE ? OR ") + " LIKE ? ";
};
exports.createSearchQuery = createSearchQuery;
