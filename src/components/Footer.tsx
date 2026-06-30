import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-brand-secondary text-brand-gray-text font-sans">
      <div className="max-w-7xl mx-auto px-6 py-12 md:py-16">
        {/* Top block */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-zinc-800">
          {/* Brand block */}
          <div className="md:col-span-4 space-y-4">
            <img src="/images/logo.svg" alt="GearUp Logo" className="h-10 w-auto brightness-200 invert" />
            <p className="text-zinc-400 text-sm leading-relaxed max-w-sm">
              GEARUP - Hệ thống phân phối trang thiết bị thể thao & dã ngoại chính hãng. Đồng hành cùng bạn trên mọi hành trình khám phá và luyện tập đỉnh cao.
            </p>
            <div className="flex gap-3 pt-2">
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-brand-accent hover:text-white transition-all duration-300">
                <FaFacebookF className="size-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-brand-accent hover:text-white transition-all duration-300">
                <FaInstagram className="size-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-brand-accent hover:text-white transition-all duration-300">
                <FaThreads className="size-4" />
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-brand-accent hover:text-white transition-all duration-300">
                <FaTiktok className="size-4" />
              </a>
            </div>
          </div>

          {/* Quick links block */}
          <div className="md:col-span-2 space-y-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider font-display">Về GearUp</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Điều khoản & Dịch vụ</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Hệ thống cửa hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Tuyển dụng</a></li>
            </ul>
          </div>

          <div className="md:col-span-2 space-y-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider font-display">Hỗ Trợ</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Hướng dẫn mua hàng</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách vận chuyển</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Chính sách đổi trả</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Liên hệ / Ý kiến đóng góp</a></li>
            </ul>
          </div>

          {/* Newsletter block */}
          <div className="md:col-span-4 space-y-3">
            <h3 className="font-bold text-white text-sm uppercase tracking-wider font-display">Đăng ký nhận tin</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Nhận thông tin cập nhật về các bộ sưu tập mới, chương trình ưu đãi độc quyền sớm nhất.
            </p>
            <form className="flex mt-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Email của bạn..."
                className="w-full bg-zinc-800 border border-zinc-700 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-l-xl px-4 py-2 text-xs text-white focus:outline-none transition-all"
              />
              <button
                type="submit"
                className="bg-brand-accent hover:bg-brand-accent-hover text-white px-5 rounded-r-xl text-xs font-bold uppercase tracking-wider btn-tactile transition-all"
              >
                Gửi
              </button>
            </form>
          </div>
        </div>

        {/* Bottom block */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-500 gap-4">
          <p>© 2026 <span className="font-semibold text-white">GEARUP CORP.</span> All rights reserved. Designed for excellence.</p>
          <div className="flex gap-2.5 flex-wrap justify-center opacity-70 hover:opacity-100 transition-opacity">
            <img src="https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/payment_1.png?1757432008733" alt="momo" className="h-5" />
            <img src="https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/payment_2.png?1757432008733" alt="zalopay" className="h-5" />
            <img src="https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/payment_3.png?1757432008733" alt="vnpay" className="h-5" />
            <img src="https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/payment_4.png?1757432008733" alt="moca" className="h-5" />
            <img src="https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/payment_5.png?1757432008733" alt="visa" className="h-5" />
            <img src="https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/payment_6.png?1757432008733" alt="atm" className="h-5" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
