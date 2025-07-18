import { Response } from "express";


export const sendResponse = (res: Response, data: {
    statusCode: number,
    success: boolean,
    message: string,
    data: any
}) => {
    res.status(data.statusCode || 201).json(data)
}