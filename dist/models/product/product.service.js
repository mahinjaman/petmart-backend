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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIdsProductIntoDb = exports.getFeaturedProductsIntoDb = exports.creacreateProuctDataIntoDb = exports.updateProductDataIntoDb = exports.getSpecificProductDataIntoDb = exports.getAllProductIntoDb = void 0;
const product_model_1 = require("./product.model");
const product_validation_1 = require("./product.validation");
const mongoose_1 = __importDefault(require("mongoose"));
/**
 * Retrieves a paginated list of products from the database with optional full-text search.
 *
 * This function uses MongoDB aggregation to perform pagination and filtering.
 * If a search term is provided, it searches across multiple fields using case-insensitive regular expressions.
 *
 * @param {Object} params - The parameters for fetching products.
 * @param {number} params.page - The current page number (1-based).
 * @param {number} params.limit - The number of products to retrieve per page.
 * @param {string} params.search - The search keyword to filter products by title, description, brand, category, tags, or attributes.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of matched product documents.
 *
 * @example
 * const products = await getAllProductIntoDb({ page: 1, limit: 10, search: "dog" });
 */
const getAllProductIntoDb = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, limit, search, categories, sort, brand }) {
    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(search, "i");
    const query = {};
    if (search) {
        query.$or = [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { brand: { $regex: brand } },
            { tags: { $regex: searchRegex } },
            { attributes: { $regex: searchRegex } },
            { sku: { $regex: searchRegex } },
        ];
    }
    if (categories === null || categories === void 0 ? void 0 : categories.length) {
        query.categories = { $all: categories };
    }
    let sortFields = {};
    if (sort) {
        sortFields = sort.split(',').reduce((acc, field) => {
            const [key, order] = field.split(':');
            acc[key] = order === 'desc' ? -1 : 1;
            return acc;
        }, {});
    }
    let pipeline = [
        { $match: query },
        { $skip: skip },
        { $limit: limit },
    ];
    if (Object.keys(sortFields).length > 0) {
        pipeline.push({ $sort: sortFields });
    }
    // ✅ Add pagination
    pipeline.push({ $skip: skip }, { $limit: limit });
    if (brand) {
        pipeline.push({ $match: { brand: brand } });
    }
    const result = yield product_model_1.Product.aggregate(pipeline).project({
        url: 1,
        title: 1,
        brand: 1,
        price: 1,
        ratings: 1,
        reviews: 1,
        productThumb: 1,
        badge: 1,
        inStock: 1,
        categories: 1,
        description: 1
    });
    const productsBrands = yield product_model_1.Product.aggregate([
        {
            $match: query
        },
        {
            $group: {
                _id: "$brand",
                count: { $sum: 1 }
            }
        }
    ]);
    const totalCount = yield product_model_1.Product.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    return { productsBrands, result, totalCount, totalPages };
});
exports.getAllProductIntoDb = getAllProductIntoDb;
/**
 * Retrieves a specific product from the database by its ID.
 *
 * This function fetches a single product document using Mongoose's `findById` method.
 * If the product does not exist, it throws an error indicating that the product was not found.
 *
 * @param {string} id - The MongoDB ObjectId of the product to retrieve.
 *
 * @returns {Promise<Object>} A promise that resolves to the product document if found.
 *
 * @throws {Error} If the product with the given ID is not found in the database.
 *
 * @example
 * const product = await getSpecificProductDataIntoDb("60f7f0c5b8d6c2123c4f1234");
 */
const getSpecificProductDataIntoDb = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.Product.findOne({ url });
    if (!result) {
        throw new Error("Oops! We couldn't find the product. Please try again with a valid product.");
    }
    return result;
});
exports.getSpecificProductDataIntoDb = getSpecificProductDataIntoDb;
/**
 * Updates a product in the database by its ID.
 *
 * This function validates the update payload, ensures only allowed fields are updated,
 * and returns the updated product document. Throws an error if the product is not found.
 *
 * @param {string} productId - The MongoDB ObjectId of the product to update.
 * @param {Partial<IProduct>} data - The fields to update.
 * @returns {Promise<Object>} The updated product document.
 * @throws {Error} If the product is not found or validation fails.
 */
