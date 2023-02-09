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
exports.validatePaytmPayment = exports.initializePayment = void 0;
const AutomaticDepositGateway_1 = __importDefault(require("../../../libs/AutomaticDepositGateway"));
const PaytmChecksum_1 = __importDefault(require("./PaytmChecksum"));
const initializePayment = (amount, orderId, custId) => __awaiter(void 0, void 0, void 0, function* () {
    const PaytmConfig = yield AutomaticDepositGateway_1.default.getPaytmConfig();
    let paymentObj = {
        MID: PaytmConfig.MID,
        ORDER_ID: orderId,
        CHANNEL_ID: PaytmConfig.CHANNEL_ID,
        CUST_ID: custId,
        TXN_AMOUNT: amount,
        WEBSITE: PaytmConfig.WEBSITE,
        CALLBACK_URL: PaytmConfig.CALLBACK_URL,
        INDUSTRY_TYPE_ID: PaytmConfig.INDUSTRY_TYPE_ID,
    };
    const checksum = yield PaytmChecksum_1.default.generateSignature(paymentObj, PaytmConfig.MERCHANT_KEY);
    paymentObj.CHECKSUMHASH = checksum;
    paymentObj.PAYTM_TXN_URL = PaytmConfig.PAYTM_TXN_URL;
    return paymentObj;
});
exports.initializePayment = initializePayment;
const validatePaytmPayment = (paymentObject) => __awaiter(void 0, void 0, void 0, function* () {
    const PaytmConfig = yield AutomaticDepositGateway_1.default.getPaytmConfig();
    const verifyStatus = yield PaytmChecksum_1.default.verifySignature(paymentObject, PaytmConfig.MERCHANT_KEY, paymentObject.CHECKSUMHASH);
    return verifyStatus ? true : false;
});
exports.validatePaytmPayment = validatePaytmPayment;
