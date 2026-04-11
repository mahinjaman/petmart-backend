import { Types } from "mongoose";

export interface IOrder {
    _id?: Types.ObjectId;
<<<<<<< HEAD
    user?: Types.ObjectId;
    orderNumber?: string;
    items: {
        productId: Types.ObjectId;
        quantity: number;
        variations: any[];
=======
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
>>>>>>> 0a64625 (update product service)
    }[];
    shippingAddress: {
        fullName: string;
        phone: string;
        email: string;
<<<<<<< HEAD
        address: string;
        city?: string;
=======
        addressLine1: string;
        addressLine2?: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
>>>>>>> 0a64625 (update product service)
    };
    paymentMethod: string;
    paymentStatus: "pending" | "paid" | "failed" | "refunded";
    orderStatus:
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled"
    | "returned";
<<<<<<< HEAD
    shippingFee?: number;
    couponCode?: string;
=======
    subtotal: number;
    shippingFee?: number;
    total: number;
    couponCode?: string;
    discount?: number;
>>>>>>> 0a64625 (update product service)
    notes?: string;
    isGift?: boolean;
    createdAt?: string;
    updatedAt?: string;
}
