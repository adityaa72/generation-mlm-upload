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
exports.fetchGenealogy = void 0;
const db_1 = __importDefault(require("../../db"));
const User_1 = __importDefault(require("../../libs/User"));
const tables_1 = require("../../tables");
const fetchGenealogy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { adminId } = req.locals;
        const user = yield User_1.default.createInstance(adminId);
        const lft = yield user.lft();
        const rgt = yield user.rgt();
        const sql = `SELECT userId FROM ${tables_1.USER_TREE_TBL} WHERE lft > ? AND rgt < ? `;
        const [rows] = yield db_1.default.execute(sql, [lft, rgt]);
        rows.push({ userId: adminId });
        const orgChart = [];
        for (let row of rows) {
            const { userId: rowUserId } = row;
            const user = yield User_1.default.createInstance(rowUserId);
            const placementId = yield user.placementIdText();
            const memberSince = yield user.registeredAt();
            const parentId = rowUserId === adminId ? null : placementId;
            const getProfileDetails = yield user.getProfileDetails();
            orgChart.push(Object.assign({ id: rowUserId, parentId,
                placementId,
                memberSince, canAddMember: true, isValid: 1 }, getProfileDetails));
        }
        return res.json(orgChart);
    }
    catch (error) {
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.fetchGenealogy = fetchGenealogy;
