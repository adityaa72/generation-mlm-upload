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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tree = exports.genealogy = void 0;
const db_1 = __importDefault(require("../../db"));
const User_1 = __importDefault(require("../../libs/User"));
const tables_1 = require("../../tables");
const genealogy = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const user = yield User_1.default.createInstance(userId);
        const lft = yield user.lft();
        const rgt = yield user.rgt();
        const sql = `SELECT userId FROM ${tables_1.USER_TREE_TBL} WHERE lft > ? AND rgt < ? ORDER BY id  ASC `;
        const [rows] = yield db_1.default.execute(sql, [lft, rgt]);
        rows.push({ userId });
        const generateRandomId = () => {
            return Math.floor(Math.random() * 10000);
        };
        const orgChart = [];
        for (let row of rows) {
            const { userId: rowUserId } = row;
            const user = yield User_1.default.createInstance(rowUserId);
            // const lft = await user.lft();
            // const rgt = await user.rgt();
            const placementId = yield user.placementIdText();
            const memberSince = yield user.registeredAt();
            const parentId = rowUserId === userId ? null : placementId;
            const getProfileDetails = yield user.getProfileDetails();
            orgChart.push({
                id: generateRandomId(),
                parentId: rowUserId,
                userName: "Join Member",
                userId: "Click Here",
                avatar: "https://jamsrworld.com/demo/binary-mlm/assets/images/add-button.webp",
                isValid: 0,
            });
            orgChart.push(Object.assign({ id: rowUserId, parentId,
                placementId,
                memberSince, isValid: 1 }, getProfileDetails));
        }
        return res.json(orgChart);
    }
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.genealogy = genealogy;
const tree = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.locals;
        const user = yield User_1.default.createInstance(userId);
        const getChild = (userId) => __awaiter(void 0, void 0, void 0, function* () {
            var e_1, _a;
            if (!userId)
                return undefined;
            let data = [];
            // get users placed under
            const sql = `SELECT * FROM ${tables_1.USER_TREE_TBL} WHERE placementId = ? `;
            const [rows] = yield db_1.default.execute(sql, [userId]);
            if (!rows.length) {
                return undefined;
            }
            try {
                for (var rows_1 = __asyncValues(rows), rows_1_1; rows_1_1 = yield rows_1.next(), !rows_1_1.done;) {
                    const row = rows_1_1.value;
                    const userId = row.userId;
                    const user = yield User_1.default.createInstance(userId);
                    const name = yield user.userName();
                    const children = yield getChild(userId);
                    data.push({ id: userId, name, children });
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (rows_1_1 && !rows_1_1.done && (_a = rows_1.return)) yield _a.call(rows_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return data;
        });
        const data = {
            id: "root",
            name: yield user.userName(),
            children: yield getChild(userId),
        };
        return res.json(data);
    }
    catch (err) {
        next(err);
    }
    finally {
        db_1.default.release();
    }
});
exports.tree = tree;
