import { Types } from "mongoose";

export interface IOrder {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    orderNumber: string;
    items: {
        product: string;
        title: string;
        sku: string;
        quantity: number;
        price: number;
        weightVariant?: {
            weight: string;
            price: number;
        };
        image?: string;
    }[];
    shippingAddress: {
        fullName: string;
        phone: string;
        email: string;
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    paymentMethod: string;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    orderStatus:
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
    subtotal: number;
    shippingFee?: number;
    total: number;
    couponCode?: string;
    discount?: number;
    notes?: string;
    isGift?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
