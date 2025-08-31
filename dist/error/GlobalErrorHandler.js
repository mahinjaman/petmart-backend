"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GlobalErrorHandler = void 0;
const sendResponse_1 = require("../features/sendResponse");
const GlobalErrorHandler = (err, req, res, next) => {
    const responseData = {
        statusCode: err.StatusCode || 500,
        success: false,
        message: err.message || "something went wrong...!",
        data: null
    };
    (0, sendResponse_1.sendResponse)(res, responseData);
};
exports.GlobalErrorHandler = GlobalErrorHandler;
