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
  const [paymentMethod, setPaymentMethod] = useState('NO_DONE')

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
      setAddress(dataUpdate.address)
      setItems(dataUpdate.checkoutItemResponses || [])
    }
  }, [dataUpdate])

  const validateEmail = (email: string) =>
    String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
 const mapPaymentStatus = (status: string): string =>
  status === 'DONE' ? 'Đã thanh toán' : 'Chưa thanh toán';

  const handleSubmitUpdateOrder = async () => {
    if (!validateEmail(email)) {
      toast.error('Email không hợp lệ')
      return
    }

    if (!dataUpdate) {
      toast.error('Không có dữ liệu cập nhật')
      return
    }

    const data = await postUpdateOrder(dataUpdate.id!, mapPaymentStatus(paymentMethod));
    
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
      <div className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-4xl rounded-xl bg-white p-6 max-h-screen overflow-y-auto">
          <DialogTitle className="text-xl font-semibold border-b pb-4 mb-6">
            Update Order
          </DialogTitle>

          {/* FORM */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* CUSTOMER INFORMATION */}
            <h3 className="col-span-2 font-semibold text-lg mt-2">
              Customer Information
            </h3>

            <div>
              <label className="label">Full Name: </label>
              <input value={fullName} disabled className="input-disabled" />
            </div>

            <div>
              <label className="label">Email: </label>
              <input value={email} onChange={e => setEmail(e.target.value)} />
            </div>

            <div>
              <label className="label">Phone: </label>
              <input value={phone} onChange={e => setPhone(e.target.value)} />
            </div>

            <div>
              <label className="label">Created Date: </label>
              <input
                value={new Date(createdDate).toLocaleString()}
                disabled
                className="input-disabled"
              />
            </div>

            {/* ĐỊA CHỈ */}
            <h3 className="col-span-2 font-semibold text-lg mt-4">
              Shipping Address
            </h3>

            <div className="col-span-2 bg-gray-50 p-3 rounded-md text-sm">
              {address && (
                <>
                  <p><b>Country:</b> {address.country}</p>
                  <p><b>City:</b> {address.city}</p>
                  <p><b>District:</b> {address.district}</p>
                  <p><b>Ward:</b> {address.ward}</p>
                  <p><b>Detail:</b> {address.addressDetail}</p>
                </>
              )}
            </div>

            {/* SẢN PHẨM */}
            <h3 className="col-span-2 font-semibold text-lg mt-4">
                Product Lists
            </h3>

            <div className="col-span-2 border rounded-md">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Size</th>
                    <th className="p-2">Quantity</th>
                    <th className="p-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="border-t text-center">
                      <td className="p-2">{item.productName}</td>
                      <td className="p-2">{item.size}</td>
                      <td className="p-2">{item.quantity}</td>
                      <td className="p-2">
                        {item.price.toLocaleString()} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* THANH TOÁN */}
            <h3 className="col-span-2 font-semibold text-lg mt-4">
              Thanh toán
            </h3>

            <div>
              <label className="label">Phương thức</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
              >
                <option value="NO_DONE">Chưa thanh toán</option>
                <option value="DONE">Đã thanh toán</option>
              </select>
            </div>

            <div>
              <label className="label">Tổng tiền</label>
              <input
                value={totalPrice.toLocaleString() + ' đ'}
                disabled
                className="input-disabled"
              />
            </div>
          </div>

          {/* BUTTON */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              className="bg-gray-200 px-4 py-2 rounded-md"
              onClick={handleClose}
            >
              Đóng
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={handleSubmitUpdateOrder}
            >
              Lưu
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}

export default ModalUpdateOrder
