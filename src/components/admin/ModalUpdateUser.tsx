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
        setPreviewImage(`data:image/jpeg;base64,${dataUpdate.avatarUrl}`);
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
      <Dialog open={show} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-5xl rounded-xl bg-white p-6">
            <DialogTitle className="text-xl font-semibold border-b pb-4 mb-6">
              Tạo mới thành viên
            </DialogTitle>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  disabled
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
                className="text-white bg-gray-800 cursor-pointer hover:bg-gray-900  px-4 py-2 rounded-md"
                onClick={handleSubmitUpdateUser}
              >
                Save
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
export default ModalUpdateUser;
