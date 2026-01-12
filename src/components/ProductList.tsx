import React, { useEffect, useState } from 'react'
import ProductBox from './ProductBox'
import { getProductsWithPaginate } from '../services/ProductService'
import ReactPaginate from 'react-paginate';
import { Product } from '../models/Product';

const ProductList = () => {
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [currentPage , setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const LIMIT_PAGE = 2;
  useEffect(() => {
    fetchProductList(currentPage)
  }, [currentPage])
  const fetchProductList = async(page: number) => {
    let res = await getProductsWithPaginate(page,LIMIT_PAGE );
    if(res && res.code === 1000){
      setCurrentPage(res.result.currentPage)
      setPageCount(res.result.totalPage)
      setListProduct(res.result.data)
    }

  }
  const handlePageClick = (event: { selected: number }) => {    
        fetchProductList(+event.selected + 1);
  };
  return (
    <div>
      <div className="bg-white">
  <div className="mx-auto max-w-2xl lg:max-w-7xl lg:px-8">
    <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
      {
        listProduct && listProduct.length >0 &&
        listProduct.map((product, index) => {
          return (
            <ProductBox
              id={product.id}
              name={product.name}
              branch='branch'
              price={product.price}
              rating={product.rating}
            />
          )
        })
      }

      {/* <!-- More products... --> */}
    </div>
       <div>
          <ReactPaginate
                breakLabel="..."
                nextLabel="Next >"
                previousLabel="< Previous"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={pageCount}
                renderOnZeroPageCount={null}
                forcePage={currentPage - 1}

                containerClassName="flex justify-center items-center gap-2 mt-4"
                pageClassName=""
                pageLinkClassName="px-3 py-1 rounded bg-gray-100 hover:bg-gray-300 transition-colors"
                previousClassName=""
                previousLinkClassName="px-3 py-1 rounded bg-gray-100 hover:bg-gray-300 transition-colors"
                nextClassName=""
                nextLinkClassName="px-3 py-1 rounded bg-gray-100 hover:bg-gray-300 transition-colors"
                activeClassName="bg-blue-600 text-white font-semibold"
            />
      </div>
  </div>
</div>
    </div>
  )
}

export default ProductList
