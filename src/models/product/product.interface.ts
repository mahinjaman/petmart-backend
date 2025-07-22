export interface IProduct {
    _id?: string;
    title: string;
    slug: string;
    brand?: string;
    description?: {
        short?: string;
        long?: string;
    };
    categories: string[];
    tags?: string[];
    sku: string;
    price: {
        original: number;
        sale?: number;
    };
    stock: number;
    inStock: boolean;
    images: {
        url: string;
        alt?: string;
    }[];
    video?: {
        url: string;
        thumbnail?: string;
    };
    attributes?: {}[];
    variants?: {}[];
    featured?: boolean;
    ratings?: {
        average: number;
        totalReviews: number;
    };
    reviews?: {
        user: string;
        comment: string;
        rating: number;
        date: string;
    }[];
    createdAt?: string;
    updatedAt?: string;
}
