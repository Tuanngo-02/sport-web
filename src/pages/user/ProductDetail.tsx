import React, { useEffect, useState } from "react";
import { StarIcon } from "@heroicons/react/20/solid";
import { RadioGroup } from "@headlessui/react";
import ShopCart from "../../components/CarouselProduct";
import ReviewPage from "./ReviewPage";
import { getProductById } from "../../services/ProductService";
import { useNavigate, useParams } from "react-router";
import { MapInProduct, Product, ProductInCart, ProductVariant, VariantSizeStock } from "../../models/Product";
import { toast } from "react-toastify";
import { getLocalCart, saveLocalCart } from "../../services/CartService";

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
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    fetchDataProduct(Number(id));
  }, [id]);

  useEffect(() => {
    if ((dataChangeProduct?.sizeAndStock?.length ?? 0) > 0) {
      const firstAvailable = dataChangeProduct?.sizeAndStock.find((s) => s.stock > 0);
      if (firstAvailable) {
        setSelectedSize(firstAvailable);
        setProductStatus(true);
      } else {
        setSelectedSize(null);
        setProductStatus(false);
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

  const fetchDataProduct = async (productId: number) => {
    let data = await getProductById(productId);
    if (data.code === 1000) {
      setDataProduct(data.result);
      const prod = data.result;
      const mapped = {
        ...prod,
        changes: prod.variants.map((v: any) => {
          const [code, label] = v.color.split(" - ");
          return {
            id: v.id!,
            code, // "#000"
            label, // "Đen"
            src: v.imageProductVariant,
            alt: v.name,
          };
        }),
        sizes: prod.variants.flatMap((v: any) =>
          v.sizeAndStock.map((p: any) => ({
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
    const variant = mappedProduct?.variants?.[idx];
    if (variant) {
      setSelectedName(variant.name);
      setDataChangeProduct(variant);
    }
    setCartQuantity(1);
  };

  const discountPercent =
    dataProduct?.discountPrice && dataProduct.price
      ? Math.round(((dataProduct.price - dataProduct.discountPrice) / dataProduct.price) * 100)
      : 0;

  const AddToCart = (product: ProductInCart) => {
    if (!selectedSize) {
      toast.warning("Vui lòng chọn kích thước!");
      return;
    }

    const userStr = sessionStorage.getItem("user");
    const currentUserId = userStr ? JSON.parse(userStr).id : null;

    const currentCart = getLocalCart(currentUserId);
    const exist = currentCart.find((item) => 
      item.productId === product.productId && 
      item.size === product.size && 
      item.color === product.color
    );

    let updatedCart;
    if (exist) {
      updatedCart = currentCart.map((item) =>
        item.productId === product.productId && 
        item.size === product.size && 
        item.color === product.color
          ? {
              ...item,
              quantity: item.quantity + product.quantity,
              price: product.price,
            }
          : item
      );
    } else {
      updatedCart = [...currentCart, { ...product, selected: false }];
    }

    saveLocalCart(currentUserId, updatedCart);
    toast.success("Thêm vào giỏ hàng thành công!");
    navigate("/cart");
  };

  return (
    <div className="bg-brand-bg min-h-screen font-sans">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white border border-brand-gray-border rounded-3xl p-6 md:p-10 shadow-xs">
          {/* Main Grid: Left = Images, Right = Product Info */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* Left: Images Gallery (col-span 7) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="w-full bg-brand-gray-light/60 border border-brand-gray-border rounded-2xl p-6 flex justify-center items-center aspect-[4/3] relative overflow-hidden">
                <img
                  src={selectedImage?.src || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=800"}
                  alt={selectedImage?.alt || dataProduct?.name}
                  className="max-h-full max-w-full object-contain rounded-lg transform hover:scale-105 transition-transform duration-500 ease-out"
                />
              </div>

              {/* Thumbnails list */}
              <div className="flex gap-3 justify-center overflow-x-auto py-1">
                {mappedProduct?.changes?.map((img: any, idx: any) => (
                  <button
                    key={idx}
                    onClick={() => handleClick(img, idx)}
                    className={classNames(
                      "w-20 h-20 bg-brand-gray-light border-2 rounded-xl p-1 overflow-hidden transition-all duration-200 cursor-pointer flex-shrink-0 flex items-center justify-center",
                      selectedImage?.src === img.src ? "border-brand-accent scale-102" : "border-brand-gray-border hover:border-zinc-400"
                    )}
                  >
                    <img src={img.src} alt={img.alt} className="max-h-full max-w-full object-contain rounded-md" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Product Info (col-span 5) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Brand name */}
                <p className="text-xs font-bold text-brand-gray-text uppercase tracking-widest">
                  {dataProduct?.branch || "GearUp"}
                </p>

                {/* Product Title */}
                <h1 className="text-2xl md:text-3xl font-bold font-display text-brand-primary leading-tight tracking-tight">
                  {dataChangeProduct?.name || dataProduct?.name}
                </h1>

                {/* SKU Code */}
                <div className="flex items-center gap-4 text-xs font-semibold text-brand-gray-text">
                  <span>Mã sản phẩm: <span className="text-brand-primary">{dataChangeProduct?.code}</span></span>
                  <span className="h-3 w-px bg-brand-gray-border"></span>
                  <span>Tình trạng: <span className={productStatus ? "text-emerald-600 font-bold" : "text-brand-accent font-bold"}>{productStatus ? "Còn hàng" : "Hết hàng"}</span></span>
                </div>

                {/* Reviews */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-yellow-400">
                    {[0, 1, 2, 3, 4].map((rating) => (
                      <StarIcon
                        key={rating}
                        aria-hidden="true"
                        className={classNames(
                          (dataProduct?.rating ?? 4) > rating ? "text-yellow-400" : "text-zinc-200",
                          "size-4.5 shrink-0"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-brand-accent tracking-wider uppercase ml-1 cursor-pointer">
                    {reviews.totalCount} Đánh giá
                  </span>
                </div>

                {/* Price block */}
                <div className="p-4 bg-brand-gray-light/60 border border-brand-gray-border rounded-2xl flex items-center justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold text-brand-accent font-display">
                      {((dataProduct?.discountPrice ?? dataProduct?.price ?? 0)).toLocaleString("vi-VN")}₫
                    </span>
                    {dataProduct?.discountPrice && (
                      <span className="line-through text-zinc-400 text-xs font-semibold">
                        {(dataProduct?.price ?? 0).toLocaleString("vi-VN")}₫
                      </span>
                    )}
                  </div>
                  {dataProduct?.discountPrice && (
                    <span className="bg-brand-accent text-white text-xs font-bold px-2 py-0.5 rounded-md">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                {/* Options form */}
                <form className="space-y-5 pt-3">
                  {/* Colors */}
                  <div>
                    <h3 className="text-xs font-bold text-brand-gray-text uppercase tracking-wider mb-2.5">
                      Màu sắc: <span className="text-brand-primary">{dataChangeProduct?.color?.split(" - ")[1]}</span>
                    </h3>
                    <div className="flex items-center gap-3">
                      {mappedProduct?.changes?.map((item: any, idx: number) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleClick(item, idx)}
                          title={item.label}
                          style={{ backgroundColor: item.code }}
                          className={classNames(
                            "size-7 rounded-full border border-zinc-300 ring-offset-2 transition-all cursor-pointer",
                            dataChangeProduct?.id === item.id ? "ring-2 ring-brand-accent scale-105" : "hover:scale-102"
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <div className="flex items-center justify-between mb-2.5">
                      <h3 className="text-xs font-bold text-brand-gray-text uppercase tracking-wider">
                        Kích cỡ: <span className="text-brand-primary font-bold">{selectedSize?.size || "Chưa chọn"}</span>
                      </h3>
                      <a href="#" className="text-xs font-bold text-brand-accent hover:text-brand-accent-hover tracking-wider uppercase">
                        Bảng Size
                      </a>
                    </div>

                    <RadioGroup value={selectedSize} onChange={setSelectedSize} className="grid grid-cols-4 gap-2.5 max-w-sm">
                      {dataChangeProduct?.sizeAndStock?.map((s) => (
                        <RadioGroup.Option
                          key={s.size}
                          value={s}
                          disabled={s.stock <= 0}
                          className={({ checked, disabled }) =>
                            classNames(
                              "relative flex items-center justify-center border p-2 text-xs font-bold uppercase rounded-xl transition-all outline-hidden cursor-pointer",
                              s.stock > 0
                                ? checked
                                  ? "border-brand-primary bg-brand-primary text-white"
                                  : "border-brand-gray-border bg-white text-brand-primary hover:bg-brand-gray-light"
                                : "border-brand-gray-border bg-zinc-50 text-zinc-300 cursor-not-allowed line-through"
                            )
                          }
                        >
                          <span>{s.size}</span>
                        </RadioGroup.Option>
                      ))}
                    </RadioGroup>
                  </div>

                  {/* Quantity Modifier */}
                  <div className="flex items-center justify-between border-t border-brand-gray-border pt-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-brand-gray-text uppercase tracking-wider block">
                        Số lượng
                      </label>
                      <div className="flex items-center gap-1 mt-1 bg-brand-gray-light border border-brand-gray-border p-1 rounded-xl w-fit">
                        <button
                          type="button"
                          onClick={() => handleQuantityChange("minus")}
                          className="w-8 h-8 flex items-center justify-center bg-white hover:bg-zinc-200 text-brand-primary text-base font-bold rounded-lg transition-all"
                        >
                          -
                        </button>
                        <input
                          type="text"
                          value={cartQuantity}
                          readOnly
                          className="w-10 text-center font-bold text-sm bg-transparent border-none focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleQuantityChange("plus")}
                          disabled={!selectedSize || cartQuantity >= selectedSize.stock}
                          className={classNames(
                            "w-8 h-8 flex items-center justify-center text-brand-primary text-base font-bold rounded-lg transition-all",
                            !selectedSize || cartQuantity >= selectedSize.stock
                              ? "bg-zinc-200/50 text-zinc-300 cursor-not-allowed"
                              : "bg-white hover:bg-zinc-200"
                          )}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    {/* Total cost */}
                    <div className="text-right">
                      <label className="text-xs font-bold text-brand-gray-text uppercase tracking-wider block mb-1">
                        Tổng cộng
                      </label>
                      <p className="text-xl font-bold text-brand-primary font-display">
                        {(
                          cartQuantity *
                          (dataProduct?.discountPrice || dataProduct?.price || 0)
                        ).toLocaleString("vi-VN")}{" "}
                        đ
                      </p>
                    </div>
                  </div>
                </form>
              </div>

              {/* Add to Cart button */}
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
                    price: dataProduct?.discountPrice || dataProduct?.price || 0,
                    image: dataChangeProduct?.imageProductVariant!,
                    stock: selectedSize?.stock!,
                    baseProductId: dataProduct?.id!,
                  })
                }
                disabled={!productStatus}
                className={classNames(
                  "w-full flex items-center justify-center rounded-xl py-3.5 text-xs font-bold uppercase tracking-wider text-white btn-tactile shadow-lg transition-all",
                  productStatus
                    ? "bg-brand-accent hover:bg-brand-accent-hover hover:shadow-brand-accent/25 hover:shadow-xl cursor-pointer"
                    : "bg-zinc-300 cursor-not-allowed"
                )}
              >
                {productStatus ? "Thêm vào giỏ hàng" : "Hết hàng"}
              </button>
            </div>
          </div>

          {/* Description & Technical details */}
          <div className="mt-16 pt-8 border-t border-brand-gray-border">
            <h3 className="text-sm font-bold text-brand-primary font-display uppercase tracking-wider mb-4">
              Mô tả chi tiết sản phẩm
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed max-w-[85ch]">
              {dataProduct?.description || "Không có mô tả cho sản phẩm này."}
            </p>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white border border-brand-gray-border rounded-3xl p-6 md:p-8">
          <ReviewPage />
        </div>
      </div>

      {/* Recommended Products Carousel */}
      <div className="bg-white border-t border-brand-gray-border py-12">
        <ShopCart />
      </div>
    </div>
  );
};

export default ProductDetail;
