import { model, Schema } from "mongoose";
import { IOrder } from "./order.interface";
<<<<<<< HEAD
import { any } from "zod";
=======
>>>>>>> 0a64625 (update product service)

const OrderSchema = new Schema<IOrder>(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
<<<<<<< HEAD
            required: false,
=======
            required: true,
>>>>>>> 0a64625 (update product service)
        },
        orderNumber: {
            type: String,
            required: true,
            unique: true,
        },
        items: [
            {
<<<<<<< HEAD
                productId: {
=======
                product: {
>>>>>>> 0a64625 (update product service)
                    type: Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
<<<<<<< HEAD

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
=======
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
>>>>>>> 0a64625 (update product service)
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
<<<<<<< HEAD
=======
        subtotal: {
            type: Number,
            required: true,
        },
>>>>>>> 0a64625 (update product service)
        shippingFee: {
            type: Number,
            default: 0,
        },
<<<<<<< HEAD
        couponCode: String,
=======
        total: {
            type: Number,
            required: true,
        },
        couponCode: String,
        discount: {
            type: Number,
            default: 0,
        },
>>>>>>> 0a64625 (update product service)
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