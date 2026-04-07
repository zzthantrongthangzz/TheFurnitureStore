export interface Product {
    id: number;
    name: string;
    price: string;
    image: string;
}

export interface ProductGroup {
    id: string;
    title: string;
    products: Product[];
}

export interface Review {
    id: number;
    name: string;
    rating: number;
    content: string;
    productImage: string;
    avatar: string;
}