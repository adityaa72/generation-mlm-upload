"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const support_1 = require("../controllers/support");
router.post("/ticket-list/:status", support_1.supportTickets);
router.get("/fetch-ticket/:id", support_1.getTicketData);
router.patch("/close-ticket/:id", support_1.closeTicket);
router.post("/reply", support_1.replyToTicket);
exports.default = router;
