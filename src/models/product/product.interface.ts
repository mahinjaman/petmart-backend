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
    videos?: {
        url: string;
        thumbnail?: string;
    }[];
    attributes?: {
        color?: string[];
        size?: string[];
        flavor?: string[];
        breedSize?: string[];
        petType?: string[];
        ageGroup?: string[];
    };
    weightVariants?: {
        weight: string;
        price: number;
        stock: number;
        sku: string;
    }[];
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
