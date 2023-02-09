"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fetch_1 = require("../controllers/fetch");
const router = express_1.default.Router();
router.get("/user/:id", fetch_1.fetchUser);
router.get("/username/:userName", fetch_1.validateUniqueUserName);
router.get("/register/user/:id", fetch_1.fetchUserRegisterData);
exports.default = router;
