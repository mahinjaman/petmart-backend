import { Schema } from "mongoose";
import { IOrder } from "./order.interface";

const OrderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        items: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                title: String,
                sku: String,
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                weightVariant: {
                    weight: String,
                    price: Number,
                },
                image: String,
            },
        ],
        shippingAddress: {
            fullName: String,
            phone: String,
            email: String,
            addressLine1: String,
            addressLine2: String,
            city: String,
            state: String,
            postalCode: String,
            country: String,
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
        subtotal: {
            type: Number,
            required: true,
        },
        shippingFee: {
            type: Number,
            default: 0,
        },
        total: {
            type: Number,
            required: true,
        },
        couponCode: String,
        discount: {
            type: Number,
            default: 0,
        },
        notes: {
            type: String,
        },
        isGift: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
