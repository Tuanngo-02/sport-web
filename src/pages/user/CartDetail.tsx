import { useEffect, useState } from "react";
// import {
//   deleteCartById,
//   getCartByUserId,
//   updateCart,
// } from "../../services/CartService";
import { Cart, updateCartItem } from "../../models/Cart";
import { toast } from "react-toastify";
import {
  Product,
  ProductInCart,
  ProductVariant,
  VariantSizeStock,
} from "../../models/Product";
import { useNavigate } from "react-router";
import { updateStock } from "../../services/CartService";
import { FaRegEdit } from "react-icons/fa";
import { MdDeleteOutline } from "react-icons/md";
import { getProductById } from "../../services/ProductService";
// type CartFormProps = {
//   onClose: () => void; // khai báo onClose là hàm không có tham số, trả về void
// };
// function EditCart({ onClose }: CartFormProps) {
//    function classNames(...classes: (string | false | null | undefined)[]) {
//       return classes.filter(Boolean).join(" ");
//     }
//     const [arrProduct, setArrProduct] = useState<Product | null>(null);
//     const [cartQuantity, setCartQuantity] = useState(1);
//     const [dataChangeProduct, setDataChangeProduct] =
//       useState<ProductVariant | null>(null);
//     const [mappedProduct, setMappedProduct] = useState<Product | null>(null);
//     const [selectedSize, setSelectedSize] = useState<VariantSizeStock | null>(
//       null
//     );
//     const [cart, setCart] = useState<ProductInCart[]>(() => {
//       const stored = localStorage.getItem("cart_guest");
//       return stored ? JSON.parse(stored) : [];
//     });
//     const navigate = useNavigate();
//     useEffect(() => {
//       if (isOpen && productId !== undefined) {
//         fetchProductById(productId);
//       }
//     }, [isOpen, productId]);
//     useEffect(() => {
//       if ((dataChangeProduct?.sizeAndStock?.length ?? 0) > 0) {
//         const firstAvailable = dataChangeProduct?.sizeAndStock.find(
//           (s) => s.stock > 0
//         );
//         if (firstAvailable) {
//           setSelectedSize(firstAvailable);
//         }
//       }
//     }, [dataChangeProduct]);

//     const handleQuantityChange = (action: "plus" | "minus") => {
//       if (!selectedSize) return;
//       setCartQuantity((prev) => {
//         if (action === "plus") {
//           return prev < selectedSize.stock ? prev + 1 : prev;
//         } else {
//           return prev > 1 ? prev - 1 : prev;
//         }
//       });
//     };
//     const fetchProductById = async (id: number) => {
//       let data = await getProductById(id);
//       if (data.code === 1000) {
//         setArrProduct(data.result);
//         const product = data.result;
//         const mapped = {
//           ...product,
//           changes: product.variants.map((v) => {
//             const [code, label] = v.color.split(" - ");
//             return {
//               id: v.id!,
//               code, // "#000"
//               label, // "Đen"
//               src: v.imageProductVariant,
//               alt: v.name,
//             };
//           }),

//           sizes: product.variants.flatMap((v) =>
//             v.sizeAndStock.map((p) => ({
//               id: p.id,
//               name: p.size,
//               inStock: p.stock > 0,
//             }))
//           ),
//         };
//         setMappedProduct(mapped);
//         setDataChangeProduct(mapped.variants[0]);
//       }
//     };
//     const handleClick = (value: any, idx: number) => {
//       const variant = mappedProduct?.variants[idx];
//       if (variant) {
//         setDataChangeProduct(variant);
//       }
//       setCartQuantity(1);
//     };
//     // Load giỏ hàng từ localStorage khi mở trang
//     useEffect(() => {
//       const storedCart = localStorage.getItem("cart_guest");
//       if (storedCart) {
//         setCart(JSON.parse(storedCart));
//       }
//     }, []);

