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

    const renderStatusBadge = (status: string | undefined) => {
      const s = status ? status.toLowerCase() : 'pending';
      let bgClass = "bg-amber-50 text-amber-700 border-amber-200";
      let displayStatus = status || "Pending";

      if (s === "delivered") {
        bgClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
      } else if (s === "cancelled") {
        bgClass = "bg-rose-50 text-rose-700 border-rose-200";
      }

      return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${bgClass}`}>
          {displayStatus}
        </span>
      );
    };

  return (
    <div className="overflow-hidden border border-zinc-200 rounded-2xl bg-white shadow-xs mt-6">
      <table className="min-w-full divide-y divide-zinc-200 text-left">
        <thead className="bg-zinc-50/80 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
          <tr>
            <th className="px-6 py-4">ID Đơn</th>
            <th className="px-6 py-4">Khách hàng</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Số điện thoại</th>
            <th className="px-6 py-4 text-right">Tổng tiền (VND)</th>
            <th className="px-6 py-4 text-center">Trạng thái</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white">
          {listOrders.map((order, index) => (
            <tr key={order.id} className="hover:bg-zinc-50/50 transition-colors">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-zinc-800">
                #{order.id}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-zinc-800">
                {order.fullName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-500">
                {order.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-500">
                {order.phone}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-zinc-700 text-right">
                {(order.totalPrice || 0).toLocaleString("vi-VN")} ₫
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-center">
                {renderStatusBadge(order.status)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-right font-medium space-x-1.5">
                <button
                  className="text-blue-600 hover:text-blue-800 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                  onClick={() => handleClickBtnUpdate(order)}
                  title="Cập nhật đơn hàng"
                >
                  <FaRegEdit className="text-base" />
                </button>
                <button
                  className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                  onClick={() => handleClickBtnDelete(order)}
                  title="Xóa đơn hàng"
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
    )
}
export default TableOrder;