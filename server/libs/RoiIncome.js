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
exports.RoiEnum = void 0;
const db_1 = __importDefault(require("../db"));
const tables_1 = require("../tables");
exports.RoiEnum = ["daily", "weekly", "monthly"];
class RoiIncome {
    static getLastRoiIncome(transactionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const sql = `SELECT createdAt FROM ${tables_1.ROI_TBL} WHERE  planTransactionId = ?`;
            const [rows] = yield db_1.default.execute(sql, [transactionId]);
            if (!rows.length)
                return null;
            const createdAt = rows[0].createdAt;
            return createdAt;
        });
    }
}
exports.default = RoiIncome;
