import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Category } from "../../models/Category";
import { useEffect, useState } from "react";
import {
  getAllCategory,
  getCategoryById,
  getRootCategory,
  updateCategory,
} from "../../services/CategoryService";
import { toast } from "react-toastify";

interface updateCategoryProps {
  show: boolean;
  setShow: (value: boolean) => void;
  fetchListCategoriesWithPaginate: (page: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  dataUpdate: Category | null;
  resetUpdateData: () => void;
}
const ModalUpdateCategory = ({
  show,
  setShow,
  fetchListCategoriesWithPaginate,
  currentPage,
  setCurrentPage,
  dataUpdate,
  resetUpdateData,
}: updateCategoryProps) => {
  const handleClose = () => {
    setShow(false);
    setName("");
    setParentCategory("");
    resetUpdateData();
  };
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState<string | undefined>(
    undefined
  );
  const [parentCategoryId, setParentCategoryId] = useState<number | null>(null);
  const [listCategories, setListCategories] = useState<Category[]>([]);
  useEffect(() => {
    if (dataUpdate) {
      searchParentCategory();
      setName(dataUpdate.name);
    }
  }, [dataUpdate]);
  useEffect(() => {
    fetchListProduct();
  }, []);
  const searchParentCategory = async () => {
    if (!dataUpdate || dataUpdate.id == undefined) {
      toast.error("Không có dữ liệu để cập nhật");
      return;
    }
    let res = await getCategoryById(dataUpdate.id);
    setParentCategory(res.result.parent);
  };
  const fetchListProduct = async () => {
    let res = await getAllCategory();
    setListCategories(res.result);
  };
  const handleSubmitUpdateCategory = async () => {
    if (!dataUpdate || dataUpdate.id == undefined) {
      toast.error("Không có dữ liệu để cập nhật");
      return;
    }
    const dataUpdateCategory: Category = {
      name: name,
      parentId: parentCategoryId,
    };
    let data = await updateCategory(dataUpdate.id, dataUpdateCategory);
    console.log("result", data);
    // valid backend field
    if (data && data.code === 1000) {
      toast.success(data.message);
      handleClose();
      // props.setCurrentPage(1)
      await fetchListCategoriesWithPaginate(currentPage);
    }
    if (data && data.code !== 1000) {
      toast.error(data.message);
    }
  };
  return (
    <>
      <Dialog open={show} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-3xl rounded-xl bg-white p-6 max-h-screen overflow-y-auto">
            <DialogTitle className="text-xl font-semibold border-b pb-4 mb-6">
              Cập nhật danh mục
            </DialogTitle>

            <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name Category
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parent Category
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md p-2"
                  onChange={(event) =>
                    setParentCategoryId(Number(event.target.value))
                  }
                >
                  <option>-- {parentCategory} --</option>
                  {listCategories &&
                    listCategories.length > 0 &&
                    listCategories.map((category, index) => (
                      <option key={index} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                </select>
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
                className="text-white bg-gray-800 cursor-pointer hover:bg-gray-900  px-4 py-2 rounded-md "
                onClick={handleSubmitUpdateCategory}
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
export default ModalUpdateCategory;
