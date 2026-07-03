import React, { useEffect, useState, useRef } from 'react';
import ProductBox from './ProductBox';
import { getProductsWithPaginate, getProductByCategoryId, getProductByTag } from '../services/ProductService';
import { getCategoryById } from '../services/CategoryService';
import ReactPaginate from 'react-paginate';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

interface ProductListProps {
  categoryId?: number;
  sortBy?: string;
  sortDir?: string;
  tag?: string;
}

const ProductList: React.FC<ProductListProps> = ({ categoryId, sortBy, sortDir, tag }) => {
  const [listProduct, setListProduct] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageCount, setPageCount] = useState(0);
  const LIMIT_PAGE = 8; // Tăng limit lên 8 sản phẩm/trang để layout bớt thưa thớt
  const prevCategoryRef = useRef<number | undefined>(undefined);
  const prevSortKeyRef = useRef<string>('');
  const prevTagRef = useRef<string | undefined>(undefined);
  const filteredProductsRef = useRef<Product[]>([]);

  // Đệ quy lấy tất cả các ID danh mục con và cháu của danh mục cha
  const getDescendantIds = (cat: Category): number[] => {
    const ids: number[] = [];
    if (cat.id !== undefined) {
      ids.push(cat.id);
    }
    if (cat.children && cat.children.length > 0) {
      cat.children.forEach(child => {
        ids.push(...getDescendantIds(child));
      });
    }
    return ids;
  };

  // Hàm helper để sắp xếp mảng sản phẩm trên Client-side
  const sortProducts = (products: Product[]) => {
    const sorted = [...products];
    if (sortBy === 'price') {
      sorted.sort((a, b) => {
        const priceA = a.discountPrice ?? a.price;
        const priceB = b.discountPrice ?? b.price;
        return sortDir === 'asc' ? priceA - priceB : priceB - priceA;
      });
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => {
        const ratingA = a.rating ?? 0;
        const ratingB = b.rating ?? 0;
        return sortDir === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      });
    } else if (sortBy === 'id') {
      sorted.sort((a, b) => {
        const idA = a.id ?? 0;
        const idB = b.id ?? 0;
        return sortDir === 'asc' ? idA - idB : idB - idA;
      });
    }
    return sorted;
  };

  useEffect(() => {
    const loadProducts = async () => {
      const hasCategoryChanged = prevCategoryRef.current !== categoryId;
      prevCategoryRef.current = categoryId;

      const prevSortKey = prevSortKeyRef.current;
      const currentSortKey = `${sortBy}-${sortDir}`;
      prevSortKeyRef.current = currentSortKey;
      const hasSortChanged = prevSortKey !== currentSortKey;

      const hasTagChanged = prevTagRef.current !== tag;
      prevTagRef.current = tag;

      if (hasCategoryChanged || hasSortChanged || hasTagChanged) {
        if (currentPage !== 1) {
          setCurrentPage(1);
          return;
        }
      }

      if (categoryId === undefined && !tag) {
        // Chế độ 1: Lấy tất cả sản phẩm phân trang từ server (không lọc gì)
        let res = await getProductsWithPaginate(currentPage, LIMIT_PAGE, sortBy, sortDir);
        if (res && res.code === 1000) {
          setPageCount(res.result.totalPage);
          setListProduct(res.result.data);
        }
      } else {
        // Chế độ 2, 3, 4: Lọc theo Category, Tag hoặc Cả hai
        if (hasCategoryChanged || hasTagChanged || filteredProductsRef.current.length === 0) {
          let productsToPaginate: Product[] = [];

          if (tag && categoryId === undefined) {
            // Trường hợp 2: Chỉ lọc theo tag
            let res = await getProductByTag(tag);
            if (res && res.code === 1000) {
              productsToPaginate = res.result;
            }
          } else {
            // Trường hợp 3 & 4: Có danh mục (và có thể có cả tag)
            const catRes = await getCategoryById(categoryId!);
            if (catRes && catRes.code === 1000) {
              const descendantIds = getDescendantIds(catRes.result);
              
              if (tag) {
                // Trường hợp 4: Có cả hai -> Lọc theo tag rồi lọc theo nhóm category ID
                let res = await getProductByTag(tag);
                if (res && res.code === 1000) {
                  productsToPaginate = res.result.filter(p => descendantIds.includes(p.categoryId));
                }
              } else {
                // Trường hợp 3: Chỉ có categoryId -> Lấy toàn bộ sản phẩm của các category liên quan
                const productRequests = descendantIds.map(id => getProductByCategoryId(id));
                const productResponses = await Promise.all(productRequests);
                productsToPaginate = productResponses
                  .filter(res => res && res.code === 1000)
                  .flatMap(res => res.result);
              }
            }
          }

          // Khử trùng lặp
          const uniqueProducts = productsToPaginate.filter(
            (product, index, self) => self.findIndex(p => p.id === product.id) === index
          );

          // Sắp xếp
          const sortedProducts = sortProducts(uniqueProducts);
          filteredProductsRef.current = sortedProducts;
          setPageCount(Math.ceil(sortedProducts.length / LIMIT_PAGE));
          setListProduct(sortedProducts.slice(0, LIMIT_PAGE));
        } else if (hasSortChanged) {
          // Sắp xếp lại danh sách client-side khi tiêu chí sắp xếp thay đổi
          const sortedProducts = sortProducts(filteredProductsRef.current);
          filteredProductsRef.current = sortedProducts;
          setListProduct(sortedProducts.slice(0, LIMIT_PAGE));
        } else {
          // Nếu trang thay đổi nhưng danh mục giữ nguyên, chỉ cần cắt mảng client-side
          setListProduct(filteredProductsRef.current.slice((currentPage - 1) * LIMIT_PAGE, currentPage * LIMIT_PAGE));
        }
      }
    };

    loadProducts();
  }, [currentPage, categoryId, sortBy, sortDir, tag]);

  const handlePageClick = (event: { selected: number }) => {
    setCurrentPage(+event.selected + 1);
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
