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
exports.getAllVideoIntoDb = exports.getAllImageIntoDb = exports.manualFileUploadIntoDb = void 0;
const media_model_1 = require("./media.model");
const manualFileUploadIntoDb = (fileInfo) => __awaiter(void 0, void 0, void 0, function* () {
    const actualFilename = fileInfo.filename;
    const fileType = fileInfo.mimetype.split('/')[0];
    const mediaFile = {
        file_name: fileInfo.originalname || "",
        file_url: `/media/${fileType}/${actualFilename}` || "",
        file_type: fileInfo.mimetype.split("/")[0] || "",
        file_size: `${(fileInfo.size / 1024 / 1024).toFixed(1)} MB`
    };
    const result = yield media_model_1.Media.create(mediaFile);
    return result;
});
exports.manualFileUploadIntoDb = manualFileUploadIntoDb;
const getAllImageIntoDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield media_model_1.Media.find({ file_type: "image" });
    return result;
});
exports.getAllImageIntoDb = getAllImageIntoDb;
const getAllVideoIntoDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield media_model_1.Media.find({ file_type: "video" });
    return result;
});
exports.getAllVideoIntoDb = getAllVideoIntoDb;
