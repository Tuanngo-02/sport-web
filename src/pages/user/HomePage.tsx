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
    src: "https://theme.hstatic.net/200000174405/1001111911/14/block_home_category1_large.jpg?v=2429", // thay bằng đúng đường dẫn ảnh của bạn
    alt: "Siêu sale giá sốc",
  },
  {
    src: "https://theme.hstatic.net/200000174405/1001111911/14/block_home_category2_grande.jpg?v=2429",
    alt: "Hệ thống cửa hàng",
  },
  {
    src: "//theme.hstatic.net/200000174405/1001111911/14/block_home_category3_large.jpg?v=2429",
    alt: "Balo túi xách",
  },
  {
    src: "https://theme.hstatic.net/200000174405/1001111911/14/block_home_category4_grande.jpg?v=2429",
    alt: "Sale toàn bộ sản phẩm",
  },
];
const cards = [
  {
    title: "Sản Phẩm Mới",
    image:
      "https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/section_gbanner_1.jpg?1754194218821",
    large: true,
  },
  {
    title: "Xu hướng",
    image:
      "https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/section_gbanner_2.jpg?1754194218821",
  },
  {
    title: "Chiến dịch",
    image:
      "https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/section_gbanner_3.jpg?1754194218821",
  },
  {
    title: "LOOKBOOK",
    image:
      "https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/section_gbanner_4.jpg?1754194218821",
  },
  {
    title: "LOOKBOOK",
    image:
      "https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/section_gbanner_4.jpg?1754194218821",
  },
];
const newsItems = [
  {
    title: "Giày thể thao mới ra mắt",
    image: "/images/news1.jpg",
    description: "Khám phá mẫu giày chạy bộ mới nhất, nhẹ và bền vượt trội.",
  },
  {
    title: "BST thu đông 2025",
    image: "/images/news2.jpg",
    description:
      "Bộ sưu tập thời trang thể thao mới phù hợp mọi điều kiện thời tiết.",
  },
  {
    title: "Giảm giá 50% toàn bộ áo thun",
    image: "/images/news3.jpg",
    description: "Chương trình khuyến mãi hấp dẫn kéo dài đến hết tháng.",
  },
  {
    title: "Trang phục bóng đá 2025",
    image: "/images/news4.jpg",
    description:
      "Bộ sưu tập áo đấu mới cho mùa giải 2025 với chất liệu cao cấp.",
  },
  {
    title: "Mẹo bảo quản giày thể thao",
    image: "/images/news5.jpg",
    description: "Hướng dẫn bảo quản giày đúng cách để tăng độ bền.",
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
  const [visibleCount, setVisibleCount] = useState(12); // 2 hàng đầu tiên
  const [selectedCategory, setSelectedCategory] = useState("Quần áo thể thao");
  const [categories, setCategories] = useState<Category[]>([]);
  const [dataProduct, setDataProduct] = useState<Product[]>([]);
  useEffect(() => {
    fetchDataCategory();
  }, []);
  const fetchDataCategory = async () => {
    let data = await getRootCategory();
    if (data && data.code == 1000) {
      setCategories(data.result);
    }
  };
  const handleShowMore = () => {
    setVisibleCount((prev) => prev + 6); // mỗi lần hiện thêm 6 sp
  };
  const fetchDataProductByTag = async (tag: String) => {
    let data = await getProductByTag(tag);
    if (data && data.code == 1000) {
      console.log(data);

      setDataProduct(data.result);
    }
  };
  useEffect(() => {
    fetchDataProductByTag(selectedCategory);
  }, [selectedCategory]);
  // Lọc sản phẩm theo danh mục (nếu có dữ liệu phân loại)
  const filteredProducts = dataProduct.filter((product) => {
    return product.categoryName === selectedCategory; // nếu bạn gắn category trong dữ liệu
  });

  const scroll = (direction: "left" | "right") => {
    const amount = 300;
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -amount : amount,
        behavior: "smooth",
      });
    }
  };
  const navigate = useNavigate()
  return (
    <div className="bg-[#EEEEEF]">
      {/* banner */}
      <PromoSection />
      {/* thanh nội dung */}
      <div className="relative bg-white mx-auto max-w-2xl px-4 sm:px-3 lg:max-w-7xl lg:px-8 mb-16 mt-16">
        <div
          data-aos="fade-up"
          className="best-services w-full bg-white flex flex-col space-y-10 lg:space-y-0 lg:flex-row lg:justify-between lg:items-center lg:h-[110px] px-10 lg:py-0 py-10 aos-init aos-animate"
        >
          <div className="item">
            <div className="flex space-x-5 items-center">
              <div>
                <span>
                  <svg
                    width="36"
                    height="36"
                    viewBox="0 0 36 36"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 1H5.63636V24.1818H35"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    ></path>
                    <path
                      d="M8.72763 35.0002C10.4347 35.0002 11.8185 33.6163 11.8185 31.9093C11.8185 30.2022 10.4347 28.8184 8.72763 28.8184C7.02057 28.8184 5.63672 30.2022 5.63672 31.9093C5.63672 33.6163 7.02057 35.0002 8.72763 35.0002Z"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    ></path>
                    <path
                      d="M31.9073 35.0002C33.6144 35.0002 34.9982 33.6163 34.9982 31.9093C34.9982 30.2022 33.6144 28.8184 31.9073 28.8184C30.2003 28.8184 28.8164 30.2022 28.8164 31.9093C28.8164 33.6163 30.2003 35.0002 31.9073 35.0002Z"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    ></path>
                    <path
                      d="M34.9982 1H11.8164V18H34.9982V1Z"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    ></path>
                    <path
                      d="M11.8164 7.18164H34.9982"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    ></path>
                  </svg>
                </span>
              </div>
              <div>
                <p className="text-black text-[15px] font-700 tracking-wide mb-1">
                  Miễn phí giao hàng
                </p>
                <p className="text-sm text-qgray">Khi đơn hàng hơn 999K</p>
              </div>
            </div>
          </div>
          <div className="item">
            <div className="flex space-x-5 items-center">
              <div>
                <span>
                  <svg
                    width="32"
                    height="34"
                    viewBox="0 0 32 34"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M31 17.4502C31 25.7002 24.25 32.4502 16 32.4502C7.75 32.4502 1 25.7002 1 17.4502C1 9.2002 7.75 2.4502 16 2.4502C21.85 2.4502 26.95 5.7502 29.35 10.7002"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                    ></path>
                    <path
                      d="M30.7 2L29.5 10.85L20.5 9.65"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    ></path>
                  </svg>
                </span>
              </div>
              <div>
                <p className="text-black text-[15px] font-700 tracking-wide mb-1">
                  Trà hàng miễn phí
                </p>
                <p className="text-sm text-qgray">
                  Trả hàng trong vòng 30 ngày
                </p>
              </div>
            </div>
          </div>
          <div className="item">
            <div className="flex space-x-5 items-center">
              <div>
                <span>
                  <svg
                    width="32"
                    height="38"
                    viewBox="0 0 32 38"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.6654 18.667H9.33203V27.0003H22.6654V18.667Z"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    ></path>
                    <path
                      d="M12.668 18.6663V13.6663C12.668 11.833 14.168 10.333 16.0013 10.333C17.8346 10.333 19.3346 11.833 19.3346 13.6663V18.6663"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    ></path>
                    <path
                      d="M31 22C31 30.3333 24.3333 37 16 37C7.66667 37 1 30.3333 1 22V5.33333L16 2L31 5.33333V22Z"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    ></path>
                  </svg>
                </span>
              </div>
              <div>
                <p className="text-black text-[15px] font-700 tracking-wide mb-1">
                  Phương thức thành toán
                </p>
                <p className="text-sm text-qgray">
                  100% Đảm bảo thanh toán online
                </p>
              </div>
            </div>
          </div>
          <div className="item">
            <div className="flex space-x-5 items-center">
              <div>
                <span>
                  <svg
                    width="32"
                    height="35"
                    viewBox="0 0 32 35"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 13H5.5C2.95 13 1 11.05 1 8.5V1H7"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                    ></path>
                    <path
                      d="M25 13H26.5C29.05 13 31 11.05 31 8.5V1H25"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                    ></path>
                    <path
                      d="M16 28V22"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                    ></path>
                    <path
                      d="M16 22C11.05 22 7 17.95 7 13V1H25V13C25 17.95 20.95 22 16 22Z"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    ></path>
                    <path
                      d="M25 34H7C7 30.7 9.7 28 13 28H19C22.3 28 25 30.7 25 34Z"
                      stroke="#29343d"
                      stroke-width="2"
                      stroke-miterlimit="10"
                      stroke-linecap="square"
                    ></path>
                  </svg>
                </span>
              </div>
              <div>
                <p className="text-black text-[15px] font-700 tracking-wide mb-1">
                  Chất lượng cao
                </p>
                <p className="text-sm text-qgray">
                  Nguồn gốc sản phẩm đạt chuẩn
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Môn thể thao yêu thích*/}
      <div className="relative  mx-auto max-w-2xl px-4 sm:px-3 lg:max-w-7xl lg:px-8 mb-16">
        <h2 className="text-2xl font-semibold mb-4">
          MÔN THỂ THAO BẠN YÊU THÍCH
          <div className="w-24 h-1  custom-bg-1 mt-1" />
        </h2>

        {/* Nút lướt trái/phải */}
        <button
          onClick={() => scroll("left")}
          className="absolute top-1/2 -left-3 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-[#29343D] cursor-pointer hover:text-white"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={() => scroll("right")}
          className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow hover:bg-[#29343D] cursor-pointer hover:text-white"
        >
          <FaChevronRight />
        </button>

        {/* Danh sách môn thể thao */}
        <div
          ref={scrollRef}
          className="flex overflow-x-hidden space-x-4 scroll-smooth"
        >
          {categories.map((sport, idx) => (
            <div
              key={idx}
              className="min-w-[190px] w-40 flex-shrink-0 rounded-md shadow-sm text-black bg-white transition-all duration-300 transform 
             hover:shadow-lg hover:-translate-y-0.5"
            >
              <img
                src="/images/demo.jpg"
                alt="image"
                className="w-full h-32 object-cover rounded-t-lg"
              />
              <div className="text-center p-2">
                <h3 className="font-semibold">{sport.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* 4 BANNER*/}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
        {banners.map((banner, index) => (
          <div key={index} className="overflow-hidden rounded-lg shadow-lg">
            <img
              src={banner.src}
              alt={banner.alt}
              className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
            />
          </div>
        ))}
      </div>
      {/* Sản phẩm mới*/}
      <div className="relative mx-auto max-w-2xl px-4 sm:px-3 lg:max-w-7xl lg:px-8 mb-16">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 mt-16">
          <h2 className="text-2xl font-semibold mb-4">
            SẢN PHẨM MỚI NHẤT
            <div className="w-24 h-1  custom-bg-1 mt-1" />
          </h2>

          <div className="flex flex-wrap gap-2">
            {category.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1 rounded-sm border font-normal text-md transition cursor-pointer ${
                  selectedCategory === cat
                    ? "custom-bg-1 text-white"
                    : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid sản phẩm */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {dataProduct.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
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

        {visibleCount < filteredProducts.length && (
          <div className="text-center mt-6">
            <button
              onClick={handleShowMore}
              className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800 transition"
            >
              Xem thêm
            </button>
          </div>
        )}
      </div>
      {/*ảnh banner*/}
      <div className="relative mx-auto max-w-2xl px-4 sm:px-3 lg:max-w-7xl  mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
          {/* Bên trái - Ảnh lớn */}
          <div className="relative overflow-hidden group rounded-xl">
            <img
              src={cards[0].image}
              alt={cards[0].title}
              className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-4 left-4 text-white text-2xl font-bold">
              <div className="relative inline-block">
                {cards[0].title}
                <span className="block h-[3px] custom-bg-1 w-12 transition-all duration-500 group-hover:w-20"></span>
              </div>
            </div>
          </div>

          {/* Bên phải - 3 ảnh nhỏ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cards.slice(1).map((card, index) => (
              <div
                key={index}
                className="relative overflow-hidden group rounded-xl"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute bottom-4 left-4 text-white text-xl font-bold">
                  <div className="relative inline-block">
                    {card.title}
                    <span className="block h-[3px] custom-bg-1 w-10 transition-all duration-500 group-hover:w-16"></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="relative mx-auto max-w-2xl px-4 sm:px-3 lg:max-w-7xl lg:px-8 pb-6">
        <div className="px-6">
          <h2 className="text-2xl font-semibold mb-6">
            TIN TỨC SẢN PHẨM
            <div className="w-24 h-1  custom-bg-1 mt-1" />
          </h2>
          <Swiper
            modules={[Autoplay]}
            slidesPerView={4}
            spaceBetween={20}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true, // Dừng lại khi hover
            }}
            breakpoints={{
              320: { slidesPerView: 1 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {newsItems.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition-all duration-300 cursor-pointer h-full flex flex-col">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-48 w-full object-cover"
                  />
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 flex-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
