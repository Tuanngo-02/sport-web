export interface Product {
    id?: number,
    name: string,
    code: string,
    imageProduct: File | null,
    price: number,
    rating: number,
    content: string,
    categoryId: number,
    categoryName?: string,
    description: string,
    discountPrice: number,
    gender: string,
    tag: string,
    branch: string,
    variants?: ProductVariant[];
    changes?: MapInProduct[]
}
export interface MapInProduct {
    alt: string;
    code: string;
    id: number;
    label: string,
    src: string
}
export interface ProductVariant{
    id?: number,
    code: string,
    color: string,
    name: string,
    imageProductVariant: string, // sửa lại để lưu url
    sizeAndStock: VariantSizeStock[]
}
export interface VariantSizeStock{
     id?: number;
    size: string;
    stock: number
}
export interface ProductInCart {
    productId: number;
    code: string;
    image: string;
    color: string;
    price: number;
    quantity: number;
    size: string;
    name: string
}