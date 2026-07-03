import { ApiResponse } from "../models/ApiResponse";
import PageResponse from "../models/PageResponse";
import { Product } from "../models/Product";
import axios from "../utils/AxiosCustomize";

const getProductByTag = (tag: String): Promise<ApiResponse<Product[]>> => {
    return axios.get(`/product/by-tag`, {
        params: {
            tag: tag
        }
    })
}
const getProductById = (productId: number): Promise<ApiResponse<Product>> => {
    return axios.get(`/product/${productId}`);
}
const getProductVariantById = (variantId: number) => {
    return axios.get(`/product/by-variantId`, {
        params: {
            variantId: variantId
        }
    })
}
const getProductByCategoryId = (categoryId: number): Promise<ApiResponse<Product[]>> => {
    return axios.get(`/product/by-catgegoryId`, {
        params: {
            categoryId: categoryId
        }
    })
}

const postCreateNewProduct = (product: Product): Promise<ApiResponse<Product>> => {
    // console.log(product);

    // const data = new FormData();
    // data.append('name', product.name);
    // data.append('categoryId', product.categoryId.toString());
    // data.append('price', product.price.toString());
    // data.append('discountPrice', product.discountPrice.toString());
    // data.append('description', product.description);
    // data.append('code', product.code);
    // data.append('branch', product.branch);
    // data.append('tag', product.tag);
    // data.append('rating', product.rating.toString());  
    // data.append('content', product.content);  

    // data.append('gender', product.gender);
    // data.append('variants', JSON.stringify(product.variants || []));
    const data = new FormData();

    // Gói toàn bộ object product thành JSON blob
    const productBlob = new Blob([JSON.stringify(product)], { type: "application/json" });
    data.append("product", productBlob);

    if (product.imageProduct) {
        data.append('image', product.imageProduct);
    }
    return axios.post('/product', data);
}
const getProductsWithPaginate = (page: number, limit: number, sortBy?: string, sortDir?: string, categoryId?: number): Promise<ApiResponse<PageResponse<Product>>> => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (sortBy) params.append("sortBy", sortBy);
    if (sortDir) params.append("sortDir", sortDir);
    if (categoryId !== null && categoryId !== undefined) {
        params.append("categoryId", categoryId.toString());
    }
    return axios.get(`/product?${params.toString()}`);
}
const postUpdateProduct = (product: Product): Promise<ApiResponse<Product>> => {
    const data = new FormData();
    if (product.id !== undefined) {
        data.append("id", product.id.toString());
    }
    // data.append('name', product.name);
    // data.append('category_id', product.category_id.toString());
    // data.append('price', product.price.toString());
    // data.append('quantity', product.quantity.toString());  
    // data.append('rating', product.rating);  
    // data.append('content', product.content);  
    const productBlob = new Blob([JSON.stringify(product)], { type: "application/json" });
    data.append("product", productBlob);
    if (product.imageProduct) {
        data.append('image', product.imageProduct);
    }
    return axios.put('/product', data);
}
const deleteProduct = (id: number): Promise<ApiResponse<void>> => {
    return axios.delete(`/product/${id}`);
}
const deleteProductVariant = (idProduct: number, idVariant: number): Promise<ApiResponse<void>> => {
    return axios.delete(`/product/${idProduct}/variants/${idVariant}`)
}
const deleteSizeAndStock = (idProduct: number, idVariant: number, idSizeAndStock: number): Promise<ApiResponse<void>> => {
    return axios.delete(`/product/${idProduct}/variants/${idVariant}/sizes/${idSizeAndStock}`)
}
export {
    getProductByTag,
    getProductsWithPaginate,
    getProductById,
    postCreateNewProduct,
    postUpdateProduct,
    deleteProduct,
    deleteProductVariant,
    deleteSizeAndStock,
    getProductVariantById,
    getProductByCategoryId
}