"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
const OrderSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    orderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    items: [
        {
            productId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "Product",
                required: true,
            },
            quantity: { type: Number, required: true },
            variations: {
                type: zod_1.any,
                required: false
            }
        },
    ],
    shippingAddress: {
        fullName: {
            type: String,
            reqired: true
        },
        phone: String,
        email: {
            type: String,
            reqired: true
        },
        address: {
            type: String,
            reqired: true
        },
        city: {
            type: String,
            reqired: true
        },
        state: {
            type: String,
            reqired: true
        },
        postalCode: {
            type: String,
            reqired: true
        },
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending",
    },
    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled", "returned"],
        default: "processing",
    },
    shippingFee: {
        type: Number,
        default: 0,
    },
    couponCode: String,
    notes: {
        type: String,
    },
    isGift: {
        type: Boolean,
        default: false,
    },
}, { timestamps: true });
exports.Order = (0, mongoose_1.model)("Order", OrderSchema);
