import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";
import { any } from "zod";

const OrderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
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
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                quantity: { type: Number, required: true },
                variations: {
                    type: any,
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
    },
    { timestamps: true }
);

export const Order = model<IOrder>("Order", OrderSchema)