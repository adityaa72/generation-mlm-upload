"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const router = express_1.default.Router();
const auth_1 = require("../controllers/auth");
// routes
router.post("/login", express_useragent_1.default.express(), auth_1.login);
router.post("/register", auth_1.register);
router.post("/forgot-password", auth_1.forgotPassword);
router.post("/reset-password", auth_1.resetPassword);
router.delete("/token/:token", auth_1.deleteLoginSessionToken);
exports.default = router;
