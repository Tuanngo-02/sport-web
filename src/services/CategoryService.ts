import { Category } from './../models/Category';
import axios from "../utils/AxiosCustomize";
import { ApiResponse } from '../models/ApiResponse';
import PageResponse from '../models/PageResponse';

const getAllCategory = (): Promise<ApiResponse<Category[]>> => {
    return axios.get('/category/getAll')
}
const getRootCategory = (): Promise<ApiResponse<Category[]>> => {
    return axios.get('/category?level=root')
}
const getLeafCategory = (): Promise<ApiResponse<Category[]>> => {
    return axios.get('/category?type=leaf')    
}
const getCategoryWithPaginate = (page: number, limit: number, name?: string, type?: string): Promise<ApiResponse<PageResponse<Category>>> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (name) params.append("name", name);
    if (type) {
        params.append("type", type);
        params.append("level", type);
    }
    return axios.get(`/category/page?${params.toString()}`)
}
const postNewCategory = (category: Category): Promise<ApiResponse<Category>> => {
    return axios.post(`/category`,
        {name: category.name, parentId: category.parentId}
    )
}
const postParentCategory = (category: Category): Promise<ApiResponse<Category>> => {
    return axios.post(`/category`, 
        {name: category.name}
    )
}
const getCategoryById = (id: number): Promise<ApiResponse<Category>> => {
    return axios.get(`/category/${id}`)
}
const updateCategory = (id: number, category: Category): Promise<ApiResponse<Category>> => {
    return axios.put(`/category/${id}`,
        {name: category.name, parentId: category.parentId}
    )
}
const deleteCategory = (id: number): Promise<ApiResponse<void>> => {
    return axios.delete(`/category/${id}`)
}
export {
    getAllCategory,
    getRootCategory,
    getLeafCategory,
    getCategoryWithPaginate,
    postNewCategory,
    postParentCategory,
    getCategoryById,
    updateCategory,
    deleteCategory
}