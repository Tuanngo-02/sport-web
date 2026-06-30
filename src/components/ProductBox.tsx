import { useState } from "react";
import { BsCartPlus } from "react-icons/bs";
import CartPage from "../pages/user/CartPage";
import { useNavigate } from "react-router";

interface productBoxProps {
  id: number | undefined;
  name: string;
  branch: string;
  price: number;
  discountPrice?: number;
  rating: number;
  colors?: string[];
  image?: string;
}

const ProductBox = ({
  id,
  name,
  branch,
  price,
  rating,
  discountPrice,
  colors = [],
  image,
}: productBoxProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const navigate = useNavigate();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };

  // Tính % giảm giá nếu có
  const discountPercent =
    discountPrice && price
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;

  const parsedColors = colors.map((c) => {
    const [hex, name] = c.split(" - ");
    return { hex, name };
  });

  // Fallback to high quality active sports sneaker placeholder if no image URL is provided
  const displayImage = image || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400";

  return (
    <div 
      className="group relative bg-white border border-brand-gray-border rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full cursor-pointer"
      onClick={() => navigate(`/product/${id}`)}
    >
      {/* Badge */}
      <div className="absolute top-3 left-3 z-10">
        {discountPrice ? (
          <span className="bg-brand-accent text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            Sale -{discountPercent}%
          </span>
        ) : (
          <span className="bg-brand-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
            New
          </span>
        )}
      </div>

      {/* Product Image Wrapper */}
      <div className="aspect-square w-full overflow-hidden bg-brand-gray-light/60 flex items-center justify-center p-6 relative">
        <img
          src={displayImage}
          alt={name}
          className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
      </div>

      {/* Card Body */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Brand */}
          <p className="text-[10px] font-bold text-brand-gray-text uppercase tracking-widest">
            {branch || "GearUp"}
          </p>

          {/* Title */}
          <h3 className="text-sm font-bold text-brand-primary line-clamp-2 mt-1 mb-2 font-display group-hover:text-brand-accent transition-colors">
            {name}
          </h3>

          {/* Color swatches */}
          {parsedColors.length > 0 && (
            <div className="flex justify-start gap-1.5 mb-3">
              {parsedColors.slice(0, 4).map((color, index) => (
                <span
                  key={index}
                  className="w-3.5 h-3.5 rounded-full border border-zinc-200 shadow-xs flex-shrink-0"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                ></span>
              ))}
              {parsedColors.length > 4 && (
                <span className="text-[9px] text-brand-gray-text font-bold self-center ml-0.5">
                  +{parsedColors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Price & Cart CTA */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-brand-gray-border">
          <div className="flex flex-col">
            {discountPrice ? (
              <div className="flex flex-col">
                <span className="text-sm font-bold text-brand-accent font-display">
                  {discountPrice.toLocaleString("vi-VN")} ₫
                </span>
                <span className="line-through text-zinc-400 text-[11px]">
                  {price.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold text-brand-primary font-display">
                {price.toLocaleString("vi-VN")} ₫
              </span>
            )}
          </div>

          <button
            className="w-9 h-9 bg-brand-primary text-white hover:bg-brand-accent rounded-full flex items-center justify-center transition-all duration-200 btn-tactile shadow-md"
            onClick={handleAddToCart}
            title="Thêm nhanh vào giỏ hàng"
          >
            <BsCartPlus size={16} />
          </button>
        </div>
      </div>

      {/* Modal giỏ hàng nhanh */}
      {isCartOpen && (
        <CartPage
          isOpen={isCartOpen}
          onClose={handleCloseCart}
          productId={id}
        />
      )}
    </div>
  );
};

export default ProductBox;