//     // Lưu giỏ hàng vào localStorage mỗi khi cart thay đổi
//     useEffect(() => {
//       localStorage.setItem("cart_guest", JSON.stringify(cart));
//     }, [cart]);
//     const AddToCart = (product: ProductInCart) => {
//       const exist = cart.find((item) => item.productId === product.productId);
//       if (exist) {
//         const updatedCart = cart.map((item) =>
//           item.productId === product.productId
//             ? {
//                 ...item,
//                 quantity: item.quantity + product.quantity,
//                 price: (item.quantity + product.quantity) * product.price,
//               }
//             : item
//         );
//         setCart(updatedCart);
//       } else {
//         setCart([...cart, { ...product }]);
//       }
//       toast.success("Đã thêm vào giỏ hàng")
//       navigate("/cart");
//     };
//   return (
//     <div className="fixed inset-0 flex items-center justify-center z-50">
//       <div
//         className="absolute inset-0 bg-black/35 bg-opacity-40"
//         onClick={onClose}
//       ></div>

//       {/* Modal content */}
//       <div className="relative bg-white w-full max-w-2xl rounded-xl shadow-lg p-6 z-10">
//         <h2 className="text-xl font-bold mb-4">Thay đổi lựa chọn</h2>

//         <div className="mt-8">
//           <div className="flow-root">
//             <ul role="list" className="-my-6 divide-y divide-gray-200">
//               {arrProduct && (
//                 <li key={arrProduct.id} className="flex py-6">
//                   <div className="size-24 shrink-0 overflow-hidden rounded-md border border-gray-200">
//                     <img
//                       alt="images"
//                       src={dataChangeProduct?.imageProductVariant}
//                       className="size-full object-cover"
//                     />
//                   </div>

//                   <div className="ml-4 flex flex-1 flex-col">
//                     <div>
//                       <h1 className="text-2xl font-semibold">
//                         {arrProduct.discountPrice
//                           ? (arrProduct.discountPrice ?? 0).toLocaleString(
//                               "vi-VN"
//                             )
//                           : (arrProduct.price ?? 0).toLocaleString(
//                               "vi-VN"
//                             )}{" "}
//                         ₫
//                       </h1>
//                       <div className="text-lg font-medium text-gray-900 mt-2">
//                         <h3>{dataChangeProduct?.name}</h3>
//                       </div>
//                     </div>
//                     <div className="flex flex-1 items-end justify-between">
//                       <p className="text-md text-gray-700">
//                         {arrProduct.branch}
//                       </p>
//                       <p className="text-gray-500 text-sm">
//                         Tồn kho: {selectedSize?.stock ?? 0}
//                       </p>
//                     </div>
//                   </div>
//                 </li>
//               )}
//             </ul>
//           </div>

//           {/* Colors */}
//           <div>
//             <h3 className="text-md font-medium text-gray-900 mt-2">
//               Màu sắc: <span>{}</span>
//             </h3>
//             <fieldset aria-label="Choose a color" className="mt-4">
//               <div className="flex items-center gap-x-3">
//                 {mappedProduct?.changes?.map(
//                   (mappedProduct: any, idx: number) => (
//                     <div
//                       key={idx}
//                       className="flex rounded-full outline -outline-offset-1 outline-black/10"
//                       onClick={() => {
//                         handleClick(mappedProduct, idx);
//                       }}
//                     >
//                       <input
//                         defaultValue={idx}
//                         defaultChecked={
//                           dataChangeProduct?.id === mappedProduct?.id
//                         }
//                         name="color"
//                         type="radio"
//                         aria-label={mappedProduct.label}
//                         style={{
//                           backgroundColor: mappedProduct.code,
//                         }} // <-- set màu trực tiếp
//                         className={classNames(
//                           "size-8 appearance-none rounded-full checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3 cursor-pointer"
//                         )}
//                       />
//                     </div>
//                   )
//                 )}
//               </div>
//             </fieldset>
//           </div>

//           {/* Sizes */}
//           <div className="mt-10">
//             <div className="flex items-center justify-between">
//               <h3 className="text-md font-medium text-gray-900">
//                 Kích thước:{" "}
//                 <span>{selectedSize?.size ?? "Chưa chọn size"}</span>
//               </h3>
//               <a
//                 href="#"
//                 className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
//               >
//                 Hướng dẫn chọn size
//               </a>
//             </div>

