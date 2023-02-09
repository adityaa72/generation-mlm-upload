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
exports.validateUniqueUserName = exports.fetchUser = exports.fetchUserRegisterData = void 0;
const db_1 = __importDefault(require("../../db"));
const User_1 = __importDefault(require("../../libs/User"));
const fetchUserRegisterData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield User_1.default.createInstance(userId, { error: "User not found" });
        const userName = yield user.userName();
        const email = yield user.email();
        const referralId = yield user.referralId();
        const placementId = yield user.placementId();
        const createdAt = yield user.createdAt();
        return res.json({ userName, email, referralId, placementId, createdAt });
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.fetchUserRegisterData = fetchUserRegisterData;
const fetchUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield User_1.default.createInstance(userId, { error: "User not found" });
        const userName = yield user.userName();
        const data = {
            userName,
        };
        return res.json(data);
    }
    catch (error) {
        return res.status(400).send({ message: error === null || error === void 0 ? void 0 : error.message });
        // next();
    }
    finally {
        db_1.default.release();
    }
});
exports.fetchUser = fetchUser;
const validateUniqueUserName = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName = "" } = req.params;
        const isUserId = yield User_1.default.isUserName(userName);
        if (isUserId)
            throw new Error("User name already exist");
        return res.status(200).send();
    }
    catch (error) {
        return res.status(400).send({ message: error === null || error === void 0 ? void 0 : error.message });
    }
    finally {
        db_1.default.release();
    }
});
exports.validateUniqueUserName = validateUniqueUserName;
