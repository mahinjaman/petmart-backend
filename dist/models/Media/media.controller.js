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
exports.getAllVideo = exports.getAllImage = exports.getMediaFile = exports.manualFileUpload = exports.urlFileUpload = void 0;
const catchAsync_1 = require("../../features/catchAsync");
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
const mime_types_1 = __importDefault(require("mime-types"));
const sendResponse_1 = require("../../features/sendResponse");
const path_1 = __importDefault(require("path"));
const media_service_1 = require("./media.service");
// Constants for better maintainability
const MEDIA_TYPES = {
    IMAGE: ["jpg", "jpeg", "png", "gif", "webp", "avif"],
    VIDEO: ["mp4", "mov", "avi", "mkv", "webm", "avi"],
    MAX_FILE_NAME_LENGTH: 255
};
/**
 * @function urlFileUpload
 * @description Uploads a file from a URL to the server
 * @param {Request} req - Express request with { fileUrl: string, fileName?: string }
 * @param {Response} res - Express response
 * @returns {Promise<void>} Sends response with file details or error
 */
exports.urlFileUpload = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { fileUrl, fileName } = req.body;
    if (!fileUrl) {
        return (0, sendResponse_1.sendResponse)(res, {
            message: "File URL is required",
            success: false,
            statusCode: 400,
            data: null
        });
    }
    // Validate URL format
    try {
        new URL(fileUrl);
    }
    catch (_a) {
        return (0, sendResponse_1.sendResponse)(res, {
            message: "Invalid URL format",
            success: false,
            statusCode: 400,
            data: null
        });
    }
    const response = yield (0, axios_1.default)({
        method: "GET",
        url: fileUrl,
        responseType: "stream",
        timeout: 10000 // 10 seconds timeout
    });
    const contentType = response.headers["content-type"];
    const ext = mime_types_1.default.extension(contentType) || "";
    // Validate file type
    let fileType = null;
    if (MEDIA_TYPES.IMAGE.includes(ext)) {
        fileType = "image";
    }
    else if (MEDIA_TYPES.VIDEO.includes(ext)) {
        fileType = "video";
    }
    else {
        return (0, sendResponse_1.sendResponse)(res, {
            message: "Only image or video files are allowed",
            success: false,
            statusCode: 400,
            data: { supportedTypes: [...MEDIA_TYPES.IMAGE, ...MEDIA_TYPES.VIDEO] }
        });
    }
    // Sanitize filename
    const sanitizedFileName = (fileName || "media")
        .replace(/[^a-zA-Z0-9-_.]/g, "")
        .substring(0, MEDIA_TYPES.MAX_FILE_NAME_LENGTH);
    const uniqueFileName = `${sanitizedFileName}-${Date.now()}.${ext}`;
    const mediaFolder = fileType === "image" ? "images" : "videos";
    const savePath = path_1.default.join(__dirname, `../../upload/${mediaFolder}`, uniqueFileName);
    const fileUrlPath = `/media/${mediaFolder}/${uniqueFileName}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${fileUrlPath}`;
    // Ensure directory exists
    fs_1.default.mkdirSync(path_1.default.dirname(savePath), { recursive: true });
    return new Promise((resolve) => {
        const writer = fs_1.default.createWriteStream(savePath);
        response.data.pipe(writer);
        writer.on("finish", () => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const fileStats = fs_1.default.statSync(savePath);
                // Prepare file data for database matching your manualFileUploadIntoDb structure
                const fileData = {
                    originalname: uniqueFileName,
                    mimetype: contentType,
                    size: fileStats.size,
                    path: savePath,
                    filename: uniqueFileName
                };
                // Save to database
                const result = yield (0, media_service_1.manualFileUploadIntoDb)(fileData);
                (0, sendResponse_1.sendResponse)(res, {
                    message: "File uploaded and saved successfully",
                    success: true,
                    statusCode: 200,
                    data: {
                        dbRecord: result,
                        fileInfo: {
                            fileType,
                            fileName: uniqueFileName,
                            path: fileUrlPath,
                            fullUrl,
                            size: `${(fileStats.size / 1024 / 1024).toFixed(1)} MB`
                        }
                    }
                });
            }
            catch (dbError) {
                // If database operation fails, delete the uploaded file
                fs_1.default.unlinkSync(savePath);
                (0, sendResponse_1.sendResponse)(res, {
                    message: "File uploaded but failed to save database record",
                    success: false,
                    statusCode: 500,
                    data: { error: dbError }
                });
            }
            resolve();
        }));
        writer.on("error", (error) => {
            (0, sendResponse_1.sendResponse)(res, {
                message: "Failed to save file",
                success: false,
                statusCode: 500,
                data: { error: error.message }
            });
            resolve();
        });
    });
}));
/**
 * @function manualFileUpload
 * @description Handles direct file uploads via multipart/form-data
 * @param {Request} req - Express request with file
 * @param {Response} res - Express response
 */
