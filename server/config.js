"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.API_URL = exports.DEPOSIT_SUCCESS_URL = exports.APP_URL = exports.JWT_SECRET_KEY = exports.WEB_NAME = void 0;
exports.WEB_NAME = "Jamsrmlm";
exports.JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
exports.APP_URL = process.env.APP_URL;
exports.DEPOSIT_SUCCESS_URL = exports.APP_URL + "/deposit-system/history";
exports.API_URL = process.env.API_URL;
