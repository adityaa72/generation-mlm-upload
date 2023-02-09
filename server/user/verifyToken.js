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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_1 = __importDefault(require("moment"));
const errors_1 = require("../errors");
const LoginSession_1 = __importDefault(require("../libs/LoginSession"));
const User_1 = __importDefault(require("../libs/User"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization)
            throw new Error("No authorization header provided");
        const token = req.headers.authorization.substring(7, req.headers.authorization.length);
        if (!token)
            throw new Error("Token is missing");
        const verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const { id: userId, exp } = verifiedToken;
        const currentTime = (0, moment_1.default)(Date.now()).utc().valueOf() / 1000;
        if (!exp || Number(exp) < currentTime)
            throw new Error("Token is expired");
        if ((0, is_empty_1.default)(userId))
            throw new Error("Token is not valid");
        const isUserId = yield User_1.default.isUserId(userId);
        if (!isUserId)
            throw new Error("Token is not valid");
        const session = yield LoginSession_1.default.createInstance(token);
        const isValid = yield session.isValid();
        if (!isValid)
            throw new Error("Token has expired");
        req.locals = {
            userId,
            token,
            adminId: "",
        };
        next();
    }
    catch (error) {
        console.log(error);
        next(new errors_1.HttpError(401, error.message || "Unauthorized"));
    }
});
exports.default = verifyToken;
