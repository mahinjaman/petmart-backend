"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductValidationSchema = void 0;
const zod_1 = require("zod");
exports.createProductValidationSchema = zod_1.z.object({
    title: zod_1.z.string()
        .min(1, 'Product title is required and cannot be empty.')
        .refine(val => typeof val === 'string', {
        message: 'Product title must be a valid string.',
    }),
    slug: zod_1.z.string()
        .min(1, 'Slug is required and cannot be empty.')
        .refine(val => typeof val === 'string', {
        message: 'Slug must be a valid string.',
    }),
    brand: zod_1.z.string().optional()
        .refine(val => val === undefined || typeof val === 'string', {
        message: 'Brand must be a string if provided.',
    }),
    description: zod_1.z.object({
        short: zod_1.z.string().optional()
            .refine(val => val === undefined || typeof val === 'string', {
            message: 'Short description must be a string if provided.',
        }),
        long: zod_1.z.string().optional()
            .refine(val => val === undefined || typeof val === 'string', {
            message: 'Long description must be a string if provided.',
        }),
    }).optional(),
    categories: zod_1.z.array(zod_1.z.string()
        .min(1, 'Each category must be a non-empty string.')
        .refine(val => typeof val === 'string', {
        message: 'Each category must be a valid string.',
    }))
        .optional(),
    tags: zod_1.z.array(zod_1.z.string()
        .min(1, 'Each tag must be a non-empty string.')
        .refine(val => typeof val === 'string', {
        message: 'Each tag must be a valid string.',
    }))
        .optional(),
    sku: zod_1.z.string().optional()
        .refine(val => val === undefined || (typeof val === 'string' && val.length > 0), {
        message: 'SKU must be a non-empty string if provided.',
    }),
    price: zod_1.z.object({
        original: zod_1.z.number()
            .refine(val => typeof val === 'number' && !isNaN(val), {
            message: 'Original price must be a valid number.',
        }),
        sale: zod_1.z.number().optional()
            .refine(val => val === undefined || (typeof val === 'number' && !isNaN(val)), {
            message: 'Sale price must be a valid number if provided.',
        }),
    }),
    stock: zod_1.z.number().optional()
        .refine(val => val === undefined || (typeof val === 'number' && Number.isInteger(val) && val >= 0), {
        message: 'Stock must be a non-negative integer if provided.',
    }),
    inStock: zod_1.z.boolean().optional()
        .refine(val => val === undefined || typeof val === 'boolean', {
        message: 'inStock must be a boolean value if provided.',
    }),
    productThumb: zod_1.z.object({
        url: zod_1.z.string().url('Product thumbnail URL must be a valid URL.'),
        alt: zod_1.z.string().optional()
            .refine(val => val === undefined || typeof val === 'string', {
            message: 'Product thumbnail alt text must be a string if provided.',
        }),
    }),
    images: zod_1.z.array(zod_1.z.object({
        url: zod_1.z.string()
            .url('Image URL must be a valid URL.')
            .refine(val => typeof val === 'string', {
            message: 'Image URL must be a valid string.',
        }),
        alt: zod_1.z.string().optional()
            .refine(val => val === undefined || typeof val === 'string', {
            message: 'Image alt text must be a string if provided.',
        }),
    })).optional(),
    video: zod_1.z.object({
        url: zod_1.z.string()
            .url('Video URL must be a valid URL.')
            .optional()
            .refine(val => val === undefined || typeof val === 'string', {
            message: 'Video URL must be a string if provided.',
        }),
        thumbnail: zod_1.z.string()
            .url('Thumbnail URL must be a valid URL.')
            .optional()
            .refine(val => val === undefined || typeof val === 'string', {
            message: 'Thumbnail URL must be a string if provided.',
        }),
    }).optional(),
    attributes: zod_1.z.array(zod_1.z.any(), {
        error: 'Attributes must be an array if provided.',
    }).optional(),
    variants: zod_1.z.array(zod_1.z.object({
        option: zod_1.z.string().min(1, 'Variant option name is required.'),
        options: zod_1.z.array(zod_1.z.object({
            title: zod_1.z.string().min(1, 'Variant title is required.'),
            price: zod_1.z.number()
                .refine(val => typeof val === 'number' && !isNaN(val), {
                message: 'Variant price must be a valid number.',
            }),
            salePrice: zod_1.z.number().optional()
                .refine(val => val === undefined || (typeof val === 'number' && !isNaN(val)), {
                message: 'Variant sale price must be a valid number if provided.',
            }),
            sku: zod_1.z.string().min(1, 'Variant SKU is required.'),
            image: zod_1.z.string().url('Variant image must be a valid URL.'),
        }))
    })).optional(),
    featured: zod_1.z.boolean().optional()
        .refine(val => val === undefined || typeof val === 'boolean', {
        message: 'Featured must be a boolean value if provided.',
    }),
    ratings: zod_1.z.object({
        average: zod_1.z.number().optional()
            .refine(val => val === undefined || (typeof val === 'number' && !isNaN(val)), {
            message: 'Average rating must be a valid number if provided.',
        }),
        totalReviews: zod_1.z.number().optional()
            .refine(val => val === undefined || (typeof val === 'number' && Number.isInteger(val) && val >= 0), {
            message: 'Total reviews must be a non-negative integer if provided.',
        }),
    }).optional(),
    reviews: zod_1.z.array(zod_1.z.object({
        user: zod_1.z.string()
            .min(1, 'Reviewer name is required.')
            .refine(val => typeof val === 'string', {
            message: 'Reviewer name must be a valid string.',
        }),
        comment: zod_1.z.string()
            .min(1, 'Review comment is required.')
            .refine(val => typeof val === 'string', {
            message: 'Review comment must be a valid string.',
        }),
        rating: zod_1.z.number()
            .refine(val => typeof val === 'number' && !isNaN(val), {
            message: 'Rating must be a valid number.',
        }),
        date: zod_1.z.coerce.date()
            .refine(val => val instanceof Date && !isNaN(val.getTime()), {
            message: 'Date must be a valid date.',
        }),
    })).optional(),
    createdAt: zod_1.z.date().optional(),
    updatedAt: zod_1.z.date().optional(),
});
