"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const network_1 = require("../controllers/network");
// routes
router.get("/genealogy", network_1.genealogy);
router.get("/tree", network_1.tree);
exports.default = router;
