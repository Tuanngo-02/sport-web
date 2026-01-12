import { Fragment, useEffect, useId, useState } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
} from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router";
import { Category } from "../models/Category";
import { getCategoryById, getRootCategory } from "../services/CategoryService";
import { getCartByUserId } from "../services/CartService";
import { IoIosArrowForward } from "react-icons/io";
import { CiUser, CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { IoCartOutline } from "react-icons/io5";

const navigation = {
  categories: [
    {
      id: "1",
      name: "Môn thể thao",
      featured: [
        {
          name: "New Arrivals",
          href: "#",
          imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-01.jpg",
          imageAlt:
            "Models sitting back to back, wearing Basic Tee in black and bone.",
        },
        {
          name: "Basic Tees",
          href: "#",
          imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/mega-menu-category-02.jpg",
          imageAlt:
            "Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "#" },
            { name: "Dresses", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Denim", href: "#" },
            { name: "Sweaters", href: "#" },
            { name: "T-Shirts", href: "#" },
            { name: "Jackets", href: "#" },
            { name: "Activewear", href: "#" },
            { name: "Browse All", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "#" },
            { name: "Wallets", href: "#" },
            { name: "Bags", href: "#" },
            { name: "Sunglasses", href: "#" },
            { name: "Hats", href: "#" },
            { name: "Belts", href: "#" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Full Nelson", href: "#" },
            { name: "My Way", href: "#" },
            { name: "Re-Arranged", href: "#" },
            { name: "Counterfeit", href: "#" },
            { name: "Significant Other", href: "#" },
          ],
        },
      ],
    },
    {
      id: "2",
      name: "Phụ kiện thể thao",
      featured: [
        {
          name: "New Arrivals",
          href: "#",
          imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/product-page-04-detail-product-shot-01.jpg",
          imageAlt:
            "Drawstring top with elastic loop closure and textured interior padding.",
        },
        {
          name: "Artwork Tees",
          href: "#",
          imageSrc:
            "https://tailwindcss.com/plus-assets/img/ecommerce-images/category-page-02-image-card-06.jpg",
          imageAlt:
            "Three shirts in gray, white, and blue arranged on table with same line drawing of hands and shapes overlapping on front of shirt.",
        },
      ],
      sections: [
        {
          id: "clothing",
          name: "Clothing",
          items: [
            { name: "Tops", href: "#" },
            { name: "Pants", href: "#" },
            { name: "Sweaters", href: "#" },
            { name: "T-Shirts", href: "#" },
            { name: "Jackets", href: "#" },
            { name: "Activewear", href: "#" },
            { name: "Browse All", href: "#" },
          ],
        },
        {
          id: "accessories",
          name: "Accessories",
          items: [
            { name: "Watches", href: "#" },
            { name: "Wallets", href: "#" },
            { name: "Bags", href: "#" },
            { name: "Sunglasses", href: "#" },
            { name: "Hats", href: "#" },
            { name: "Belts", href: "#" },
          ],
        },
        {
          id: "brands",
          name: "Brands",
          items: [
            { name: "Re-Arranged", href: "#" },
            { name: "Counterfeit", href: "#" },
            { name: "Full Nelson", href: "#" },
            { name: "My Way", href: "#" },
          ],
        },
      ],
    },
  ],
  pages: [
    { name: "SẢN PHẨM MỚI", href: "/product" },
    { name: "SALE 50%", href: "#" },
  ],
};
const NavBar = () => {
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [listRootCategories, setListRootCategories] = useState<Category[]>([]);
  const [listChildrenCategories, setListChildrenCategories] = useState<
    Category[]
  >([]);
  const [listChildrenCategoriesSub, setListChildrenCategoriesSub] = useState<
    Category[]
  >([]);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeCategorySubId, setActiveCategorySubId] = useState<number | null>(
    null
  );
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [userId, setUserId] = useState<number | null>(null);
  const [fullName, setFullName] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    fetchRootCategories();
    const userStr = sessionStorage.getItem("user");
    const access_token = sessionStorage.getItem("access_token");
    if (userStr && access_token) {
      setToken(access_token);
      const user = JSON.parse(userStr);
      setUserId(user.id);
      setFullName(user.name);
    }
  }, []);
  useEffect(() => {
    const storedCart = localStorage.getItem("cart_guest");
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart);
      const quantity = parsedCart.reduce(
        (total: number, item: any) => total + (item.quantity || 0),
        0
      );
      setTotalQuantity(quantity);
    }
  }, []);

  const fetchRootCategories = async () => {
    let res = await getRootCategory();
    setListRootCategories(res.result);
  };
  const fetchChildrenCategories = async (id: number) => {
    if (selectedParentId === id) {
      setSelectedParentId(null);
      setListChildrenCategories([]);
      setSelectedChildId(null);
      setListChildrenCategoriesSub([]);
      return;
    }
    const res = await getCategoryById(id);
    if (res && res.code === 1000) {
      setSelectedParentId(id);
      setListChildrenCategories(res.result.children || []);
      setSelectedChildId(null);
      setListChildrenCategoriesSub([]);
    }
  };
  const fetchChildrenCategoriesSub = async (id: number) => {
    if (selectedChildId === id) {
      setSelectedChildId(null);
      setListChildrenCategoriesSub([]);
      return;
    }
    const res = await getCategoryById(id);
    if (res && res.code === 1000) {
      setSelectedChildId(id);
      setListChildrenCategoriesSub(res.result.children || []);
    }
  };
  return (
    <div className="bg-white">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-40 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-black/25 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-40 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Close menu</span>
                <IoMdClose aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-2">
              <div className="border-b border-gray-200">
                <TabList className="-mb-px flex space-x-8 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent px-1 py-4 text-base font-medium whitespace-nowrap text-gray-900 data-selected:border-indigo-600 data-selected:text-indigo-600"
                    >
                      {category.name}
                    </Tab>
                  ))}
                </TabList>
              </div>
              <TabPanels as={Fragment}>
                {navigation.categories.map((category) => (
                  <TabPanel
                    key={category.name}
                    className="space-y-10 px-4 pt-10 pb-8"
                  >
                    <div className="grid grid-cols-2 gap-x-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-sm">
                          <img
                            alt={item.imageAlt}
                            src={item.imageSrc}
                            className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                          />
                          <a
                            href={item.href}
                            className="mt-6 block font-medium text-gray-900"
                          >
                            <span
                              aria-hidden="true"
                              className="absolute inset-0 z-10"
                            />
                            {item.name}
                          </a>
                          <p aria-hidden="true" className="mt-1">
                            Shop now
                          </p>
                        </div>
                      ))}
                    </div>
                    {category.sections.map((section) => (
                      <div key={section.name}>
                        <p
                          id={`${category.id}-${section.id}-heading-mobile`}
                          className="font-medium text-gray-900"
                        >
                          {section.name}
                        </p>
                        <ul
                          role="list"
                          aria-labelledby={`${category.id}-${section.id}-heading-mobile`}
                          className="mt-6 flex flex-col space-y-6"
                        >
                          {section.items.map((item) => (
                            <li key={item.name} className="flow-root">
                              <a
                                href={item.href}
                                className="-m-2 block p-2 text-gray-500"
                              >
                                {item.name}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <a
                    href={page.href}
                    className="-m-2 block p-2 font-medium text-gray-900"
                  >
                    {page.name}
                  </a>
                </div>
              ))}
            </div>

            <div className="space-y-6 border-t border-gray-200 px-4 py-6">
              <div className="flow-root">
                <a
                  href="#"
                  className="-m-2 block p-2 font-medium text-gray-900"
                >
                  Sign in
                </a>
              </div>
              <div className="flow-root">
                <a
                  href="#"
                  className="-m-2 block p-2 font-medium text-gray-900"
                >
                  Create account
                </a>
              </div>
            </div>

            <div className="border-t border-gray-200 px-4 py-6">
              <a href="#" className="-m-2 flex items-center p-2">
                <img
                  alt=""
                  src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                  className="block h-auto w-5 shrink-0"
                />
                <span className="ml-3 block text-base font-medium text-gray-900">
                  CAD
                </span>
                <span className="sr-only">, change currency</span>
              </a>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="fixed top-0 left-0 right-0 bg-white z-50 border-b border-gray-200 ">
        <p className="flex h-10 items-center justify-center custom-bg-1 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
          Miễn phí giao hàng khi tổng giá trị đơn hàng 999K
        </p>

        <nav
          aria-label="Top"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 "
        >
          <div className="">
            <div className="flex h-16 items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-md bg-white p-2 text-gray-400 lg:hidden"
              >
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <a href="/">
                  <span className="sr-only">Your Company</span>
                  <img alt="" src="/images/logo.svg" className="h-30 w-auto" />
                </a>
              </div>

              {/* Flyout menus */}
              <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch z-50">
                <div className="flex h-full space-x-8">
                  {navigation.categories.map((category) => (
                    <Popover key={category.name} className="flex">
                      <div className="relative flex">
                        <PopoverButton className="relative z-10 -mb-px flex items-center border-b-2 border-transparent pt-px text-sm font-medium text-black transition-colors duration-200 ease-out hover:text-gray-500 data-open:border-gray-500 data-open:text-gray-500">
                          {category.name}
                        </PopoverButton>
                      </div>

                      <PopoverPanel
                        transition
                        className="absolute inset-x-0 top-full text-sm text-gray-500 transition data-closed:opacity-0 data-enter:duration-200 data-enter:ease-out data-leave:duration-150 data-leave:ease-in"
                      >
                        {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 top-1/2 bg-white shadow-sm"
                        />

                        <div className="relative bg-white">
                          <div className="mx-auto max-w-7xl px-8">
                            <div className="grid grid-cols-2  gap-y-10 pl-18 py-2">
                              <div className="col-start-2 grid grid-cols-2 gap-x-8">
                                {/* {category.featured.map((item) => (
                                  <div key={item.name} className="group relative text-base sm:text-sm">
                                    <img
                                      alt={item.imageAlt}
                                      src={item.imageSrc}
                                      className="aspect-square w-full rounded-lg bg-gray-100 object-cover group-hover:opacity-75"
                                    />
                                    <a href={item.href} className="mt-6 block font-medium text-gray-900">
                                      <span aria-hidden="true" className="absolute inset-0 z-10" />
                                      {item.name}
                                    </a>
                                    <p aria-hidden="true" className="mt-1">
                                      Shop now
                                    </p>
                                  </div>
                                ))} */}
                              </div>
                              <div className="row-start-1 grid grid-cols-3 gap-x-2 gap-y-10 text-lg text-black">
                                <div className="pl-3 border-l border-gray-200">
                                  {listRootCategories &&
                                    listRootCategories.length > 0 &&
                                    listRootCategories.map(
                                      (listRoot, index) => (
                                        <ul
                                          role="list"
                                          aria-labelledby={`${listRoot.name}-heading`}
                                          className="space-y-6 sm:pt-3 sm:space-y-4 border-gray-200 border-t pb-3"
                                        >
                                          <div
                                            className={`flex items-center hover:text-gray-400 ${
                                              activeCategoryId === listRoot.id
                                                ? "text-gray-400"
                                                : ""
                                            }`}
                                          >
                                            <button
                                              className="  items-center w-20"
                                              onClick={() => {
                                                fetchChildrenCategories(
                                                  listRoot.id!
                                                );
                                                setActiveCategoryId(
                                                  listRoot.id!
                                                );
                                              }}
                                            >
                                              {listRoot.name}
                                            </button>
                                            <span className="inline-block ml-2">
                                              <IoIosArrowForward />
                                            </span>
                                          </div>
                                        </ul>
                                      )
                                    )}
                                </div>
                                {selectedParentId && (
                                  <div className="pl-3 border-l border-gray-200">
                                    {listChildrenCategories &&
                                      listChildrenCategories.length > 0 &&
                                      listChildrenCategories.map(
                                        (listChildrenCategories, index) => (
                                          <ul
                                            role="list"
                                            aria-labelledby={`${listChildrenCategories.name}-heading`}
                                            className="space-y-6 sm:pt-3 sm:space-y-4 border-gray-200 border-t pb-3"
                                          >
                                            <div
                                              className={`flex items-center hover:text-gray-400 ${
                                                activeCategorySubId ===
                                                listChildrenCategories.id
                                                  ? "text-gray-400"
                                                  : ""
                                              }`}
                                            >
                                              <button
                                                className=" items-center w-35"
                                                onClick={() => {
                                                  fetchChildrenCategoriesSub(
                                                    listChildrenCategories.id!
                                                  );
                                                  setActiveCategorySubId(
                                                    listChildrenCategories.id!
                                                  );
                                                }}
                                              >
                                                {listChildrenCategories.name}
                                              </button>
                                              <span className="inline-block ml-2">
                                                <IoIosArrowForward />
                                              </span>
                                            </div>
                                          </ul>
                                        )
                                      )}
                                  </div>
                                )}
                                {selectedChildId && (
                                  <div className="pl-3 border-l border-gray-200">
                                    {listChildrenCategoriesSub &&
                                      listChildrenCategoriesSub.length > 0 &&
                                      listChildrenCategoriesSub.map(
                                        (listChildrenCategoriesSub, index) => (
                                          <ul
                                            role="list"
                                            aria-labelledby={`${listChildrenCategoriesSub.name}-heading`}
                                            className="space-y-6 sm:pt-3 sm:space-y-4 border-gray-200 border-t pb-3"
                                          >
                                            <button
                                              className="flex hover:text-gray-400"
                                              onClick={() =>
                                                fetchChildrenCategoriesSub(
                                                  listChildrenCategoriesSub.id!
                                                )
                                              }
                                            >
                                              {listChildrenCategoriesSub.name}
                                            </button>
                                          </ul>
                                        )
                                      )}
                                  </div>
                                )}

                                {/* {category.sections.map((section) => (
                                  <div key={section.name}>
                                    <p id={`${section.name}-heading`} className="font-medium text-gray-900">
                                      {section.name}
                                    </p>
                                    <ul
                                      role="list"
                                      aria-labelledby={`${section.name}-heading`}
                                      className="mt-6 space-y-6 sm:mt-4 sm:space-y-4"
                                    >
                                      {section.items.map((item) => (
                                        <li key={item.name} className="flex">
                                          <a href={item.href} className="hover:text-gray-800">
                                            {item.name}
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ))} */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </PopoverPanel>
                    </Popover>
                  ))}

                  {navigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      to={page.href}
                      className="flex items-center text-md font-medium text-red-600 hover:text-red-700"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </PopoverGroup>

              <div className="ml-auto flex items-center">
                {/* <div className="hidden lg:ml-8 lg:flex">
                  <a
                    href="#"
                    className="flex items-center text-gray-700 hover:text-gray-800"
                  >
                    <img
                      alt=""
                      src="https://tailwindcss.com/plus-assets/img/flags/flag-canada.svg"
                      className="block h-auto w-5 shrink-0"
                    />
                    <span className="ml-3 block text-sm font-medium">CAD</span>
                    <span className="sr-only">, change currency</span>
                  </a>
                </div> */}
                {/* Thanh search trượt ra */}
                <div
                  className={`h-10 flex items-center overflow-hidden transition-all duration-300 ${
                    openSearch ? "w-80 opacity-100" : "w-0 opacity-0"
                  }`}
                >
                  <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm"
                    className="w-full h-full bg-gray-100 rounded-full px-3 py-2 text-sm focus:outline-none"
                  />
                </div>
                {/* Search */}
                <div className="flex lg:ml-4 lg:mr-2">
                  <button
                    className="p-2 text-gray-400 hover:text-gray-500"
                    onClick={() => setOpenSearch(!openSearch)}
                  >
                    {openSearch ? (
                      <IoMdClose className="h-6 w-6" />
                    ) : (
                      <CiSearch className="h-6 w-6" />
                    )}
                  </button>
                </div>

                {token ? (
                  <div className="flex-wrap items-center gap-2 justify-center text-center">
                    <div className="flex justify-center">
                      <CiUser className="text-xl" />
                    </div>
                    {fullName}
                  </div>
                ) : (
                  <div className="hidden lg:flex lg:flex-1 lg:items-center px-5 py-3 bg-[#382246] rounded-full hover:bg-[#442757]">
                    <button
                      className="text-sm font-medium text-white cursor-pointer"
                      onClick={() => navigate("/login")}
                    >
                      Đăng nhập
                    </button>
                  </div>
                )}
                {/* Cart */}
                <div className=" relative ml-4 flow-root lg:ml-6">
                  <Link to="/cart" className="group -m-2 flex items-center p-2">
                    <IoCartOutline
                      aria-hidden="true"
                      className="size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                    />
                    <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full text-xs px-1">
                      {totalQuantity}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
};

export default NavBar;
