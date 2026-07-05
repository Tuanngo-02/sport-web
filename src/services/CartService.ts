import { ApiResponse } from '../models/ApiResponse';
import { Cart, updateCartItem } from '../models/Cart';
import axios from '../utils/AxiosCustomize';

const postAddToCart = (cart: Cart) => {
  return axios.post('shop/cart/add',
    { userId: cart.user_id, productId: cart.product_id, quantity: cart.quantity }
  );
}
const getCartByUserId = (id: number) => {
  return axios.get(`shop/cart/${id}`);
}

const deleteCartById = (id: number) => {
  return axios.delete(`shop/cart/${id}`)
}

const updateCart = (arrListCart: updateCartItem[]) => {
  return axios.put(`shop/cart`, arrListCart)
}
const updateStock = (
  id: number,
  oldQuantity: number,
  newQuantity: number,
): Promise<ApiResponse<void>> => {
  return axios.put(`/product/updateQuantity`, null, {
    params: {
      id,
      oldQuantity,
      newQuantity,
    },
  });
};

// LocalStorage helpers for cart
const getCartKey = (userId: number | null): string => {
  return userId ? `cart_user_${userId}` : "cart_guest";
};

const getLocalCart = (userId: number | null): Cart[] => {
  const key = getCartKey(userId);
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : [];
};

const saveLocalCart = (userId: number | null, cart: Cart[]) => {
  const key = getCartKey(userId);
  localStorage.setItem(key, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
};

const mergeCartAfterLogin = (userId: number) => {
  const guestCart = getLocalCart(null);
  if (guestCart.length === 0) return;

  const userCart = getLocalCart(userId);
  const mergedCart = [...userCart];

  guestCart.forEach((guestItem) => {
    const existingIndex = mergedCart.findIndex(
      (userItem) =>
        userItem.productId === guestItem.productId &&
        userItem.size === guestItem.size &&
        userItem.color === guestItem.color
    );

    if (existingIndex > -1) {
      mergedCart[existingIndex].quantity += guestItem.quantity;
    } else {
      mergedCart.push(guestItem);
    }
  });

  saveLocalCart(userId, mergedCart);
  localStorage.removeItem("cart_guest");
  window.dispatchEvent(new Event("cart-updated"));
};

export {
  postAddToCart, getCartByUserId, deleteCartById, updateCart,
  updateStock, getCartKey, getLocalCart, saveLocalCart, mergeCartAfterLogin
}