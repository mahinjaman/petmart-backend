import { Media } from "./media.model";

export const manualFileUploadIntoDb = async (fileInfo: any) => {
    const actualFilename = fileInfo.filename;
    const fileType = fileInfo.mimetype.split('/')[0];

    const mediaFile = {
        file_name: fileInfo.originalname || "",
        file_url: `/media/${fileType}/${actualFilename}` || "",
        file_type: fileInfo.mimetype.split("/")[0] || "",
        file_size: `${(fileInfo.size / 1024 / 1024).toFixed(1)} MB`
    };

    const result = await Media.create(mediaFile);
    return result;
}

export const getAllImageIntoDb = async () => {
    const result = await Media.find({ file_type: "image" });
    return result
}

export const getAllVideoIntoDb = async () => {
    const result = await Media.find({ file_type: "video" });
    return result
}