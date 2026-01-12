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
const getCategoryWithPaginate = (page: number, limit: number): Promise<ApiResponse<PageResponse<Category>>> => {
    return axios.get(`/category/page?page=${page}&limit=${limit}`)
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