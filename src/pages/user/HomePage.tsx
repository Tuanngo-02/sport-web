import React, { useEffect, useRef, useState } from "react";
import PromoSection from "../../components/PromoSection";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ProductBox from "../../components/ProductBox";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { getRootCategory } from "../../services/CategoryService";
import { getProductByTag } from "../../services/ProductService";
import { Category } from "../../models/Category";
import { Product } from "../../models/Product";
import { useNavigate } from "react-router";

const banners = [
  {
    src: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=600",
    alt: "Siêu sale thể thao",
  },
  {
    src: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600",
    alt: "Hệ thống phòng tập",
  },
  {
    src: "https://images.unsplash.com/photo-1553531384-397c80973a0b?auto=format&fit=crop&q=80&w=600",
    alt: "Balo & Thiết bị leo núi",
  },
  {
    src: "https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=600",
    alt: "Ưu đãi trang phục chạy bộ",
  },
];

const cards = [
  {
    title: "Sản Phẩm Mới",
    image: "https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=600",
    large: true,
  },
  {
    title: "Xu hướng",
    image: "https://images.unsplash.com/photo-1483721310020-0a334fc34424?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Chiến dịch",
    image: "https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "LOOKBOOK",
    image: "https://images.unsplash.com/photo-1502224562085-639556652f33?auto=format&fit=crop&q=80&w=600",
  },
  {
    title: "Outdoor Gear",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600",
  },
];

const newsItems = [
  {
    title: "Giày thể thao mới ra mắt",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500",
    description: "Khám phá mẫu giày chạy bộ mới nhất, nhẹ và bền vượt trội cho cự ly dài.",
  },
  {
    title: "Bộ sưu tập thu đông 2026",
    image: "https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=500",
    description: "Bộ sưu tập thời trang dã ngoại chống gió, giữ nhiệt hiệu quả trong mọi điều kiện.",
  },
  {
    title: "Giảm giá 50% toàn bộ áo thun",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=500",
    description: "Chương trình khuyến mãi hấp dẫn dành riêng cho áo thun dry-fit thoáng khí.",
  },
  {
    title: "Trang phục leo núi chuyên nghiệp",
    image: "https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=500",
    description: "Bộ sưu tập áo gió công nghệ Gore-Tex mới nhất cho trải nghiệm leo núi an toàn.",
  },
  {
    title: "Mẹo bảo quản giày thể thao đúng cách",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=500",
    description: "Hướng dẫn chi tiết cách vệ sinh và bảo quản giày chạy bộ để tăng tuổi thọ sử dụng.",
  },
];

const category = [
  "Quần áo thể thao",
  "Giày thể thao",
  "Dụng cụ thể thao",
  "Phụ kiện thể thao",
  "Nam",
  "Nữ",
];