//             <fieldset aria-label="Choose a size" className="mt-4 w-96">
//               <RadioGroup
//                 value={selectedSize}
//                 onChange={setSelectedSize} // sẽ tự nhận value từ Option
//                 className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-8"
//               >
//                 {dataChangeProduct?.sizeAndStock?.map((s) => (
//                   <RadioGroup.Option
//                     key={s.size}
//                     value={s} // <-- khi chọn sẽ setSelectedSize(s.size)
//                     disabled={s.stock <= 0}
//                     className={({ active, checked }) =>
//                       classNames(
//                         s.stock > 0
//                           ? "cursor-pointer bg-white text-gray-900 shadow-xs"
//                           : "cursor-not-allowed bg-gray-50 text-gray-200",
//                         checked ? "ring-2 ring-gray-500" : "",
//                         "group relative flex items-center justify-center border border-gray-300 p-2 text-md font-medium uppercase hover:bg-gray-50 focus:outline-hidden sm:flex-1"
//                       )
//                     }
//                   >
//                     <span>{s.size}</span>
//                   </RadioGroup.Option>
//                 ))}
//               </RadioGroup>
//             </fieldset>
//           </div>
//         </div>
//         <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
//           <div className="flex items-start justify-between w-full">
//             {/* Cột bên trái: Số lượng */}
//             <div className="flex flex-col">
//               <label className="text-sm font-medium mb-1">Số lượng</label>
//               <div className="flex items-center gap-2">
//                 <button
//                   onClick={() => handleQuantityChange("minus")}
//                   className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-lg font-semibold rounded cursor-pointer"
//                 >
//                   <span>-</span>
//                 </button>

//                 <input
//                   type="text"
//                   value={cartQuantity}
//                   readOnly
//                   className="w-16 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
//                 />

//                 <button
//                   onClick={() => handleQuantityChange("plus")}
//                   disabled={!selectedSize || cartQuantity >= selectedSize.stock}
//                   className={`w-8 h-8 rounded ${
//                     !selectedSize || cartQuantity >= selectedSize.stock
//                       ? "bg-gray-300 cursor-not-allowed"
//                       : "bg-gray-200 hover:bg-gray-300 cursor-pointer"
//                   }`}
//                 >
//                   <span>+</span>
//                 </button>
//               </div>
//             </div>

//             {/* Cột bên phải: Tổng tiền */}
//             <div className="text-right ml-4">
//               <label className="text-sm font-medium mb-1 block">Tổng</label>
//               <p className="text-base font-semibold text-red-600">
//                 {/* .toLocaleString('vi-VN') */}
//                 {mappedProduct?.discountPrice
//                   ? (
//                       cartQuantity * (mappedProduct?.discountPrice ?? 0)
//                     ).toLocaleString("vi-VN")
//                   : (cartQuantity * (mappedProduct?.price ?? 0)).toLocaleString(
//                       "vi-VN"
//                     )}
//                 đ
//               </p>
//             </div>
//           </div>

