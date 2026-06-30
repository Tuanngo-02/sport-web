import React, { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle, RadioGroup } from "@headlessui/react";
import { IoIosArrowBack } from "react-icons/io";
import { Product, ProductInCart, ProductVariant, VariantSizeStock } from "../../models/Product";
import { getProductById } from "../../services/ProductService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

interface CartPageProps {
  isOpen: boolean;
  onClose: () => void;
  productId: number | undefined;
}

const CartPage = ({ isOpen, onClose, productId }: CartPageProps) => {
  function classNames(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(" ");
  }

  const [arrProduct, setArrProduct] = useState<Product | null>(null);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [dataChangeProduct, setDataChangeProduct] = useState<ProductVariant | null>(null);
  const [mappedProduct, setMappedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<VariantSizeStock | null>(null);
  const [cart, setCart] = useState<ProductInCart[]>(() => {
    const stored = localStorage.getItem("cart_guest");
    return stored ? JSON.parse(stored) : [];
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && productId !== undefined) {
      fetchProductById(productId);
    }
  }, [isOpen, productId]);

  useEffect(() => {
    if ((dataChangeProduct?.sizeAndStock?.length ?? 0) > 0) {
      const firstAvailable = dataChangeProduct?.sizeAndStock.find((s) => s.stock > 0);
      if (firstAvailable) {
        setSelectedSize(firstAvailable);
      } else {
        setSelectedSize(null);
      }
    }
  }, [dataChangeProduct]);

  const handleQuantityChange = (action: "plus" | "minus") => {
    if (!selectedSize) return;
    setCartQuantity((prev) => {
      if (action === "plus") {
        return prev < selectedSize.stock ? prev + 1 : prev;
      } else {
        return prev > 1 ? prev - 1 : prev;
      }
    });
  };

  const fetchProductById = async (id: number) => {
    let data = await getProductById(id);
    if (data.code === 1000) {
      setArrProduct(data.result);
      const product = data.result;
      const mapped = {
        ...product,
        changes: product.variants.map((v: any) => {
          const [code, label] = v.color.split(" - ");
          return {
            id: v.id!,
            code, // "#000"
            label, // "Đen"
            src: v.imageProductVariant,
            alt: v.name,
          };
        }),
        sizes: product.variants.flatMap((v: any) =>
          v.sizeAndStock.map((p: any) => ({
            id: p.id,
            name: p.size,
            inStock: p.stock > 0,
          }))
        ),
      };
      setMappedProduct(mapped);
      setDataChangeProduct(mapped.variants[0]);
    }
  };

  const handleClick = (value: any, idx: number) => {
    const variant = mappedProduct?.variants?.[idx];
    if (variant) {
      setDataChangeProduct(variant);
    }
    setCartQuantity(1);
  };

  useEffect(() => {
    const storedCart = localStorage.getItem("cart_guest");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart_guest", JSON.stringify(cart));
  }, [cart]);

  const AddToCart = (product: ProductInCart) => {
    if (!selectedSize) {
      toast.warning("Vui lòng chọn kích thước!");
      return;
    }
    const exist = cart.find((item) => item.productId === product.productId);
    if (exist) {
      const updatedCart = cart.map((item) =>
        item.productId === product.productId
          ? {
              ...item,
              quantity: item.quantity + product.quantity,
              price: (item.quantity + product.quantity) * product.price,
            }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product }]);
    }
    toast.success("Đã thêm vào giỏ hàng!");
    onClose();
    navigate("/cart");
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-brand-primary/45 backdrop-blur-xs transition-opacity duration-300 ease-in-out data-closed:opacity-0"
      />

      <div className="fixed inset-0 overflow-hidden font-sans">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <DialogPanel
              transition
              className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
            >
              <div className="flex h-full flex-col overflow-y-auto bg-white shadow-2xl">
                
                {/* Header */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  <div className="flex items-center gap-3 border-b border-brand-gray-border pb-4">
                    <button
                      type="button"
                      onClick={onClose}
                      className="p-1.5 text-brand-gray-text hover:bg-brand-gray-light hover:text-brand-primary rounded-full transition-all cursor-pointer"
                    >
                      <IoIosArrowBack className="size-5" />
                    </button>
                    <DialogTitle className="text-base font-bold font-display text-brand-primary uppercase tracking-wider">
                      Lựa chọn sản phẩm
                    </DialogTitle>
                  </div>

                  {/* Body Content */}
                  <div className="mt-6 space-y-6">
                    {arrProduct && (
                      <div className="flex gap-4 p-4 bg-brand-gray-light/60 border border-brand-gray-border rounded-2xl">
                        <div className="w-24 h-24 bg-white border border-brand-gray-border rounded-xl p-2 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img
                            alt={arrProduct.name}
                            src={dataChangeProduct?.imageProductVariant}
                            className="max-h-full max-w-full object-contain rounded"
                          />
                        </div>

                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-brand-gray-text uppercase tracking-widest block">
                              {arrProduct.branch}
                            </span>
                            <h4 className="text-sm font-bold text-brand-primary font-display mt-0.5 line-clamp-2">
                              {dataChangeProduct?.name || arrProduct.name}
                            </h4>
                          </div>
                          
                          <div className="flex justify-between items-baseline mt-2">
                            <span className="text-base font-bold text-brand-accent font-display">
                              {(arrProduct.discountPrice || arrProduct.price || 0).toLocaleString("vi-VN")} ₫
                            </span>
                            <span className="text-[10px] font-semibold text-brand-gray-text">
                              Kho: {selectedSize?.stock ?? 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Color variants selector */}
                    <div>
                      <h3 className="text-xs font-bold text-brand-gray-text uppercase tracking-wider mb-2.5">
                        Màu sắc: <span className="text-brand-primary">{dataChangeProduct?.color?.split(" - ")[1]}</span>
                      </h3>
                      <div className="flex items-center gap-2.5">
                        {mappedProduct?.changes?.map((item: any, idx: number) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => handleClick(item, idx)}
                            style={{ backgroundColor: item.code }}
                            className={classNames(
                              "size-7 rounded-full border border-zinc-300 ring-offset-2 transition-all cursor-pointer",
                              dataChangeProduct?.id === item.id ? "ring-2 ring-brand-accent scale-105" : "hover:scale-102"
                            )}
                            title={item.label}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Size options selector */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <h3 className="text-xs font-bold text-brand-gray-text uppercase tracking-wider">
                          Kích thước: <span className="text-brand-primary">{selectedSize?.size || "Chưa chọn"}</span>
                        </h3>
                        <a href="#" className="text-[11px] font-bold text-brand-accent hover:text-brand-accent-hover tracking-wider uppercase">
                          Hướng dẫn chọn size
                        </a>
                      </div>

                      <RadioGroup value={selectedSize} onChange={setSelectedSize} className="grid grid-cols-4 gap-2">
                        {dataChangeProduct?.sizeAndStock?.map((s) => (
                          <RadioGroup.Option
                            key={s.size}
                            value={s}
                            disabled={s.stock <= 0}
                            className={({ checked }) =>
                              classNames(
                                "flex items-center justify-center border py-2 text-xs font-bold uppercase rounded-xl transition-all outline-hidden cursor-pointer",
                                s.stock > 0
                                  ? checked
                                    ? "border-brand-primary bg-brand-primary text-white"
                                    : "border-brand-gray-border bg-white text-brand-primary hover:bg-brand-gray-light"
                                  : "border-zinc-200 bg-zinc-50 text-zinc-300 cursor-not-allowed line-through"
                              )
                            }
                          >
                            <span>{s.size}</span>
                          </RadioGroup.Option>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Quantity modifier and cost */}
                    <div className="flex items-center justify-between border-t border-brand-gray-border pt-4">
                      <div>
                        <label className="text-xs font-bold text-brand-gray-text uppercase tracking-wider block">
                          Số lượng
                        </label>
                        <div className="flex items-center gap-1 mt-1.5 bg-brand-gray-light border border-brand-gray-border p-0.5 rounded-lg w-fit">
                          <button
                            type="button"
                            onClick={() => handleQuantityChange("minus")}
                            className="w-7.5 h-7.5 flex items-center justify-center bg-white hover:bg-zinc-200 text-brand-primary text-sm font-bold rounded-md transition-all cursor-pointer"
                          >
                            -
                          </button>
                          <input
                            type="text"
                            value={cartQuantity}
                            readOnly
                            className="w-8 text-center font-bold text-xs bg-transparent border-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleQuantityChange("plus")}
                            disabled={!selectedSize || cartQuantity >= selectedSize.stock}
                            className={classNames(
                              "w-7.5 h-7.5 flex items-center justify-center text-brand-primary text-sm font-bold rounded-md transition-all",
                              !selectedSize || cartQuantity >= selectedSize.stock
                                ? "bg-zinc-200/50 text-zinc-300 cursor-not-allowed"
                                : "bg-white hover:bg-zinc-200 cursor-pointer"
                            )}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      <div className="text-right">
                        <label className="text-xs font-bold text-brand-gray-text uppercase tracking-wider block mb-1">
                          Tổng cộng
                        </label>
                        <p className="text-lg font-bold text-brand-primary font-display">
                          {(
                            cartQuantity *
                            (arrProduct?.discountPrice || arrProduct?.price || 0)
                          ).toLocaleString("vi-VN")}₫
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer action button */}
                <div className="border-t border-brand-gray-border px-6 py-6 bg-brand-gray-light/30">
                  <button
                    type="button"
                    onClick={() =>
                      AddToCart({
                        productId: selectedSize?.id!,
                        code: dataChangeProduct?.code!,
                        color: dataChangeProduct?.color!,
                        name: dataChangeProduct?.name!,
                        size: selectedSize?.size!,
                        quantity: cartQuantity,
                        price: arrProduct?.discountPrice || arrProduct?.price || 0,
                        image: dataChangeProduct?.imageProductVariant!,
                      })
                    }
                    className="w-full flex items-center justify-center rounded-xl bg-brand-primary hover:bg-brand-accent text-white py-3.5 text-xs font-bold uppercase tracking-wider btn-tactile shadow-lg transition-all cursor-pointer"
                  >
                    Thêm vào giỏ hàng
                  </button>
                  
                  <div className="mt-4 flex justify-center text-center text-xs font-semibold text-brand-gray-text">
                    <p>
                      hoặc{" "}
                      <button
                        type="button"
                        onClick={onClose}
                        className="font-bold text-brand-accent hover:text-brand-accent-hover cursor-pointer"
                      >
                        Tiếp tục mua sắm &rarr;
                      </button>
                    </p>
                  </div>
                </div>

              </div>
            </DialogPanel>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CartPage;
