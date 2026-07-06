import { useEffect, useState } from "react";
import { Order } from "../../models/Order";
import TableOrder from "../../components/admin/TableOrder";
import { getOrdersWithPaginate, getOrderDetail } from "../../services/CheckOutService";
import ModalUpdateOrder from "../../components/admin/ModalUpdateOrder";
import { Checkout } from "../../models/CheckOut";
import { toast } from "react-toastify";

const OrderPage = () => {
  const LIMIT_PAGE = 3;
  const [listOrders, setListOrders] = useState<Order[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModalUpdateOrder, setShowModalUpdateOrder] = useState(false);
  const [showModalDeleteOrder, setShowModalDeleteOrder] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<Order | null>(null);
  const [dataDelete, setDataDelete] = useState<Order | null>(null);

  const [showFilter, setShowFilter] = useState(false);
  const [searchFullName, setSearchFullName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");

  useEffect(() => {
    //   fetchListProducts()
    fetchListOrdersWithPaginate(1);
  }, []);
  //gọi api cập nhật lại giao diện
  const fetchListOrdersWithPaginate = async (page: number) => {
    let res = await getOrdersWithPaginate(
      page,
      LIMIT_PAGE,
      searchFullName || undefined,
      searchStatus || undefined
    );
    if (res.code === 1000) {
      console.log("data", res.result);
      setListOrders(res.result.data);
      setPageCount(res.result.totalPage);
    }
  };
  const handleClickBtnUpdate = async (order: Order) => {
    let res = await getOrderDetail(order.id!);
    if (res && res.code === 1000) {
      setDataUpdate(res.result);
      setShowModalUpdateOrder(true);
    } else {
      toast.error("Không thể lấy chi tiết đơn hàng");
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchListOrdersWithPaginate(1);
  };

  const handleClear = async () => {
    setSearchFullName("");
    setSearchStatus("");
    setCurrentPage(1);
    
    let res = await getOrdersWithPaginate(1, LIMIT_PAGE);
    if (res.code === 1000) {
      setListOrders(res.result.data);
      setPageCount(res.result.totalPage);
    }
  };

  const handleClickBtnDelete = (order: Order) => {
    setShowModalDeleteOrder(true);
    setDataDelete(order);
  };
  const resetUpdateData = () => {
    setDataUpdate(null);
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
      </div>
      <div className="sm:flex sm:items-center justify-between mt-3">
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 cursor-pointer hover:bg-gray-900 ">
          THÊM ĐƠN HÀNG
        </button>
        <button
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white cursor-pointer transition-colors ${showFilter ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-800 hover:bg-gray-900'}`}
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? "ẨN BỘ LỌC" : "BỘ LỌC"}
        </button>
      </div>

      {showFilter && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end shadow-xs">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên khách hàng</label>
            <input
              type="text"
              value={searchFullName}
              onChange={(e) => setSearchFullName(e.target.value)}
              placeholder="Nhập tên khách hàng..."
              className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:border-gray-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Trạng thái (Status)</label>
            <select
              value={searchStatus}
              onChange={(e) => setSearchStatus(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:border-gray-800 focus:outline-none bg-white"
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Chưa thanh toán (PENDING)</option>
              <option value="PAID">Đã thanh toán (PAID)</option>
              <option value="CANCELLED">Đã hủy (CANCELLED)</option>
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
      <ModalUpdateOrder
        show={showModalUpdateOrder}
        setShow={setShowModalUpdateOrder}
        fetchListOrdersWithPaginate={fetchListOrdersWithPaginate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        dataUpdate={dataUpdate}
        resetUpdateData={resetUpdateData}
      />

      <div className="mt-8 flow-root">
        <div className="-my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <TableOrder
              listOrders={listOrders}
              handleClickBtnUpdate={handleClickBtnUpdate}
              handleClickBtnDelete={handleClickBtnDelete}
              fetchListOrdersWithPaginate={fetchListOrdersWithPaginate}
              pageCount={pageCount}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default OrderPage;
