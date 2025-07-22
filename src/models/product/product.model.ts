import { model, Schema } from "mongoose";
import { IProduct } from "./product.interface";


const ProductSchema = new Schema<IProduct>(
    {
        title: {
            type: String,
            required: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
        },
        brand: {
            type: String,
        },
        description: {
            short: { type: String },
            long: { type: String },
        },
        categories: [
            {
                type: String,
            },
        ],
        tags: [String],
        sku: {
            type: String,
            unique: true,
        },
        price: {
            original: { type: Number, required: true },
            sale: { type: Number },
        },
        stock: {
            type: Number,
            default: 0,
        },
        inStock: {
            type: Boolean,
            default: true,
        },
        images: [
            {
                url: String,
                alt: String,
            },
        ],
        video: {
            type: {
                url: {
                    type: String,
                    required: false
                },
                thumbnail: {
                    type: String,
                    required: false
                }
            },
            required: false,
            default: {}
        },

        attributes: {
            type: Array,
            default: []
        },
        variants: {
            type: Array,
            default: []
        },
        featured: {
            type: Boolean,
            default: false,
        },
        ratings: {
            average: { type: Number, default: 0 },
            totalReviews: { type: Number, default: 0 },
        },
        reviews: [
            {
                user: String,
                comment: String,
                rating: Number,
                date: Date,
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        updatedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);


export const Product = model<IProduct>("Product", ProductSchema)