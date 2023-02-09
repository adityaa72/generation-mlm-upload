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
exports.uploadFile = void 0;
const multer_1 = __importDefault(require("multer"));
const fns_1 = require("./utils/fns");
const DIR = "./public/files";
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR);
    },
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(" ").join("-");
        cb(null, Date.now() + "-" + fileName);
    },
});
const upload = (0, multer_1.default)({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" ||
            file.mimetype == "image/jpg" ||
            file.mimetype == "image/jpeg") {
            cb(null, true);
        }
        else {
            console.log(cb);
            console.log(file);
            // cb(null, false);
            cb(new Error("Only .png, .jpg and .jpeg formats are allowed"));
        }
    },
}).single("file");
const uploadFile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        upload(req, res, (err) => {
            if (err) {
                return next(err);
            }
            return res.send({
                fileName: req.file.filename,
                fileUrl: (0, fns_1.getFileUrl)(req.file.filename),
            });
        });
    }
    catch (error) {
        next(error);
    }
});
exports.uploadFile = uploadFile;
