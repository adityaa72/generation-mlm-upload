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
exports.getProfile = void 0;
const db_1 = __importDefault(require("../../db"));
const User_1 = __importDefault(require("../../libs/User"));
// get profile
const getProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.locals;
        const user = yield User_1.default.createInstance(adminId);
        const data = yield user.getProfileDetails();
        return res.json(data);
    }
    catch (error) {
        console.log("🚀 ~ file: profile.ts:14 ~ getProfile ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.getProfile = getProfile;
