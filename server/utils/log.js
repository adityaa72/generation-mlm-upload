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
Object.defineProperty(exports, "__esModule", { value: true });
exports.logData = void 0;
const fns_1 = require("./fns");
const fs = require("fs").promises;
const f = require("fs");
const logData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const text = JSON.stringify({ data, time: (0, fns_1.currentDateTime)() }) + ",\n";
    const isFileExist = f.existsSync("log.json");
    if (isFileExist) {
        fs.appendFile("log.json", text);
    }
    else {
        fs.writeFile("log.json", text);
    }
});
exports.logData = logData;
