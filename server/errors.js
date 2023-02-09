"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = exports.ErrorHandler = exports.ClientError = exports.AuthError = exports.ServerError = exports.HttpError = void 0;
class HttpError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.HttpError = HttpError;
class ServerError extends Error {
    constructor(message) {
        super(message);
        this.status = 500;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ServerError = ServerError;
class AuthError extends Error {
    constructor() {
        super();
        this.status = 403;
        this.message = "You don't have permission to access this data";
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AuthError = AuthError;
class ClientError extends Error {
    constructor(message) {
        super(message);
        this.status = 400;
        this.message = message;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ClientError = ClientError;
const ErrorHandler = (err, req, res, next) => {
    const success = err.success || false;
    const status = err.status || 500;
    const message = err.message || "Something went wrong!";
    console.log(err);
    Error.captureStackTrace(err);
    res.status(status).json({
        success,
        status,
        toastMessage: message,
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
exports.ErrorHandler = ErrorHandler;
const sendResponse = (res, toastMessage, response, status = 200) => {
    return res.status(status).json(Object.assign({ success: true, status, toastMessage }, response));
};
exports.sendResponse = sendResponse;
