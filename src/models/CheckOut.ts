export interface CheckoutItem {
  productVariantId: number;
  size: string;
  color: string;
  quantity: number;
  price: number;
  productName?:string
}

export interface Checkout {
  fullName: string;
  email: string;
  phone: string;
  addressId?: number;
  orderDetail: string;
  paymentMethod: string;
  totalPrice: number;
  checkoutItemRequests: CheckoutItem[];
}