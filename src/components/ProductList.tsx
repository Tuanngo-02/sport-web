import React, { useEffect, useState } from 'react';
import ProductBox from './ProductBox';
import { getProductsWithPaginate } from '../services/ProductService';
import ReactPaginate from 'react-paginate';
import { Product } from '../models/Product';

const ProductList = () => {
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const LIMIT_PAGE = 8; // Tăng limit lên 8 sản phẩm/trang để layout bớt thưa thớt

  useEffect(() => {
    fetchProductList(currentPage);
  }, [currentPage]);

  const fetchProductList = async (page: number) => {
    let res = await getProductsWithPaginate(page, LIMIT_PAGE);
    if (res && res.code === 1000) {
      setCurrentPage(res.result.currentPage);
      setPageCount(res.result.totalPage);
      setListProduct(res.result.data);
    }
  };

  const handlePageClick = (event: { selected: number }) => {
    fetchProductList(+event.selected + 1);
  };

  return (
    <div className="bg-white font-sans">
      <div className="mx-auto max-w-2xl lg:max-w-7xl">
        {listProduct && listProduct.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listProduct.map((product) => (
              <ProductBox
                key={product.id}
                id={product.id}
                name={product.name}
                branch={product.branch || "GearUp"}
                price={product.price}
                discountPrice={product.discountPrice}
                rating={product.rating}
                colors={product.variants?.map((v: any) => v.color) || []}
                image={product.variants?.[0]?.imageProductVariant}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-brand-gray-border rounded-2xl bg-brand-bg">
            <p className="text-brand-gray-text text-sm">Hiện không có sản phẩm nào phù hợp.</p>
          </div>
        )}

        {/* Phân trang */}
        {pageCount > 1 && (
          <div className="mt-12 flex justify-center">
            <ReactPaginate
              breakLabel="..."
              nextLabel="Sau >"
              previousLabel="< Trước"
              onPageChange={handlePageClick}
              pageRangeDisplayed={3}
              pageCount={pageCount}
              renderOnZeroPageCount={null}
              forcePage={currentPage - 1}
              containerClassName="flex items-center gap-1 bg-brand-gray-light p-1.5 rounded-xl border border-brand-gray-border"
              pageClassName="list-none"
              pageLinkClassName="px-3.5 py-1.5 rounded-lg text-xs font-bold text-brand-gray-text hover:text-brand-primary hover:bg-zinc-200/50 transition-all cursor-pointer block"
              previousClassName="list-none"
              previousLinkClassName="px-3.5 py-1.5 rounded-lg text-xs font-bold text-brand-gray-text hover:text-brand-primary hover:bg-zinc-200/50 transition-all cursor-pointer block"
              nextClassName="list-none"
              nextLinkClassName="px-3.5 py-1.5 rounded-lg text-xs font-bold text-brand-gray-text hover:text-brand-primary hover:bg-zinc-200/50 transition-all cursor-pointer block"
              breakClassName="list-none text-brand-gray-text px-2 text-xs"
              activeClassName="active-page"
              // Dùng inline class hack hoặc viết đè styles cho active-page
              activeLinkClassName="!bg-brand-accent !text-white shadow-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
