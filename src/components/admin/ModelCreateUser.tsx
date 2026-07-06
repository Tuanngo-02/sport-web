import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { BsPlusCircle } from "react-icons/bs";
import { toast } from "react-toastify";
import { postCreateNewUser } from "../../services/UserService";
import { User } from "../../models/User";

interface CreateUserProps {
  show: boolean;
  setShow: (value: boolean) => void;
  fetchListUsersWithPaginate: (page: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}
const ModelCreateUser = ({
  show,
  setShow,
  fetchListUsersWithPaginate,
  currentPage,
  setCurrentPage,
}: CreateUserProps) => {
  const handleClose = () => {
    setShow(false);
    setEmail("");
    setPassword("");
    setRole("");
    setFullName("");
    setGender("");
    setPhone("");
    setDateOfBirth("");
    setImage(null);
    setPreviewImage("");
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
  const validateEmail = (email: String) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };
  // update ảnh dưới dạng blob
  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file); // lưu file dạng Blob (hoặc File) để gửi lên server
    }
  };

  const handleSubmitCreateUser = async () => {
    //validate
    const isValidEmail = validateEmail(email);
    if (!isValidEmail) {
      toast.error("invalid email");
      return;
    }
    if (!password) {
      toast.error("invalid password");
      return;
    }
    const dataNewUser: User = {
      email: email,
      password: password,
      fullName: fullName,
      phone: phone,
      dateOfBirth: dateOfBirth,
      gender: gender,
      role: role,
      image: image,
    };
    let res = await postCreateNewUser(dataNewUser);
    if (res && res.code === 1000) {
      toast.success(res.message);
      handleClose();
      setCurrentPage(1);
      await fetchListUsersWithPaginate(1);
    }
    if (res && res.code !== 1000) {
      toast.error(res.message);
    }
  };
  return (
    <>
      <Dialog open={show} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-brand-primary/30 backdrop-blur-xs transition-opacity duration-300" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-4xl rounded-2xl bg-white shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto border border-zinc-100 transition-all">
            <DialogTitle className="text-xl font-bold text-brand-primary font-display border-b border-zinc-100 pb-4 mb-6">
              Tạo Mới Thành Viên
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
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none bg-white font-medium"
                      value={password}
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
                    htmlFor="labelUploadCreate"
                    className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 transition-colors"
                  >
                    <BsPlusCircle className="text-sm text-zinc-500" /> Tải ảnh đại diện
                  </label>
                  <input
                    type="file"
                    id="labelUploadCreate"
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
                onClick={handleSubmitCreateUser}
              >
                Tạo thành viên
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default ModelCreateUser;
