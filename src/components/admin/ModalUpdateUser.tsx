import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { User } from "../../models/User";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { postUpdateUser } from "../../services/UserService";
import { BsPlusCircle } from "react-icons/bs";

interface UpdateUserProps {
  show: boolean;
  setShow: (value: boolean) => void;
  fetchListUsersWithPaginate: (page: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  dataUpdate: User | null;
  resetUpdateData: () => void;
}
const ModalUpdateUser = ({
  show,
  setShow,
  fetchListUsersWithPaginate,
  currentPage,
  setCurrentPage,
  dataUpdate,
  resetUpdateData,
}: UpdateUserProps) => {
  const handleClose = () => {
    setShow(false);
    setEmail("");
    setPassword("");
    setRole("");
    setImage(null);
    setPreviewImage("");
    setFullName("");
    setGender("");
    setPhone("");
    setDateOfBirth("");
    resetUpdateData();
  };
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [gender, setGender] = useState("MAN");
  const [phone, setPhone] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [role, setRole] = useState("USER");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (dataUpdate) {
      setEmail(dataUpdate.email);
      setFullName(dataUpdate.fullName || "");
      setGender(dataUpdate.gender || "");
      setPhone(dataUpdate.phone || "");
      if (dataUpdate.dateOfBirth) {
        const dt = new Date(dataUpdate.dateOfBirth);
        const formatted =
          dt.getFullYear() +
          "-" +
          String(dt.getMonth() + 1).padStart(2, "0") +
          "-" +
          String(dt.getDate()).padStart(2, "0");
        setDateOfBirth(formatted);
      } else {
        setDateOfBirth("");
      }
      setRole(dataUpdate.role);
      //hiển thị image
      if (dataUpdate.avatarUrl) {
        setPreviewImage(dataUpdate.avatarUrl);
      }
    }
  }, [dataUpdate]);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Đọc file và trả ra dạng base64

      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject("Không đọc được file.");
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // update ảnh dưới dạng blob
  const handleUploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !dataUpdate) return;

    const base64Image = await convertToBase64(file);

    if (!dataUpdate.avatarUrl || dataUpdate.avatarUrl !== base64Image) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file);
    } else {
      toast.error("Ảnh giống ảnh cũ, không cập nhật.");
    }
  };
  const handleSubmitUpdateUser = async () => {
    if (!validateEmail(email)) {
      toast.error("Invalid email");
      return;
    }
    if (!dataUpdate) {
      toast.error("Không có dữ liệu để cập nhật");
      return;
    }
    // Gọi API cập nhật
    const dataUserNewUpdate: User = {
      id: dataUpdate.id,
      password: dataUpdate.password,
      role: role,
      email: email,
      fullName: fullName,
      gender: gender,
      dateOfBirth: dateOfBirth,
      phone: phone,
      image: image,
    };
    try {
      const response = await postUpdateUser(dataUserNewUpdate);
      if (response && response.code === 1000) {
        toast.success(response.message);
        handleClose();
        await fetchListUsersWithPaginate(currentPage);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật người dùng");
    }
  };

  return (
    <>
      <Dialog open={show} onClose={() => { }} className="relative z-50">
        <div className="fixed inset-0 bg-brand-primary/30 backdrop-blur-xs transition-opacity duration-300" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-zinc-100 transition-all">
            <DialogTitle className="text-xl font-bold text-brand-primary font-display border-b border-zinc-100 pb-4 mb-6">
              Chỉnh Sửa Thành Viên
            </DialogTitle>

            <form className="space-y-6">
              {/* THÔNG TIN TÀI KHOẢN */}
              <div className="bg-zinc-50/70 p-5 rounded-2xl border border-zinc-100 space-y-4">
                <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-1.5">
                  Thông tin tài khoản
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Email</label>
                    <input
                      type="email"
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none bg-white font-medium"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Mật khẩu</label>
                    <input
                      type="password"
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm bg-zinc-100/70 text-zinc-400 font-medium cursor-not-allowed"
                      value={password}
                      disabled
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Vai trò (Role)</label>
                    <select
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none bg-white font-bold text-zinc-700"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="USER">USER</option>
                      <option value="ADMIN">ADMIN</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* THÔNG TIN CÁ NHÂN */}
              <div className="bg-zinc-50/70 p-5 rounded-2xl border border-zinc-100 space-y-4">
                <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-1.5">
                  Thông tin cá nhân
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Họ và tên</label>
                    <input
                      type="text"
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none bg-white font-medium"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Ngày sinh</label>
                    <input
                      type="date"
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none bg-white font-medium"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Giới tính</label>
                    <select
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none bg-white font-medium text-zinc-700"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                    >
                      <option value="MAN">MAN</option>
                      <option value="WOMAN">WOMAN</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">Số điện thoại</label>
                    <input
                      type="text"
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none bg-white font-medium"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* HÌNH ẢNH ĐẠI DIỆN */}
              <div className="bg-zinc-50/70 p-5 rounded-2xl border border-zinc-100 grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label
                    htmlFor="labelUploadUpdate"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 transition-colors"
                  >
                    <BsPlusCircle className="text-sm text-zinc-500" /> Cập nhật ảnh đại diện
                  </label>
                  <input
                    type="file"
                    id="labelUploadUpdate"
                    hidden
                    onChange={handleUploadImage}
                  />
                </div>

                <div className="border border-dashed border-zinc-200 p-3 rounded-xl flex justify-center items-center bg-white min-h-[100px] max-h-[140px] overflow-hidden">
                  {previewImage ? (
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="max-h-24 object-contain rounded-lg"
                    />
                  ) : (
                    <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Xem trước ảnh đại diện</span>
                  )}
                </div>
              </div>
            </form>

            <div className="flex justify-end gap-3 mt-8 border-t border-zinc-100 pt-6">
              <button
                className="px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer"
                onClick={handleClose}
              >
                Hủy
              </button>
              <button
                className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-accent text-white text-sm font-bold shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-95"
                onClick={handleSubmitUpdateUser}
              >
                Lưu thay đổi
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
export default ModalUpdateUser;
