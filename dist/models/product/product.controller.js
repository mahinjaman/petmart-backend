"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdsProduct = exports.getFeaturedProducts = exports.createProduct = exports.updateProductData = exports.getSpecificProductData = exports.getAllProduct = void 0;
const catchAsync_1 = require("../../features/catchAsync");
const sendResponse_1 = require("../../features/sendResponse");
const product_service_1 = require("./product.service");
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
exports.getAllProduct = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, categories, sort, brand } = req.query;
    const filterCategories = categories && categories.split(",");
    const pareseedPage = parseInt(page);
    const pareseedLimit = parseInt(limit);
    if (isNaN(pareseedPage) || isNaN(pareseedLimit)) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 400,
            message: "Page and Limit should be number",
            data: null
        });
    }
    if (search && search.length > 20) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "search input must be within 20 chearecters!",
            data: null
        });
    }
    const result = yield (0, product_service_1.getAllProductIntoDb)({ page: pareseedPage, limit: pareseedLimit, search: search || "", categories: filterCategories || [], sort: sort || "", brand: brand || "" });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Everything's ready—your data is here!",
        data: result
    });
}));
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
exports.getSpecificProductData = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (!((_a = req.params) === null || _a === void 0 ? void 0 : _a.url)) {
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Oops! We couldn't find the product. Please try again with a valid product.!",
            data: null
        });
    }
    const result = yield (0, product_service_1.getSpecificProductDataIntoDb)((_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.url);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Everything's ready—your data is here!",
        data: result
    });
}));
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
exports.updateProductData = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { productId } = req.params;
    if (!productId) {
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Oops! We couldn't find the product. Please try again with a valid product.!",
            data: null
        });
    }
    const updateData = req.body;
    const result = (0, product_service_1.updateProductDataIntoDb)(productId, updateData);
    if (!req.query.productId) {
        (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 201,
            message: "Product updated successfully.",
            data: result
        });
    }
}));
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
exports.createProduct = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productData = req.body;
    const result = yield (0, product_service_1.creacreateProuctDataIntoDb)(productData);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Product data created successful",
        data: result
    });
}));
/**
 * @description
 * Controller to retrieve all featured products with pagination and optional search functionality.
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
exports.getFeaturedProducts = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, search, categories, sort, brand } = req.query;
    const filterCategories = categories && categories.split(",");
    const pareseedPage = parseInt(page);
    const pareseedLimit = parseInt(limit);
    if (isNaN(pareseedPage) || isNaN(pareseedLimit)) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 400,
            message: "Page and Limit should be number",
            data: null
        });
    }
    if (search && search.length > 20) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "search input must be within 20 chearecters!",
            data: null
        });
    }
    const result = yield (0, product_service_1.getFeaturedProductsIntoDb)({ page: pareseedPage, limit: pareseedLimit, search: search || "", categories: filterCategories || [], sort: sort || "", brand: brand || "" });
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 201,
        message: "Everything's ready—your data is here!",
        data: result
    });
}));
exports.getIdsProduct = (0, catchAsync_1.catchAsync)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let idsArr = [];
    if (Array.isArray(req.query.ids)) {
        idsArr = req.query.ids;
    }
    else if (typeof req.query.ids === "string" && req.query.ids.trim() !== "") {
        idsArr = req.query.ids.split(",");
    }
    if (!idsArr) {
        return (0, sendResponse_1.sendResponse)(res, {
            success: true,
            statusCode: 200,
            message: "Please enter valid ids!",
            data: null
        });
    }
    const result = yield (0, product_service_1.getIdsProductIntoDb)(idsArr);
    (0, sendResponse_1.sendResponse)(res, {
        success: true,
        statusCode: 200,
        message: "Everything's ready—your data is here!",
        data: result
    });
}));
