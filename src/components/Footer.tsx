import { FaFacebookF } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { FaThreads } from "react-icons/fa6";
import { FaTiktok } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-white">
            <div className="max-w-7xl mx-auto px-6 py-6">
                {/* Logo */}
                <div className="flex justify-center mb-6 border-b border-b-gray-200">
                    <img src="/images/logo.svg" alt="" className="" width="152" height="36" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-md text-gray-600 mb-8">
                    <div>
                        <h3 className="font-semibold text-black mb-3">About Us</h3>
                        <p className="text-gray-500 leading-relaxed">
                            We know there are a lot of threa developers our but we pride into a
                            firm in the industry.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-black mb-3">Feature</h3>
                        <ul className="space-y-2">
                            <li><a href="#">About Us</a></li>
                            <li><a href="#">Terms Condition</a></li>
                            <li><a href="#">Best Products</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-black mb-3">General Links</h3>
                        <ul className="space-y-2">
                            <li><a href="#">Blog</a></li>
                            <li><a href="#">Tracking Order</a></li>
                            <li><a href="#">Become Seller</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-black mb-3">Helpful</h3>
                        <ul className="space-y-2">
                            <li><a href="#">Flash Sale</a></li>
                            <li><a href="#">FAQ</a></li>
                            <li><a href="#">Support</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
                    <div className="flex gap-4 mb-4 md:mb-0">
                        <a href="#"><FaFacebookF /></a>
                        <a href="#"><FaInstagram /></a>
                        <a href="#"><FaThreads /></a>
                        <a href="#"><FaTiktok /></a>
                    </div>
                    <p className="mb-4 md:mb-0">
                        ©2025 <span className="font-semibold text-black">GEARUP</span> All rights reserved
                    </p>
                    <div className="flex gap-3">
                        <img src="https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/payment_1.png?1757432008733" alt="momo" className="h-6" />
                        <img src="https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/payment_2.png?1757432008733" alt="zalopay" className="h-6" />
                        <img src="https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/payment_3.png?1757432008733" alt="vnpay" className="h-6" />
                        <img src="https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/payment_4.png?1757432008733" alt="moca" className="h-6" />
                        <img src="https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/payment_5.png?1757432008733" alt="visa" className="h-6" />
                        <img src="https://bizweb.dktcdn.net/100/522/096/themes/959072/assets/payment_6.png?1757432008733" alt="atm" className="h-6" />
                    </div>
                </div>
            </div>
        </footer>
    );
}
export default Footer;
