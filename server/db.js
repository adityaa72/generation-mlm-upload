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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const promise_1 = __importDefault(require("mysql2/promise"));
const config = {
    host: "localhost",
    user: "root",
    password: "",
    database: "generation_30_1_23",
    decimalNumbers: true,
    // debug: true,
    connectionLimit: 2,
    timezone: "+00:00",
};
const pool = promise_1.default.createPool(config);
const DB = (_a = class {
        static transaction(callback) {
            return __awaiter(this, void 0, void 0, function* () {
                const conn = yield DB.conn();
                try {
                    yield conn.beginTransaction();
                    const result = yield callback(conn);
                    yield conn.commit();
                    return result;
                }
                catch (error) {
                    yield conn.rollback();
                    throw error;
                }
                finally {
                    conn.release();
                    conn.end();
                }
            });
        }
        static release() {
            if (DB.db) {
                DB.db.release();
            }
            DB.db = null;
        }
    },
    _a.conn = () => __awaiter(void 0, void 0, void 0, function* () {
        if (DB.db)
            return DB.db;
        DB.db = yield pool.getConnection();
        return DB.db;
    }),
    _a.execute = (sql, params) => __awaiter(void 0, void 0, void 0, function* () {
        const connection = yield DB.conn();
        return yield connection.execute(sql, params);
    }),
    _a.query = (sql, params) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const connection = yield DB.conn();
            return yield connection.query(sql, params);
        }
        catch (error) {
            throw error;
        }
    }),
    _a);
exports.default = DB;
