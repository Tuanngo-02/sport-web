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
}

const ProductBox = ({
  id,
  name,
  branch,
  price,
  rating,
  discountPrice,
  colors = [],
}: productBoxProps) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  // const colors = ["#000000", "#ff0000", "#0057e7", "#f4a300"]; // ví dụ

  const handleAddToCart = () => {
    setIsCartOpen(true);
  };

  const handleCloseCart = () => {
    setIsCartOpen(false);
  };
  const navigate = useNavigate();
  // Tính % giảm giá nếu có
  const discountPercent =
    discountPrice && price
      ? Math.round(((price - discountPrice) / price) * 100)
      : 0;
  const parsedColors = colors.map((c) => {
    const [hex, name] = c.split(" - ");
    return { hex, name };
  });
  return (
    <div className="max-w-xs bg-white rounded-md shadow relative">
      {/* Sale badge */}
      <div className="absolute bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded-tl rounded-br">
        New
      </div>

      {/* Product Image */}
      <img
        src="https://contents.mediadecathlon.com/p2174015/203813623997dbcb2a2d16c6ad9938fe/p2174015.jpg"
        alt="Xe đạp gấp Tilt 100"
        className="w-full h-full object-contain mb-3"
        onClick={() => {
          navigate(`/product/${id}`);
        }}
      />

      {/* Màu sắc */}
      <div
        className="flex justify-start pl-4 gap-2"
        onClick={() => {
          navigate(`/product/${id}`);
        }}
      >
        {parsedColors.map((color, index) => (
          <button
            key={index}
            className="w-3 h-3 rounded-full border border-gray-300"
            style={{ backgroundColor: color.hex }}
          ></button>
        ))}
      </div>

      <div className="p-3">
        {/* Giá & giảm giá */}
        <div
          className="flex flex-col md:flex-row md:items-center md:gap-2 mb-2"
          onClick={() => {
            navigate(`/product/${id}`);
          }}
        >
          {/* Hàng 1 */}
          <div className="flex items-center gap-2">
            {discountPrice ? (
              <>
                <span className="text-md font-semibold text-black">
                  {discountPrice.toLocaleString("vi-VN")} ₫
                </span>
                <span className="line-through text-gray-400 text-sm">
                  {price.toLocaleString("vi-VN")} ₫
                </span>
              </>
            ) : (
              <span className="text-sm font-semibold text-black">
                {price.toLocaleString("vi-VN")} ₫
              </span>
            )}
          </div>
          {/* Hàng 2 (chuyển sang ngang ở md) */}
          {discountPrice && (
            <span className="bg-yellow-300 text-black text-sm px-1 py-0.5 rounded md:ml-auto md:self-center">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Title */}
        <div
          className="text-lg font-medium mb-1"
          onClick={() => {
            navigate(`/product/${id}`);
          }}
        >
          {name}
        </div>

        {/* Brand */}
        <div
          className="text-gray-500 text-md mb-2"
          onClick={() => {
            navigate(`/product/${id}`);
          }}
        >
          {branch}
        </div>

        {/* Rating & Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-md text-gray-800">
            <span className="text-yellow-400">★</span>
            <span>{rating}</span>
            <span className="text-gray-500">(27)</span>
          </div>
          <button
            className="text-black  p-3 rounded-full cursor-pointer hover:bg-gray-200"
            onClick={handleAddToCart}
          >
            <BsCartPlus size={20} />
          </button>
        </div>
        {/* Modal giỏ hàng */}
        {isCartOpen && (
          <CartPage
            isOpen={isCartOpen}
            onClose={handleCloseCart}
            productId={id}
          />
        )}
      </div>
    </div>
  );
};

export default ProductBox;
