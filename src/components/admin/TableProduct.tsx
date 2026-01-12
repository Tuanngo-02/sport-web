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
    <div>
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-md">
        <thead>
          <tr className="text-md font-semibold text-black text-center">
            <th className="px-6 py-3">ID (Code)</th>
            <th className="px-6 py-3">Product Name</th>
            <th className="px-6 py-3">Product Image</th>
            <th className="px-6 py-3">Category</th>
            <th className="px-6 py-3">Tag</th>
            <th className="px-6 py-3">Price (VND)</th>
            <th className="px-6 py-3">Discount Price (VND)</th>
            <th className="px-6 py-3">Rating</th>
            <th className="px-6 py-3">Stock</th>
            <th className="px-6 py-3"> Action </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {listProducts.map((product, index) => (
            <tr key={product.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {product.code}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {product.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                <img
                  src={`data:image/jpeg;base64,${product.imageProduct}`}
                  alt="ảnh sản phẩm"
                ></img>
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {product.categoryName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {product.tag}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {(product.price).toLocaleString("vi-VN")}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {product.discountPrice ? (product.discountPrice).toLocaleString("vi-VN") :""}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {product.rating}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                In stock
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm space-x-2">
                <button
                  className="text-blue-500 bg-white p-2 rounded hover:bg-gray-100"
                  onClick={() => handleClickBtnUpdate(product)}
                >
                  <FaRegEdit />
                </button>
                <button
                  className="text-red-500 bg-white p-2 rounded hover:bg-gray-100"
                  onClick={() => handleClickBtnDelete(product)}
                >
                  <IoTrashBinOutline />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="user-pagination">
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          previousLabel="<"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          forcePage={currentPage - 1}
          containerClassName="flex justify-end items-center gap-2 mt-9 cursor-pointer"
          pageClassName=""
          pageLinkClassName="px-5 py-3 rounded bg-gray-100 hover:bg-gray-300 transition-colors"
          previousClassName=""
          previousLinkClassName="px-5 py-3 rounded bg-gray-100 hover:bg-gray-300 transition-colors"
          nextClassName=""
          nextLinkClassName="px-5 py-3 rounded bg-gray-100 hover:bg-gray-300 transition-colors"
          activeClassName="text-red-500 font-bold "
        />
      </div>
    </div>
  );
};
export default TableProduct;
