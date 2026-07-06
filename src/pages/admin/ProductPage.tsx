import { useEffect, useState } from "react";
import { Product } from "../../models/Product";
import { getProductsWithPaginate } from "../../services/ProductService";
import TableProduct from "../../components/admin/TableProduct";
import ModalCreateProduct from "../../components/admin/ModalCreateProduct";
import ModalUpdateProduct from "../../components/admin/ModalUpdateProduct";
import ModalDeleteProduct from "../../components/admin/ModalDeleteProduct";
import { getAllCategory } from "../../services/CategoryService";
import { Category } from "../../models/Category";
import { tag_categories } from "../../constants/categories";

const ProductPage = () => {
    const LIMIT_PAGE = 3;
    const [listProducts, setListProducts] =  useState<Product[]>([])
    const [pageCount, setPageCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [showModalCreateProduct, setShowModalCreateProduct] = useState(false)
    const [showModalUpdateProduct, setShowModalUpdateProduct] = useState(false)
    const [showModalDeleteProduct, setShowModalDeleteProduct] = useState(false)
    const [dataUpdate, setDataUpdate] = useState<Product | null>(null) 
    const [dataDelete, setDataDelete] = useState<Product | null>(null) 

    const [showFilter, setShowFilter] = useState(false);
    const [searchName, setSearchName] = useState("");
    const [searchTag, setSearchTag] = useState("");
    const [searchCategoryId, setSearchCategoryId] = useState("");
    const [searchSortDir, setSearchSortDir] = useState(""); // "asc" | "desc" | ""
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            let res = await getAllCategory();
            if (res.code === 1000) {
                setCategories(res.result);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        //   fetchListProducts()
        fetchListProductsWithPaginate(1)
    }, [])
    //gọi api cập nhật lại giao diện
    const fetchListProductsWithPaginate = async(page: number) => {
        let res = await getProductsWithPaginate(
            page, 
            LIMIT_PAGE,
            searchSortDir ? "price" : undefined,
            searchSortDir || undefined,
            searchCategoryId ? Number(searchCategoryId) : undefined,
            searchName || undefined,
            searchTag || undefined
        );

        if(res.code === 1000){
            setListProducts(res.result.data);
            setPageCount(res.result.totalPage);
        }   
    }

    const handleSearch = () => {
        setCurrentPage(1);
        fetchListProductsWithPaginate(1);
    };

    const handleClear = async () => {
        setSearchName("");
        setSearchTag("");
        setSearchCategoryId("");
        setSearchSortDir("");
        setCurrentPage(1);
        
        let res = await getProductsWithPaginate(1, LIMIT_PAGE);
        if (res.code === 1000) {
            setListProducts(res.result.data);
            setPageCount(res.result.totalPage);
        }
    };

    const handleClickBtnUpdate = (product: Product) => {
        setDataUpdate(product);
        setShowModalUpdateProduct(true);
      }
    
      const handleClickBtnDelete = (product: Product) => {    
        setShowModalDeleteProduct(true)
        setDataDelete(product)
      }
      const resetUpdateData = () => {
        setDataUpdate(null);
      }
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        </div>
        <div className="sm:flex sm:items-center justify-between mt-3">
          <button 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 cursor-pointer hover:bg-gray-900 "
            onClick={() => setShowModalCreateProduct(true)}
          >
            THÊM SẢN PHẨM
          </button>
          <button 
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white cursor-pointer transition-colors ${showFilter ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-800 hover:bg-gray-900'}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? "ẨN BỘ LỌC" : "BỘ LỌC"}
          </button>
        </div>

        {showFilter && (
          <div className="bg-white p-4 rounded-xl border border-gray-200 mt-4 grid grid-cols-1 sm:grid-cols-5 gap-4 items-end shadow-xs">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên sản phẩm</label>
              <input
                type="text"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                placeholder="Nhập tên sản phẩm..."
                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:border-gray-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Loại sản phẩm (Tag)</label>
              <select
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:border-gray-800 focus:outline-none bg-white"
              >
                <option value="">Tất cả tag</option>
                {tag_categories.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Danh mục (Category)</label>
              <select
                value={searchCategoryId}
                onChange={(e) => setSearchCategoryId(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:border-gray-800 focus:outline-none bg-white"
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Sắp xếp theo Giá</label>
              <select
                value={searchSortDir}
                onChange={(e) => setSearchSortDir(e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:border-gray-800 focus:outline-none bg-white"
              >
                <option value="">Mặc định</option>
                <option value="asc">Giá: Thấp đến Cao</option>
                <option value="desc">Giá: Cao đến Thấp</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                className="h-10 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg text-sm transition-all cursor-pointer flex-1 text-center"
              >
                Tìm kiếm
              </button>
              <button
                onClick={handleClear}
                className="h-10 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg text-sm transition-all cursor-pointer flex-1 text-center"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>
        )}
        <ModalCreateProduct 
              show={showModalCreateProduct} 
              setShow={setShowModalCreateProduct}
              fetchListProductsWithPaginate={fetchListProductsWithPaginate}
              currentPage = {currentPage}
              setCurrentPage = {setCurrentPage}       
        />
        <ModalUpdateProduct
              show={showModalUpdateProduct}
              setShow={setShowModalUpdateProduct}
              fetchListProductsWithPaginate={fetchListProductsWithPaginate}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              dataUpdate= {dataUpdate}
              resetUpdateData = {resetUpdateData}
        />
        <ModalDeleteProduct 
              show={showModalDeleteProduct}
              setShow={setShowModalDeleteProduct}
              fetchListProductsWithPaginate={fetchListProductsWithPaginate}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              dataDelete= {dataDelete}
        />

        <div className="mt-8 flow-root">
          <div className="-my-2 overflow-x-auto">
            <div className="inline-block min-w-full py-2 align-middle">
              <TableProduct
                listProducts = {listProducts}
                handleClickBtnUpdate = {handleClickBtnUpdate}
                handleClickBtnDelete = {handleClickBtnDelete}
                fetchListProductsWithPaginate = {fetchListProductsWithPaginate}
                pageCount = {pageCount}
                currentPage = {currentPage}
                setCurrentPage = {setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    )
}
export default ProductPage;