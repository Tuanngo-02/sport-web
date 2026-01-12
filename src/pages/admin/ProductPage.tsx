import { useEffect, useState } from "react";
import { Product } from "../../models/Product";
import { getProductsWithPaginate } from "../../services/ProductService";
import TableProduct from "../../components/admin/TableProduct";
import ModalCreateProduct from "../../components/admin/ModalCreateProduct";
import ModalUpdateProduct from "../../components/admin/ModalUpdateProduct";
import ModalDeleteProduct from "../../components/admin/ModalDeleteProduct";

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

    useEffect(() => {
            //   fetchListProducts()
        fetchListProductsWithPaginate(1)
    }, [])
          //gọi api cập nhật lại giao diện
    const fetchListProductsWithPaginate = async(page: number) => {
        let res = await getProductsWithPaginate(page, LIMIT_PAGE)

        if(res.code === 1000){
            setListProducts(res.result.data);
            setPageCount(res.result.totalPage);
    
        }   
    }
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
            ADD PRODUCT
          </button>
          <button 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white custom-bg-1 cursor-pointer "
          >
            FITTER PRODUCT
          </button>
        </div>
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