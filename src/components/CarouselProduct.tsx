import React, { useEffect, useRef, useState } from 'react';
import ProductBox from './ProductBox';
import { getProductByTag } from '../services/ProductService';
import { Product } from '../models/Product';

// type Product = {
//   id: number | string;
//   name?: string;
//   href?: string;
//   imageSrc?: string;
//   imageAlt?: string;
//   price?: string;
//   color?: string;
//   placeholder?: boolean;
// };

// const products: Product[] = [
//   {
//     id: 1,
//     name: 'Basic Tee',
//     href: '#',
//     imageSrc:
//       'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg',
//     imageAlt: "Front of men's Basic Tee in black.",
//     price: '$35',
//     color: 'Black',
//   },
//   {
//     id: 2,
//     name: 'Basic Tee',
//     href: '#',
//     imageSrc:
//       'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg',
//     imageAlt: "Front of men's Basic Tee in black.",
//     price: '$35',
//     color: 'Black',
//   },
//   {
//     id: 3,
//     name: 'Basic Tee',
//     href: '#',
//     imageSrc:
//       'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg',
//     imageAlt: "Front of men's Basic Tee in black.",
//     price: '$35',
//     color: 'Black',
//   },
//   {
//     id: 4,
//     name: 'Basic Tee',
//     href: '#',
//     imageSrc:
//       'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg',
//     imageAlt: "Front of men's Basic Tee in black.",
//     price: '$35',
//     color: 'Black',
//   },
//   {
//     id: 5,
//     name: 'Basic Tee',
//     href: '#',
//     imageSrc:
//       'https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-01-related-product-01.jpg',
//     imageAlt: "Front of men's Basic Tee in black.",
//     price: '$35',
//     color: 'Black',
//   },
// ];
const CarouselProduct = () => {
    const [isLoading, setIsLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [dataProduct, setDataProduct] = useState<Product[]>([]);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    fetchDataProductByTag("new");
  }, []);
  const fetchDataProductByTag = async (tag: String) => {
    let data = await getProductByTag(tag);
    if (data && data.code == 1000) {
      console.log(data);

      setDataProduct(data.result);
    }
  };
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth * 0.8;
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const products = [
    {
      id: 1,
      name: "Bảng Phấn Mắt",
      sales: "Bán 4k+ / tháng",
      image:
        "https://readdy.ai/api/search-image?query=Eyeshadow%20palette%20with%20various%20shades%20of%20brown%2C%20gold%2C%20and%20neutral%20colors%20on%20a%20simple%20white%20background%2C%20professional%20product%20photography%20with%20soft%20lighting%20and%20clear%20details&width=300&height=300&seq=1&orientation=squarish",
    },
    {
      id: 2,
      name: "Bảng Phấn Mắt Nhũ",
      sales: "Bán 35k+ / tháng",
      image:
        "https://readdy.ai/api/search-image?query=Glitter%20eyeshadow%20palette%20with%20vibrant%20colors%20and%20shimmer%20effect%2C%20luxury%20cosmetic%20product%20on%20clean%20white%20background%20with%20professional%20studio%20lighting&width=300&height=300&seq=2&orientation=squarish",
    },
    {
      id: 3,
      name: "Áo Babydoll Nữ Tay Bèo",
      sales: "Bán 105k+ / tháng",
      image:
        "https://readdy.ai/api/search-image?query=White%20babydoll%20dress%20with%20ruffled%20sleeves%20on%20a%20simple%20clean%20background%2C%20fashion%20product%20photography%20with%20soft%20lighting%20showing%20the%20fabric%20texture%20and%20details&width=300&height=300&seq=3&orientation=squarish",
    },
    {
      id: 4,
      name: "Son Kem Lì Mịn Môi Romand",
      sales: "Bán 110k+ / tháng",
      image:
        "https://readdy.ai/api/search-image?query=Set%20of%20three%20matte%20liquid%20lipsticks%20in%20red%20and%20burgundy%20shades%20with%20elegant%20packaging%20on%20a%20clean%20white%20background%2C%20cosmetic%20product%20photography%20with%20professional%20lighting&width=300&height=300&seq=4&orientation=squarish",
    },
    {
      id: 5,
      name: "Quạt Mini Cầm Tay",
      sales: "Bán 224k+ / tháng",
      image:
        "https://readdy.ai/api/search-image?query=Portable%20mini%20handheld%20fan%20in%20white%20and%20yellow%20color%20with%20sunflower%20design%20on%20a%20clean%20background%2C%20electronic%20gadget%20product%20photography%20with%20bright%20lighting&width=300&height=300&seq=5&orientation=squarish",
    },
    {
      id: 6,
      name: "Phấn Phủ",
      sales: "Bán 80k+ / tháng",
      image:
        "https://readdy.ai/api/search-image?query=Compact%20face%20powder%20in%20elegant%20black%20packaging%20with%20mirror%2C%20high-end%20makeup%20product%20on%20clean%20white%20background%20with%20professional%20studio%20lighting&width=300&height=300&seq=6&orientation=squarish",
    },
    {
      id: 7,
      name: "Kem Chống Nắng Dưỡng Da",
      sales: "Bán 150k+ / tháng",
      image:
        "https://readdy.ai/api/search-image?query=Elegant%20sunscreen%20cream%20in%20white%20tube%20packaging%20on%20a%20clean%20minimalist%20background%2C%20skincare%20product%20photography%20with%20soft%20lighting%20highlighting%20the%20texture&width=300&height=300&seq=7&orientation=squarish",
    },
    {
      id: 8,
      name: "Túi Xách Nữ Mini",
      sales: "Bán 95k+ / tháng",
      image:
        "https://readdy.ai/api/search-image?query=Small%20elegant%20handbag%20in%20beige%20color%20with%20gold%20chain%20strap%20on%20a%20clean%20white%20background%2C%20fashion%20accessory%20product%20photography%20with%20professional%20lighting&width=300&height=300&seq=8&orientation=squarish",
    },
  ];
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 lg:max-w-7xl lg:px-8">
      <div className="max-w-[1440px] mx-auto px-4 py-6">
        <div className="relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-color-1">
              TÌM KIẾM HÀNG ĐẦU
            </h2>
            <a
              href="/product"
              className="text-md text-red-500 hover:text-red-600 transition-colors duration-300 flex items-center whitespace-nowrap"
            >
              Xem Tất Cả 
            </a>
          </div>

          {/* Navigation Arrows */}
          {showLeftArrow && (
            <button
              onClick={() => scroll("left")}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 -ml-5"
              aria-label="Scroll left"
            >
              <i className="fas fa-chevron-left text-gray-600"></i>
            </button>
          )}

          {showRightArrow && (
            <button
              onClick={() => scroll("right")}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md rounded-full w-10 h-10 flex items-center justify-center cursor-pointer transition-all duration-300 -mr-5"
              aria-label="Scroll right"
            >
              <i className="fas fa-chevron-right text-gray-600"></i>
            </button>
          )}

          {/* Products Scroll Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            onScroll={handleScroll}
          >
            {isLoading
              ? // Skeleton loading
                Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="min-w-[200px] mr-4 flex-shrink-0 animate-pulse"
                    >
                      <div className="relative rounded-lg overflow-hidden bg-gray-200 h-48 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ))
              : // Actual products
                dataProduct.map((product) => (
                  <div
                    key={product.id}
                    className="min-w-[200px] mr-4 flex-shrink-0 group cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    <ProductBox
                id={product.id}
                name={product.name}
                branch={product.branch}
                price={product.price}
                discountPrice={product.discountPrice}
                rating={product.rating}
                colors={product.variants.map((v: any) => v.color)}
              />
                  </div>
                ))}
          </div>
        </div>
      </div>
    </div>
    </div>
  )
};

export default CarouselProduct;