import { ZodObject } from 'zod';
import { NextFunction, Request, RequestHandler, Response } from 'express';
import { AppError } from '../error/AppError';

export const requestDataValidation = (validationSchema: any): RequestHandler => {
    return (req: Request, res: Response, next: NextFunction) => {
        const data = req.body;
<<<<<<< HEAD
=======
        console.log(data);
>>>>>>> 0a64625 (update product service)
        if (!data) {
            return next(new AppError(400, 'Product data is required'));
        }

        try {
            const validData = validationSchema.parse(data);
            req.body = validData;
            next();
        } catch (error: any) {
<<<<<<< HEAD
=======
            console.log(error);
>>>>>>> 0a64625 (update product service)
            return next(new AppError(422, 'Validation failed', error));
        }
    };
};