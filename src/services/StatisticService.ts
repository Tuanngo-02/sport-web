import { ApiResponse } from "../models/ApiResponse";
import axios from "../utils/AxiosCustomize";

export interface StatisticResult {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  recentOrders: any[];
}

const getStatistic = (): Promise<ApiResponse<StatisticResult>> => {
  return axios.get("/dashboard/summary");
};

export { getStatistic };
