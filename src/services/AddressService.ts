import { Address } from '../models/Address';
import { ApiResponse } from '../models/ApiResponse';
import axios from '../utils/AxiosCustomize';

interface AddressRequest {
  country: string;
  city: string;
  district: string;
  ward: string;
  addressDetail: string;
  addressType: string;
}

const createNewAddress = (id: number, address: AddressRequest): Promise<ApiResponse<Address>> => {
  console.log(address);

  return axios.post(`/address/${id}`, address)
}
const getAddressByUserId = (userId: number): Promise<ApiResponse<Address[]>> => {
  return axios.get(`/address/${userId}`)
}
export {
  createNewAddress,
  getAddressByUserId
}