import { Types } from "mongoose";

export interface IOrder {
    _id?: Types.ObjectId;
    user?: Types.ObjectId;
    orderNumber?: string;
    items: {
        productId: Types.ObjectId;
        quantity: number;
        variations: any[];
    }[];
    shippingAddress: {
        fullName: string;
        phone: string;
        email: string;
        address: string;
        city?: string;
    };
    paymentMethod: string;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    orderStatus:
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
    shippingFee?: number;
    couponCode?: string;
    notes?: string;
    isGift?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
