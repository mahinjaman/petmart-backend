import { Model, model, Schema } from "mongoose";
import { IProduct } from "./product.interface";


const ProductSchema = new Schema<IProduct>(
    {
        title: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: false,
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

ProductSchema.pre('save', async function (next) {
    if (this.isModified('title') || !this.slug || !this.url) {
        const baseSlug = this.title
            .toString()
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');

        let slug = baseSlug;
        let counter = 1;

        const Product = this.constructor as Model<IProduct>;

        while (await Product.exists({ slug })) {
            slug = `${baseSlug}-${counter}`;
            counter++;
        }

        this.slug = slug;
        this.url = slug;
    }

    next();
});


export const Product = model<IProduct>("Product", ProductSchema)