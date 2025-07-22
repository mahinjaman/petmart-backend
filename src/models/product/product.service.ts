import { IProduct } from './product.interface';
import { Product } from "./product.model"


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
export const getAllProductIntoDb = async ({ page, limit, search }: { page: number, limit: number, search: string }) => {
    const skip = (page - 1) * limit;
    const searchRegex = new RegExp(search, "i")
    const query = search ? {
        $or: [
            { title: { $regex: searchRegex } },
            { description: { $regex: searchRegex } },
            { brand: { $regex: searchRegex } },
            { category: { $regex: searchRegex } },
            { tags: { $regex: searchRegex } },
            { attributes: { $regex: searchRegex } },
            { sku: { $regex: searchRegex } },
        ]
    } : {}
    const result = await Product.aggregate([
        {
            $match: query
        },
        { $skip: skip },
        { $limit: limit }
    ])
    return result;
}


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

export const getSpecificProductDataIntoDb = async (id: string) => {
    const result = await Product.findById(id);
    if (!result) {
        throw new Error("Oops! We couldn't find the product. Please try again with a valid product.");
    }
    return result;
};



export const updateProductDataIntoDb = async (productId: string, data: IProduct) => {
    const result = ""
}


export const creacreateProuctDataIntoDb = async (productData: IProduct) => {
    const result = await Product.create(productData);
    return result
}