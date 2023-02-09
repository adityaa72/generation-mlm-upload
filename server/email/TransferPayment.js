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
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../libs/User"));
const format_1 = require("../utils/format");
const TransferPayment = (userId, agentId, amount, event) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.createInstance(userId);
    const userName = yield user.userName();
    const agentUser = yield User_1.default.createInstance(agentId);
    const agentUserName = yield agentUser.userName();
    const amountText = yield (0, format_1.fCurrency)(amount);
    let message;
    let title;
    if (event === "transferred") {
        message = `You have transferred ${amountText} to ${agentUserName} (${agentId})`;
        title = "Payment Transfer";
    }
    else {
        message = `You have received ${amountText} from ${agentUserName} (${agentId})`;
        title = "Payment Received";
    }
    return `<p style="font-size:36px;line-height:42px;margin:30px 0;color:#1d1c1d;font-weight:700;padding:0">${title}</p>
<p style="font-size:20px;line-height:28px;margin:16px 0;margin-bottom:30px">Hello ${userName}, ${message}</p>`;
});
exports.default = TransferPayment;
