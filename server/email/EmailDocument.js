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
const config_1 = require("../config");
const Setting_1 = __importDefault(require("../libs/Setting"));
const format_1 = require("../utils/format");
const EmailDocument = (children) => __awaiter(void 0, void 0, void 0, function* () {
    const setting = new Setting_1.default();
    const appName = yield setting.appName();
    let logo = yield setting.logo();
    logo = (0, format_1.formatUrl)(logo);
    return `<!DOCTYPE html
  PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
</head>
<table style="width:100%;background-color:#F4F4F8;margin:0 auto;font-family:sans-serif" align="center" border="0"
  cellPadding="0" cellSpacing="0" role="presentation">
  <tbody>
    <tr style="display:grid;grid-auto-columns:minmax(0, 1fr);grid-auto-flow:column">
      <td>
        <div><!--[if mso | IE]>
            <table role="presentation" width="100%" align="center" style="max-width:600px;margin:20px auto;background-color:#ffffff;padding:40;"><tr><td></td><td style="width:37.5em;background:#ffffff">
          <![endif]--></div>
        <div style="max-width:600px;margin:20px auto;background-color:#ffffff;padding:40px">
          <table style="width:100%;margin-top:32px" align="center" border="0" cellPadding="0" cellSpacing="0"
            role="presentation">
            <tbody>
              <tr style="display:grid;grid-auto-columns:minmax(0, 1fr);grid-auto-flow:column">
                <td><img alt="${appName}"
                    src="${logo}"
                    height="40" style="display:block;outline:none;border:none;text-decoration:none" /></td>
              </tr>
            </tbody>
          </table>
              ${children}
              <table style="width:100%" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr style="display:grid;grid-auto-columns:minmax(0, 1fr);grid-auto-flow:column">
                  <td>
                    <p style="font-size:15px;line-height:24px;margin:16px 0;color:#333"><b>Regards, ${appName}</b></p>
                  </td>
                </tr>
              </tbody>
            </table>
            <table style="width:100%;font-size:12px;color:#b7b7b7;line-height:15px;text-align:center;margin-bottom:50px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
              <tbody>
                <tr style="display:grid;grid-auto-columns:minmax(0, 1fr);grid-auto-flow:column">
                  <td>
                    <p style="font-size:12px;line-height:15px;margin:16px 0;color:#b7b7b7;text-align:center;margin-bottom:50px">Copyright © 2023. All rights reserved <a target="_blank" style="color:#067df7;text-decoration:none" href="${config_1.APP_URL}">${appName}</a>.</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div><!--[if mso | IE]>
          </td><td></td></tr></table>
          <![endif]--></div>
        </td>
      </tr>
    </tbody>
  </table>
</html>`;
});
exports.default = EmailDocument;
