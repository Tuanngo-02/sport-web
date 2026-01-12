import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { useEffect, useState } from "react";
import { BsPlusCircle } from "react-icons/bs";
import { Category } from "../../models/Category";
import {
  Product,
  ProductVariant,
  VariantSizeStock,
} from "../../models/Product";
import { toast } from "react-toastify";
import {
  deleteProductVariant,
  deleteSizeAndStock,
  postUpdateProduct,
} from "../../services/ProductService";
import {
  getLeafCategory,
} from "../../services/CategoryService";
import { IoTrashBinOutline } from "react-icons/io5";

interface UpdateProductProps {
  show: boolean;
  setShow: (value: boolean) => void;
  fetchListProductsWithPaginate: (page: number) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  dataUpdate: Product | null;
  resetUpdateData: () => void;
}
const ModalUpdateProduct = ({
  show,
  setShow,
  fetchListProductsWithPaginate,
  currentPage,
  setCurrentPage,
  dataUpdate,
  resetUpdateData,
}: UpdateProductProps) => {
  const handleClose = () => {
    setShow(false);
    setName("");
    setCategory_id(0);
    setPrice(0);
    setRating(0);
    setContent("");
    setImage(null);
    setPreviewImage("");
    resetUpdateData();
  };

  //   const [name, setName] = useState("");
  //   const [category_id, setCategory_id] = useState(0);
  //   const [price, setPrice] = useState(0);
  //   const [rating, setRating] = useState("");
  //   const [gender, setGender] = useState("");
  //   const [content, setContent] = useState("");
  //   const [image, setImage] = useState<File | null>(null);
  //   const [previewImage, setPreviewImage] = useState("");
  //   const [arrCategory, setArrCategory] = useState<Category[]>([]);
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
  const removeVariant = (vIndex: number, id: number) => {
    if (id) {
      const confirmDelete = window.confirm(
        "Bạn có chắc chắn muốn xóa biến thể này không?"
      );
      if (!confirmDelete) return;
      delProductVariant(dataUpdate?.id!, id);
    }
    setVariants((prev) => prev.filter((_, i) => i !== vIndex));
  };

  const removeSizeStock = (
    vIndex: number,
    sIndex: number,
    idVariant: number,
    id: number
  ) => {
    if (idVariant && id) {
      const confirmDelete = window.confirm(
        "Bạn có chắc chắn muốn xóa size và stock này không?"
      );
      if (!confirmDelete) return;
      delSizeAndStock(dataUpdate?.id!, idVariant, id);
    }
    const copy = [...variants];
    copy[vIndex].sizeAndStock = copy[vIndex].sizeAndStock.filter(
      (_, i) => i !== sIndex
    );
    setVariants(copy);
  };
  useEffect(() => {
    if (dataUpdate) {
      //update state
      setName(dataUpdate.name);
      setCategory_id(dataUpdate.categoryId);
      setPrice(dataUpdate.price);
      setRating(dataUpdate.rating);
      setContent(dataUpdate.content);
      setCode(dataUpdate.code);
      setBranch(dataUpdate.branch);
      setTag(dataUpdate.tag);
      setDiscountPrice(dataUpdate.discountPrice);
      setDescription(dataUpdate.description);
      if (dataUpdate.variants) {
        setVariants(dataUpdate.variants);
      }
      if (dataUpdate.imageProduct) {
        setPreviewImage(`data:image/jpeg;base64,${dataUpdate.imageProduct}`);
      }
      setGender(dataUpdate.gender);
    }
  }, [dataUpdate]);
  useEffect(() => {
    getCategory();
  }, []);

  const getCategory = async () => {
    let res = await getLeafCategory();
    if (res && res.code === 1000) {
      setArrCategory(res.result);
    }
  };
  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Đọc file và trả  dạng base64

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

  // update ảnh dưới dạng blobra
  const handleUploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !dataUpdate) return;

    const base64Image = await convertToBase64(file);

    // Nếu không có ảnh sẵn hoặc ảnh khác ảnh cũ => cập nhật
    if (
      !dataUpdate.imageProduct ||
      dataUpdate.imageProduct.toString() !== base64Image
    ) {
      setPreviewImage(URL.createObjectURL(file));
      setImage(file); // Cập nhật ảnh (dạng File)
    } else {
      console.log("Ảnh giống ảnh cũ, không cập nhật.");
    }
  };
  const handleSubmitUpdateProduct = async () => {
    // Đảm bảo dataUpdate có đầy đủ dữ liệu cần cập nhật
    if (!dataUpdate) {
      toast.error("No information product");
      return;
    }
    // Gọi API cập nhật
    const dataProductNewUpdate: Product = {
      id: dataUpdate.id,
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

    try {
      const response = await postUpdateProduct(dataProductNewUpdate);
      if (response && response.code === 1000) {
        toast.success(response.message);
        handleClose();
        await fetchListProductsWithPaginate(currentPage);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      toast.error("Đã xảy ra lỗi khi cập nhật người dùng");
    }
  };
  const delProductVariant = async (idProduct: number, idVariant: number) => {
    let data = await deleteProductVariant(idProduct, idVariant);
    if (data && data.code === 1000) {
      toast.success(data.message);
      handleClose();
      await fetchListProductsWithPaginate(currentPage);
    }
  };

  const delSizeAndStock = async (
    idProduct: number,
    idVariant: number,
    idSizeAndStock: number
  ) => {
    let data = await deleteSizeAndStock(idProduct, idVariant, idSizeAndStock);
    if (data && data.code === 1000) {
      toast.success(data.message);
      handleClose();
      await fetchListProductsWithPaginate(currentPage);
    }
  };
  return (
    <>
      <Dialog open={show} onClose={() => {}} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="w-full max-w-6xl rounded-xl bg-white p-6 max-h-screen overflow-y-auto">
            <DialogTitle className="text-xl font-semibold border-b pb-4 mb-6">
              Edit product
            </DialogTitle>

            <form className="grid grid-cols-1 gap-4">
              <div>
                <label className="block font-medium text-gray-700">
                  Name Product
                </label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-gray-700">
                    Code Product
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    value={code}
                    onChange={(event) => setCode(event.target.value)}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700">
                    Category
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    value={category_id}
                    onChange={(event) =>
                      setCategory_id(Number(event.target.value))
                    }
                  >
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
                  <label className="block font-medium text-gray-700">
                    Branch Product
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    value={branch}
                    onChange={(event) => setBranch(event.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block font-medium text-gray-700">
                    Gender
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    value={gender}
                    onChange={(event) => setGender(event.target.value)}
                  >
                    <option value="MAN">Man</option>
                    <option value="WOMAN">Woman</option>
                    <option value="UNISEX">Unisex</option>
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-gray-700">
                    Rating Product
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    value={rating}
                    onChange={(event) => setRating(Number(event.target.value))}
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700">
                    Tag Product
                  </label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    value={tag}
                    onChange={(event) => setTag(event.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700">
                    Price
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    value={price}
                    onChange={(event) => setPrice(Number(event.target.value))}
                  />
                </div>

                <div>
                  <label className="block font-medium text-gray-700">
                    Discount Price
                  </label>
                  <input
                    type="number"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                    value={discountPrice}
                    onChange={(event) =>
                      setDiscountPrice(Number(event.target.value))
                    }
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  Content
                </label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                />
              </div>
              <div>
                <label
                  htmlFor="labelUpload"
                  className="cursor-pointer inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                >
                  <BsPlusCircle className="text-xl" /> Upload File Image
                </label>
                <input
                  type="file"
                  id="labelUpload"
                  hidden
                  onChange={(event) => handleUploadImage(event)}
                />
              </div>

              <div className="border border-dashed border-gray-300 p-4 rounded-md flex justify-center items-center min-h-[150px]">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="max-h-48 object-contain"
                  />
                ) : (
                  <span className="text-gray-400">Image preview</span>
                )}
              </div>
            </form>
            <div className="mt-5">
              <button
                onClick={addVariant}
                className="px-3 py-2 text-white bg-gray-800 cursor-pointer hover:bg-gray-900 rounded-md"
              >
                Add Variable
              </button>
              {variants.map((variant, vIndex) => (
                <div
                  key={vIndex}
                  className="border border-gray-400 p-4 rounded mt-4 "
                >
                  <div className="flex justify-between items-center mb-4">
                    <input
                      className="px-7 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300 "
                      placeholder="Name"
                      value={variant.name}
                      onChange={(e) =>
                        handleVariantChange(vIndex, "name", e.target.value)
                      }
                    />

                    <input
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
                      placeholder="Code"
                      value={variant.code}
                      onChange={(e) =>
                        handleVariantChange(vIndex, "code", e.target.value)
                      }
                    />

                    <input
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
                      placeholder="Color"
                      value={variant.color}
                      onChange={(e) =>
                        handleVariantChange(vIndex, "color", e.target.value)
                      }
                    />

                    <input
                      type="file"
                      accept="image/*"
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;

                        // Nếu bạn muốn lưu URL tạm để preview
                        const url = URL.createObjectURL(file);

                        handleVariantChange(vIndex, "imageProductVariant", url);
                      }}
                    />

                    <button
                      onClick={() => removeVariant(vIndex, variant.id!)}
                      className="px-3 py-2 text-red-500 rounded bg-gray-200/30 hover:bg-gray-200 cursor-pointer"
                    >
                      <IoTrashBinOutline />
                    </button>
                  </div>
                  <div className="mt-2">
                    <button
                      onClick={() => addSizeStock(vIndex)}
                      className="px-3 py-1 text-white bg-gray-800 cursor-pointer hover:bg-gray-900 rounded-md"
                    >
                      Add size/stock
                    </button>

                    {variant.sizeAndStock.map((s, sIndex) => (
                      <div key={sIndex} className="flex gap-2 mt-2">
                        <input
                          placeholder="Size"
                          value={s.size}
                          className=" px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
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
                          placeholder="Stock"
                          value={s.stock}
                          className=" px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-300"
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
                          onClick={() =>
                            removeSizeStock(vIndex, sIndex, variant.id!, s.id!)
                          }
                          className="px-2 py-1 text-red-500 rounded bg-gray-200/30 hover:bg-gray-200 cursor-pointer"
                        >
                          <IoTrashBinOutline />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                onClick={handleClose}
              >
                Close
              </button>
              <button
                className="text-white bg-gray-800 cursor-pointer hover:bg-gray-900  px-4 py-2 rounded-md "
                onClick={handleSubmitUpdateProduct}
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
export default ModalUpdateProduct;
