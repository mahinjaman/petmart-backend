"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadVideo = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Allowed MIME types
const ALLOWED_IMAGE_MIME_TYPES = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/gif",
    "image/avif",
    "image/webp",
];
const ALLOWED_VIDEO_MIME_TYPES = [
    "video/mp4",
    "video/quicktime",
    "video/x-msvideo",
    "video/webm",
    "video/x-matroska",
    "video/x-flv",
    "video/x-ms-wmv",
    "video/mpeg",
];
const createStorage = (folderName) => multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path_1.default.join(__dirname, `../upload/${folderName}`));
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        cb(null, uniqueName);
    },
});
const createFileFilter = (allowedMimeTypes) => (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Invalid file type: ${file.mimetype}`));
    }
};
// Multer upload handlers
exports.uploadImage = (0, multer_1.default)({
    storage: createStorage("images"),
    fileFilter: createFileFilter(ALLOWED_IMAGE_MIME_TYPES),
});
exports.uploadVideo = (0, multer_1.default)({
    storage: createStorage("videos"),
    fileFilter: createFileFilter(ALLOWED_VIDEO_MIME_TYPES),
});
