import { useEffect, useState } from "react";
import { Order } from "../../models/Order";
import TableOrder from "../../components/admin/TableOrder";
import { getOrdersWithPaginate } from "../../services/CheckOutService";
import ModalUpdateOrder from "../../components/admin/ModalUpdateOrder";
import { Checkout } from "../../models/CheckOut";

const OrderPage = () => {
  const LIMIT_PAGE = 3;
  const [listOrders, setListOrders] = useState<Order[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModalUpdateOrder, setShowModalUpdateOrder] = useState(false);
  const [showModalDeleteOrder, setShowModalDeleteOrder] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<Order | null>(null);
  const [dataDelete, setDataDelete] = useState<Order | null>(null);

  useEffect(() => {
    //   fetchListProducts()
    fetchListOrdersWithPaginate(1);
  }, []);
  //gọi api cập nhật lại giao diện
  const fetchListOrdersWithPaginate = async (page: number) => {
    let res = await getOrdersWithPaginate(page, LIMIT_PAGE);
    if (res.code === 1000) {
      console.log("data", res.result);
      setListOrders(res.result.data);
      setPageCount(res.result.totalPage);
    }
  };
  const handleClickBtnUpdate = (order: Order) => {
    setDataUpdate(order);
    setShowModalUpdateOrder(true);
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
          ADD ORDER
        </button>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white custom-bg-1 cursor-pointer ">
          FITTER ORDER
        </button>
      </div>
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
