"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Media = void 0;
const mongoose_1 = require("mongoose");
const fileSchema = new mongoose_1.Schema({
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
exports.Media = (0, mongoose_1.model)("Media", fileSchema);
