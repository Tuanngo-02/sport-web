import React, { useEffect } from "react";
import { useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  RadioGroup,
} from "@headlessui/react";
import { IoIosArrowBack } from "react-icons/io";

import {
  Product,
  ProductInCart,
  ProductVariant,
  VariantSizeStock,
} from "../../models/Product";
import { Cart } from "../../models/Cart";
import { getProductById } from "../../services/ProductService";
import { postAddToCart } from "../../services/CartService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
interface CartPage {
  isOpen: boolean;
  onClose: () => void;
  productId: number | undefined;
}
const CartPage = ({ isOpen, onClose, productId }: CartPage) => {
  function classNames(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(" ");
  }
  const [arrProduct, setArrProduct] = useState<Product | null>(null);
  const [cartQuantity, setCartQuantity] = useState(1);
  const [dataChangeProduct, setDataChangeProduct] =
    useState<ProductVariant | null>(null);
  const [mappedProduct, setMappedProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<VariantSizeStock | null>(
    null
  );
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
      const firstAvailable = dataChangeProduct?.sizeAndStock.find(
        (s) => s.stock > 0
      );
      if (firstAvailable) {
        setSelectedSize(firstAvailable);
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
        changes: product.variants.map((v) => {
          const [code, label] = v.color.split(" - ");
          return {
            id: v.id!,
            code, // "#000"
            label, // "Đen"
            src: v.imageProductVariant,
            alt: v.name,
          };
        }),

        sizes: product.variants.flatMap((v) =>
          v.sizeAndStock.map((p) => ({
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
    const variant = mappedProduct?.variants[idx];
    if (variant) {
      setDataChangeProduct(variant);
    }
    setCartQuantity(1);
  };
  // Load giỏ hàng từ localStorage khi mở trang
  useEffect(() => {
    const storedCart = localStorage.getItem("cart_guest");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Lưu giỏ hàng vào localStorage mỗi khi cart thay đổi
  useEffect(() => {
    localStorage.setItem("cart_guest", JSON.stringify(cart));
  }, [cart]);
  const AddToCart = (product: ProductInCart) => {
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
    toast.success("Đã thêm vào giỏ hàng")
    navigate("/cart");
  };
  console.log(mappedProduct, "mappedProduct");
  console.log(dataChangeProduct, "dataChangeProduct");
  console.log(arrProduct, "arrProduct");
  
  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} className="relative z-70">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500/75 transition-opacity duration-500 ease-in-out data-closed:opacity-0"
        />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <DialogPanel
                transition
                className="pointer-events-auto w-screen max-w-md transform transition duration-500 ease-in-out data-closed:translate-x-full sm:duration-700"
              >
                <div className="flex h-full flex-col overflow-y-auto bg-white shadow-xl">
                  <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                    <div className="flex items-center ">
                      <button
                        type="button"
                        onClick={onClose}
                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500 mr-1 cursor-pointer"
                      >
                        <span className="absolute -inset-0.5" />
                        <span className="sr-only">Close panel</span>
                        <IoIosArrowBack aria-hidden="true" className="size-6" />
                      </button>
                      <DialogTitle className="text-lg font-medium text-color-1">
                        Thay đổi lựa chọn
                      </DialogTitle>
                    </div>

                    <div className="mt-8">
                      <div className="flow-root">
                        <ul
                          role="list"
                          className="-my-6 divide-y divide-gray-200"
                        >
                          {arrProduct && (
                            <li key={arrProduct.id} className="flex py-6">
                              <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
                                <img
                                  alt="images"
                                  src={dataChangeProduct?.imageProductVariant}
                                  className="size-full object-cover"
                                />
                              </div>

                              <div className="ml-4 flex flex-1 flex-col">
                                <div>
                                  <h1 className="text-2xl font-semibold">
                                    {arrProduct.discountPrice ? 
                                    (arrProduct.discountPrice ?? 0).toLocaleString(
                                      "vi-VN"
                                    ) : (arrProduct.price ?? 0).toLocaleString(
                                      "vi-VN"
                                    ) 
                                    }{" "}
                                    ₫
                                  </h1>
                                  <div className="text-lg font-medium text-gray-900 mt-2">
                                    <h3>{dataChangeProduct?.name}</h3>
                                  </div>
                                </div>
                                <div className="flex flex-1 items-end justify-between">
                                  <p className="text-md text-gray-700">
                                    {arrProduct.branch}
                                  </p>
                                  <p className="text-gray-500 text-sm">
                                    Tồn kho: {selectedSize?.stock ?? 0}
                                  </p>
                                </div>
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>

                      {/* Colors */}
                      <div>
                        <h3 className="text-md font-medium text-gray-900 mt-2">
                          Màu sắc: <span>{}</span>
                        </h3>
                        <fieldset aria-label="Choose a color" className="mt-4">
                          <div className="flex items-center gap-x-3">
                            {mappedProduct?.changes?.map(
                              (mappedProduct: any, idx: number) => (
                                <div
                                  key={idx}
                                  className="flex rounded-full outline -outline-offset-1 outline-black/10"
                                  onClick={() => {
                                    handleClick(mappedProduct, idx);
                                  }}
                                >
                                  <input
                                    defaultValue={idx}
                                    defaultChecked={
                                      dataChangeProduct?.id ===
                                      mappedProduct?.id
                                    }
                                    name="color"
                                    type="radio"
                                    aria-label={mappedProduct.label}
                                    style={{
                                      backgroundColor: mappedProduct.code,
                                    }} // <-- set màu trực tiếp
                                    className={classNames(
                                      "size-8 appearance-none rounded-full checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3 cursor-pointer"
                                    )}
                                  />
                                </div>
                              )
                            )}
                          </div>
                        </fieldset>
                      </div>

                      {/* Sizes */}
                      <div className="mt-10">
                        <div className="flex items-center justify-between">
                          <h3 className="text-md font-medium text-gray-900">
                            Kích thước:{" "}
                            <span>
                              {selectedSize?.size ?? "Chưa chọn size"}
                            </span>
                          </h3>
                          <a
                            href="#"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Hướng dẫn chọn size
                          </a>
                        </div>

                        <fieldset
                          aria-label="Choose a size"
                          className="mt-4 w-96"
                        >
                          <RadioGroup
                            value={selectedSize}
                            onChange={setSelectedSize} // sẽ tự nhận value từ Option
                            className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-8"
                          >
                            {dataChangeProduct?.sizeAndStock?.map((s) => (
                              <RadioGroup.Option
                                key={s.size}
                                value={s} // <-- khi chọn sẽ setSelectedSize(s.size)
                                disabled={s.stock <= 0}
                                className={({ active, checked }) =>
                                  classNames(
                                    s.stock > 0
                                      ? "cursor-pointer bg-white text-gray-900 shadow-xs"
                                      : "cursor-not-allowed bg-gray-50 text-gray-200",
                                    checked ? "ring-2 ring-gray-500" : "",
                                    "group relative flex items-center justify-center border border-gray-300 p-2 text-md font-medium uppercase hover:bg-gray-50 focus:outline-hidden sm:flex-1"
                                  )
                                }
                              >
                                <span>{s.size}</span>
                              </RadioGroup.Option>
                            ))}
                          </RadioGroup>
                        </fieldset>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
                    <div className="flex items-start justify-between w-full">
                      {/* Cột bên trái: Số lượng */}
                      <div className="flex flex-col">
                        <label className="text-sm font-medium mb-1">
                          Số lượng
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuantityChange("minus")}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-lg font-semibold rounded cursor-pointer"
                          >
                            <span>-</span>
                          </button>

                          <input
                            type="text"
                            value={cartQuantity}
                            readOnly
                            className="w-16 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                          />

                          <button
                            onClick={() => handleQuantityChange("plus")}
                            disabled={
                              !selectedSize ||
                              cartQuantity >= selectedSize.stock
                            }
                            className={`w-8 h-8 rounded ${
                              !selectedSize ||
                              cartQuantity >= selectedSize.stock
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
                            }`}
                          >
                            <span>+</span>
                          </button>
                        </div>
                      </div>

                      {/* Cột bên phải: Tổng tiền */}
                      <div className="text-right ml-4">
                        <label className="text-sm font-medium mb-1 block">
                          Tổng
                        </label>
                        <p className="text-base font-semibold text-red-600">
                          {/* .toLocaleString('vi-VN') */}
                          {mappedProduct?.discountPrice ? 
                          (
                            cartQuantity * (mappedProduct?.discountPrice ?? 0)
                          ).toLocaleString("vi-VN")
                          : (
                            cartQuantity * (mappedProduct?.price ?? 0)
                          ).toLocaleString("vi-VN")
                          }
                          đ
                        </p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() =>
                          AddToCart({
                            productId: selectedSize?.id!,
                            code: dataChangeProduct?.code!,
                            color: dataChangeProduct?.color!,
                            name: dataChangeProduct?.name!,
                            size: selectedSize?.size!,
                            quantity: cartQuantity,
                            price: mappedProduct?.price!,
                            image: dataChangeProduct?.imageProductVariant!,
                          })
                        }
                        className="w-full flex items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-red-700 cursor-pointer"
                      >
                        Thêm vào giỏ hàng
                      </button>
                    </div>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                      <p>
                        hoặc{" "}
                        <button
                          type="button"
                          onClick={onClose}
                          className="font-medium text-red-600 hover:text-red-500 cursor-pointer"
                        >
                          Tiếp tục mua sắm
                          <span aria-hidden="true"> &rarr;</span>
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
    </div>
  );
};

export default CartPage;
