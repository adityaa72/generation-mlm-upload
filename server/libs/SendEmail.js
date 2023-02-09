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
const nodemailer_1 = __importDefault(require("nodemailer"));
const EmailDocument_1 = __importDefault(require("../email/EmailDocument"));
const Setting_1 = __importDefault(require("./Setting"));
const sendMail = (email, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    const setting = new Setting_1.default();
    const emailConfig = yield setting.emailSettings();
    const { encryption, host, password, port, username } = emailConfig;
    const appName = yield setting.appName();
    const transporter = nodemailer_1.default.createTransport({
        port,
        host,
        auth: {
            user: username,
            pass: password,
        },
        secure: encryption === "SSL",
    });
    html = yield (0, EmailDocument_1.default)(html);
    const mailOptions = {
        from: `${appName} ${username}`,
        subject,
        html,
        to: email,
    };
    return transporter.sendMail(mailOptions);
});
exports.default = sendMail;
