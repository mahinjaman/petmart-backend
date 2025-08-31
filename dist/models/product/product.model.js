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
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const ProductSchema = new mongoose_1.Schema({
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
    productThumb: {
        url: { type: String, required: true },
        alt: { type: String, required: false },
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
}, { timestamps: true });
ProductSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
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
            const Product = this.constructor;
            while (yield Product.exists({ slug })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            this.slug = slug;
            this.url = slug;
        }
        next();
    });
});
ProductSchema.pre('findOneAndUpdate', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        const update = this.getUpdate();
        if (!update)
            return next();
        // Check if title is being updated or slug/url is missing
        if (update.title || !update.slug || !update.url) {
            const baseTitle = update.title || ((_a = (yield this.model.findOne(this.getQuery()))) === null || _a === void 0 ? void 0 : _a.title);
            if (!baseTitle)
                return next();
            const baseSlug = baseTitle
                .toString()
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, '');
            let slug = baseSlug;
            let counter = 1;
            const Product = this.model;
            while (yield Product.exists({ slug })) {
                slug = `${baseSlug}-${counter}`;
                counter++;
            }
            update.slug = slug;
            update.url = slug;
            this.setUpdate(update);
        }
        next();
    });
});
exports.Product = (0, mongoose_1.model)("Product", ProductSchema);
