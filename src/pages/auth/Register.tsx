import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ImSpinner6 } from "react-icons/im";
import { postRegister } from "../../services/AuthService";
import { RiHomeLine } from "react-icons/ri";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const validateEmail = (emailStr: string) => {
    return String(emailStr)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleRegister = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      toast.error("Email không hợp lệ");
      return;
    }
    if (!password || password.length < 4) {
      toast.error("Mật khẩu phải có ít nhất 4 ký tự");
      return;
    }
    if (!fullName.trim()) {
      toast.error("Vui lòng nhập họ và tên");
      return;
    }

    setIsLoading(true);
    try {
      console.log(email, password, fullName);

      let data = await postRegister({ email, password, fullName });
      console.log(data);

      if (data && data.code === 1000) {
        toast.success(data.message || "Tạo tài khoản thành công! Vui lòng đăng nhập.");
        setIsLoading(false);
        navigate("/login");
      } else {
        toast.error("Đăng ký thất bại!");
        setIsLoading(false);
      }
    } catch (e: any) {
      setIsLoading(false);
      toast.error(e.response?.data?.message || "Đăng ký thất bại");
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col font-sans bg-brand-gray-light">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-[radial-gradient(#ff4800_1px,transparent_1px)] [background-size:24px_24px] opacity-10 -z-10"></div>

      {/* Header bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-brand-gray-border h-16 relative z-10">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-primary hover:text-brand-accent transition-colors btn-tactile cursor-pointer"
        >
          <RiHomeLine size={18} />
          Trang chủ
        </button>

        <img
          src="/images/logo.svg"
          alt="logo"
          className="h-24 md:h-28 w-auto object-contain -my-6 md:-my-8"
        />

        <div className="w-20"></div> {/* Spacer to center logo */}
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-brand-gray-border rounded-3xl p-6 md:p-8 shadow-2xl animate-scale-in">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-extrabold font-display text-brand-primary uppercase tracking-tight">
              Tạo Tài Khoản
            </h1>
            <p className="text-xs text-brand-gray-text mt-1.5 font-semibold">Bắt đầu gia nhập cộng đồng thể thao GEARUP!</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-brand-gray-text uppercase tracking-widest mb-1.5">Email</label>
              <input
                type="email"
                name="email"
                placeholder="example@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-brand-gray-text uppercase tracking-widest mb-1.5">Mật khẩu</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Ít nhất 4 ký tự..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none transition-all"
                required
              />
            </div>

            {/* Show Password */}
            <div className="flex items-center text-xs font-semibold">
              <input
                id="showPassword"
                type="checkbox"
                className="size-4 rounded border-brand-gray-border text-brand-accent focus:ring-brand-accent accent-brand-accent cursor-pointer"
                onChange={(e) => setShowPassword(e.target.checked)}
              />
              <label htmlFor="showPassword" className="ml-2 text-brand-gray-text cursor-pointer hover:text-brand-primary">
                Hiện mật khẩu
              </label>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-brand-gray-text uppercase tracking-widest mb-1.5">Họ và Tên</label>
              <input
                type="text"
                name="fullName"
                placeholder="Nhập đầy đủ họ và tên..."
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-xl px-4 py-2.5 text-xs text-brand-primary focus:outline-none transition-all"
                required
              />
            </div>

            <div className="text-xs text-brand-gray-text pt-2">
              Bạn đã có tài khoản GEARUP?{" "}
              <button
                type="button"
                className="text-brand-accent hover:text-brand-accent-hover font-bold"
                onClick={() => navigate("/login")}
              >
                Đăng nhập ngay!
              </button>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-brand-primary hover:bg-brand-accent text-white py-3 rounded-xl text-xs font-bold uppercase tracking-wider btn-tactile shadow-lg transition-all flex items-center justify-center cursor-pointer"
              >
                {isLoading && <ImSpinner6 className="animate-spin mr-2 size-4" />}
                <span>Đăng ký tài khoản</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
