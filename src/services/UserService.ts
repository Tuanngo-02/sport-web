import { ApiResponse } from "../models/ApiResponse";
import PageResponse from "../models/PageResponse";
import { User } from "../models/User";
import axios from "../utils/AxiosCustomize";

const postCreateNewUser = (userData: User): Promise<ApiResponse<User>> => {
  const formData = new FormData();
  formData.append("email", userData.email);
  formData.append("password", userData.password);
  formData.append("fullName", userData.fullName || "");
  formData.append("dateOfBirth", userData.dateOfBirth || "");
  formData.append("gender", userData.gender || "");
  formData.append("role", userData.role);
  formData.append("phone", userData.phone || "");
  if (userData.image) {
    formData.append("image", userData.image);
  }

  return axios.post("/user", formData);
};
const postUpdateUser = (userData: User): Promise<ApiResponse<User>> => {
  const data = new FormData();
  if (userData.id !== undefined) {
    data.append("id", userData.id.toString());
  }
  data.append("email", userData.email);
  data.append("fullName", userData.fullName || "");
  data.append("dateOfBirth", userData.dateOfBirth || "");
  data.append("gender", userData.gender || "");
  data.append("phone", userData.phone || "");
  data.append("role", userData.role);
  if (userData.image) {
    data.append("image", userData.image);
  }

  return axios.put(`/user`, data);
};

const deleteUser = (userId: number): Promise<ApiResponse<void>> => {
  return axios.delete(`/user/${userId}`);
};
const getUserWithPaginate = (
  page: number,
  limit: number
): Promise<ApiResponse<PageResponse<User>>> => {
  return axios.get(`/user?page=${page}&limit=${limit}`);
};
export { postCreateNewUser, getUserWithPaginate, postUpdateUser, deleteUser };
