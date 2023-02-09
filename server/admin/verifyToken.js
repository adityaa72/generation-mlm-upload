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
const User_1 = __importDefault(require("../libs/User"));
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.headers.authorization)
            throw new errors_1.ClientError("No authorization header provided");
        const token = req.headers.authorization.substring(7, req.headers.authorization.length);
        if (!token)
            throw new Error("Token is missing");
        const verifiedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        const { id: adminId, exp } = verifiedToken;
        const currentTime = Math.floor((0, moment_1.default)(Date.now()).utc().valueOf() / 1000);
        if (!exp || Number(exp) < currentTime)
            throw new Error("Token is expired");
        if ((0, is_empty_1.default)(adminId))
            throw new Error("UserId is required");
        const isUserId = yield User_1.default.isGrandAdminId(adminId);
        if (!isUserId)
            throw new Error("Admin is not registered");
        req.locals = {
            token,
            adminId,
            userId: "",
        };
        next();
    }
    catch (error) {
        console.log(error);
        next(new errors_1.HttpError(401, "Unauthorized"));
    }
});
exports.default = verifyToken;
