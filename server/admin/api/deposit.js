"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentMethods = exports.InstantPaymentMethods = void 0;
exports.InstantPaymentMethods = [
    "Paytm",
    "Paypal",
    "Payu",
    "Razorpay",
    "Stripe",
    "Flutterwave",
];
exports.PaymentMethods = [
    {
        gatewayId: "Paytm",
        name: "Paytm",
        logo: "images/paytm.jpg",
        image: "images/paytm-1.png",
        config: [
            {
                key: "MID",
                label: "Merchant Id",
            },
            {
                key: "MERCHANT_KEY",
                label: "Merchant Key",
            },
            {
                key: "ENVIRONMENT",
                label: "Environment",
                options: ["test", "production"],
            },
        ],
    },
    {
        gatewayId: "Paypal",
        name: "Paypal",
        logo: "images/paypal.png",
        image: "images/paypal-1.png",
        config: [
            {
                key: "email",
                label: "Email",
            },
            {
                key: "CLIENT_ID",
                label: "Client Id",
            },
            {
                key: "CLIENT_SECRET",
                label: "Client Secret",
            },
        ],
    },
    {
        gatewayId: "Payu",
        name: "Payu",
        logo: "images/payu.png",
        image: "images/payu-1.png",
        config: [
            {
                key: "KEY",
                label: "Key",
            },
            {
                key: "SALT",
                label: "Salt",
            },
        ],
    },
    {
        gatewayId: "Razorpay",
        name: "Razorpay",
        logo: "images/razorpay.png",
        image: "images/razorpay-1.png",
        config: [
            {
                key: "PUBLIC_KEY",
                label: "Public Key",
            },
            {
                key: "SECRET_KEY",
                label: "Secret Key",
            },
        ],
    },
    {
        gatewayId: "Stripe",
        name: "Stripe",
        logo: "images/stripe.jpg",
        image: "images/stripe-1.png",
        config: [
            {
                key: "PUBLISHABLE_KEY",
                label: "Publishable Key",
            },
            {
                key: "SECRET_KEY",
                label: "Secret Key",
            },
        ],
    },
    {
        gatewayId: "Flutterwave",
        name: "Flutterwave",
        logo: "images/flutterwave.png",
        image: "images/flutterwave-1.png",
        config: [
            {
                key: "PUBLIC_KEY",
                label: "Public Key",
            },
            {
                key: "SECRET_KEY",
                label: "Secret Key",
            },
        ],
    },
];
