import { ApiResponse } from '../models/ApiResponse';
import { Cart, updateCartItem } from '../models/Cart';
import axios from '../utils/AxiosCustomize';

const postAddToCart = (cart : Cart) => {
    return axios.post('shop/cart/add' , 
        {userId : cart.user_id, productId: cart.product_id, quantity: cart.quantity}
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
) : Promise<ApiResponse<void>> => {
  return axios.put(`/product/updateQuantity`, null, {
    params: {
      id,
      oldQuantity,
      newQuantity,
    },
  });
};

export {
    postAddToCart,getCartByUserId, deleteCartById, updateCart,
    updateStock
}