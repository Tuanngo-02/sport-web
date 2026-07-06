import { ApiResponse } from "../models/ApiResponse";
import { Checkout } from "../models/CheckOut";
import { Order } from "../models/Order";
import PageResponse from "../models/PageResponse";
import axios from "../utils/AxiosCustomize";
const getOrdersWithPaginate = (
  page: number,
  limit: number,
  fullName?: string,
  status?: string
): Promise<ApiResponse<PageResponse<Order>>> => {
  const params = new URLSearchParams();
  params.append("page", page.toString());
  params.append("limit", limit.toString());
  if (fullName) params.append("fullName", fullName);
  if (status) params.append("status", status);
  return axios.get(`/checkout?${params.toString()}`);
};
const postUpdateOrder = (
  orderId: number,
  status: string
): Promise<ApiResponse<Order>> => {
  return axios.put(`/checkout/${orderId}`, {
    status: status,
  });
};
const getOrderDetail = (orderId: number): Promise<ApiResponse<any>> => {
  return axios.get(`/checkout/${orderId}`);
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
export { getOrdersWithPaginate, postUpdateOrder, createCheckout, getOrderDetail };
