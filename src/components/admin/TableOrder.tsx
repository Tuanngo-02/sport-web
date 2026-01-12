import { Order } from "../../models/Order";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import ReactPaginate from "react-paginate";
interface TableOrderProps {
  listOrders: Order[];
  handleClickBtnUpdate: (order: Order) => void;
  handleClickBtnDelete: (order: Order) => void;
  fetchListOrdersWithPaginate: (page: number) => void;
  pageCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}
const TableOrder = ({
    listOrders,
    handleClickBtnDelete,
    handleClickBtnUpdate,
    fetchListOrdersWithPaginate,
    pageCount,
    currentPage,
    setCurrentPage
} : TableOrderProps) => {
    const handlePageClick = (event: { selected: number }) => {
        fetchListOrdersWithPaginate(+event.selected + 1);
        setCurrentPage(+event.selected + 1)
    };
    return (
        <div>
            <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-md">
                <thead>
                <tr className="text-md font-semibold text-black text-left">
                    <th className="px-6 py-3">
                    ID
                    </th>
                    <th className="px-6 py-3">
                    Name Client
                    </th>
                    <th className="px-6 py-3">
                    Email
                    </th>
                    <th className="px-6 py-3">
                    Phone
                    </th>
                    <th className="px-6 py-3">
                    Total Price (VND)
                    </th>
                    <th className="px-6 py-3">
                    Status
                    </th>
                    <th className="px-6 py-3" />
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {listOrders.map((order, index) => (
                    <tr key={order.id}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {order.id}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {order.fullName}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {order.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {order.phone}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {(order.totalPrice).toLocaleString("vi-VN")}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                        {order.paymentMethod}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm space-x-2">
                        <button
                        className="text-blue-500 bg-white p-2 rounded hover:bg-gray-100"
                        onClick={() => handleClickBtnUpdate(order)}
                        >
                        <FaRegEdit />
                        </button>
                        <button
                        className="text-red-500 bg-white p-2 rounded hover:bg-gray-100"
                        onClick={() => handleClickBtnDelete(order)}
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
    )
}
export default TableOrder;