const HomePage = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState("Quần áo thể thao");
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataProduct, setDataProduct] = useState<Product[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDataCategory();
  }, []);

  const fetchDataCategory = async () => {
    let data = await getRootCategory();
    if (data && data.code == 1000) {
      setCategories(data.result);
    }
  };

  const fetchDataProductByTag = async (tag: String) => {
    let data = await getProductByTag(tag);
    if (data && data.code == 1000) {
      setDataProduct(data.result);
    }
  };

  useEffect(() => {
    fetchDataProductByTag(selectedCategory);
  }, [selectedCategory]);

  const scroll = (direction: "left" | "right") => {
    const amount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Banner */}
      <PromoSection />

      {/* Services Wall */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12 mb-16">
        <div className="glass-panel rounded-2xl p-6 md:py-8 grid grid-cols-1 md:grid-cols-4 gap-8 md:divide-x md:divide-brand-gray-border">
          <div className="flex items-center space-x-4 pl-0 md:pl-4">
            <span className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </span>
            <div>
              <p className="text-brand-primary font-bold text-sm font-display uppercase tracking-wider">Miễn phí giao hàng</p>
              <p className="text-xs text-brand-gray-text mt-0.5">Cho hóa đơn từ 999K</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 pl-0 md:pl-8">
            <span className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
              </svg>
            </span>
            <div>
              <p className="text-brand-primary font-bold text-sm font-display uppercase tracking-wider">Trả hàng dễ dàng</p>
              <p className="text-xs text-brand-gray-text mt-0.5">Miễn phí trong vòng 30 ngày</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 pl-0 md:pl-8">
            <span className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <div>
              <p className="text-brand-primary font-bold text-sm font-display uppercase tracking-wider">Bảo mật thanh toán</p>
              <p className="text-xs text-brand-gray-text mt-0.5">Thanh toán online an toàn 100%</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 pl-0 md:pl-8">
            <span className="p-3 bg-brand-accent/10 rounded-xl text-brand-accent">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
            </span>
            <div>
              <p className="text-brand-primary font-bold text-sm font-display uppercase tracking-wider">Chất lượng đạt chuẩn</p>
              <p className="text-xs text-brand-gray-text mt-0.5">Nguồn gốc sản phẩm cam kết chính hãng</p>
            </div>
          </div>
        </div>
      </div>

      {/* Môn thể thao bạn yêu thích */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16 relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold font-display text-brand-primary tracking-tight">
            MÔN THỂ THAO YÊU THÍCH
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll("left")}
              className="bg-white border border-brand-gray-border p-2.5 rounded-full shadow-xs hover:bg-brand-primary hover:text-white transition-all btn-tactile cursor-pointer"
            >
              <FaChevronLeft size={14} />
            </button>
            <button
              onClick={() => scroll("right")}
              className="bg-white border border-brand-gray-border p-2.5 rounded-full shadow-xs hover:bg-brand-primary hover:text-white transition-all btn-tactile cursor-pointer"
            >
              <FaChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Danh sách môn thể thao */}
        <div
          ref={scrollRef}
          className="flex overflow-x-auto gap-5 pb-4 scroll-smooth scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((sport, idx) => (
            <div
              key={idx}
              className="min-w-[170px] w-44 flex-shrink-0 group cursor-pointer bg-white border border-brand-gray-border rounded-2xl overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300"
              onClick={() => navigate(`/product?category=${sport.id}`)}
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-brand-gray-light relative">
                <img
                  src="https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=200"
                  alt={sport.name}
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                />
              </div>
              <div className="p-3 text-center">
                <h3 className="font-bold text-xs text-brand-primary font-display tracking-wider uppercase group-hover:text-brand-accent transition-colors">
                  {sport.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Banners grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {banners.map((banner, index) => (
            <div key={index} className="relative overflow-hidden rounded-2xl shadow-sm aspect-[4/3] group cursor-pointer">
              <img
                src={banner.src}
                alt={banner.alt}
                className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/20 to-transparent p-4 flex flex-col justify-end">
                <p className="text-white text-xs font-bold uppercase tracking-wider">{banner.alt}</p>
                <p className="text-brand-accent text-[10px] font-bold mt-1 tracking-widest uppercase">Khám phá ngay →</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sản phẩm mới nhất */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <h2 className="text-xl md:text-2xl font-bold font-display text-brand-primary tracking-tight">
            SẢN PHẨM MỚI NHẤT
          </h2>

          <div className="flex flex-wrap gap-1.5 bg-brand-gray-light p-1 rounded-xl border border-brand-gray-border">
            {category.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-lg font-semibold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  selectedCategory === cat
                    ? "bg-brand-accent text-white shadow-xs"
                    : "text-brand-gray-text hover:text-brand-primary hover:bg-zinc-200/50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid sản phẩm */}
        {dataProduct.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
            {dataProduct.slice(0, 10).map((product) => (
              <ProductBox
                key={product.id}
                id={product.id}
                name={product.name}
                branch={product.branch}
                price={product.price}
                discountPrice={product.discountPrice}
                rating={product.rating}
                colors={product.variants?.map((v: any) => v.color) || []}
                image={product.variants?.[0]?.imageProductVariant}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-brand-gray-border rounded-2xl bg-white">
            <p className="text-brand-gray-text text-sm">Không tìm thấy sản phẩm trong danh mục này.</p>
          </div>
        )}
      </div>

      {/* Bento Grid layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* Cột trái - Khối b Bento lớn */}
          <div className="md:col-span-7 relative overflow-hidden group rounded-2xl aspect-[16/10] md:aspect-auto md:h-[420px] shadow-sm">
            <img
              src={cards[0].image}
              alt={cards[0].title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/90 via-brand-primary/30 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-white text-2xl font-bold font-display uppercase tracking-tight">
                {cards[0].title}
              </h3>
              <p className="text-zinc-300 text-xs mt-1 max-w-sm">Trải nghiệm những trang bị tập luyện được thiết kế tối ưu cho hiệu năng tối đa.</p>
              <button 
                onClick={() => navigate('/product')}
                className="mt-4 bg-brand-accent hover:bg-brand-accent-hover text-white text-xs font-bold tracking-wider uppercase px-5 py-2.5 rounded-xl btn-tactile w-fit"
              >
                Khám phá bộ sưu tập
              </button>
            </div>
          </div>

          {/* Cột phải - 4 Khối nhỏ */}
          <div className="md:col-span-5 grid grid-cols-2 gap-5">
            {cards.slice(1).map((card, index) => (
              <div
                key={index}
                className="relative overflow-hidden group rounded-2xl aspect-square shadow-sm cursor-pointer"
                onClick={() => navigate('/product')}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent p-4 flex flex-col justify-end">
                  <h4 className="text-white text-sm font-bold font-display uppercase tracking-wider">
                    {card.title}
                  </h4>
                  <p className="text-brand-accent text-[10px] font-bold mt-0.5 tracking-wider">Xem thêm →</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* News Carousel */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-16">
        <h2 className="text-xl md:text-2xl font-bold font-display text-brand-primary tracking-tight mb-8">
          TIN TỨC NỔI BẬT
        </h2>

        <Swiper
          modules={[Autoplay]}
          slidesPerView={1}
          spaceBetween={20}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {newsItems.map((item, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white border border-brand-gray-border rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer h-full flex flex-col group">
                <div className="aspect-[16/10] w-full overflow-hidden bg-brand-gray-light">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-brand-primary font-display group-hover:text-brand-accent transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-brand-gray-text mt-2 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-brand-accent uppercase tracking-wider mt-4 block">
                    Đọc tiếp →
                  </span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default HomePage;
