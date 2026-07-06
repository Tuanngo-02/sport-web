import { Address } from "./Address"
import { CheckoutItem } from "./CheckOut"

export interface Order {
    id?: number,
    fullName: string,
    email: string,
    phone: string,
    totalPrice: number,
    paymentMethod: string,
    status?: string,
    address?: any,
    checkoutItemResponses?: any[],
    createdDate?: string,
    orderDetail?: string
}