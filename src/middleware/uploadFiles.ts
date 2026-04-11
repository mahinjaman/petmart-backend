import multer from "multer"
const uploadDir = "./../"
export const uploadThumbnail = multer({
    dest: uploadDir,
})
