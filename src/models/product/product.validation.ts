import { z } from 'zod';

export const createProductValidationSchema = z.object({
    title: z.string()
        .min(1, 'Product title is required and cannot be empty.')
        .refine(val => typeof val === 'string', {
            message: 'Product title must be a valid string.',
        }),

    slug: z.string()
        .min(1, 'Slug is required and cannot be empty.')
        .refine(val => typeof val === 'string', {
            message: 'Slug must be a valid string.',
        }),

    brand: z.string().optional()
        .refine(val => val === undefined || typeof val === 'string', {
            message: 'Brand must be a string if provided.',
        }),

    description: z.object({
        short: z.string().optional()
            .refine(val => val === undefined || typeof val === 'string', {
                message: 'Short description must be a string if provided.',
            }),
        long: z.string().optional()
            .refine(val => val === undefined || typeof val === 'string', {
                message: 'Long description must be a string if provided.',
            }),
    }).optional(),

    categories: z.array(z.string()
        .min(1, 'Each category must be a non-empty string.')
        .refine(val => typeof val === 'string', {
            message: 'Each category must be a valid string.',
        }))
        .optional(),

    tags: z.array(z.string()
        .min(1, 'Each tag must be a non-empty string.')
        .refine(val => typeof val === 'string', {
            message: 'Each tag must be a valid string.',
        }))
        .optional(),

    sku: z.string().optional()
        .refine(val => val === undefined || (typeof val === 'string' && val.length > 0), {
            message: 'SKU must be a non-empty string if provided.',
        }),

    price: z.object({
        original: z.number()
            .refine(val => typeof val === 'number' && !isNaN(val), {
                message: 'Original price must be a valid number.',
            }),
        sale: z.number().optional()
            .refine(val => val === undefined || (typeof val === 'number' && !isNaN(val)), {
                message: 'Sale price must be a valid number if provided.',
            }),
    }),

    stock: z.number().optional()
        .refine(val => val === undefined || (typeof val === 'number' && Number.isInteger(val) && val >= 0), {
            message: 'Stock must be a non-negative integer if provided.',
        }),

    inStock: z.boolean().optional()
        .refine(val => val === undefined || typeof val === 'boolean', {
            message: 'inStock must be a boolean value if provided.',
        }),

    images: z.array(z.object({
        url: z.string()
            .url('Image URL must be a valid URL.')
            .refine(val => typeof val === 'string', {
                message: 'Image URL must be a valid string.',
            }),
        alt: z.string().optional()
            .refine(val => val === undefined || typeof val === 'string', {
                message: 'Image alt text must be a string if provided.',
            }),
    })).optional(),

    video: z.object({
        url: z.string()
            .url('Video URL must be a valid URL.')
            .optional()
            .refine(val => val === undefined || typeof val === 'string', {
                message: 'Video URL must be a string if provided.',
            }),
        thumbnail: z.string()
            .url('Thumbnail URL must be a valid URL.')
            .optional()
            .refine(val => val === undefined || typeof val === 'string', {
                message: 'Thumbnail URL must be a string if provided.',
            }),
    }).optional(),

    attributes: z.array(z.any(), {
        error: 'Attributes must be an array if provided.',
    }).optional(),

    variants: z.array(
        z.object({
            option: z.string().min(1, 'Variant option name is required.'),
            options: z.array(
                z.object({
                    title: z.string().min(1, 'Variant title is required.'),
                    price: z.number()
                        .refine(val => typeof val === 'number' && !isNaN(val), {
                            message: 'Variant price must be a valid number.',
                        }),
                    salePrice: z.number().optional()
                        .refine(val => val === undefined || (typeof val === 'number' && !isNaN(val)), {
                            message: 'Variant sale price must be a valid number if provided.',
                        }),
                    sku: z.string().min(1, 'Variant SKU is required.'),
                    image: z.string().url('Variant image must be a valid URL.'),
                })
            )
        })
    ).optional(),

    featured: z.boolean().optional()
        .refine(val => val === undefined || typeof val === 'boolean', {
            message: 'Featured must be a boolean value if provided.',
        }),

    ratings: z.object({
        average: z.number().optional()
            .refine(val => val === undefined || (typeof val === 'number' && !isNaN(val)), {
                message: 'Average rating must be a valid number if provided.',
            }),
        totalReviews: z.number().optional()
            .refine(val => val === undefined || (typeof val === 'number' && Number.isInteger(val) && val >= 0), {
                message: 'Total reviews must be a non-negative integer if provided.',
            }),
    }).optional(),

    reviews: z.array(z.object({
        user: z.string()
            .min(1, 'Reviewer name is required.')
            .refine(val => typeof val === 'string', {
                message: 'Reviewer name must be a valid string.',
            }),
        comment: z.string()
            .min(1, 'Review comment is required.')
            .refine(val => typeof val === 'string', {
                message: 'Review comment must be a valid string.',
            }),
        rating: z.number()
            .refine(val => typeof val === 'number' && !isNaN(val), {
                message: 'Rating must be a valid number.',
            }),
        date: z.coerce.date()
            .refine(val => val instanceof Date && !isNaN(val.getTime()), {
                message: 'Date must be a valid date.',
            }),
    })).optional(),

    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
});
