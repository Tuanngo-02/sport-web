import ReactPaginate from "react-paginate";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import { Product } from "../../models/Product";
interface TableProductProps {
  listProducts: Product[];
  handleClickBtnUpdate: (product: Product) => void;
  handleClickBtnDelete: (product: Product) => void;
  fetchListProductsWithPaginate: (page: number) => void;
  pageCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}
const TableProduct = ({
  listProducts,
  handleClickBtnDelete,
  handleClickBtnUpdate,
  fetchListProductsWithPaginate,
  pageCount,
  currentPage,
  setCurrentPage,
}: TableProductProps) => {
  const handlePageClick = (event: { selected: number }) => {
    fetchListProductsWithPaginate(+event.selected + 1);
    setCurrentPage(+event.selected + 1);
  };
  return (
    <div className="overflow-hidden border border-zinc-200 rounded-2xl bg-white shadow-xs mt-6">
      <table className="min-w-full divide-y divide-zinc-200 text-left">
        <thead className="bg-zinc-50/80 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
          <tr>
            <th className="px-6 py-4">Mã SP (Code)</th>
            <th className="px-6 py-4">Tên sản phẩm</th>
            <th className="px-6 py-4">Ảnh</th>
            <th className="px-6 py-4">Danh mục</th>
            <th className="px-6 py-4">Nhãn (Tag)</th>
            <th className="px-6 py-4 text-right">Giá bán (VND)</th>
            <th className="px-6 py-4 text-right">Giá KM (VND)</th>
            <th className="px-6 py-4 text-center">Đánh giá</th>
            <th className="px-6 py-4 text-center">Kho hàng</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white">
          {listProducts.map((product, index) => (
            <tr key={product.id} className="hover:bg-zinc-50/50 transition-colors">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-zinc-800">
                {product.code || "—"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-zinc-800">
                {product.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm">
                <img
                  src={`data:image/jpeg;base64,${product.imageProduct}`}
                  alt="ảnh sản phẩm"
                  className="w-10 h-10 object-contain rounded border border-zinc-200 bg-zinc-50"
                />
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-600">
                {product.categoryName || "—"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                {product.tag ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-zinc-100 text-zinc-700 border border-zinc-200">
                    {product.tag}
                  </span>
                ) : "—"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-zinc-700 text-right">
                {product.price ? product.price.toLocaleString("vi-VN") : "0"} ₫
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-brand-accent text-right">
                {product.discountPrice ? `${product.discountPrice.toLocaleString("vi-VN")} ₫` : "—"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-center font-bold text-amber-500">
                ★ {product.rating || "5.0"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-center">
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
                  Còn hàng
                </span>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-right font-medium space-x-1.5">
                <button
                  className="text-blue-600 hover:text-blue-800 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                  onClick={() => handleClickBtnUpdate(product)}
                  title="Sửa sản phẩm"
                >
                  <FaRegEdit className="text-base" />
                </button>
                <button
                  className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                  onClick={() => handleClickBtnDelete(product)}
                  title="Xóa sản phẩm"
                >
                  <IoTrashBinOutline className="text-base" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="user-pagination px-6 py-4 border-t border-zinc-100">
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          previousLabel="<"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          forcePage={currentPage - 1}
          containerClassName="flex justify-end items-center gap-2 cursor-pointer"
          pageClassName=""
          pageLinkClassName="px-4 py-2 text-sm font-semibold text-zinc-600 rounded-lg bg-zinc-50 hover:bg-zinc-200 transition-colors"
          previousClassName=""
          previousLinkClassName="px-4 py-2 text-sm font-semibold text-zinc-600 rounded-lg bg-zinc-50 hover:bg-zinc-200 transition-colors"
          nextClassName=""
          nextLinkClassName="px-4 py-2 text-sm font-semibold text-zinc-600 rounded-lg bg-zinc-50 hover:bg-zinc-200 transition-colors"
          activeClassName="text-brand-primary font-bold bg-brand-primary/10 rounded-lg"
        />
      </div>
    </div>
  );
};
export default TableProduct;