exports.manualFileUpload = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.file) {
        return (0, sendResponse_1.sendResponse)(res, {
            message: "No file uploaded",
            success: false,
            statusCode: 400,
            data: null
        });
    }
    const result = yield (0, media_service_1.manualFileUploadIntoDb)(req.file);
    if (!result) {
        return (0, sendResponse_1.sendResponse)(res, {
            message: "File upload failed",
            success: false,
            statusCode: 500,
            data: null
        });
    }
    return (0, sendResponse_1.sendResponse)(res, {
        message: "File uploaded successfully",
        success: true,
        statusCode: 200,
        data: result
    });
}));
/**
 * @function getMediaFile
 * @description Streams media files with proper headers and range support
 * @param {Request} req - Express request with type and fileName params
 * @param {Response} res - Express response
 */
exports.getMediaFile = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type, fileName } = req.params;
    if (!["image", "video"].includes(type)) {
        return (0, sendResponse_1.sendResponse)(res, {
            message: "Invalid media type",
            success: false,
            statusCode: 400,
            data: { supportedTypes: ["image", "video"] }
        });
    }
    // Prevent directory traversal
    if (fileName.includes("../") || fileName.includes("..\\")) {
        return (0, sendResponse_1.sendResponse)(res, {
            message: "Invalid file name",
            success: false,
            statusCode: 400,
            data: null
        });
    }
    const folderPath = path_1.default.join(__dirname, `../../upload/${type}s`);
    const filePath = path_1.default.join(folderPath, fileName);
    if (!fs_1.default.existsSync(filePath)) {
        return (0, sendResponse_1.sendResponse)(res, {
            message: "File not found",
            success: false,
            statusCode: 404,
            data: null
        });
    }
    if (type === "image") {
        const mimeType = mime_types_1.default.lookup(filePath) || "application/octet-stream";
        res.setHeader("Content-Type", mimeType);
        fs_1.default.createReadStream(filePath).pipe(res);
        return;
    }
    // Video streaming with range support
    const stat = fs_1.default.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (!range) {
        const mimeType = mime_types_1.default.lookup(filePath) || "video/mp4";
        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": mimeType,
        });
        fs_1.default.createReadStream(filePath).pipe(res);
        return;
    }
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    if (start >= fileSize) {
        res.status(416).send("Requested range not satisfiable");
        return;
    }
    const chunksize = end - start + 1;
    const mimeType = mime_types_1.default.lookup(filePath) || "video/mp4";
    res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": mimeType,
    });
    fs_1.default.createReadStream(filePath, { start, end }).pipe(res);
}));
/**
 * @desc    Fetches all image records from the database and returns them in the response.
 *          If no images are found, responds with a 404 status and a descriptive message.
 *          If an unexpected condition occurs (like invalid data type), it responds with
 *          a 400 status and the list of supported media types.
 *
 * @route   GET /api/media/images
 * @access  Public
 */
exports.getAllImage = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, media_service_1.getAllImageIntoDb)();
    // If no images found, send a 404 response
    if (!result || result.length === 0) {
        return (0, sendResponse_1.sendResponse)(res, {
            message: "No media files found in the database.",
            success: false,
            statusCode: 404,
            data: null
        });
    }
    // ✅ If valid images found, send a success response
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Media files retrieved successfully.",
        success: true,
        statusCode: 200,
        data: result
    });
}));
exports.getAllVideo = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield (0, media_service_1.getAllVideoIntoDb)();
    // If no images found, send a 404 response
    if (!result || result.length === 0) {
        return (0, sendResponse_1.sendResponse)(res, {
            message: "No media files found in the database.",
            success: false,
            statusCode: 404,
            data: null
        });
    }
    // ✅ If valid images found, send a success response
    return (0, sendResponse_1.sendResponse)(res, {
        message: "Media files retrieved successfully.",
        success: true,
        statusCode: 200,
        data: result
    });
}));
