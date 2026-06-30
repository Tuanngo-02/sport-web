import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { createCheckout } from "../../services/CheckOutService";
import { Checkout } from "../../models/CheckOut";
import { createNewAddress, getAddressByUserId } from "../../services/AddressService";
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

  const districts = provinces.find((p) => p.code === Number(selectedProvince))?.districts || [];
  const wards = districts.find((d) => d.code === Number(selectedDistrict))?.wards || [];

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

  const handleSubmitAddress = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProvinceName || !selectedDistrictName || !selectedWardName || !addressDetail) {
      toast.warning("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }
    const newAddress = {
      country,
      city: selectedProvinceName,
      district: selectedDistrictName,
      ward: selectedWardName,
      addressDetail,
      addressType,
    };
    if (userId !== null) {
      let res = await createNewAddress(userId, newAddress);
      if (res) {
        toast.success(res.message || "Lưu địa chỉ thành công!");
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 font-sans">
      <div className="absolute inset-0 bg-brand-primary/45 backdrop-blur-xs" onClick={onClose}></div>
      <div className="relative bg-white w-full max-w-xl rounded-3xl shadow-2xl p-6 md:p-8 z-10 border border-brand-gray-border animate-scale-in">
        <h2 className="text-lg font-bold font-display text-brand-primary uppercase tracking-wider mb-5 pb-3 border-b border-brand-gray-border">
          Thêm Địa Chỉ Nhận Hàng
        </h2>

        <form className="space-y-4" onSubmit={handleSubmitAddress}>
          <div className="grid grid-cols-1 gap-4 max-h-[60dvh] overflow-y-auto pr-1">
            <div>
              <label className="block text-xs font-bold text-brand-gray-text uppercase tracking-wider mb-1.5">
                Quốc gia <span className="text-brand-accent">*</span>
              </label>
              <select
                className="w-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none transition-all"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="Việt Nam">Việt Nam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gray-text uppercase tracking-wider mb-1.5">
                Tỉnh / Thành phố <span className="text-brand-accent">*</span>
              </label>
              <select
                className="w-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none transition-all"
                value={selectedProvince}
                onChange={(e) => {
                  setSelectedProvince(e.target.value);
                  setSelectedDistrict("");
                  setSelectedWard("");
                }}
              >
                <option value="">-- Chọn Tỉnh/Thành phố --</option>
                {provinces.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gray-text uppercase tracking-wider mb-1.5">
                Quận / Huyện <span className="text-brand-accent">*</span>
              </label>
              <select
                className="w-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none transition-all disabled:opacity-50"
                value={selectedDistrict}
                onChange={(e) => {
                  setSelectedDistrict(e.target.value);
                  setSelectedWard("");
                }}
                disabled={!selectedProvince}
              >
                <option value="">-- Chọn Quận/Huyện --</option>
                {districts.map((d) => (
                  <option key={d.code} value={d.code}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gray-text uppercase tracking-wider mb-1.5">
                Phường / Xã <span className="text-brand-accent">*</span>
              </label>
              <select
                className="w-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none transition-all disabled:opacity-50"
                value={selectedWard}
                onChange={(e) => setSelectedWard(e.target.value)}
                disabled={!selectedDistrict}
              >
                <option value="">-- Chọn Phường/Xã --</option>
                {wards.map((w) => (
                  <option key={w.code} value={w.code}>
                    {w.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gray-text uppercase tracking-wider mb-1.5">
                Địa chỉ chi tiết <span className="text-brand-accent">*</span>
              </label>
              <input
                type="text"
                placeholder="Số nhà, tên đường..."
                className="w-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none transition-all"
                value={addressDetail}
                onChange={(e) => setAddressDetail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-brand-gray-text uppercase tracking-wider mb-1.5">
                Loại địa chỉ
              </label>
              <input
                type="text"
                placeholder="Ví dụ: Nhà riêng, Công ty..."
                className="w-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none transition-all"
                value={addressType}
                onChange={(e) => setAddressType(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-brand-gray-border mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 border border-brand-gray-border hover:bg-brand-gray-light text-brand-primary rounded-xl text-xs font-bold uppercase tracking-wider transition-all btn-tactile cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              onClick={onClose}
              className="px-5 py-2.5 bg-brand-primary hover:bg-brand-accent text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all btn-tactile cursor-pointer"
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
      setUserId(user.id); 
    }
  }, []);

  const fetchDataAddress = async (uid: number) => {
    let res = await getAddressByUserId(uid);
    if (res && res.result) {
      setAddresses(res.result);
      setEmail(res.result.user?.email ?? "");
      setName(res.result.user?.fullName ?? "");
      setPhone(res.result.user?.phone ?? "");
    }
  };

  useEffect(() => {
    if (userId === null) return;
    fetchDataAddress(userId);
  }, [userId]);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart_guest");
    if (storedCart) {
      setListCart(JSON.parse(storedCart).filter((item: any) => item.selected === true));
    }
  }, []);  

  useEffect(() => {
    if (listCart && listCart.length > 0) {
      const total = listCart.reduce((sum, item) => {
        return sum + item.quantity * item.price;
      }, 0);
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [listCart]);

  const handleSubmitCreateCheckout = async () => {
    if (!name || !email || !phone) {
      toast.warning("Vui lòng nhập đầy đủ thông tin khách hàng!");
      return;
    }
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
    if (res && res.code === 1000) {
      toast.success(res.message || "Đặt hàng thành công!");
      localStorage.setItem("cart_guest", JSON.stringify([])); // clear cart
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Form: Info & Methods (col-span 2) */}
        <div className="lg:col-span-2 bg-white border border-brand-gray-border rounded-3xl p-6 md:p-8 shadow-xs space-y-8">
          
          {/* Customer Information */}
          <div className="space-y-4">
            <h2 className="text-base font-bold font-display text-brand-primary uppercase tracking-wider pb-2.5 border-b border-brand-gray-border">
              Thông tin khách hàng
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-brand-gray-text uppercase tracking-widest mb-1.5">Họ và tên</label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên..."
                  className="w-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none transition-all"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-brand-gray-text uppercase tracking-widest mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="example@domain.com"
                  className="w-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-brand-gray-text uppercase tracking-widest mb-1.5">Số điện thoại</label>
              <input
                type="text"
                placeholder="Nhập số điện thoại..."
                className="w-full max-w-md bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none transition-all"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {/* Delivery Address */}
          <div className="space-y-4">
            <h2 className="text-base font-bold font-display text-brand-primary uppercase tracking-wider pb-2.5 border-b border-brand-gray-border">
              Địa chỉ nhận hàng
            </h2>
            <div className="p-4 bg-brand-gray-light/60 border border-brand-gray-border rounded-2xl flex items-center justify-between gap-4">
              {!addresses || Object.keys(addresses).length === 0 ? (
                <span className="text-xs font-semibold text-brand-gray-text italic">
                  Chưa lưu địa chỉ nhận hàng nào.
                </span>
              ) : (
                <span className="text-xs font-bold text-brand-primary leading-relaxed">
                  {`${addresses.addressDetail}, ${addresses.ward}, ${addresses.district}, ${addresses.city}`}
                </span>
              )}

              {!addresses || Object.keys(addresses).length === 0 ? (
                <button
                  onClick={() => setOpen(true)}
                  className="text-xs font-bold text-brand-accent hover:text-brand-accent-hover tracking-wider uppercase flex-shrink-0 cursor-pointer"
                >
                  + Thêm địa chỉ
                </button>
              ) : (
                <button
                  className="text-xs font-bold text-zinc-400 hover:text-brand-accent tracking-wider uppercase flex-shrink-0 cursor-pointer"
                  onClick={() => setAddresses(null)}
                >
                  Thay đổi
                </button>
              )}
            </div>

            {open && <AddressForm onClose={() => setOpen(false)} />}
          </div>

          {/* Payment Methods */}
          <div className="space-y-4">
            <h2 className="text-base font-bold font-display text-brand-primary uppercase tracking-wider pb-2.5 border-b border-brand-gray-border">
              Phương thức thanh toán
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label
                className={`border p-4 rounded-2xl cursor-pointer flex justify-between items-center transition-all ${
                  paymentMethod === "cod" ? "border-brand-primary bg-zinc-50" : "border-brand-gray-border hover:bg-brand-gray-light/30"
                }`}
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-brand-primary uppercase tracking-wider">Thanh toán khi nhận hàng (COD)</p>
                  <p className="text-[11px] font-semibold text-brand-gray-text">Nhận hàng trong 3-5 ngày làm việc</p>
                </div>
                <input
                  type="radio"
                  name="shipping"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="size-4 text-brand-accent focus:ring-brand-accent accent-brand-accent"
                />
              </label>

              <label
                className={`border p-4 rounded-2xl cursor-pointer flex justify-between items-center transition-all ${
                  paymentMethod === "online" ? "border-brand-primary bg-zinc-50" : "border-brand-gray-border hover:bg-brand-gray-light/30"
                }`}
              >
                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-brand-primary uppercase tracking-wider">Thanh toán trực tuyến</p>
                  <p className="text-[11px] font-semibold text-brand-gray-text">Hỗ trợ ZaloPay, VNPAY, ATM, Visa</p>
                </div>
                <input
                  type="radio"
                  name="shipping"
                  value="online"
                  checked={paymentMethod === "online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="size-4 text-brand-accent focus:ring-brand-accent accent-brand-accent"
                />
              </label>
            </div>
          </div>

          {/* Ghi chú */}
          <div className="space-y-2.5">
            <label htmlFor="note" className="block text-xs font-bold text-brand-gray-text uppercase tracking-wider">
              Ghi chú đơn hàng
            </label>
            <textarea
              id="note"
              value={orderDetail}
              onChange={(e) => setOrderDetail(e.target.value)}
              placeholder="Ghi chú về thời gian giao hàng, người nhận..."
              className="w-full h-24 bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-2xl px-4 py-3 text-xs text-brand-primary focus:outline-none transition-all resize-none"
            />
          </div>
        </div>

        {/* Right Summary Sidebar */}
        <div className="bg-white border border-brand-gray-border rounded-3xl p-6 shadow-xs h-fit space-y-6">
          <h2 className="text-lg font-bold font-display text-brand-primary uppercase tracking-wider pb-3 border-b border-brand-gray-border">
            Tóm tắt đơn hàng
          </h2>

          {/* List items order */}
          <div className="divide-y divide-brand-gray-border max-h-[40dvh] overflow-y-auto pr-1">
            {listCart.map((item, i) => (
              <div key={i} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                <div className="w-16 h-16 bg-brand-gray-light/60 border border-brand-gray-border rounded-xl p-1 flex items-center justify-center flex-shrink-0">
                  <img src={item.image} alt={item.name} className="max-h-full max-w-full object-contain rounded" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-brand-primary truncate">{item.name}</h4>
                  <p className="text-[10px] text-brand-gray-text font-semibold mt-0.5 uppercase tracking-wider">
                    {item.color.split(" - ")[1]} / Size {item.size}
                  </p>
                  <p className="text-[11px] font-bold text-brand-primary font-display mt-1">
                    {item.price.toLocaleString("vi-VN")} đ <span className="text-brand-gray-text font-semibold font-sans text-[10px]">x {item.quantity}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Subtotal & total */}
          <div className="space-y-3.5 text-xs font-semibold text-brand-gray-text border-t border-brand-gray-border pt-4">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span className="text-brand-primary font-bold">{totalPrice.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span className="text-emerald-600 font-bold">Miễn phí</span>
            </div>
            <div className="flex justify-between font-bold border-t border-brand-gray-border pt-3 text-sm text-brand-primary">
              <span>Tổng thanh toán</span>
              <span className="text-lg font-bold text-brand-accent font-display">
                {totalPrice.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>

          <button
            onClick={() => handleSubmitCreateCheckout()}
            className="w-full bg-brand-accent hover:bg-brand-accent-hover text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-tactile shadow-lg transition-all cursor-pointer"
          >
            Xác nhận đặt hàng
          </button>
        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
