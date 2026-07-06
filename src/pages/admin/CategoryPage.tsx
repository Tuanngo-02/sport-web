import { useEffect, useState } from "react";
import { Category } from "../../models/Category";
import {
  getAllCategory,
  getCategoryWithPaginate,
  getRootCategory,
  postNewCategory,
  postParentCategory,
} from "../../services/CategoryService";
import TableCategory from "../../components/admin/TableCategory";
import { toast } from "react-toastify";
import ModalUpdateCategory from "../../components/admin/ModalUpdateCategory";
import ModalDeleteCategory from "../../components/admin/ModalDeleteCategory";

const CategoryPage = () => {
  const LIMIT_PAGE = 5;
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModalUpdateCategory, setShowModalUpdateCategory] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<Category | null>(null);
  const [showModalDeleteCategory, setShowModalDeleteCategory] = useState(false);
  const [dataDelete, setDataDelete] = useState<Category | null>(null);

  const [listCategories, setListCategories] = useState<Category[]>([]);
  const [listAllCategories, setListAllCategories] = useState<Category[]>([]);
  const [parentCategoryId, setParentCategoryId] = useState(0);
  const [subCategory, setSubCategory] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [reloadCategory, setReloadCategory] = useState(false);

  const [showFilter, setShowFilter] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [searchType, setSearchType] = useState("");

  useEffect(() => {
    fetchListCategoryWithPaginate(1);
  }, []);
  useEffect(() => {
    fetchListProduct();
  }, [reloadCategory]);

  const fetchListCategoryWithPaginate = async (page: number) => {
    let res = await getCategoryWithPaginate(page, LIMIT_PAGE, searchName || undefined, searchType || undefined);
    if (res.code === 1000) {
      setListCategories(res.result.data);
      setPageCount(res.result.totalPage);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchListCategoryWithPaginate(1);
  };

  const handleClear = async () => {
    setSearchName("");
    setSearchType("");
    setCurrentPage(1);
    
    let res = await getCategoryWithPaginate(1, LIMIT_PAGE);
    if (res.code === 1000) {
      setListCategories(res.result.data);
      setPageCount(res.result.totalPage);
    }
  };

  const fetchListProduct = async () => {
    let res = await getAllCategory();
    setListAllCategories(res.result);
  };
  const handleClickBtnUpdate = (category: Category) => {
    setDataUpdate(category);
    setShowModalUpdateCategory(true);
  };

  const handleClickBtnDelete = (category: Category) => {
    setShowModalDeleteCategory(true);
    setDataDelete(category);
  };
  const handleSubmitSubCategory = async () => {
    const newCategory: Category = {
      name: subCategory,
      parentId: parentCategoryId,
    };
    let res = await postNewCategory(newCategory);
    if (res && res.code === 1000) {
      toast.success(res.message);
      setCurrentPage(1);
      await fetchListCategoryWithPaginate(1);
      setReloadCategory((prev) => !prev);
    }
    if (res && res.code !== 1000) {
      toast.error(res.message);
    }
  };
  const handleSubmitParentCategory = async () => {
    const newCategory: Category = {
      name: parentCategory,
    };
    let res = await postParentCategory(newCategory);
    if (res && res.code === 1000) {
      toast.success(res.message);
      setCurrentPage(1);
      await fetchListCategoryWithPaginate(1);
      setReloadCategory((prev) => !prev);
    }
    if (res && res.code !== 1000) {
      toast.error("add parent category success fail");
    }
  };
  const resetUpdateData = () => {
    setDataUpdate(null);
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white cursor-pointer transition-colors ${showFilter ? 'bg-gray-600 hover:bg-gray-700' : 'bg-gray-800 hover:bg-gray-900'}`}
            onClick={() => setShowFilter(!showFilter)}
          >
            {showFilter ? "ẨN BỘ LỌC" : "BỘ LỌC"}
          </button>
        </div>
      </div>

      {showFilter && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 items-end shadow-xs">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tên danh mục</label>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Nhập tên danh mục..."
              className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:border-gray-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cấp độ (Root/Leaf)</label>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:border-gray-800 focus:outline-none bg-white"
            >
              <option value="">Tất cả danh mục</option>
              <option value="root">Danh mục cha (Root)</option>
              <option value="leaf">Danh mục con (Leaf)</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="h-10 px-4 bg-gray-800 hover:bg-gray-900 text-white font-medium rounded-lg text-sm transition-all cursor-pointer flex-1 text-center"
            >
              Tìm kiếm
            </button>
            <button
              onClick={handleClear}
              className="h-10 px-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg text-sm transition-all cursor-pointer flex-1 text-center"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto mt-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* <!-- Form thêm category cha --> */}
          <form
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitParentCategory();
            }}
          >
            <h2 className="text-2xl font-semibold text-gray-700">
              Add Category Root
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name category
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                onChange={(event) => setParentCategory(event.target.value)}
              />
            </div>

            <button
              type="submit"
              className="text-white bg-gray-800 cursor-pointer hover:bg-gray-900 px-4 py-2 rounded"
            >
              Save
            </button>
          </form>

          {/* <!-- Form thêm category con --> */}
          <form
            className="bg-white p-6 rounded-lg shadow-md space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmitSubCategory();
            }}
          >
            <h2 className="text-2xl font-semibold text-gray-700">
              Add Category Leaf
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Name category leaf
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                onChange={(event) => setSubCategory(event.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Select category root
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                onChange={(event) =>
                  setParentCategoryId(Number(event.target.value))
                }
              >
                <option>-- select category root --</option>
                {listAllCategories &&
                  listAllCategories.length > 0 &&
                  listAllCategories.map((category, index) => (
                    <option key={index} value={category.id}>
                      {category.name}
                    </option>
                  ))}
              </select>
            </div>

            <button
              className="text-white bg-gray-800 cursor-pointer hover:bg-gray-900 px-4 py-2 rounded"
              type="submit"
            >
              Save
            </button>
          </form>
        </div>
      </div>
      <ModalUpdateCategory
        show={showModalUpdateCategory}
        setShow={setShowModalUpdateCategory}
        fetchListCategoriesWithPaginate={fetchListCategoryWithPaginate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        dataUpdate={dataUpdate}
        resetUpdateData={resetUpdateData}
      />
      <ModalDeleteCategory
        show={showModalDeleteCategory}
        setShow={setShowModalDeleteCategory}
        dataDelete={dataDelete}
        fetchListCategoriesWithPaginate={fetchListCategoryWithPaginate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="mt-8 flow-root">
        <div className="-my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            <TableCategory
              listCategory={listCategories}
              handleClickBtnUpdate={handleClickBtnUpdate}
              handleClickBtnDelete={handleClickBtnDelete}
              fetchListCategoryWithPaginate={fetchListCategoryWithPaginate}
              pageCount={pageCount}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default CategoryPage;
