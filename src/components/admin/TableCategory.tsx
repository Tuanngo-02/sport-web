import ReactPaginate from "react-paginate";
import { Category } from "../../models/Category";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
interface TableCategoryProps {
  listCategory: Category[];
  handleClickBtnUpdate: (category: Category) => void;
  handleClickBtnDelete: (category: Category) => void;
  fetchListCategoryWithPaginate: (page: number) => void;
  pageCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}
const TableCategory = ({
  listCategory,
  handleClickBtnUpdate,
  handleClickBtnDelete,
  fetchListCategoryWithPaginate,
  pageCount,
  currentPage,
  setCurrentPage,
}: TableCategoryProps) => {
  const handlePageClick = (event: { selected: number }) => {
    fetchListCategoryWithPaginate(+event.selected + 1);
    setCurrentPage(+event.selected + 1);
  };
  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-md">
        <thead>
          <tr className="text-md font-semibold text-black text-left">
            <th className="px-6 py-3">id</th>
            <th className="px-6 py-3">Name category</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {listCategory.map((category, index) => (
            <tr key={category.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {category.id}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                {category.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium space-x-2">
                <button
                  className="text-blue-500 bg-white p-2 rounded hover:bg-gray-100"
                  onClick={() => handleClickBtnUpdate(category)}
                >
                  <FaRegEdit />
                </button>
                <button
                  className="text-red-500 bg-white p-2 rounded hover:bg-gray-100"
                  onClick={() => handleClickBtnDelete(category)}
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
          containerClassName="flex justify-end items-center gap-2 mt-9 mb-9 cursor-pointer"
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
export default TableCategory;
