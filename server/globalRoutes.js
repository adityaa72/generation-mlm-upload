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
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const errors_1 = require("./errors");
const Setting_1 = __importDefault(require("./libs/Setting"));
const tables_1 = require("./tables");
const router = express_1.default.Router();
router.get("/configuration", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const sql = `SELECT COUNT(*) AS users FROM ${tables_1.USER_TBL} `;
        const [rows] = yield db_1.default.query(sql);
        const userCount = rows[0].users;
        if (!userCount)
            throw new errors_1.HttpError(412, "Installation required");
        const settings = new Setting_1.default();
        const siteSettings = yield settings.getGlobalConfiguration();
        return res.json(siteSettings);
    }
    catch (error) {
        console.log("🚀 ~ file: globalRoutes.ts:8 ~ router.get ~ error", error);
        next(error);
    }
}));
exports.default = router;
