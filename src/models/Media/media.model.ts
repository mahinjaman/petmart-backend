import { model, Schema } from "mongoose";
import { IFIle } from "./media.interface";

const fileSchema = new Schema<IFIle>({
    file_name: {
        type: String,
        required: true
    },
    file_url: {
        type: String,
        required: true
    },
    file_type: {
        type: String,
        required: true
    },
    file_size: {
        type: String,
        required: true
    },
}, { timestamps: true });


export const Media = model<IFIle>("Media", fileSchema)