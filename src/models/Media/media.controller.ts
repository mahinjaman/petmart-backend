import { Request, Response } from "express";
import { catchAsync } from "../../features/catchAsync";
import axios from "axios";
import fs from "fs";
import mime from "mime-types";
import { sendResponse } from "../../features/sendResponse";
import path from "path";
import { getAllImageIntoDb, getAllVideoIntoDb, manualFileUploadIntoDb } from "./media.service";

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
export const urlFileUpload = catchAsync(async (req: Request, res: Response) => {
    const { fileUrl, fileName } = req.body;

    if (!fileUrl) {
        return sendResponse(res, {
            message: "File URL is required",
            success: false,
            statusCode: 400,
            data: null
        });
    }

    // Validate URL format
    try {
        new URL(fileUrl);
    } catch {
        return sendResponse(res, {
            message: "Invalid URL format",
            success: false,
            statusCode: 400,
            data: null
        });
    }

    const response = await axios({
        method: "GET",
        url: fileUrl,
        responseType: "stream",
        timeout: 10000 // 10 seconds timeout
    });

    const contentType = response.headers["content-type"];
    const ext = mime.extension(contentType) || "";

    // Validate file type
    let fileType: "image" | "video" | null = null;
    if (MEDIA_TYPES.IMAGE.includes(ext)) {
        fileType = "image";
    } else if (MEDIA_TYPES.VIDEO.includes(ext)) {
        fileType = "video";
    } else {
        return sendResponse(res, {
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
    const savePath = path.join(__dirname, `../../upload/${mediaFolder}`, uniqueFileName);
    const fileUrlPath = `/media/${mediaFolder}/${uniqueFileName}`;
    const fullUrl = `${req.protocol}://${req.get('host')}${fileUrlPath}`;

    // Ensure directory exists
    fs.mkdirSync(path.dirname(savePath), { recursive: true });

    return new Promise<void>((resolve) => {
        const writer = fs.createWriteStream(savePath);
        response.data.pipe(writer);

        writer.on("finish", async () => {
            try {
                const fileStats = fs.statSync(savePath);

                // Prepare file data for database matching your manualFileUploadIntoDb structure
                const fileData = {
                    originalname: uniqueFileName,
                    mimetype: contentType,
                    size: fileStats.size,
                    path: savePath,
                    filename: uniqueFileName
                };

                // Save to database
                const result = await manualFileUploadIntoDb(fileData);

                sendResponse(res, {
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
            } catch (dbError) {
                // If database operation fails, delete the uploaded file
                fs.unlinkSync(savePath);
                sendResponse(res, {
                    message: "File uploaded but failed to save database record",
                    success: false,
                    statusCode: 500,
                    data: { error: dbError }
                });
            }
            resolve();
        });

        writer.on("error", (error) => {
            sendResponse(res, {
                message: "Failed to save file",
                success: false,
                statusCode: 500,
                data: { error: error.message }
            });
            resolve();
        });
    });
});

/**
 * @function manualFileUpload
 * @description Handles direct file uploads via multipart/form-data
 * @param {Request} req - Express request with file
 * @param {Response} res - Express response
 */
export const manualFileUpload = catchAsync(async (req: Request, res: Response) => {
    if (!req.file) {
        return sendResponse(res, {
            message: "No file uploaded",
            success: false,
            statusCode: 400,
            data: null
        });
    }

    const result = await manualFileUploadIntoDb(req.file);

    if (!result) {
        return sendResponse(res, {
            message: "File upload failed",
            success: false,
            statusCode: 500,
            data: null
        });
    }

    return sendResponse(res, {
        message: "File uploaded successfully",
        success: true,
        statusCode: 200,
        data: result
    });
});

/**
 * @function getMediaFile
 * @description Streams media files with proper headers and range support
 * @param {Request} req - Express request with type and fileName params
 * @param {Response} res - Express response
 */
export const getMediaFile = catchAsync(async (req: Request, res: Response) => {
    const { type, fileName } = req.params;

    if (!["image", "video"].includes(type)) {
        return sendResponse(res, {
            message: "Invalid media type",
            success: false,
            statusCode: 400,
            data: { supportedTypes: ["image", "video"] }
        });
    }

    // Prevent directory traversal
    if (fileName.includes("../") || fileName.includes("..\\")) {
        return sendResponse(res, {
            message: "Invalid file name",
            success: false,
            statusCode: 400,
            data: null
        });
    }

    const folderPath = path.join(__dirname, `../../upload/${type}s`);
    const filePath = path.join(folderPath, fileName);

    if (!fs.existsSync(filePath)) {
        return sendResponse(res, {
            message: "File not found",
            success: false,
            statusCode: 404,
            data: null
        });
    }

    if (type === "image") {
        const mimeType = mime.lookup(filePath) || "application/octet-stream";
        res.setHeader("Content-Type", mimeType);
        fs.createReadStream(filePath).pipe(res);
        return;
    }

    // Video streaming with range support
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;

    if (!range) {
        const mimeType = mime.lookup(filePath) || "video/mp4";
        res.writeHead(200, {
            "Content-Length": fileSize,
            "Content-Type": mimeType,
        });
        fs.createReadStream(filePath).pipe(res);
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
    const mimeType = mime.lookup(filePath) || "video/mp4";
    res.writeHead(206, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": chunksize,
        "Content-Type": mimeType,
    });

    fs.createReadStream(filePath, { start, end }).pipe(res);
});

/**
 * @desc    Fetches all image records from the database and returns them in the response.
 *          If no images are found, responds with a 404 status and a descriptive message.
 *          If an unexpected condition occurs (like invalid data type), it responds with
 *          a 400 status and the list of supported media types.
 * 
 * @route   GET /api/media/images
 * @access  Public
 */
export const getAllImage = catchAsync(async (req: Request, res: Response) => {
    const result = await getAllImageIntoDb();

    // If no images found, send a 404 response
    if (!result || result.length === 0) {
        return sendResponse(res, {
            message: "No media files found in the database.",
            success: false,
            statusCode: 404,
            data: null
        });
    }

    // ✅ If valid images found, send a success response
    return sendResponse(res, {
        message: "Media files retrieved successfully.",
        success: true,
        statusCode: 200,
        data: result
    });
});


export const getAllVideo = catchAsync(async (req: Request, res: Response) => {
    const result = await getAllVideoIntoDb();

    // If no images found, send a 404 response
    if (!result || result.length === 0) {
        return sendResponse(res, {
            message: "No media files found in the database.",
            success: false,
            statusCode: 404,
            data: null
        });
    }

    // ✅ If valid images found, send a success response
    return sendResponse(res, {
        message: "Media files retrieved successfully.",
        success: true,
        statusCode: 200,
        data: result
    });
});
