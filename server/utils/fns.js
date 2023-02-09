"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomNumber = exports.jsonToArray = exports.getFileUrl = exports.isAlphaNumeric = exports.isAlphabet = exports.isNumber = exports.isUserName = exports.isObject = exports.getDate = exports.getDateTime = exports.dateToUtc = exports.currentDate = exports.currentDateTimeInMoment = exports.convertToDateTime = exports.currentDateTime = exports.momentUtc = void 0;
const moment_1 = __importDefault(require("moment"));
const momentUtc = () => {
    const add = 0;
    return (0, moment_1.default)(new Date()).add(add, "days").utc();
};
exports.momentUtc = momentUtc;
const currentDateTime = () => {
    return (0, exports.momentUtc)().format("YYYY-MM-DD HH:mm:ss");
};
exports.currentDateTime = currentDateTime;
const convertToDateTime = (date) => {
    return date.format("YYYY-MM-DD HH:mm:ss");
};
exports.convertToDateTime = convertToDateTime;
const currentDateTimeInMoment = () => {
    return (0, exports.momentUtc)();
};
exports.currentDateTimeInMoment = currentDateTimeInMoment;
const currentDate = () => {
    return (0, exports.momentUtc)().format("YYYY-MM-DD");
};
exports.currentDate = currentDate;
const dateToUtc = (date) => {
    return (0, moment_1.default)(new Date(date)).utc();
};
exports.dateToUtc = dateToUtc;
const getDateTime = (action, input, unit) => {
    if (action === "add") {
        return (0, exports.momentUtc)().add(input, unit).format("YYYY-MM-DD HH:mm:ss");
    }
    return (0, exports.momentUtc)().subtract(input, unit).format("YYYY-MM-DD HH:mm:ss");
};
exports.getDateTime = getDateTime;
const getDate = (action, input, unit) => {
    if (action === "add") {
        return (0, exports.momentUtc)().add(input, unit).format("YYYY-MM-DD");
    }
    return (0, exports.momentUtc)().subtract(input, unit).format("YYYY-MM-DD");
};
exports.getDate = getDate;
const isObject = (a) => {
    return !!a && a.constructor === Object;
};
exports.isObject = isObject;
const isUserName = (userName) => {
    const hasString = /[A-Za-z]/.test(userName);
    if (!hasString)
        return false;
    return /^[a-zA-Z0-9]+$/.test(userName);
};
exports.isUserName = isUserName;
const isNumber = (text) => {
    return /^\d+$/.test(text);
};
exports.isNumber = isNumber;
const isAlphabet = (text) => {
    return /^[a-zA-Z /s]+$/.test(text);
};
exports.isAlphabet = isAlphabet;
const isAlphaNumeric = (text) => {
    return /^[a-zA-Z0-9 /s]+$/.test(text);
};
exports.isAlphaNumeric = isAlphaNumeric;
const getFileUrl = (fileName) => `files/${fileName}`;
exports.getFileUrl = getFileUrl;
const jsonToArray = (json) => {
    try {
        const arr = JSON.parse(json);
        return arr;
    }
    catch (error) {
        return [];
    }
};
exports.jsonToArray = jsonToArray;
const generateRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};
exports.generateRandomNumber = generateRandomNumber;
