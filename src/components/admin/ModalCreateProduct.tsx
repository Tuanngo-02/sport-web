import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { toast } from "react-toastify";
import {
  Product,
  ProductVariant,
  VariantSizeStock,
} from "../../models/Product";
import {
  getLeafCategory,
} from "../../services/CategoryService";
import { Category } from "../../models/Category";
import { postCreateNewUser } from "../../services/UserService";
import { postCreateNewProduct } from "../../services/ProductService";
import { IoTrashBinOutline } from "react-icons/io5";

interface CreateProductProps {
  show: boolean;
  setShow: (value: boolean) => void;
  fetchListProductsWithPaginate: (page: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}
const ModalCreateProduct = ({
  show,
  setShow,
  fetchListProductsWithPaginate,
  currentPage,
  setCurrentPage,
}: CreateProductProps) => {
  const handleClose = () => {
    setShow(false);
    setName("");
    setCategory_id(0);
    setPrice(0);
    setRating(0);
    setContent("");
    setImage(null);
    setPreviewImage("");
    setBranch("");
    setCode("");
    setTag("");
    setDescription("");
    setVariants([]);
  };

  const [name, setName] = useState("");
  const [category_id, setCategory_id] = useState(0);
  const [price, setPrice] = useState(0);
  const [discountPrice, setDiscountPrice] = useState(0);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState("");
  const [code, setCode] = useState("");
  const [branch, setBranch] = useState("");
  const [tag, setTag] = useState("");
  const [description, setDescription] = useState("");
  const [gender, setGender] = useState("");
  const [arrCategory, setArrCategory] = useState<Category[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([
    {
      name: "",
      code: "",
      color: "",
      imageProductVariant: "",
      sizeAndStock: [{ size: "", stock: 0 }],
    },
  ]);
  const addVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        name: "",
        code: "",
        color: "",
        imageProductVariant: "",
        sizeAndStock: [{ size: "", stock: 0 }],
      },
    ]);
  };

  const handleVariantChange = (
    index: number,
    field: Exclude<keyof ProductVariant, "sizeAndStock" | "id">,
    value: string
  ) => {
    const copy = [...variants];
    copy[index][field] = value;
    setVariants(copy);
  };

  const addSizeStock = (variantIndex: number) => {
    const copy = [...variants];
    copy[variantIndex].sizeAndStock.push({ size: "", stock: 0 });
    setVariants(copy);
  };

  const handleSizeStockChange = <K extends keyof VariantSizeStock>(
    vIndex: number,
    sIndex: number,
    field: K,
    value: VariantSizeStock[K]
  ) => {
    const copy = [...variants];
    copy[vIndex].sizeAndStock[sIndex][field] = value;
    setVariants(copy);
  };
  const removeVariant = (vIndex: number) => {
    setVariants((prev) => prev.filter((_, i) => i !== vIndex));
  };

  const removeSizeStock = (vIndex: number, sIndex: number) => {
    const copy = [...variants];
    copy[vIndex].sizeAndStock = copy[vIndex].sizeAndStock.filter(
      (_, i) => i !== sIndex
    );
    setVariants(copy);
  };

  // update ảnh dưới dạng blob
  const handleUploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file); // lưu file dạng Blob (hoặc File) để gửi lên server
    }
  };
  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    let res = await getLeafCategory();
    if (res && res.code === 1000) {
      setArrCategory(res.result);
    }
  };
  const handleSubmitCreateProduct = async () => {
    if (!name) {
      toast.error("invalid name");
      return;
    } else if (!category_id) {
      toast.error("invalid category");
    } else if (!price) {
      toast.error("invalid price");
    }
    const dataNewProduct: Product = {
      name: name,
      code: code,
      branch: branch,
      description: description,
      discountPrice: discountPrice,
      categoryId: category_id,
      price: price,
      rating: rating,
      content: content,
      gender: gender,
      imageProduct: image,
      tag: tag,
      variants: variants,
    };
    let data = await postCreateNewProduct(dataNewProduct);
    if (data && data.code === 1000) {
      toast.success(data.message);
      handleClose();
      setCurrentPage(1);
      await fetchListProductsWithPaginate(1);
    }
    if (data && data.code !== 1000) {
      toast.error(data.message);
    }
  };
  return (
    <>
      <Dialog open={show} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-brand-primary/30 backdrop-blur-xs transition-opacity duration-300" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-6xl rounded-2xl bg-white shadow-2xl p-6 md:p-8 max-h-[92vh] overflow-y-auto border border-zinc-100 transition-all">
            <DialogTitle className="text-xl font-bold text-brand-primary font-display border-b border-zinc-100 pb-4 mb-6">
              Thêm Sản Phẩm Mới
            </DialogTitle>
            
            <form className="space-y-6">
              {/* THÔNG TIN CHUNG */}
              <div className="bg-zinc-50/70 p-5 rounded-2xl border border-zinc-100 space-y-4">
                <h3 className="text-xs font-extrabold text-zinc-400 uppercase tracking-widest border-b border-zinc-200 pb-1.5">
                  Thông tin chung
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Tên sản phẩm
                    </label>
                    <input
                      type="text"
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-zinc-700 font-medium bg-white"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Mã sản phẩm (Code)
                    </label>
                    <input
                      type="text"
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-zinc-700 font-medium bg-white"
                      value={code}
                      onChange={(event) => setCode(event.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Danh mục (Category)
                    </label>
                    <select
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white font-medium text-zinc-700"
                      value={category_id}
                      onChange={(event) =>
                        setCategory_id(Number(event.target.value))
                      }
                    >
                      <option value="">Chọn danh mục</option>
                      {arrCategory &&
                        arrCategory.length > 0 &&
                        arrCategory.map((category, index) => (
                          <option key={index} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Thương hiệu (Brand)
                    </label>
                    <input
                      type="text"
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-zinc-700 font-medium bg-white"
                      value={branch}
                      onChange={(event) => setBranch(event.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Giới tính (Gender)
                    </label>
                    <select
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary bg-white font-medium text-zinc-700"
                      value={gender}
                      onChange={(event) => setGender(event.target.value)}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="MAN">Nam (Man)</option>
                      <option value="WOMAN">Nữ (Woman)</option>
                      <option value="UNISEX">Unisex</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Giá niêm yết
                    </label>
                    <input
                      type="number"
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-zinc-700 font-medium bg-white"
                      value={price || ""}
                      onChange={(event) => setPrice(Number(event.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Giá khuyến mãi (Discount)
                    </label>
                    <input
                      type="number"
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-zinc-700 font-medium bg-white"
                      value={discountPrice || ""}
                      onChange={(event) =>
                        setDiscountPrice(Number(event.target.value))
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Đánh giá (Rating)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-zinc-700 font-medium bg-white"
                      value={rating || ""}
                      onChange={(event) => setRating(Number(event.target.value))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                      Nhãn tìm kiếm (Tag)
                    </label>
                    <input
                      type="text"
                      className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-zinc-700 font-medium bg-white"
                      value={tag}
                      onChange={(event) => setTag(event.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Mô tả ngắn (Description)
                  </label>
                  <textarea
                    rows={2}
                    className="w-full border border-zinc-200 rounded-lg p-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-zinc-700 font-medium bg-white resize-none"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1.5">
                    Nội dung chi tiết (Content)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-zinc-200 rounded-lg p-3 text-sm focus:border-brand-primary focus:outline-none focus:ring-1 focus:ring-brand-primary transition-all text-zinc-700 font-medium bg-white resize-none"
                    value={content}
                    onChange={(event) => setContent(event.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div>
                    <label
                      htmlFor="labelUpload"
                      className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 hover:bg-zinc-50 hover:text-zinc-800 transition-colors"
                    >
                      <BsPlusCircle className="text-sm text-zinc-500" /> Tải ảnh sản phẩm
                    </label>
                    <input
                      type="file"
                      id="labelUpload"
                      hidden
                      onChange={(event) => handleUploadImage(event)}
                    />
                  </div>

                  <div className="border border-dashed border-zinc-200 p-3 rounded-xl flex justify-center items-center bg-white min-h-[100px] max-h-[140px] overflow-hidden">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-24 object-contain rounded"
                      />
                    ) : (
                      <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Xem trước ảnh đại diện</span>
                    )}
                  </div>
                </div>
              </div>
            </form>

            {/* BIẾN THỂ SẢN PHẨM */}
            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
                <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wider">
                  Biến Thể Sản Phẩm (Variants)
                </h3>
                <button
                  onClick={addVariant}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-800 hover:bg-zinc-900 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer active:scale-95"
                >
                  <BsPlusCircle className="text-sm" /> Thêm Biến Thể
                </button>
              </div>

              <div className="space-y-4">
                {variants.map((variant, vIndex) => (
                  <div
                    key={vIndex}
                    className="bg-zinc-50/70 p-5 rounded-2xl border border-zinc-200 space-y-4"
                  >
                    {/* HÀNG NHẬP THÔNG TIN BIẾN THỂ */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
                      <div className="md:col-span-2">
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Tên biến thể</label>
                        <input
                          className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none bg-white font-medium"
                          placeholder="Ví dụ: Áo màu Đen"
                          value={variant.name}
                          onChange={(e) =>
                            handleVariantChange(vIndex, "name", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Mã biến thể</label>
                        <input
                          className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none bg-white font-medium"
                          placeholder="Code"
                          value={variant.code}
                          onChange={(e) =>
                            handleVariantChange(vIndex, "code", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Màu sắc (Color)</label>
                        <input
                          className="w-full h-10 border border-zinc-200 rounded-lg px-3 text-sm focus:border-brand-primary focus:outline-none bg-white font-medium"
                          placeholder="Color"
                          value={variant.color}
                          onChange={(e) =>
                            handleVariantChange(vIndex, "color", e.target.value)
                          }
                        />
                      </div>

                      <div className="flex gap-2 items-center">
                        <div className="flex-1">
                          <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">Ảnh biến thể</label>
                          <input
                            type="file"
                            accept="image/*"
                            className="w-full text-xs text-zinc-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-zinc-200 file:text-zinc-700 hover:file:bg-zinc-300 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              const url = URL.createObjectURL(file);
                              handleVariantChange(vIndex, "imageProductVariant", url);
                            }}
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => removeVariant(vIndex)}
                          className="h-10 px-3 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors cursor-pointer flex items-center justify-center mt-5"
                          title="Xóa biến thể"
                        >
                          <IoTrashBinOutline className="text-base" />
                        </button>
                      </div>
                    </div>

                    {/* SIZE VÀ SỐ LƯỢNG KHO */}
                    <div className="bg-white p-4 rounded-xl border border-zinc-100 space-y-3">
                      <div className="flex justify-between items-center border-b border-zinc-100 pb-2">
                        <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                          Kích cỡ & Số lượng tồn kho (Sizes & Stock)
                        </span>
                        <button
                          type="button"
                          onClick={() => addSizeStock(vIndex)}
                          className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-900 text-white text-2xs font-bold rounded-lg transition-colors cursor-pointer"
                        >
                          + Thêm Size/Stock
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {variant.sizeAndStock.map((s, sIndex) => (
                          <div key={sIndex} className="flex gap-2 items-center bg-zinc-50 p-2 rounded-lg border border-zinc-200">
                            <input
                              placeholder="Size (L, XL...)"
                              value={s.size}
                              className="w-1/2 h-8 border border-zinc-200 rounded px-2 text-xs focus:outline-none focus:border-brand-primary bg-white font-medium"
                              onChange={(e) =>
                                handleSizeStockChange(
                                  vIndex,
                                  sIndex,
                                  "size",
                                  e.target.value
                                )
                              }
                            />

                            <input
                              type="number"
                              placeholder="Số lượng"
                              value={s.stock || ""}
                              className="w-1/2 h-8 border border-zinc-200 rounded px-2 text-xs focus:outline-none focus:border-brand-primary bg-white font-medium"
                              onChange={(e) =>
                                handleSizeStockChange(
                                  vIndex,
                                  sIndex,
                                  "stock",
                                  Number(e.target.value)
                                )
                              }
                            />

                            <button
                              type="button"
                              onClick={() => removeSizeStock(vIndex, sIndex)}
                              className="p-1.5 text-rose-500 hover:text-rose-700 bg-white hover:bg-rose-50 border border-zinc-200 rounded transition-colors cursor-pointer"
                            >
                              <IoTrashBinOutline className="text-sm" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PHẦN FOOTER LƯU / HỦY */}
            <div className="flex justify-end gap-3 mt-8 border-t border-zinc-100 pt-6">
              <button
                className="px-5 py-2.5 rounded-xl border border-zinc-200 text-sm font-bold text-zinc-500 hover:bg-zinc-50 transition-colors cursor-pointer"
                onClick={handleClose}
              >
                Hủy
              </button>
              <button
                className="px-5 py-2.5 rounded-xl bg-brand-primary hover:bg-brand-accent text-white text-sm font-bold shadow-md transition-all cursor-pointer hover:shadow-lg active:scale-95"
                onClick={handleSubmitCreateProduct}
              >
                Lưu sản phẩm
              </button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
};
export default ModalCreateProduct;
