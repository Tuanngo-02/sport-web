import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { createCheckout } from "../../services/CheckOutService";
import { Checkout } from "../../models/CheckOut";
import {
  createNewAddress,
  getAddressByUserId,
} from "../../services/AddressService";
import provinces from "../../assets/data/provinces.json";
import { Cart } from "../../models/Cart";
import { Address } from "../../models/Address";
type AddressFormProps = {
  onClose: () => void; 
};
function AddressForm({ onClose }: AddressFormProps) {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [country, setCountry] = useState("Việt Nam");
  const [addressDetail, setAddressDetail] = useState("");
  const [addressType, setAddressType] = useState("");
  const [userId, setUserId] = useState<number | null>(null);
  const [selectedProvinceName, setSelectedProvinceName] = useState("");
  const [selectedDistrictName, setSelectedDistrictName] = useState("");
  const [selectedWardName, setSelectedWardName] = useState("");
  // Lấy danh sách huyện theo tỉnh
  const districts =
    provinces.find((p) => p.code === Number(selectedProvince))?.districts || [];

  // Lấy danh sách xã theo huyện
  const wards =
    districts.find((d) => d.code === Number(selectedDistrict))?.wards || [];

  useEffect(() => {
    const province = provinces.find((p) => p.code === Number(selectedProvince));
    const district = districts.find((p) => p.code === Number(selectedDistrict));
    const ward = wards.find((p) => p.code === Number(selectedWard));
    setSelectedProvinceName(province?.name || "");
    setSelectedDistrictName(district?.name || "");
    setSelectedWardName(ward?.name || "");
  }, [selectedProvince, selectedDistrict, selectedWard]);

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id); 
    }
  }, []);
  const handleSubmitAddress = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const newAddress = {
      country,
      city: selectedProvinceName,
      district: selectedDistrictName,
      ward: selectedWardName,
      addressDetail: addressDetail,
      addressType: addressType,
    };
    console.log("newAddress", newAddress);
    if (userId !== null) {
      let res = await createNewAddress(userId, newAddress);
      if (res) {
        toast.success(res.message);
      }
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="absolute inset-0 bg-black/35 bg-opacity-40"
        onClick={onClose}
      ></div>

      {/* Modal content */}
      <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 z-10">
        <h2 className="text-xl font-bold mb-4">Thêm địa chỉ</h2>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmitAddress}>
          <div className="p-4 space-y-3 border rounded-md bg-white shadow">
            <div>
              <label className="block text-sm font-medium">
                Quốc gia <span className="text-red-500">*</span>
              </label>
              <select
                className="mt-1 w-full border rounded-lg p-2"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="Việt Nam">Việt Nam</option>
              </select>
            </div>
            {/* Tỉnh/Thành phố */}
            <div>
              <label className="block font-medium">
                Tỉnh/Thành phố <span className="text-red-500">*</span>
              </label>
              <select
                className="border p-2 w-full rounded"
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedDistrict("");
                  setSelectedWard("");
                }}
              >
                <option value="">-- Chọn tỉnh/thành --</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quận/Huyện */}
            <div>
              <label className="block font-medium">
                Quận/Huyện <span className="text-red-500">*</span>
              </label>
              <select
                className="border p-2 w-full rounded"
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedWard("");
                }}
                disabled={!selectedProvince}
              >
                <option value="">-- Chọn quận/huyện --</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Xã/Phường */}
            <div>
              <label className="block font-medium">
                Xã/Phường <span className="text-red-500">*</span>
              </label>
              <select
                className="border p-2 w-full rounded"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                disabled={!selectedDistrict}
              >
                <option value="">-- Chọn xã/phường --</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium">
                Địa chỉ nhận hàng <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Số nhà, tên đường..."
                className="mt-1 w-full border rounded-lg p-2"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Loại địa chỉ</label>
              <input
                type="text"
                placeholder="Ví dụ: Nhà, Công ty, v.v."
                className="mt-1 w-full border rounded-lg p-2"
                value={addressType}
                onChange={(e) => setAddressType(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Lưu địa chỉ
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
const CheckoutPage = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [orderDetail, setOrderDetail] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [listCart, setListCart] = useState<Cart[]>([]);
  const [addresses, setAddresses] = useState<Address | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id); // gán vào state -> useEffect khác sẽ chạy
    }
  }, []);
  const fetchDataAddress = async (userId: number) => {
    let res = await getAddressByUserId(userId);
    console.log(res, "res");
    
    if (res) {
      setAddresses(res.result);
      setEmail(res.result.user.email ?? "");
      setName(res.result.user.fullName ?? "");
      setPhone(res.result.user.phone ?? "");
    }
  };
  useEffect(() => {
    if (userId === null) return;
    fetchDataAddress(userId);
  }, [userId]);
  useEffect(() => {
    const storedCart = localStorage.getItem("cart_guest");
    console.log(storedCart, "st");
    
    if (storedCart) {
      setListCart(JSON.parse(storedCart).filter((item: any) => item.selected === true));
    }
  }, []);  
  useEffect(() => {
    if (listCart && listCart.length > 0) {
      const total = listCart.reduce((sum, cart) => {
        return sum + cart.quantity * cart.price;
      }, 0);
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [listCart]);
  const handleSubmitCreateCheckout = async () => {
    const dataCheckOut: Checkout = {
      fullName: name,
      email: email,
      phone: phone,
      addressId: addresses?.id,
      orderDetail: orderDetail,
      paymentMethod: paymentMethod,
      totalPrice: totalPrice,
      checkoutItemRequests: listCart.map((item) => ({
        productVariantId: item.productId,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        price: item.price,
      })),
    };
    let res = await createCheckout(dataCheckOut);
    console.log("res", res);

    if (res && res.code === 1000) {
      toast.success(res.message);
      navigate("/");
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form bên trái */}
        <div className="lg:col-span-2 space-y-8">
          {/* Contact Information */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Thông tin khách hàng</h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full border p-2 rounded"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <input
              type="text"
              placeholder="Họ và tên"
              className="w-full border p-2 rounded mt-4"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
            <input
              type="text"
              placeholder="Số điện thoại"
              className="w-full border p-2 rounded mt-4"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </div>

          {/* Shipping Information */}
          <div className="">
            <h2 className="text-lg font-semibold">Địa chỉ đơn hàng</h2>
            {!addresses || Object.keys(addresses).length === 0 ? (
              <h3 className="text-blue-700 font-semibold ml-6">
                Không có địa chỉ đã lưu
              </h3>
            ) : (
              <h1>{`${addresses.addressDetail}, ${addresses.ward}, ${addresses.district}, ${addresses.city}`}</h1>
            )}
            {/* Nút mở modal */}
            {!addresses || Object.keys(addresses).length === 0 ? (
              <button
                onClick={() => setOpen(true)}
                className="py-2 rounded-lg text-black hover:text-gray-500 cursor-pointer ml-6"
              >
                + Thêm địa chỉ
              </button>
            ) : (
              <button
                // onClick={() => setOpen(true)}
                className="py-2 rounded-lg text-black hover:text-gray-500 cursor-pointer ml-6"
              >
                Xóa địa chỉ
              </button>
            )}

            {/* Hiện modal nếu open = true */}
            {open && <AddressForm onClose={() => setOpen(false)} />}
          </div>

          {/* Delivery Method */}
          <div>
            <h2 className="text-lg font-semibold mb-2">
              Phương thức thanh toán
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <label className="border p-4 rounded cursor-pointer flex justify-between items-center">
                <div>
                  <p className="font-medium">Thanh toán khi nhận hàng</p>
                  <p className="text-sm text-gray-500">4–10 business days</p>
                </div>
                {/* <p className="text-sm">$5.00</p> */}
                <input
                  type="radio"
                  name="shipping"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="ml-2"
                />
              </label>
              <label className="border p-4 rounded cursor-pointer flex justify-between items-center">
                <div>
                  <p className="font-medium">Thanh toán online</p>
                  <p className="text-sm text-gray-500">2–5 business days</p>
                </div>
                {/* <p className="text-sm">$16.00</p> */}
                <input
                  type="radio"
                  name="shipping"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="ml-2"
                />
              </label>
            </div>
          </div>

          {/* Payment */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Payment</h2>
            <div className="flex gap-4">
              <label>
                <input
                  type="radio"
                  name="payment"
                  className="mr-1"
                  defaultChecked
                />
                Credit card
              </label>
              <label>
                <input type="radio" name="payment" className="mr-1" />
                PayPal
              </label>
              <label>
                <input type="radio" name="payment" className="mr-1" />
                eTransfer
              </label>
            </div>
            <input
              type="text"
              placeholder="Card number"
              className="w-full border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Name on card"
              className="w-full border p-2 rounded"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Expiration date (MM/YY)"
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="CVC"
                className="border p-2 rounded"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="note"
              className="block text-gray-700 font-medium mb-2"
            >
              Ghi chú
            </label>
            <textarea
              id="note"
              value={orderDetail}
              onChange={(e) => setOrderDetail(e.target.value)}
              placeholder="Nhập nội dung..."
              className="w-full h-32 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black-300"
            />
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white shadow-md rounded p-6 space-y-6">
          <h2 className="text-lg font-bold mb-2">Tóm tắt đơn hàng</h2>
          {listCart &&
            listCart.length > 0 &&
            listCart.map((item, i) => (
              <div key={i} className="flex gap-4 border-b border-gray-200 pb-4">
                <img
                  src={item.image}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{item.name}</p>
                  <p className="font-medium">{item.color}</p>
                  <p className="font-medium">{item.size}</p>
                  {/* <p className="text-sm text-gray-500">{item.color} / {item.size}</p> */}
                  <p className="text-sm text-gray-900 font-semibold">
                    {(item.price).toLocaleString("vi-VN")} đ
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="px-2">Số lượng: {item.quantity}</span>
                </div>
              </div>
            ))}

          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span></span>
            </div>
            <div className="flex justify-between">
              <span>Thuế</span>
              <span></span>
            </div>
            <div className="flex justify-between font-bold border-t border-gray-200 pt-2 text-xl">
              <span>Tổng tiền</span>
              <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
            </div>
          </div>

          <button
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition cursor-pointer"
            onClick={() => handleSubmitCreateCheckout()}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};
export default CheckoutPage;
