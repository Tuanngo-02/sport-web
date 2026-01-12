import { Product } from "./Product";
import { User } from "./User";

export interface Cart {
    id?: number,
    quantity:number,
    productId:number,
    name: string;
    code: string,
    price: number;
    size: string;
    color: string
    image: string
    selected: boolean;
}

export interface updateCartItem {
    productId: number;
    productQuantity: number;
    cartId: number;
    cartQuantity: number;
}