import { ApiResponse } from "../models/ApiResponse";
import { Auth, LoginResult } from "../models/Auth";
import axios from "../utils/AxiosCustomize";

const postLogin = (auth: Auth): Promise<ApiResponse<LoginResult>> => {
  return axios.post(`/auth/login`, {
    email: auth.email,
    password: auth.password,
  });
};
const postRegister = (auth: Auth): Promise<ApiResponse<Auth>> => {
  return axios.post(`/auth/register`,
    { email: auth.email, password: auth.password, fullName: auth.fullName }
  );
}
export {
  postLogin,
  postRegister
}