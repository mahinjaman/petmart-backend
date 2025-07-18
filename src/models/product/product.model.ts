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
                type: String, // e.g. "Dog Food", "Toys", "Accessories"
            },
        ],
        tags: [String], // e.g. ["natural", "organic", "grain-free"]
        sku: {
            type: String,
            unique: true,
        },
        price: {
            original: { type: Number, required: true },
            sale: { type: Number }, // if discounted
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
        videos: [
            {
                url: String,
                thumbnail: String,
            },
        ],
        attributes: {
            color: [String],
            size: [String],
            flavor: [String], // for food/treats
            breedSize: [String], // small, medium, large breeds
            petType: [String], // e.g. dog, cat
            ageGroup: [String], // puppy, adult, senior
        },
        weightVariants: [
            {
                weight: String, // e.g. "1kg", "5kg"
                price: Number,
                stock: Number,
                sku: String,
            },
        ],
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