const updateProductDataIntoDb = (productId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Remove fields that should not be updated
    const forbiddenFields = ['_id', 'createdAt', 'updatedAt'];
    forbiddenFields.forEach(field => { delete data[field]; });
    // Use a partial schema for updates
    const updateSchema = product_validation_1.createProductValidationSchema.partial();
    const parseResult = updateSchema.safeParse(data);
    if (!parseResult.success) {
        throw new Error('Validation failed: ' + JSON.stringify(parseResult.error.format()));
    }
    // Use $set to only update provided fields
    const result = yield product_model_1.Product.findByIdAndUpdate(productId, { $set: data }, { new: true, runValidators: true });
    if (!result) {
        throw new Error("Oops! We couldn't find the product to update. Please try again with a valid product ID.");
    }
    return result;
});
exports.updateProductDataIntoDb = updateProductDataIntoDb;
const creacreateProuctDataIntoDb = (productData) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield product_model_1.Product.create(productData);
    return result;
});
exports.creacreateProuctDataIntoDb = creacreateProuctDataIntoDb;
/**
 * Retrieves a paginated list of products from the database with optional full-text search.
 *
 * This function uses MongoDB aggregation to perform pagination and filtering.
 * If a search term is provided, it searches across multiple fields using case-insensitive regular expressions.
 *
 * @param {Object} params - The parameters for fetching products.
 * @param {number} params.page - The current page number (1-based).
 * @param {number} params.limit - The number of products to retrieve per page.
 * @param {string} params.search - The search keyword to filter products by title, description, brand, category, tags, or attributes.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of matched product documents.
 *
 * @example
 * const products = await getAllProductIntoDb({ page: 1, limit: 10, search: "dog" });
 */
const getFeaturedProductsIntoDb = (_a) => __awaiter(void 0, [_a], void 0, function* ({ page, limit, search, categories, sort, brand }) {
    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(search, "i");
    const query = {};
    if (search) {
        query.$or = [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { brand: { $regex: brand } },
            { tags: { $regex: searchRegex } },
            { attributes: { $regex: searchRegex } },
            { sku: { $regex: searchRegex } },
        ];
    }
    if (categories === null || categories === void 0 ? void 0 : categories.length) {
        query.categories = { $all: categories };
    }
    let sortFields = {};
    if (sort) {
        sortFields = sort.split(',').reduce((acc, field) => {
            const [key, order] = field.split(':');
            acc[key] = order === 'desc' ? -1 : 1;
            return acc;
        }, {});
    }
    let pipeline = [
        { $match: query },
        { $skip: skip },
        { $limit: limit },
        { $match: { featured: true } }
    ];
    if (Object.keys(sortFields).length > 0) {
        pipeline.push({ $sort: sortFields });
    }
    pipeline.push({ $skip: skip }, { $limit: limit });
    const result = yield product_model_1.Product.aggregate(pipeline).project({
        url: 1,
        title: 1,
        brand: 1,
        price: 1,
        rating: 1,
        reviews: 1,
        productThumb: 1,
        badge: 1,
        inStock: 1,
        categories: 1
    });
    const productsBrands = yield product_model_1.Product.aggregate([
        {
            $match: query
        },
        {
            $group: {
                _id: "$brand",
                count: { $sum: 1 }
            }
        }
    ]);
    const totalCount = yield product_model_1.Product.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);
    return { productsBrands, result, totalCount, totalPages };
});
exports.getFeaturedProductsIntoDb = getFeaturedProductsIntoDb;
const getIdsProductIntoDb = (ids) => __awaiter(void 0, void 0, void 0, function* () {
    const objectIds = ids.map(id => {
        try {
            return new mongoose_1.default.Types.ObjectId(id);
        }
        catch (err) {
            return null;
        }
    }).filter(Boolean);
    const result = yield product_model_1.Product.aggregate([
        { $match: { _id: { $in: objectIds } } },
        {
            $project: {
                url: 1,
                title: 1,
                brand: 1,
                price: 1,
                rating: 1,
                reviews: 1,
                productThumb: 1,
                badge: 1,
                inStock: 1,
                categories: 1
            }
        }
    ]);
    if (!result || result.length === 0) {
        throw new Error("Product data not found");
    }
    return result;
});
exports.getIdsProductIntoDb = getIdsProductIntoDb;
