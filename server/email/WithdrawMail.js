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
const Withdraw_1 = __importDefault(require("../libs/Withdraw"));
const format_1 = require("../utils/format");
const WithdrawMail = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    const deposit = yield Withdraw_1.default.createInstance(transactionId);
    const user = yield deposit.user();
    const amount = yield deposit.amount();
    const charge = yield deposit.charge();
    const netAmount = yield deposit.netAmount();
    const gatewayName = yield deposit.gatewayName();
    const status = yield deposit.status();
    const amountText = yield (0, format_1.fCurrency)(amount);
    const chargeText = yield (0, format_1.fCurrency)(charge);
    const netAmountText = yield (0, format_1.fCurrency)(netAmount);
    const userName = yield user.userName();
    let titleEve;
    let title;
    if (status === "pending") {
        titleEve = "submitted";
        title = "Requested";
    }
    else if (status === "rejected") {
        titleEve = "rejected";
        title = "Rejected";
    }
    else if (status === "success") {
        titleEve = "success";
        title = "Successful";
    }
    else
        return;
    let html = `<p style="font-size:36px;line-height:42px;margin:30px 0;color:#1d1c1d;font-weight:700;padding:0">Withdraw ${title}</p>
<p style="font-size:16px;line-height:24px;margin:16px 0;color:#333">Hello, ${userName}</p>
<p style="font-size:16px;line-height:24px;margin:16px 0;color:#333">Your withdraw request of ${netAmountText} via ${gatewayName} has been
 ${titleEve} .</p>
<p style="font-size:16px;line-height:24px;margin:16px 0;color:#333"><b>Withdraw details:</b></p>
<table
    style="width:100%;background:rgb(245, 244, 245);border-radius:4px;margin-right:50px;margin-bottom:30px;padding:43px 23px"
    align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
    <tbody>
    <tr style="display:grid;grid-auto-columns:minmax(0, 1fr);grid-auto-flow:column">
        <td>
    <tr>
        <td>
            <p style="font-size:18px;margin:16px 0;color:#637381">Amount</p>
        </td>
        <td>
            <p style="font-size:18px;margin:16px 0;color:#637381">
                ${amountText}
            </p>
        </td>
    </tr>
    </td>
    <td>
        <tr>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">
                   Charge
                </p>
            </td>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">
                    ${chargeText}
                </p>
            </td>
        </tr>
    </td>
    <td>
        <tr>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">
                Net Amount
                </p>
            </td>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">
                ${netAmountText}
                </p>
            </td>
        </tr>
    </td>
    <td>
        <tr>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">
                    Payment Method
                </p>
            </td>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">
                    ${gatewayName}
                </p>
            </td>
        </tr>
    </td>
    <td>
        <tr>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">Status</p>
            </td>
            <td>
                <p style="font-size:18px;margin:16px 0;color:#637381">${status}</p>
            </td>
        </tr>
    </td>
    </tr>
</tbody>
</table>`;
    if (status === "pending") {
        html += `
    <table style="width:100%" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
        <tbody>
            <tr style="display:grid;grid-auto-columns:minmax(0, 1fr);grid-auto-flow:column">
                <td>
                    <p style="font-size:16px;line-height:24px;margin:16px 0;color:#333">You&#x27;ll get a notification email
                        when withdraw request will be verified.</p>
                </td>
            </tr>
        </tbody>
    </table>`;
    }
    return html;
});
exports.default = WithdrawMail;
