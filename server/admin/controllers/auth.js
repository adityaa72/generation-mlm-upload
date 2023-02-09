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
exports.deleteLoginSessionToken = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validator_1 = __importDefault(require("validator"));
const db_1 = __importDefault(require("../../db"));
const User_1 = __importDefault(require("../../libs/User"));
const tables_1 = require("../../tables");
const validate_1 = __importDefault(require("../../utils/validate"));
const errors_1 = require("./../../errors");
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { userId, password } = reqBody;
        // validate if the all the values are present in the body
        (0, validate_1.default)([userId, password], "body").args();
        (0, validate_1.default)(userId, "User Id").required().string();
        (0, validate_1.default)(password, "Password").required().string();
        const isEmail = validator_1.default.isEmail(userId);
        const user = yield User_1.default.createInstance(userId, {
            error: "No account is registered with the provided credentials",
            userName: isNaN(Number(userId)) ? true : false,
            email: isEmail, //  login with email
        });
        const role = yield user.role();
        if (role !== "admin")
            throw new errors_1.ClientError("Admin does not exist");
        const dbPassword = yield user.password();
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, dbPassword);
        if (!isPasswordCorrect)
            throw new errors_1.ClientError("Password is incorrect");
        const originalUserId = user.userId;
        const token = jsonwebtoken_1.default.sign({ id: originalUserId }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1d", // expires in 1 day
        });
        return (0, errors_1.sendResponse)(res, "Login successful", {
            accessToken: token,
            user: yield user.getProfileDetails(),
        });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.login = login;
const deleteLoginSessionToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const sql = `UPDATE ${tables_1.LOGIN_SESSION_TBL} SET status = ? WHERE token = ?`;
        yield db_1.default.execute(sql, ["expired", token]);
        return (0, errors_1.sendResponse)(res, "Logout Successful");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.deleteLoginSessionToken = deleteLoginSessionToken;
