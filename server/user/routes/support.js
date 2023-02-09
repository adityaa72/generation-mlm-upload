"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const support_1 = require("../controllers/support");
// routes
router.get("/ticket/:ticketId", support_1.fetchTicket);
router.post("/create-ticket", support_1.createTicket);
router.delete("/close-ticket/:ticketId", support_1.closeTicket);
router.post("/tickets", support_1.supportTickets);
exports.default = router;
