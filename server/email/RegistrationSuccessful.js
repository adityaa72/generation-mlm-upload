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
const moment_1 = __importDefault(require("moment"));
const Setting_1 = __importDefault(require("../libs/Setting"));
const User_1 = __importDefault(require("../libs/User"));
const RegistrationSuccessful = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.createInstance(userId);
    const userName = yield user.userName();
    const email = yield user.email();
    const referralId = yield user.referralId();
    const placementId = yield user.placementId();
    const createdAt = yield user.createdAt();
    const setting = new Setting_1.default();
    const appName = yield setting.appName();
    const createdAtText = (0, moment_1.default)(createdAt).format("YYYY-MM-DD HH:mm:ss");
    return ` <p style="font-size:36px;line-height:42px;margin:30px 0;color:#1d1c1d;font-weight:700;padding:0">Registration Successful</p>
              <p style="font-size:20px;line-height:28px;margin:16px 0;margin-bottom:30px">Hey Jamsrworld, Your account has been created successfully! Here is your registration details.</p>
              <table style="width:100%;background:rgb(245, 244, 245);border-radius:4px;margin-right:50px;margin-bottom:30px;padding:43px 23px" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
                <tbody>
                  <tr style="display:grid;grid-auto-columns:minmax(0, 1fr);grid-auto-flow:column">
                    <td>
                  <tr>
                    <td>
                      <p style="font-size:18px;margin:16px 0;color:#637381">User Id</p>
                    </td>
                    <td>
                      <p style="font-size:18px;margin:16px 0;color:#637381">${userId}</p>
                    </td>
                  </tr>
          </td>
          <td>
        <tr>
          <td>
            <p style="font-size:18px;margin:16px 0;color:#637381">Username</p>
          </td>
          <td>
            <p style="font-size:18px;margin:16px 0;color:#637381">${userName}</p>
          </td>
        </tr>
        </td>
        <td>
          <tr>
            <td>
              <p style="font-size:18px;margin:16px 0;color:#637381">Email</p>
            </td>
            <td>
              <p style="font-size:18px;margin:16px 0;color:#637381">${email}</p>
            </td>
          </tr>
        </td>
        <td>
          <tr>
            <td>
              <p style="font-size:18px;margin:16px 0;color:#637381">Referral Id</p>
            </td>
            <td>
              <p style="font-size:18px;margin:16px 0;color:#637381">${referralId}</p>
            </td>
          </tr>
        </td>
        <td>
          <tr>
            <td>
              <p style="font-size:18px;margin:16px 0;color:#637381">Placement Id</p>
            </td>
            <td>
              <p style="font-size:18px;margin:16px 0;color:#637381">${placementId}</p>
            </td>
          </tr>
        </td>
        <td>
          <tr>
            <td>
              <p style="font-size:18px;margin:16px 0;color:#637381">Registration Date</p>
            </td>
            <td>
              <p style="font-size:18px;margin:16px 0;color:#637381">${createdAtText}</p>
            </td>
          </tr>
        </td>
        </tr>
      </tbody>
    </table>
    <table style="width:100%" align="center" border="0" cellPadding="0" cellSpacing="0" role="presentation">
    <tbody>
      <tr style="display:grid;grid-auto-columns:minmax(0, 1fr);grid-auto-flow:column">
        <td>
          <p style="font-size:15px;line-height:24px;margin:16px 0;color:#333">Thanks for becoming a member of ${appName}</p>
        </td>
      </tr>
    </tbody>
  </table>`;
});
exports.default = RegistrationSuccessful;
