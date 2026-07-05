import { useEffect, useState } from "react";
import { Cart } from "../../models/Cart";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { updateStock, getLocalCart, saveLocalCart } from "../../services/CartService";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";

const CartDetail = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [listCart, setListCart] = useState<Cart[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [CartAfterCheck, setCartAfterCheck] = useState<Cart[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    let currentUserId: number | null = null;
    if (userStr) {
      const user = JSON.parse(userStr);
      currentUserId = user.id;
      setUserId(user.id);
    }

    const cart = getLocalCart(currentUserId);
    const withSelected = cart.map((item: any) => ({
      ...item,
      selected: item.selected ?? false,
    }));
    setListCart(withSelected);
    setCartAfterCheck(withSelected.filter((item: any) => item.selected === true));
  }, []);

  const toggleSelect = (productId: number) => {
    setListCart((prev) => {
      const newList = prev.map((item) =>
        item.productId === productId
          ? { ...item, selected: !item.selected }
          : item
      );
      setCartAfterCheck(newList.filter((item) => item.selected === true));
      saveLocalCart(userId, newList);
      return newList;
    });
  };

  useEffect(() => {
    if (CartAfterCheck && CartAfterCheck.length > 0) {
      const total = CartAfterCheck.reduce((sum, item) => {
        return sum + item.quantity * item.price;
      }, 0);
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [CartAfterCheck]);

  const handleQuantityChange = async (
    productId: number,
    action: "plus" | "minus",
    size: string
  ) => {
    if (!productId || !size) return;

    const target = listCart.find((item) => item.productId === productId);
    if (!target) return;

    const oldQuantity = target.quantity;
    const newQuantity =
      action === "plus"
        ? target.quantity + 1
        : target.quantity > 1
          ? target.quantity - 1
          : 1;

    // Optimistic update helper
    const updateList = (qty: number) => {
      setListCart((prevCart) => {
        const newList = prevCart.map((item) =>
          item.productId === productId ? { ...item, quantity: qty } : item
        );
        setCartAfterCheck(newList.filter((item) => item.selected === true));
        saveLocalCart(userId, newList);
        return newList;
      });
    };

    updateList(newQuantity);

    try {
      const res = await updateStock(productId, oldQuantity, newQuantity);
      // if (res) {
      //   toast.success(res.message);
      // }
    } catch (err: any) {
      console.error("Update stock failed", err);
      const errorMsg = err?.response?.data?.message || "Cập nhật thất bại!";
      toast.error(errorMsg);
      // Rollback to old quantity
      updateList(oldQuantity);
    }
  };

  const handleCart = () => {
    if (CartAfterCheck.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một sản phẩm để thanh toán!");
      return;
    }
    if (userId === null) {
      toast.warning("Vui lòng đăng nhập để thanh toán!");
      navigate("/login?redirect=/cart");
      return;
    }
    navigate(`/checkout/${userId}`);
  };

  const allSelected =
    listCart.length > 0 && listCart.every((item) => item.selected);

  const toggleSelectAll = () => {
    setListCart((prev) => {
      const newList = prev.map((item) => ({ ...item, selected: !allSelected }));
      setCartAfterCheck(newList.filter((item) => item.selected));
      saveLocalCart(userId, newList);
      return newList;
    });
  };

  const handleDeleteItem = (productId: number) => {
    const newList = listCart.filter((item) => item.productId !== productId);
    setListCart(newList);
    setCartAfterCheck(newList.filter((item) => item.selected === true));
    saveLocalCart(userId, newList);
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  return (
    <div className="bg-brand-bg min-h-screen py-8 font-sans">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left: Product list (col-span 2) */}
        <div className="lg:col-span-2 space-y-6">
          <h1 className="text-2xl md:text-3xl font-extrabold font-display text-brand-primary tracking-tight">
            Giỏ Hàng Của Bạn
          </h1>

          <div className="bg-white border border-brand-gray-border rounded-3xl p-6 shadow-xs">
            {/* Select All */}
            <div className="flex items-center pb-4 border-b border-brand-gray-border mb-6">
              <input
                type="checkbox"
                className="w-5 h-5 rounded border-brand-gray-border text-brand-accent focus:ring-brand-accent accent-brand-accent cursor-pointer"
                checked={allSelected}
                onChange={toggleSelectAll}
              />
              <span className="pl-3.5 text-xs font-bold text-brand-primary uppercase tracking-wider">
                Chọn tất cả sản phẩm ({listCart.length})
              </span>
            </div>

            {listCart.length > 0 ? (
              <div className="divide-y divide-brand-gray-border">
                {listCart.map((cartItem) => (
                  <div
                    key={cartItem.productId}
                    className="relative flex flex-col sm:flex-row py-6 first:pt-0 last:pb-0 group"
                  >
                    {/* Checkbox Select */}
                    <div className="flex items-start mr-4 pt-4 sm:pt-10">
                      <input
                        type="checkbox"
                        checked={cartItem.selected}
                        onChange={() => toggleSelect(cartItem.productId)}
                        className="w-5 h-5 rounded border-brand-gray-border text-brand-accent focus:ring-brand-accent accent-brand-accent cursor-pointer"
                      />
                    </div>

                    {/* Product Image */}
                    <div className="w-28 h-28 bg-brand-gray-light/60 border border-brand-gray-border rounded-xl p-2 flex items-center justify-center flex-shrink-0 mt-4 sm:mt-0">
                      <img
                        src={cartItem.image}
                        alt={cartItem.name}
                        className="max-h-full max-w-full object-contain rounded"
                      />
                    </div>

                    {/* Product Specs & Info */}
                    <div className="sm:ml-6 mt-4 sm:mt-0 flex-1 flex flex-col justify-between">
                      <div className="space-y-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-brand-primary font-display group-hover:text-brand-accent transition-colors line-clamp-1 pr-6">
                            {cartItem.name}
                          </h3>
                          {/* Price */}
                          <span className="text-sm font-bold text-brand-primary font-display">
                            {cartItem.price.toLocaleString("vi-VN")} đ
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 text-xs font-semibold text-brand-gray-text">
                          <p>Màu: <span className="text-brand-primary font-bold">{cartItem.color.split(" - ")[1]}</span></p>
                          <p>Kích cỡ: <span className="text-brand-primary font-bold">{cartItem.size}</span></p>
                        </div>
                      </div>

                      {/* Quantity Modifier and Operations */}
                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center gap-1 bg-brand-gray-light border border-brand-gray-border p-0.5 rounded-lg w-fit">
                          <button
                            onClick={() =>
                              handleQuantityChange(cartItem.productId, "minus", cartItem.size)
                            }
                            className="w-7 h-7 flex items-center justify-center bg-white hover:bg-zinc-200 text-brand-primary text-sm font-bold rounded-md transition-all cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={cartItem.quantity}
                            readOnly
                            className="w-8 text-center font-bold text-xs bg-transparent border-none"
                          />
                          <button
                            disabled={cartItem.stock !== undefined && cartItem.quantity >= cartItem.stock}
                            onClick={() =>
                              handleQuantityChange(cartItem.productId, "plus", cartItem.size)
                            }
                            className={`w-7 h-7 flex items-center justify-center text-brand-primary text-sm font-bold rounded-md transition-all ${cartItem.stock !== undefined && cartItem.quantity >= cartItem.stock
                              ? "bg-zinc-100 text-zinc-300 cursor-not-allowed"
                              : "bg-white hover:bg-zinc-200 cursor-pointer"
                              }`}
                          >
                            +
                          </button>
                        </div>

                        {/* Actions Delete / Edit */}
                        <div className="flex gap-2 text-xs font-bold uppercase tracking-wider">
                          <button
                            onClick={() => handleDeleteItem(cartItem.productId)}
                            className="text-brand-accent hover:text-brand-accent-hover p-1.5 rounded-full hover:bg-brand-accent/5 transition-all cursor-pointer flex items-center gap-1"
                          >
                            <MdDeleteOutline className="size-4.5" />
                            <span className="hidden sm:inline">Xoá</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <p className="text-brand-gray-text text-sm">Giỏ hàng của bạn đang trống.</p>
                <button
                  onClick={() => navigate("/product")}
                  className="mt-4 bg-brand-primary hover:bg-brand-accent text-white text-xs font-bold tracking-wider uppercase px-6 py-3 rounded-xl btn-tactile transition-all"
                >
                  Mua sắm ngay
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="bg-white border border-brand-gray-border rounded-3xl p-6 shadow-xs h-fit lg:mt-12 space-y-6">
          <h2 className="text-lg font-bold font-display text-brand-primary uppercase tracking-wider pb-3 border-b border-brand-gray-border">
            Tóm tắt đơn hàng
          </h2>

          <div className="space-y-3.5 text-xs font-semibold text-brand-gray-text">
            <div className="flex justify-between">
              <span>Tạm tính ({CartAfterCheck.length} sản phẩm)</span>
              <span className="text-brand-primary font-bold">{totalPrice.toLocaleString("vi-VN")} đ</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span className="text-emerald-600 font-bold">Miễn phí</span>
            </div>
            <div className="flex justify-between">
              <span>Thuế GTGT</span>
              <span>Đã bao gồm</span>
            </div>

            <div className="pt-4 border-t border-brand-gray-border flex justify-between font-bold text-sm text-brand-primary">
              <span>Tổng cộng</span>
              <span className="text-lg font-bold text-brand-accent font-display">
                {totalPrice.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleCart()}
              className="w-full bg-brand-primary hover:bg-brand-accent text-white py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider btn-tactile shadow-md transition-all cursor-pointer"
            >
              Tiếp tục thanh toán
            </button>

            <button
              onClick={() => navigate("/product")}
              className="w-full bg-white border border-brand-gray-border hover:border-brand-primary text-brand-primary py-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-tactile transition-all cursor-pointer"
            >
              Chọn thêm sản phẩm khác
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CartDetail;
