"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentGateways_1 = require("../controllers/paymentGateways");
const router = express_1.default.Router();
// withdraw
router.get("/withdraw/fetch/:id", paymentGateways_1.getWithdrawDetails);
router.post("/withdraw/create", paymentGateways_1.createWithdrawGateway);
router.post("/withdraw/list", paymentGateways_1.withdrawList);
router.post("/withdraw/update-status/:id", paymentGateways_1.updateWithdrawStatus);
router.delete("/withdraw/delete/:id", paymentGateways_1.deleteWithdrawGateway);
// automatic deposit
router.get("/automatic-deposit/list", paymentGateways_1.getAutomaticDepositGatewayList);
router.get("/automatic-deposit/create-list", paymentGateways_1.getAutomaticDepositGatewayCreateList);
router.get("/automatic-deposit/fetch/:id", paymentGateways_1.getAutomaticDepositGatewayDetails);
router.post("/automatic-deposit/create/:id", paymentGateways_1.createAutomaticDepositGateway);
router.post("/automatic-deposit/update-status/:id", paymentGateways_1.updateAutomaticDepositGatewayStatus);
router.delete("/automatic-deposit/delete/:gatewayId", paymentGateways_1.deleteInstantDepositGateway);
// manual deposit
router.get("/manual-deposit/list", paymentGateways_1.getManualDepositGatewayList);
router.post("/manual-deposit/create", paymentGateways_1.createManualDepositGateway);
router.post("/manual-deposit/update-status/:id", paymentGateways_1.updateManualDepositGatewayStatus);
router.get("/manual-deposit/fetch/:id", paymentGateways_1.getManualDepositGatewayDetails);
router.delete("/manual-deposit/delete/:id", paymentGateways_1.deleteManualDepositGateway);
exports.default = router;
