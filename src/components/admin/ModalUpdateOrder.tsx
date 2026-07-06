import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Order } from '../../models/Order'
import { postUpdateOrder } from '../../services/CheckOutService'

interface UpdateOrderProps {
  show: boolean
  setShow: (value: boolean) => void
  fetchListOrdersWithPaginate: (page: number) => void
  currentPage: number
  setCurrentPage: (page: number) => void
  dataUpdate: Order | null
  resetUpdateData: () => void
}

const ModalUpdateOrder = ({
  show,
  setShow,
  fetchListOrdersWithPaginate,
  currentPage,
  dataUpdate,
  resetUpdateData
}: UpdateOrderProps) => {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [totalPrice, setTotalPrice] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [status, setStatus] = useState('Pending')

  const [createdDate, setCreatedDate] = useState('')
  const [orderDetail, setOrderDetail] = useState('')
  const [address, setAddress] = useState<any>(null)
  const [items, setItems] = useState<any[]>([])

  const handleClose = () => {
    setShow(false)
    resetUpdateData()
  }

  useEffect(() => {    
    if (dataUpdate) {
      setFullName(dataUpdate.fullName)
      setEmail(dataUpdate.email)
      setPhone(dataUpdate.phone)
      setTotalPrice(dataUpdate.totalPrice)
      setPaymentMethod(dataUpdate.paymentMethod)
      setStatus(dataUpdate.status || 'Pending')
      setAddress(dataUpdate.address)
      setItems(dataUpdate.checkoutItemResponses || [])
      setCreatedDate(dataUpdate.createdDate || '')
      setOrderDetail(dataUpdate.orderDetail || '')
    }
  }, [dataUpdate])

  const validateEmail = (email: string) =>
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )

  const handleSubmitUpdateOrder = async () => {
    if (!validateEmail(email)) {
      toast.error('Email không hợp lệ')
      return
    }

    if (!dataUpdate) {
      toast.error('Không có dữ liệu cập nhật')
      return
    }

    const data = await postUpdateOrder(dataUpdate.id!, status);
    
    if (data && data.code === 1000) {
      toast.success(data.message)
      handleClose()
      fetchListOrdersWithPaginate(currentPage)
    } else {
      toast.error('Cập nhật đơn hàng thất bại')
    }
  }

  return (
    <Dialog open={show} onClose={() => {}} className="relative z-50">
      <div className="fixed inset-0 bg-brand-primary/30 backdrop-blur-xs transition-opacity duration-300" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-zinc-100 transition-all">
          <DialogTitle className="text-xl font-bold text-brand-primary font-display border-b border-zinc-100 pb-4 mb-6">
            Chi Tiết & Cập Nhật Đơn Hàng
          </DialogTitle>

          {/* FORM */}
          <div className="space-y-6">

            {/* THÔNG TIN KHÁCH HÀNG */}
            <div className="bg-zinc-50/70 p-5 rounded-2xl border border-zinc-100 space-y-4">
              <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-1.5">
                Thông tin khách hàng
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Họ và tên</label>
                  <input
                    value={fullName}
                    disabled
                    className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm bg-zinc-100/70 text-zinc-500 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Email</label>
                  <input
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all font-medium text-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                  <input
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all font-medium text-zinc-700"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Ngày đặt hàng</label>
                  <input
                    value={createdDate ? new Date(createdDate).toLocaleString("vi-VN") : ""}
                    disabled
                    className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm bg-zinc-100/70 text-zinc-500 font-medium cursor-not-allowed"
                  />
                </div>

                {orderDetail && (
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Ghi chú từ khách hàng</label>
                    <textarea
                      value={orderDetail}
                      disabled
                      className="w-full border border-zinc-200 rounded-lg p-3 text-sm bg-zinc-100/50 text-zinc-600 font-medium cursor-not-allowed resize-none h-14"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ĐỊA CHỈ GIAO HÀNG */}
            {address && (
              <div className="bg-zinc-50/70 p-5 rounded-2xl border border-zinc-100 space-y-3">
                <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-1.5">
                  Địa chỉ nhận hàng
                </h3>
                <div className="text-sm font-semibold text-zinc-700 space-y-1">
                  <p><span className="text-zinc-400 font-normal">Quốc gia:</span> {address.country}</p>
                  <p><span className="text-zinc-400 font-normal">Tỉnh/Thành phố:</span> {address.city}</p>
                  <p><span className="text-zinc-400 font-normal">Quận/Huyện:</span> {address.district}</p>
                  <p><span className="text-zinc-400 font-normal">Phường/Xã:</span> {address.ward}</p>
                  <p><span className="text-zinc-400 font-normal">Địa chỉ chi tiết:</span> {address.addressDetail}</p>
                </div>
              </div>
            )}

            {/* DANH SÁCH SẢN PHẨM */}
            <div className="space-y-3">
              <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-1.5">
                Danh sách sản phẩm
              </h3>
              <div className="overflow-hidden border border-zinc-200 rounded-xl">
                <table className="w-full text-sm text-left">
                  <thead className="bg-zinc-50 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
                    <tr>
                      <th className="p-3.5">Tên sản phẩm</th>
                      <th className="p-3.5 text-center">Kích cỡ</th>
                      <th className="p-3.5 text-center">Số lượng</th>
                      <th className="p-3.5 text-right">Đơn giá</th>
                      <th className="p-3.5 text-right">Thành tiền</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 bg-white">
                    {items.map((item, idx) => (
                      <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                        <td className="p-3.5 font-bold text-zinc-800">{item.productName}</td>
                        <td className="p-3.5 text-center font-semibold text-zinc-500">{item.size}</td>
                        <td className="p-3.5 text-center font-bold text-zinc-800">{item.quantity}</td>
                        <td className="p-3.5 text-right font-semibold text-zinc-600">
                          {item.price !== null && item.price !== undefined ? item.price.toLocaleString("vi-VN") : '0'} ₫
                        </td>
                        <td className="p-3.5 text-right font-bold text-zinc-800">
                          {item.price !== null && item.price !== undefined ? (item.price * item.quantity).toLocaleString("vi-VN") : '0'} ₫
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* TRẠNG THÁI & THANH TOÁN */}
            <div className="bg-zinc-50/70 p-5 rounded-2xl border border-zinc-100 space-y-4">
              <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-1.5">
                Trạng thái & Thanh toán
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Trạng thái đơn hàng</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                    className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white font-bold text-zinc-700"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Phương thức thanh toán</label>
                  <input
                    value={paymentMethod}
                    disabled
                    className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm bg-zinc-100/70 text-zinc-500 font-semibold cursor-not-allowed"
                  />
                </div>

                <div className="text-right sm:col-span-1">
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Tổng tiền thanh toán</label>
                  <span className="text-2xl font-extrabold text-brand-accent font-display">
                    {totalPrice !== null && totalPrice !== undefined ? totalPrice.toLocaleString("vi-VN") : '0'} ₫
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-3 mt-8 border-t border-zinc-100 pt-6">
            <button
              className="px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer"
              onClick={handleClose}
            >
              Hủy
            </button>
            <button
              className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-accent text-white text-sm font-bold shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-95"
              onClick={handleSubmitUpdateOrder}
            >
              Lưu thay đổi
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export default ModalUpdateOrder
