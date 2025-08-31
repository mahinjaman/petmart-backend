"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestDataValidation = void 0;
const AppError_1 = require("../error/AppError");
const requestDataValidation = (validationSchema) => {
    return (req, res, next) => {
        const data = req.body;
        if (!data) {
            return next(new AppError_1.AppError(400, 'Product data is required'));
        }
        try {
            const validData = validationSchema.parse(data);
            req.body = validData;
            next();
        }
        catch (error) {
            return next(new AppError_1.AppError(422, 'Validation failed', error));
        }
    };
};
exports.requestDataValidation = requestDataValidation;
