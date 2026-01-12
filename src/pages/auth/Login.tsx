import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { ImSpinner6 } from "react-icons/im";
import { postLogin } from "../../services/AuthService";
import { RiHomeLine } from "react-icons/ri";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    //validate
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      toast.error("Email không hợp lệ");
      return;
    }
    if (!password) {
      toast.error("Mật khẩu không hợp lệ");
      return;
    }
    setIsLoading(true);
    //gọi api
    try {
      let data = await postLogin({ email, password });
      if (data && data.code === 1000) {
        sessionStorage.setItem("access_token", data.result.token);
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            id: data.result.id,
            role: data.result.role,
            name: data.result.fullName,
          })
        );
        if (data.result.role === "ADMIN") {
          navigate("/admin");
        } else if (data.result.role === "USER") {
          navigate("/");
        }
        toast.success(data.message);
        setIsLoading(false);
      }
      if (data && data.code !== 1000) {
        toast.error("Đăng nhập thất bại!");
        setIsLoading(false);
      }
    } catch (e) {}
  };
  return (
    <div className="relative min-h-screen flex flex-col">
      <img
        src="/images/nen.png"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      <div className="text-center py-4 bg-white shadow relative h-18">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate("/")}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black-600 hover:text-gray-600 ml-7 text-xl flex justify-center items-center cursor-pointer"
        >
          <span className="inline-block text-3xl mr-2">
            <RiHomeLine />
          </span>{" "}
          Quay lại
        </button>

        {/* Logo */}
        <img
          src="/images/logo.svg"
          alt="logo"
          className="absolute w-60 inline-block text-center top-[-85px] left-1/2 transform -translate-x-1/2"
        />
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md px-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-semibold">ĐĂNG NHẬP</h1>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-300 focus:outline-none"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Mật khẩu
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-1 focus:ring-gray-300 focus:outline-none"
                />
              </div>
              <div className="mb-4 flex items-center justify-between">
                {/* Hiện mật khẩu */}
                <div className="flex items-center">
                  <input
                    id="showPassword"
                    type="checkbox"
                    className="mr-2"
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  <label
                    htmlFor="showPassword"
                    className="text-sm text-gray-700"
                  >
                    Hiện mật khẩu
                  </label>
                </div>

                {/* Quên mật khẩu */}
                <span
                  className="text-sm text-black-600 hover:underline cursor-pointer"
                  onClick={() => navigate("/forgot-password")}
                >
                  Quên mật khẩu?
                </span>
              </div>

              <div>
                <span className="mr-2">Bạn chưa có tài khoản GEARUP?</span>
                <button
                  type="button"
                  className="text-red-500 hover:underline cursor-pointer "
                  onClick={() => navigate("/register")}
                >
                  Đăng kí ngay!
                </button>
              </div>
              <div className="mt-6">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded flex items-center justify-center cursor-pointer"
                >
                  {isLoading && <ImSpinner6 className="animate-spin mr-2" />}
                  <span>Đăng nhập</span>
                </button>
              </div>

              <div className="text-center mt-4">{/* Phát triển thêm!! */}</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Login;
