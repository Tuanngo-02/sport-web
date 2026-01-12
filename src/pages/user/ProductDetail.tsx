import React, { useEffect } from "react";
import { useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { Radio, RadioGroup } from "@headlessui/react";
import ShopCart from "../../components/CarouselProduct";
import ReviewPage from "./ReviewPage";
import { getProductById } from "../../services/ProductService";
import { useNavigate, useParams } from "react-router";
import { MapInProduct, Product, ProductInCart, ProductVariant, VariantSizeStock } from "../../models/Product";
import { toast } from "react-toastify";

const reviews = { href: "#", average: 4, totalCount: 117 };

function classNames(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
const ProductDetail = () => {
  const [selectedSize, setSelectedSize] = useState<VariantSizeStock | null>(null);
  const [productStatus, setProductStatus] = useState(true);
  const [selectedImage, setSelectedImage] = useState<MapInProduct | null>(null);
  const [selectedName, setSelectedName] = useState("");
  const [cartQuantity, setCartQuantity] = useState(1);
  const [dataProduct, setDataProduct] = useState<Product | null>(null);
  const [dataChangeProduct, setDataChangeProduct] = useState<ProductVariant | null>(null);
  const [mappedProduct, setMappedProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<ProductInCart[]>(() => {
    const stored = localStorage.getItem("cart_guest");
    return stored ? JSON.parse(stored) : [];
  });

  const navigate = useNavigate()
  useEffect(() => {
    if ((dataChangeProduct?.sizeAndStock?.length ?? 0) > 0) {
      const firstAvailable = dataChangeProduct?.sizeAndStock.find(
        (s) => s.stock > 0
      );
      if (firstAvailable) {
        setSelectedSize(firstAvailable);
        setProductStatus(true);
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
  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    fetchDataProduct(Number(id));
  }, [id]);
  const fetchDataProduct = async (id: number) => {
    let data = await getProductById(id);
    if (data.code === 1000) {
      setDataProduct(data.result);
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
      setSelectedImage(mapped.changes[0]);
      setDataChangeProduct(mapped.variants[0]);
    }
  };

  const handleClick = (value: any, idx: number) => {
    setSelectedImage(value);
    const variant = mappedProduct?.variants[idx];
    if (variant) {
      setSelectedName(variant.name);
      setDataChangeProduct(variant);
    }
    setCartQuantity(1);
  };
  // Tính % giảm giá nếu có
  const discountPercent =
    dataProduct?.discountPrice && dataProduct.price
      ? Math.round(
          ((dataProduct.price - dataProduct.discountPrice) /
            dataProduct.price) *
            100
        )
      : 0;
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
          ? { ...item, quantity: item.quantity + product.quantity, price: (item.quantity + product.quantity) * product.price }
          : item
      );
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...product}]);
    }
    toast.success("Thêm vào giỏ hàng thành công!");
    navigate("/cart")
  }
  
  return (
    <div>
      <div className="bg-white">
        <div className="pt-6">
          <nav aria-label="Breadcrumb">
            <ol
              role="list"
              className="mx-auto flex max-w-2xl items-center space-x-2 px-4 sm:px-6 lg:max-w-7xl lg:px-8"
            >
              {/* {product.breadcrumbs.map((breadcrumb) => (
                <li key={breadcrumb.id}>
                  <div className="flex items-center">
                    <a
                      href={breadcrumb.href}
                      className="mr-2 text-sm font-medium text-gray-900"
                    >
                      {breadcrumb.name}
                    </a>
                    <svg
                      fill="currentColor"
                      width={16}
                      height={20}
                      viewBox="0 0 16 20"
                      aria-hidden="true"
                      className="h-5 w-4 text-gray-300"
                    >
                      <path d="M5.697 4.34L8.98 16.532h1.327L7.025 4.341H5.697z" />
                    </svg>
                  </div>
                </li>
              ))}
              <li className="text-sm">
                <a
                  href={product.href}
                  aria-current="page"
                  className="font-medium text-gray-500 hover:text-gray-600"
                >
                  {product.name}
                </a>
              </li> */}
            </ol>
          </nav>

          {/* Product section */}
          <div className="mx-auto max-w-7xl px-4 pt-10 pb-16 sm:px-6 lg:px-8">
            {/* Grid chia 2 cột: trái = thông tin sản phẩm, phải = ảnh */}
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-6">
              {/* RIGHT: Images */}
              <div className="lg:col-span-1 mt-10 lg:mt-0">
                <div className="flex flex-col items-center space-y-4">
                  {/* Ảnh chính */}
                  <div className="w-full flex justify-center">
                    <img
                      src={selectedImage?.src}
                      alt={selectedImage?.alt}
                      className="rounded-lg object-contain max-h-[400px]"
                    />
                  </div>

                  {/* Thumbnail ảnh nhỏ */}
                  <div className="flex space-x-2">
                    {mappedProduct?.changes?.map((img: any, idx: any) => (
                      <button
                        key={idx}
                        onClick={() => handleClick(img, idx)}
                        className={`border-2 rounded-lg p-1 ${
                          selectedImage?.src === img.src
                            ? "border-orange-500"
                            : "border-transparent"
                        }`}
                      >
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="h-20 w-20 object-cover rounded-md"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {/* LEFT: Product info */}
              <div className="lg:col-span-1">
                <h1 className=" font-bold text-gray-900  text-2xl sm:text-3xl">
                  {dataChangeProduct?.name}
                </h1>
                <h1 className="mt-2">
                  Mã: <span className="text-red-500 font-medium">{dataChangeProduct?.code}</span>
                </h1>
                <div className="mt-1">
                  <span className="pr-5">
                    Thương hiệu: <span className="text-red-500 font-medium">{dataProduct?.branch}</span>
                  </span>
                  <span className="pl-5 border-l-3 border-gray-500">
                    Tình trạng:{" "}
                    <span className="text-red-500 font-medium">{productStatus ? `Còn hàng` : "Hết hàng"}</span>
                  </span>
                </div>
                <div className="flex items-center mt-4">
                  <p className=" text-3xl tracking-tight text-color-1 font-semibold">
                    {(dataProduct?.discountPrice ?? 0).toLocaleString("vi-VN")}₫
                  </p>
                  <p className=" ml-4 line-through text-gray-400 text-md">{(dataProduct?.price ?? 0).toLocaleString("vi-VN")}₫</p>
                  <p className=" ml-4 p-2 bg-yellow-300">{discountPercent}%</p>
                </div>
                {/* Reviews */}
                <div className="mt-4 flex items-center">
                  <div className="flex items-center">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={classNames(
                          dataProduct?.rating! > rating
                            ? "text-gray-900"
                            : "text-gray-200",
                          "size-5 shrink-0"
                        )}
                      />
                    ))}
                  </div>
                  <a
                    href={reviews.href}
                    className="ml-3 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    {reviews.totalCount} đánh giá
                  </a>
                </div>

                {/* Options form */}
                <form className="mt-4">
                  {/* Colors */}
                  <div>
                    <h3 className="text-md font-medium text-gray-900">
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
                                  dataChangeProduct?.id === mappedProduct?.id
                                }
                                name="color"
                                type="radio"
                                aria-label={mappedProduct.label}
                                style={{ backgroundColor: mappedProduct.code }} // <-- set màu trực tiếp
                                className={classNames(
                                  "size-8 appearance-none rounded-full checked:outline-2 checked:outline-offset-2 focus-visible:outline-3 focus-visible:outline-offset-3"
                                )}
                              />
                            </div>
                          )
                        )}
                      </div>
                    </fieldset>
                  </div>

                  {/* Sizes */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-medium text-gray-900">
                        Kích thước: <span>{selectedSize?.size}</span>
                      </h3>
                      <a
                        href="#"
                        className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                      >
                        Hướng dẫn chọn size
                      </a>
                    </div>

                    <fieldset aria-label="Choose a size" className="mt-4 w-96">
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
                  <div className="flex items-start justify-between w-full mt-6">
                    {/* Cột bên trái: Số lượng */}
                    <div className="flex flex-col">
                      <label className="text-md font-medium mb-1">
                        Số lượng
                      </label>
                      <div className="flex items-center gap-2 mt-1">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange("minus")}
                          className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 text-lg font-semibold rounded"
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
                          type="button"
                          onClick={() => handleQuantityChange("plus")}
                          disabled={
                            !selectedSize || cartQuantity >= selectedSize.stock
                          }
                          className={`w-8 h-8 rounded ${
                            !selectedSize || cartQuantity >= selectedSize.stock
                              ? "bg-gray-300 cursor-not-allowed"
                              : "bg-gray-200 hover:bg-gray-300"
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
                      <p className="text-lg font-semibold text-red-600 mt-1"> 
                        {mappedProduct?.discountPrice ? 
                          (
                            cartQuantity * (mappedProduct?.discountPrice ?? 0)
                          ).toLocaleString("vi-VN")
                          : (
                            cartQuantity * (mappedProduct?.price ?? 0)
                          ).toLocaleString("vi-VN")
                          }{" "}
                          đ
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => AddToCart({
                      productId: selectedSize?.id!,
                      code: dataChangeProduct?.code!,
                      color: dataChangeProduct?.color!,
                      name: dataChangeProduct?.name!,
                      size: selectedSize?.size!,
                      quantity: cartQuantity,
                      price: mappedProduct?.price!,
                      image: dataChangeProduct?.imageProductVariant!
                    })}
                    className="mt-10 flex w-full items-center justify-center rounded-md border border-transparent bg-red-600 px-8 py-3 text-base font-medium text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:outline-hidden cursor-pointer"
                  >
                    Thêm vào giỏ
                  </button>
                </form>
              </div>
            </div>

            {/* BELOW: Description + Highlights + Details */}
            <div className="mt-12 border-t border-gray-200 pt-8">
              {/* Description */}
              <h3 className="sr-only">Description</h3>
              <p className="text-base text-gray-900">
                {dataProduct?.description}
              </p>

              {/* Highlights */}
              <div className="mt-8">
                <h3 className="text-sm font-medium text-gray-900">
                  Highlights
                </h3>
                {/* <ul className="mt-4 list-disc space-y-2 pl-4 text-sm text-gray-600">
                  {product.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul> */}
              </div>

              {/* Details */}
              <div className="mt-8">
                <h2 className="text-sm font-medium text-gray-900">Details</h2>
                <p className="mt-4 text-sm text-gray-600">
                  {/* {dataProduct?.details} */}
                </p>
              </div>

              {/* Features, Care, Shipping giữ nguyên toggle */}
              <div className="mt-8 space-y-4">
                {/* giữ nguyên code toggle */}
              </div>
            </div>
          </div>

          <div className="mx-auto mt-6 max-w-2xl sm:px-6 lg:max-w-7xl lg:px-8">
            <ReviewPage />
          </div>
        </div>
      </div>
      <div  className="bg-white pt-8">
        <ShopCart />
      </div>
    </div>
  );
};

export default ProductDetail;
