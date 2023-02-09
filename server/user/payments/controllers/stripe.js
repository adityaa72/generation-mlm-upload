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
exports.verifyStripePayment = exports.createStripeTransaction = void 0;
const stripe_1 = __importDefault(require("stripe"));
const config_1 = require("../../../config");
const db_1 = __importDefault(require("../../../db"));
const AutomaticDepositGateway_1 = __importDefault(require("../../../libs/AutomaticDepositGateway"));
const Deposit_1 = __importDefault(require("../../../libs/Deposit"));
const Transaction_1 = __importDefault(require("../../../libs/Transaction"));
const tables_1 = require("../../../tables");
const fns_1 = require("../../../utils/fns");
const validate_1 = __importDefault(require("../../../utils/validate"));
const endpointSecret = "whsec_364017ea3b5b5df603e23583a7955eeb24c1444b440378b3957d2ddc97ca99b3";
const createStripeTransaction = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const StripeConfig = yield AutomaticDepositGateway_1.default.getStripeConfig();
    const stripe = new stripe_1.default(StripeConfig.SECRET_KEY, {
        apiVersion: "2022-11-15",
    });
    const conn = yield db_1.default.conn();
    conn.beginTransaction();
    const redirectUrl = config_1.DEPOSIT_SUCCESS_URL;
    try {
        const { userId } = req.locals;
        const reqBody = req.body;
        (0, validate_1.default)(reqBody, "body").object();
        const { amount: amountString } = reqBody;
        (0, validate_1.default)(amountString, "Amount").required().number().min(1);
        (0, validate_1.default)([amountString], "body").args();
        const amount = Number(amountString);
        const gatewayId = "Stripe";
        const gateway = yield AutomaticDepositGateway_1.default.createInstance(gatewayId);
        const gatewayName = yield gateway.name();
        const charge = yield gateway.getCharge(amount);
        yield gateway.checkStatus();
        const logo = yield gateway.logo();
        const transactionId = Transaction_1.default.generateTransactionId();
        const status = "pending";
        const type = "automatic";
        const netAmount = amount + charge;
        const category = "deposit";
        const description = `deposit - ${gatewayName}`;
        const currency = "INR";
        const session = yield stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: currency,
                        product_data: {
                            name: "Deposit",
                        },
                        unit_amount: netAmount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: redirectUrl,
            cancel_url: redirectUrl,
        });
        const stripeId = session.id;
        const tRowData = {
            transactionId,
            userId,
            amount: netAmount,
            charge,
            netAmount: amount,
            category,
            status,
            description,
            createdAt: (0, fns_1.currentDateTime)(),
            updatedAt: (0, fns_1.currentDateTime)(),
        };
        const rowData = {
            transactionId,
            userId,
            amount: netAmount,
            charge,
            netAmount: amount,
            currency,
            gatewayName,
            gatewayId,
            status,
            type,
            stripeId,
            actionBy: "user",
            createdAt: (0, fns_1.currentDateTime)(),
            logo,
        };
        const sql = `INSERT INTO ${tables_1.TRANSACTION_TBL} SET ?`;
        yield db_1.default.query(sql, tRowData);
        const dSql = `INSERT INTO ${tables_1.USER_DEPOSIT_TBL} SET ?`;
        yield db_1.default.query(dSql, rowData);
        yield conn.commit();
        return res.json({ url: session.url });
    }
    catch (error) {
        yield conn.rollback();
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.createStripeTransaction = createStripeTransaction;
const verifyStripePayment = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const conn = yield db_1.default.conn();
    conn.beginTransaction();
    const StripeConfig = yield AutomaticDepositGateway_1.default.getStripeConfig();
    const stripe = new stripe_1.default(StripeConfig.SECRET_KEY, {
        apiVersion: "2022-11-15",
    });
    try {
        const sig = req.headers["stripe-signature"];
        let event;
        try {
            event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        }
        catch (err) {
            console.log(`Webhook Error: ${err.message}`);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        if (!event)
            return;
        // Handle the event
        switch (event.type) {
            case "checkout.session.completed":
                const data = event.data.object;
                //@ts-ignore
                const { id: stripeId, amount_total, currency, status } = data;
                (0, validate_1.default)([stripeId, amount_total, currency, status], "body").args();
                const isStripeId = yield Deposit_1.default.isStripeId(stripeId);
                if (!isStripeId)
                    throw new Error(`No transaction details available for ${stripeId}`);
                const transactionId = yield Deposit_1.default.getTransactionIdByStripeId(stripeId);
                const deposit = yield Deposit_1.default.createInstance(transactionId, "No transaction record available");
                const dbStatus = yield deposit.status();
                const dbCurrency = yield deposit.currency();
                const amount = yield deposit.amount();
                if (Number(amount) !== Number(amount_total / 100))
                    throw new Error("Transaction amount not matching");
                if (dbCurrency.toLowerCase() !== currency.toLowerCase())
                    throw new Error("Payment failed invalid currency");
                if (dbStatus === "pending") {
                    if (status === "complete") {
                        const tUpdate = {
                            status: "credit",
                            updatedAt: (0, fns_1.currentDateTime)(),
                        };
                        const update = {
                            status: "credit",
                            updatedAt: (0, fns_1.currentDateTime)(),
                        };
                        const where = {
                            transactionId,
                            status: "pending",
                        };
                        const sql = `UPDATE ${tables_1.TRANSACTION_TBL} SET ? WHERE transactionId = ? AND status = ?`;
                        yield db_1.default.query(sql, [tUpdate, ...Object.values(where)]);
                        const dSql = `UPDATE ${tables_1.USER_DEPOSIT_TBL} SET ? WHERE transactionId = ? AND status = ?`;
                        yield db_1.default.query(dSql, [update, ...Object.values(where)]);
                    }
                    else {
                        const tUpdate = {
                            status: "failed",
                            updatedAt: (0, fns_1.currentDateTime)(),
                        };
                        const update = {
                            status: "failed",
                            updatedAt: (0, fns_1.currentDateTime)(),
                        };
                        const where = {
                            transactionId,
                            status: "pending",
                        };
                        const sql = `UPDATE ${tables_1.TRANSACTION_TBL} SET ? WHERE transactionId = ? AND status = ?`;
                        yield db_1.default.query(sql, [tUpdate, ...Object.values(where)]);
                        const dSql = `UPDATE ${tables_1.USER_DEPOSIT_TBL} SET ? WHERE transactionId = ? AND status = ?`;
                        yield db_1.default.query(dSql, [update, ...Object.values(where)]);
                    }
                }
                yield conn.commit();
                return res.send("okk");
                break;
            // ... handle other event types
            default:
                console.log(`Unhandled event type ${event === null || event === void 0 ? void 0 : event.type}`);
                return res.status(400).send(`Unhandled event type ${event === null || event === void 0 ? void 0 : event.type}`);
                break;
        }
    }
    catch (error) {
        yield conn.rollback();
        console.log("🚀 ~ file: stripe.ts:177 ~ verifyStripePayment ~ error", error);
        next(error);
    }
    finally {
        db_1.default.release();
    }
});
exports.verifyStripePayment = verifyStripePayment;
