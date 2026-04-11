import multer, { FileFilterCallback, StorageEngine } from "multer";
import path from "path";
import { Request } from "express";

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

const createStorage = (folderName: string): StorageEngine =>
    multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, path.join(__dirname, `../upload/${folderName}`));
        },
        filename: (req, file, cb) => {
            const uniqueName = `${Date.now()}-${file.originalname}`;
            cb(null, uniqueName);
        },
    });

const createFileFilter = (allowedMimeTypes: string[]) =>
    (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error(`Invalid file type: ${file.mimetype}`));
        }
    };

// Multer upload handlers
export const uploadImage = multer({
    storage: createStorage("images"),
    fileFilter: createFileFilter(ALLOWED_IMAGE_MIME_TYPES),
});

export const uploadVideo = multer({
    storage: createStorage("videos"),
    fileFilter: createFileFilter(ALLOWED_VIDEO_MIME_TYPES),
});