//           <div className="mt-6">
//             <button
//               onClick={() =>
//                 AddToCart({
//                   productId: selectedSize?.id!,
//                   code: dataChangeProduct?.code!,
//                   color: dataChangeProduct?.color!,
//                   name: dataChangeProduct?.name!,
//                   size: selectedSize?.size!,
//                   quantity: cartQuantity,
//                   price: mappedProduct?.price!,
//                   image: dataChangeProduct?.imageProductVariant!,
//                 })
//               }
//               className="w-full flex items-center justify-center rounded-md border border-transparent bg-red-600 px-6 py-3 text-base font-medium text-white shadow-xs hover:bg-red-700 cursor-pointer"
//             >
//               Thêm vào giỏ hàng
//             </button>
//           </div>
//           <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
//             <p>
//               hoặc{" "}
//               <button
//                 type="button"
//                 onClick={onClose}
//                 className="font-medium text-red-600 hover:text-red-500 cursor-pointer"
//               >
//                 Tiếp tục mua sắm
//                 <span aria-hidden="true"> &rarr;</span>
//               </button>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
const CartDetail = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [listCart, setListCart] = useState<Cart[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [CartAfterCheck, setCartAfterCheck] = useState<Cart[]>([]);
  const navigate = useNavigate();
  useEffect(() => {
    const userStr = sessionStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserId(user.id); 
    }
  }, []);
  useEffect(() => {
    const storedCart = localStorage.getItem("cart_guest");
    if (storedCart) {
      const parsed = JSON.parse(storedCart);
      const withSelected = parsed.map((item: any) => ({
        ...item,
        selected: item.selected ?? false,
      }));

      setListCart(withSelected);
    }
  }, []);
  // // Lưu giỏ hàng vào localStorage mỗi khi cart thay đổi
  useEffect(() => {
    if (listCart.length > 0) {
      localStorage.setItem("cart_guest", JSON.stringify(listCart));
    }
  }, [listCart]);

  const toggleSelect = (productId: number) => {
    setListCart((prev) => {
      const newList = prev.map((item) =>
        item.productId === productId
          ? { ...item, selected: !item.selected }
          : item
      );
      setCartAfterCheck(newList.filter((item) => item.selected === true));
      return newList;
    });
  };
  useEffect(() => {
    if (CartAfterCheck && CartAfterCheck.length > 0) {
      const total = CartAfterCheck.reduce((sum, cart) => {
        return sum + cart.quantity * cart.price;
      }, 0);
      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [CartAfterCheck]);
  // const fetchDataCart = async (id: number) => {
  //   let res = await getCartByUserId(id);
  //   console.log(res);
  //   setListCart(res.result);
  // };
  //  const handleQuantityChange = (index?: number, type?: string) => {
  //   console.log(index);

  //   // setListCart(prev => {
  //   //     const newArr = [...prev];
  //   //     const item = newArr[index];

  //   //     // Clone sâu để tránh side effect
  //   // const updatedItem = { ...item, product: { ...item.product as Product} };

  //   if (type === 'minus' && totalPrice > 1) {
  //     setTotalPrice(totalPrice - 1);
  //   } else if (type === 'plus') {
  //     if (totalPrice > 0) {
  //      setTotalPrice(totalPrice + 1)
  //     } else {
  //       alert("Sản phẩm đã hết hàng!");
  //     }
  //   }
  //   console.log(totalPrice);

  //   // newArr[index] = updatedItem;
  //   // return newArr;
  //   // });
  //   };
  //   const deleteDataCart = async (id: number) => {
  //       console.log(id);
  //       let res = await deleteCartById(id);
  //        if(res && res.ec === 1){
  //             toast.success("delete success");
  //        }
  //         if (userId !== null) {
  //         fetchDataCart(userId); // chỉ gọi khi userId có giá trị
  //       }
  //   }
  //   const handleUpdateCart = async () => {
  //       const dataToSend : updateCartItem[] = listCart.map(item => ({
  //           productId: item.product!.id,
  //           productQuantity: item.product!.quantity,
  //           cartId: item.id!,
  //           cartQuantity: item.quantity
  //       }));
  //       const dataCheckout = listCart.map(item => ({
  //           productId: item.product!.id,
  //           productName: item.product!.name,
  //           productQuantity: item.quantity,
  //           productPrice: item.product!.price * item.quantity,
  //       }));
  //       sessionStorage.setItem("cartList", JSON.stringify(dataCheckout));
  //       sessionStorage.setItem("totalPrice", JSON.stringify(totalPrice));

  //      await updateCart(dataToSend);
  //      toast.success("sucess")
  //      navigate(`/checkout/${userId}`)
  //   }

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
    setListCart((prevCart) => {
      const newList = prevCart.map((item) =>
        item.productId === productId ? { ...item, quantity: newQuantity } : item
      );
      setCartAfterCheck(newList.filter((item) => item.selected === true));
      return newList;
    });
    try {
      const res = await updateStock(productId, oldQuantity, newQuantity);
      if (res) {
        toast.success(res.message);
      }
    } catch (err) {
      console.error("Update stock failed", err);
      toast.error("Cập nhật thất bại!");
    }
  };
  const handleCart = () => {
    navigate("/checkout/8");
  };
  const allSelected =
    listCart.length > 0 && listCart.every((item) => item.selected);
  const toggleSelectAll = () => {
    setListCart((prev) => {
      const newList = prev.map((item) => ({ ...item, selected: !allSelected }));
      setCartAfterCheck(newList.filter((item) => item.selected));
      return newList;
    });
  };
  return (
    <div className="bg-white p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen max-w-7xl mx-auto">
      {/* Left: Product list */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-4">Giỏ hàng</h1>
        </div>
        <div className="border p-8 border-gray-200 rounded">
          <div className="flex">
            <input
              type="checkbox"
              className="w-5 h-5 mt-1 cursor-pointer accent-red-600"
              checked={allSelected}
              onChange={toggleSelectAll}
            />
            <p className="pl-4 mb-4 text-md">Chọn tất cả sản phẩm</p>
          </div>
          {listCart.map((cart, index) => (
            <div
              key={cart.id}
              className="relative flex flex-col sm:flex-row border-b border-gray-200 pb-6 mb-6"
            >
              <div className="mr-4 flex items-start">
                <input
                  type="checkbox"
                  checked={cart.selected}
                  onChange={() => toggleSelect(cart.productId)}
                  className="w-5 h-5 mt-1 cursor-pointer accent-red-600"
                />
              </div>
              <div className="absolute top-2 right-2 flex gap-2">
                <button className="text-sm text-color-1 hover:bg-red-200/15 px-2 py-1 rounded cursor-pointer">
                  <span className="inline-block">
                    <FaRegEdit />
                  </span>{" "}
                  Chỉnh sửa
                </button>
                <button
                  // onClick={() => deleteDataCart(cart.id!)}
                  className="text-sm text-red-500 hover:bg-red-200/15 px-2 py-1 rounded cursor-pointer"
                >
                  <span className="inline-block">
                    <MdDeleteOutline />
                  </span>
                  Xoá
                </button>
              </div>

              <img
                src={cart.image}
                alt="hình ảnh"
                className="w-32 h-32 object-cover rounded"
              />
              <div className="sm:ml-4 mt-4 sm:mt-0 flex-1">
                <p className="text-gray-900 font-semibold text-lg">
                  {cart.price.toLocaleString("vi-VN")} đ
                </p>
                <h3 className="text-lg font-medium">{cart.name}</h3>
                <p className="text-gray-500">
                  Phân loại:{" "}
                  <span className="text-red-500">
                    {cart.color.split(" - ")[1]}
                  </span>
                </p>
                <p className="text-gray-500">
                  Kích cỡ <span className="text-red-500">{cart.size}</span>
                </p>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        handleQuantityChange(cart.productId, "minus", cart.size)
                      }
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-lg font-semibold rounded"
                    >
                      <span>-</span>
                    </button>

                    <input
                      type="text"
                      value={cart.quantity}
                      readOnly
                      className="w-16 text-center border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                      onClick={() =>
                        handleQuantityChange(cart.productId, "plus", cart.size)
                      }
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-lg font-semibold rounded"
                    >
                      <span>+</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Order summary */}
      <div className="bg-gray-50 p-6 rounded shadow h-fit mt-15">
        <h2 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h2>
        <div className="flex justify-between text-sm mb-2">
          <span>Tạm tính</span>
          <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span>Giao hàng</span>
          <span>0</span>
        </div>
        <div className="flex justify-between text-sm mb-2">
          <span>Thuế</span>
          <span>0</span>
        </div>
        <div className="flex justify-between font-bold mt-4 mb-6 text-xl">
          <span>Tổng</span>
          <span>{totalPrice.toLocaleString("vi-VN")} đ</span>
        </div>
        <button
          className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 cursor-pointer"
          onClick={() => handleCart()}
        >
          Tiếp tục thanh toán
        </button>
        <button
          className="w-full border border-gray-400 text-black mt-3 py-2 rounded hover:bg-red-200/20 cursor-pointer"
          onClick={() => navigate("/product")}
        >
          Chọn thêm sản phẩm khác
        </button>
      </div>
    </div>
  );
};
export default CartDetail;
