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
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-5xl rounded-xl bg-white p-6">
            <DialogTitle className="text-xl font-semibold border-b pb-4 mb-6">
              Add User
            </DialogTitle>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">FullName</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Role</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 font-medium">DateOfBirth</label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Phone</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Gender</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="MAN">MAN</option>
                  <option value="WOMAN">WOMAN</option>
                </select>
              </div>
              <div className="col-span-2">
                <label
                  htmlFor="labelUpload"
                  className="inline-flex items-center gap-2 text-blue-600 cursor-pointer hover:underline"
                >
                  <BsPlusCircle />
                  Upload File Image
                </label>
                <input
                  type="file"
                  id="labelUpload"
                  hidden
                  onChange={handleUploadImage}
                />
              </div>
              <div className="col-span-2 text-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-h-40 object-contain inline-block"
                  />
                ) : (
                  <div className="text-gray-500 text-sm">Image preview</div>
                )}
              </div>
            </form>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                className="text-white bg-gray-800 cursor-pointer hover:bg-gray-900 px-4 py-2 rounded-md "
                onClick={handleSubmitCreateUser}
              >
                Lưu
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};

export default ModelCreateUser;
