import { ApiResponse } from "../models/ApiResponse";
import { Checkout } from "../models/CheckOut";
import { Order } from "../models/Order";
import PageResponse from "../models/PageResponse";
import axios from "../utils/AxiosCustomize";
const getOrdersWithPaginate = (
  page: number,
  limit: number
): Promise<ApiResponse<PageResponse<Order>>> => {
  return axios.get(`/checkout?page=${page}&limit=${limit}`);
};
const postUpdateOrder = (
  orderId: number,
  paymentMethod: string
): Promise<ApiResponse<Order>> => {
  return axios.put(`/checkout/${orderId}`, {
    paymentMethod: paymentMethod,
  });
};
const createCheckout = (
  checkout: Checkout
): Promise<ApiResponse<Checkout[]>> => {
  return axios.post(`/checkout`, {
    fullName: checkout.fullName,
    email: checkout.email,
    phone: checkout.phone,
    addressId: checkout.addressId,
    orderDetail: checkout.orderDetail,
    paymentMethod: checkout.paymentMethod,
    totalPrice: checkout.totalPrice,
    checkoutItemRequests: checkout.checkoutItemRequests,
  });
};
export { getOrdersWithPaginate, postUpdateOrder, createCheckout };
