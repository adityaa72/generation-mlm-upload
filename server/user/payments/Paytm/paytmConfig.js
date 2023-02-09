"use strict";
// const PaytmConfig = {
//   MID: "WgbocG04046901552998",
//   MERCHANT_KEY: "&xMexbD%DUYhqGhX",
//   WEBSITE: "DEFAULT",
//   CHANNEL_ID: "WEB",
//   INDUSTRY_TYPE_ID: "Retail",
//   PAYTM_TXN_URL: "https://securegw.paytm.in/theia/processTransaction",
// };
Object.defineProperty(exports, "__esModule", { value: true });
const PaytmConfig = {
    MID: "WgbocG04046901552998",
    MERCHANT_KEY: "&xMDUYhqGhXexbD%",
    WEBSITE: "WEBSTAGING",
    CHANNEL_ID: "WEB",
    INDUSTRY_TYPE_ID: "Retail",
    PAYTM_TXN_URL: "https://securegw-stage.paytm.in/theia/processTransaction",
    VERIFY_STATUS_URL: "https://securegw-stage.paytm.in/v3/order/status",
};
exports.default = PaytmConfig;
