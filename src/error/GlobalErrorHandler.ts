import { NextFunction, Request, Response } from "express";
import { sendResponse } from "../features/sendResponse";

export const GlobalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    const responseData = {
        statusCode: err.StatusCode || 500,
        success: false,
        message: err.message || "something went wrong...!",
        data: null
    }
    sendResponse(res, responseData)
}