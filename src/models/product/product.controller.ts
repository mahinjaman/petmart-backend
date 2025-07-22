import { Request, Response } from "express";
import { catchAsync } from "../../features/catchAsync";
import { sendResponse } from "../../features/sendResponse";
import { creacreateProuctDataIntoDb, getAllProductIntoDb, getSpecificProductDataIntoDb, updateProductDataIntoDb } from "./product.service";

/**
 * @description
 * Controller to retrieve all products with pagination and optional search functionality.
 * 
 * Responsibilities:
 * 1. Extracts `page`, `limit`, and `search` parameters from the request.
 * 2. Validates `page` and `limit` to ensure they are valid numbers.
 * 3. Ensures the `search` input (if provided) does not exceed the maximum allowed length.
 * 4. Calls the service function `getAllProductIntoDb` to fetch paginated product data.
 * 5. Sends a structured API response with the retrieved products.
 * 
 * @route GET /api/products/:page/:limit/:search?
 * @access Public or Protected (based on middleware)
 * 
 * @param {Request} req - Express request object containing pagination and optional search parameters
 * @param {Response} res - Express response object used to send the data
 * 
 * @returns {Promise<void>} Sends a paginated list of products or error message
 */
export const getAllProduct = catchAsync(async (req: Request, res: Response) => {
    const page = parseInt(req.params?.page);
    const limit = parseInt(req.params?.limit);
    const search = req.params?.search;

    if (isNaN(page) || isNaN(limit)) {
        return sendResponse(res, {
            success: true,
            statusCode: 400,
            message: "Page and Limit should be number",
            data: null
        });
    }

    if (search.length > 20) {
        return sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "search input must be within 20 chearecters!",
            data: null
        })
    }
    const result = await getAllProductIntoDb({ page, limit, search });
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Everything's ready—your data is here!",
        data: result
    })
})

/**
 * @description
 * Controller to retrieve detailed information for a specific product by its ID.
 * 
 * This handler is responsible for:
 * 1. Validating the presence of `productId` in the request URL parameters.
 * 2. Calling the service layer (`getSpecificProductDataIntoDb`) to fetch the product data from the database.
 * 3. Sending a structured API response with the product details if found.
 * 
 * @route GET /api/products/:productId
 * @access Public or Protected (depending on middleware applied)
 * 
 * @param {Request} req - Express request object containing the productId in URL params
 * @param {Response} res - Express response object used to send back the product data
 * 
 * @returns {Promise<void>} Sends JSON response with product details or error message
 */
export const getSpecificProductData = catchAsync(async (req: Request, res: Response) => {
    if (!req.query.productId) {
        sendResponse(res, {
            success: true,
            statusCode: 200,
            message: "Oops! We couldn't find the product. Please try again with a valid product.!",
            data: null
        })
    }
    const result = await getSpecificProductDataIntoDb(req.params.productId);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Everything's ready—your data is here!",
        data: result
    })
})


/**
 * @description
 * Controller for updating product details by product ID.
 * 
 * This function handles incoming PATCH/PUT requests to update an existing product.
 * It performs the following steps:
 * 1. Extracts the product ID from the request URL parameters.
 * 2. Validates the presence of the product ID.
 * 3. Retrieves the update payload from the request body.
 * 4. Calls the service layer function `updateProductDataIntoDb` to perform the update operation.
 * 5. Sends a standardized API response back to the client.
 * 
 * @route PATCH /api/products/:productId
 * @access Protected (authentication/authorization should be handled by middleware)
 * 
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * 
 * @returns {Promise<void>} Sends a JSON response with the update result
 */
export const updateProductData = catchAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    if (!productId) {
        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Oops! We couldn't find the product. Please try again with a valid product.!",
            data: null
        })
    }
    const updateData = req.body;
    const result = updateProductDataIntoDb(productId, updateData);
    if (!req.query.productId) {
        sendResponse(res, {
            success: true,
            statusCode: 201,
            message: "Product updated successfully.",
            data: result
        })
    }
})

/**
 * @description Controller to handle the creation of a new product.
 * - Extracts product data from the request body.
 * - Calls the service layer to persist data into the database.
 * - Sends a standardized success response with the created product data.
 * 
 * Uses the catchAsync utility to handle asynchronous errors gracefully.
 * 
 * @route POST /api/products
 * @access Public or Protected (depending on route config)
 */

export const createProduct = catchAsync(async (req: Request, res: Response) => {
    const productData = req.body;
    const result = await creacreateProuctDataIntoDb(productData);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "Product data created successful",
        data: result
    })
})