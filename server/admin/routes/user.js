"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_useragent_1 = __importDefault(require("express-useragent"));
const router = express_1.default.Router();
const user_1 = require("../controllers/user");
router.post("/list/:status", user_1.usersList);
router.get("/profile/:userId", user_1.getUserProfile);
router.patch("/status/:userId", user_1.updateUserStatus);
router.post("/balance/add/:userId", user_1.addBalanceToUser);
router.post("/balance/subtract/:userId", user_1.subtractBalanceFromUser);
router.patch("/profile/:userId", user_1.updateUserKyc);
router.get("/login/token/:userId", express_useragent_1.default.express(), user_1.generateLoginToken);
exports.default = router;
