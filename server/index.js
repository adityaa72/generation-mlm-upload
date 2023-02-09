"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
//@ts-ignore
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
//@ts-ignore
const helmet_1 = __importDefault(require("helmet"));
const node_cron_1 = __importDefault(require("node-cron"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./admin/routes"));
const errors_1 = require("./errors");
const globalRoutes_1 = __importDefault(require("./globalRoutes"));
const routes_2 = __importDefault(require("./user/routes"));
// routes
const cron_1 = require("./cron");
const webhook_1 = __importDefault(require("./user/routes/webhook"));
const format_1 = require("./utils/format");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
// logData("server is running");
// setup cron
node_cron_1.default.schedule("*/1 * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // logData("the cron is running well");
        yield (0, cross_fetch_1.default)((0, format_1.formatUrl)("/cron"));
    }
    catch (error) {
        console.log("🚀 ~ file: index.ts:26 ~ cron.schedule ~ error", error);
    }
}));
const publicDir = path_1.default.join(__dirname, "../public");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// webhook routes
app.use("/verify-payment", webhook_1.default);
const getLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 1000,
    message: {
        toastMessage: "Too many requests",
    }, // legacyHeaders: false,
});
const postLimiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 60 * 1000,
    max: 100,
    message: {
        toastMessage: "Too many requests",
    },
    // legacyHeaders: false,
});
app.use((0, helmet_1.default)({
    crossOriginResourcePolicy: false,
}));
app.use((0, cors_1.default)());
app.get("*", (req, res, next) => {
    if (req.path.split("/")[1] !== "public")
        getLimiter(req, res, next);
    else
        next();
});
app.post("*", postLimiter);
app.set("trust proxy", true);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/public", express_1.default.static(publicDir));
app.use(function (req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve) => setTimeout(resolve, 400));
        next();
    });
});
app.use(globalRoutes_1.default);
app.use(routes_2.default);
app.use("/admin", routes_1.default);
app.get("/cron", cron_1.manageCron);
app.use(errors_1.ErrorHandler);
app.get("/", (req, res, next) => {
    res.send("Yes, yippee you are at right place...");
});
app.listen(PORT, () => {
    const appUrl = `http://localhost:${PORT}`;
    console.log(`Listening to the ${appUrl}`);
});
