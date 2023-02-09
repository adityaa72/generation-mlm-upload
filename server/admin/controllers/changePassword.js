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
exports.changePassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = __importDefault(require("../../db"));
const User_1 = __importDefault(require("../../libs/User"));
const tables_1 = require("../../tables");
const validate_1 = __importDefault(require("../../utils/validate"));
const errors_1 = require("./../../errors");
const changePassword = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        throw new Error("Action not allowed in demo for this account");
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { oldPassword, newPassword, confirmNewPassword } = reqBody;
        (0, validate_1.default)([oldPassword, newPassword, confirmNewPassword], "body").args();
        (0, validate_1.default)(oldPassword, "Old Password").required().string();
        (0, validate_1.default)(newPassword, "New Password").required().string().minLength(6).maxLength(15);
        (0, validate_1.default)(confirmNewPassword, "Confirm New Password")
            .required()
            .string()
            .minLength(6)
            .maxLength(15)
            .equal(newPassword, "New Passwords are not matching");
        const { adminId } = req.locals;
        const user = yield User_1.default.createInstance(adminId);
        const userPassword = yield user.password();
        const isPasswordCorrect = yield bcryptjs_1.default.compare(oldPassword, userPassword);
        if (!isPasswordCorrect)
            throw new errors_1.ClientError("Current Password is not correct");
        const hashedPassword = yield bcryptjs_1.default.hash(newPassword, 10);
        const where = {
            password: hashedPassword,
            userId: adminId,
        };
        const sql = `UPDATE ${tables_1.USER_TBL} SET password = ? WHERE userId = ? `;
        yield db_1.default.execute(sql, Object.values(where));
        return (0, errors_1.sendResponse)(res, "Password changed successful");
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.changePassword = changePassword;
