import { Fragment, useEffect, useState } from "react";
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
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import { Category } from "../models/Category";
import { getCategoryById, getRootCategory } from "../services/CategoryService";
import { IoIosArrowForward } from "react-icons/io";
import { CiUser, CiSearch } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { IoCartOutline, IoLogOutOutline } from "react-icons/io5";

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
  const [listChildrenCategories, setListChildrenCategories] = useState<Category[]>([]);
  const [listChildrenCategoriesSub, setListChildrenCategoriesSub] = useState<Category[]>([]);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [activeCategorySubId, setActiveCategorySubId] = useState<number | null>(null);
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
    if (res && res.result) {
      setListRootCategories(res.result);
    }
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

  const handleLogout = () => {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("user");
    setToken("");
    setUserId(null);
    setFullName("");
    toast.success("Đăng xuất thành công!");
    navigate("/");
  };

  return (
    <div className="bg-brand-bg font-sans">
      {/* Mobile menu */}
      <Dialog open={open} onClose={setOpen} className="relative z-50 lg:hidden">
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-brand-primary/40 backdrop-blur-xs transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />
        <div className="fixed inset-0 z-50 flex">
          <DialogPanel
            transition
            className="relative flex w-full max-w-xs transform flex-col overflow-y-auto bg-white pb-12 shadow-2xl transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <div className="flex px-4 pt-5 pb-2 justify-between items-center border-b border-brand-gray-border">
              <h2 className="text-lg font-bold text-brand-primary font-display">Menu</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="relative -m-2 inline-flex items-center justify-center rounded-full p-2 text-brand-gray-text hover:bg-brand-gray-light hover:text-brand-primary transition-all"
              >
                <span className="sr-only">Close menu</span>
                <IoMdClose aria-hidden="true" className="size-6" />
              </button>
            </div>

            {/* Links */}
            <TabGroup className="mt-4">
              <div className="border-b border-brand-gray-border">
                <TabList className="-mb-px flex space-x-6 px-4">
                  {navigation.categories.map((category) => (
                    <Tab
                      key={category.name}
                      className="flex-1 border-b-2 border-transparent pb-3 text-sm font-semibold whitespace-nowrap text-brand-gray-text data-selected:border-brand-accent data-selected:text-brand-accent outline-none transition-all"
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
                    className="space-y-8 px-4 pt-6 pb-8"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      {category.featured.map((item) => (
                        <div key={item.name} className="group relative text-xs font-semibold">
                          <div className="aspect-square w-full overflow-hidden rounded-xl bg-brand-gray-light">
                            <img
                              alt={item.imageAlt}
                              src={item.imageSrc}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <a
                            href={item.href}
                            className="mt-3 block font-bold text-brand-primary hover:text-brand-accent transition-colors"
                          >
                            <span aria-hidden="true" className="absolute inset-0 z-10" />
                            {item.name}
                          </a>
                        </div>
                      ))}
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </TabGroup>

            <div className="space-y-4 border-t border-brand-gray-border px-4 py-6">
              {navigation.pages.map((page) => (
                <div key={page.name} className="flow-root">
                  <Link
                    to={page.href}
                    onClick={() => setOpen(false)}
                    className="-m-2 block p-2 font-bold text-brand-primary hover:text-brand-accent transition-colors"
                  >
                    {page.name}
                  </Link>
                </div>
              ))}
            </div>

            <div className="space-y-4 border-t border-brand-gray-border px-4 py-6">
              {token ? (
                <>
                  <div className="text-sm font-bold text-brand-primary">
                    Tài khoản: <span className="text-brand-accent">{fullName}</span>
                  </div>
                  {sessionStorage.getItem("user") && JSON.parse(sessionStorage.getItem("user")!).role === "ADMIN" && (
                    <div className="flow-root">
                      <button
                        onClick={() => {
                          setOpen(false);
                          navigate("/admin");
                        }}
                        className="-m-2 block w-full text-left p-2 font-semibold text-brand-primary hover:text-brand-accent transition-colors cursor-pointer"
                      >
                        Quản lý Admin
                      </button>
                    </div>
                  )}
                  <div className="flow-root">
                    <button
                      onClick={() => {
                        setOpen(false);
                        handleLogout();
                      }}
                      className="-m-2 block w-full text-left p-2 font-bold text-brand-accent hover:text-brand-accent-hover transition-colors cursor-pointer flex items-center gap-2"
                    >
                      <IoLogOutOutline className="size-4" />
                      Đăng xuất
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flow-root">
                    <Link
                      to="/login"
                      onClick={() => setOpen(false)}
                      className="-m-2 block p-2 font-semibold text-brand-primary hover:text-brand-accent transition-colors"
                    >
                      Đăng nhập
                    </Link>
                  </div>
                  <div className="flow-root">
                    <Link
                      to="/register"
                      onClick={() => setOpen(false)}
                      className="-m-2 block p-2 font-semibold text-brand-primary hover:text-brand-accent transition-colors"
                    >
                      Đăng ký tài khoản
                    </Link>
                  </div>
                </>
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-brand-gray-border transition-all">
        <p className="flex h-9 items-center justify-center bg-brand-accent px-4 text-xs font-semibold text-white sm:px-6 lg:px-8 tracking-wider uppercase">
          Miễn phí giao hàng khi tổng giá trị đơn hàng từ 999K
        </p>

        <nav aria-label="Top" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="relative rounded-full p-2 text-brand-primary hover:bg-brand-gray-light lg:hidden transition-all"
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon aria-hidden="true" className="size-6" />
              </button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0 items-center">
                <a href="/" className="flex items-center">
                  <span className="sr-only">Your Company</span>
                  <img alt="Sport Shop" src="/images/logo.svg" className="h-24 md:h-28 w-auto object-contain -my-6 md:-my-8" />
                </a>
              </div>
            </div>

            {/* Flyout menus */}
            <PopoverGroup className="hidden lg:ml-8 lg:block lg:self-stretch z-50">
              <div className="flex h-full space-x-8">
                {navigation.categories.map((category) => (
                  <Popover key={category.name} className="flex">
                    {({ close }) => (
                      <>
                        <div className="relative flex">
                          <PopoverButton className="relative z-10 -mb-px flex items-center border-b-2 border-transparent pt-px text-sm font-semibold text-brand-primary transition-colors duration-200 hover:text-brand-accent hover:border-brand-accent outline-none cursor-pointer data-[open]:border-brand-accent data-[open]:text-brand-accent">
                            {category.name}
                          </PopoverButton>
                        </div>

                        <PopoverPanel
                          transition
                          className="absolute inset-x-0 top-full text-sm text-brand-primary shadow-2xl transition duration-200 ease-out data-closed:opacity-0 data-closed:translate-y-1"
                        >
                          <div className="relative bg-white border-b border-brand-gray-border">
                            <div className="mx-auto max-w-7xl px-8 py-8">
                              <div className="grid grid-cols-4 gap-8">
                                {/* Column 1: Root Categories */}
                                <div className="space-y-1 pr-4 border-r border-brand-gray-border">
                                  <h3 className="text-xs font-bold text-brand-gray-text tracking-wider uppercase mb-3">Danh Mục Chính</h3>
                                  {listRootCategories && listRootCategories.length > 0 && listRootCategories.map((listRoot) => (
                                    <button
                                      key={listRoot.id}
                                      onClick={() => {
                                        fetchChildrenCategories(listRoot.id!);
                                        setActiveCategoryId(listRoot.id!);
                                      }}
                                      className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                                        activeCategoryId === listRoot.id
                                          ? "bg-brand-accent/10 text-brand-accent"
                                          : "hover:bg-brand-gray-light text-brand-primary"
                                      }`}
                                    >
                                      <span>{listRoot.name}</span>
                                      <IoIosArrowForward className={`size-3.5 transition-transform ${activeCategoryId === listRoot.id ? 'translate-x-1' : ''}`} />
                                    </button>
                                  ))}
                                </div>

                                {/* Column 2: Children Categories */}
                                <div className="space-y-1 pr-4 border-r border-brand-gray-border">
                                  <h3 className="text-xs font-bold text-brand-gray-text tracking-wider uppercase mb-3">Danh Mục Con</h3>
                                  {selectedParentId ? (
                                    listChildrenCategories && listChildrenCategories.length > 0 ? (
                                      listChildrenCategories.map((child) => (
                                        <button
                                          key={child.id}
                                          onClick={() => {
                                            fetchChildrenCategoriesSub(child.id!);
                                            setActiveCategorySubId(child.id!);
                                          }}
                                          className={`w-full flex items-center justify-between px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                                            activeCategorySubId === child.id
                                              ? "bg-brand-accent/10 text-brand-accent"
                                              : "hover:bg-brand-gray-light text-brand-primary"
                                          }`}
                                        >
                                          <span>{child.name}</span>
                                          <IoIosArrowForward className={`size-3.5 transition-transform ${activeCategorySubId === child.id ? 'translate-x-1' : ''}`} />
                                        </button>
                                      ))
                                    ) : (
                                      <p className="text-xs text-brand-gray-text pl-3 py-2 italic">Không có danh mục con</p>
                                    )
                                  ) : (
                                    <p className="text-xs text-brand-gray-text pl-3 py-2 italic">Chọn danh mục chính để xem</p>
                                  )}
                                </div>

                                {/* Column 3: Sub Children Categories */}
                                <div className="space-y-1 pr-4 border-r border-brand-gray-border">
                                  <h3 className="text-xs font-bold text-brand-gray-text tracking-wider uppercase mb-3">Chi Tiết</h3>
                                  {selectedChildId ? (
                                    listChildrenCategoriesSub && listChildrenCategoriesSub.length > 0 ? (
                                      listChildrenCategoriesSub.map((subChild) => (
                                        <button
                                          key={subChild.id}
                                          onClick={() => {
                                            navigate(`/product?category=${subChild.id}`);
                                            close();
                                          }}
                                          className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-brand-gray-light text-brand-primary hover:text-brand-accent transition-all"
                                        >
                                          {subChild.name}
                                        </button>
                                      ))
                                    ) : (
                                      <p className="text-xs text-brand-gray-text pl-3 py-2 italic">Không có chi tiết danh mục</p>
                                    )
                                  ) : (
                                    <p className="text-xs text-brand-gray-text pl-3 py-2 italic">Chọn danh mục con để xem</p>
                                  )}
                                </div>

                                {/* Column 4: Promotional Asset */}
                                <div className="flex flex-col justify-between">
                                  <div className="relative rounded-xl overflow-hidden bg-brand-gray-light aspect-[4/3] shadow-md group">
                                    <img
                                      src="https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&q=80&w=400"
                                      alt="Featured Promotion"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/80 to-transparent p-4 flex flex-col justify-end">
                                      <p className="text-white text-xs font-bold uppercase tracking-wider">New Arrivals</p>
                                      <p className="text-white text-sm font-semibold mt-1">Đồ thể thao chạy bộ mới nhất</p>
                                    </div>
                                  </div>
                                  <button
                                    onClick={() => {
                                      navigate('/product');
                                      close();
                                    }}
                                    className="w-full mt-3 bg-brand-primary hover:bg-brand-accent text-white py-2 px-4 rounded-xl text-xs font-bold tracking-wider uppercase btn-tactile transition-all"
                                  >
                                    Xem tất cả
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </PopoverPanel>
                      </>
                    )}
                  </Popover>
                ))}

                {navigation.pages.map((page) => (
                  <Link
                    key={page.name}
                    to={page.href}
                    className="flex items-center text-sm font-bold text-brand-accent hover:text-brand-accent-hover tracking-wider transition-colors duration-200"
                  >
                    {page.name}
                  </Link>
                ))}
              </div>
            </PopoverGroup>

            {/* Icons & Actions */}
            <div className="flex items-center space-x-3">
              {/* Search Box */}
              <div
                className={`h-9 flex items-center overflow-hidden transition-all duration-300 ${
                  openSearch ? "w-64 opacity-100 mr-2" : "w-0 opacity-0"
                }`}
              >
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full h-full bg-brand-gray-light border border-brand-gray-border focus:border-brand-accent focus:ring-1 focus:ring-brand-accent rounded-full px-4 text-xs focus:outline-none transition-all"
                />
              </div>

              {/* Search Toggle Button */}
              <button
                className="p-2 text-brand-primary hover:bg-brand-gray-light rounded-full transition-all cursor-pointer animate-fade-in"
                onClick={() => setOpenSearch(!openSearch)}
              >
                {openSearch ? (
                  <IoMdClose className="h-5 w-5" />
                ) : (
                  <CiSearch className="h-5 w-5 stroke-[0.5]" />
                )}
              </button>

              {/* User Identity / CTA */}
              {token ? (
                <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <MenuButton className="flex items-center space-x-2 px-3 py-1.5 bg-brand-gray-light rounded-full border border-brand-gray-border hover:bg-zinc-200/50 transition-all cursor-pointer">
                      <CiUser className="text-lg text-brand-primary" />
                      <span className="text-xs font-semibold text-brand-primary hidden sm:inline">{fullName}</span>
                      <ChevronDownIcon className="size-3 text-brand-gray-text" />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-50 mt-2 w-44 origin-top-right rounded-xl bg-white shadow-2xl ring-1 ring-black/5 focus:outline-hidden transition duration-100 ease-out data-closed:scale-95 data-closed:transform data-closed:opacity-0"
                  >
                    <div className="py-1.5 px-1.5 space-y-0.5">
                      {sessionStorage.getItem("user") && JSON.parse(sessionStorage.getItem("user")!).role === "ADMIN" && (
                        <MenuItem>
                          <button
                            onClick={() => navigate("/admin")}
                            className="w-full text-left px-3 py-2 text-xs font-semibold rounded-lg hover:bg-brand-gray-light text-brand-primary transition-all cursor-pointer"
                          >
                            Quản lý Admin
                          </button>
                        </MenuItem>
                      )}
                      <MenuItem>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-3 py-2 text-xs font-bold rounded-lg hover:bg-brand-accent/10 text-brand-accent transition-all cursor-pointer flex items-center gap-2"
                        >
                          <IoLogOutOutline className="size-4" />
                          Đăng xuất
                        </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              ) : (
                <button
                  className="hidden lg:flex items-center justify-center px-5 py-2 bg-brand-primary hover:bg-brand-accent text-white rounded-full text-xs font-bold tracking-wider uppercase btn-tactile transition-all cursor-pointer"
                  onClick={() => navigate("/login")}
                >
                  Đăng nhập
                </button>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative p-2 text-brand-primary hover:bg-brand-gray-light rounded-full transition-all flex items-center justify-center">
                <IoCartOutline aria-hidden="true" className="size-6 shrink-0" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-brand-accent text-white rounded-full text-[10px] font-bold w-4 h-4 flex items-center justify-center shadow-md animate-pulse">
                    {totalQuantity}
                  </span>
                )}
              </Link>
            </div>
          </div>
      </nav>
    </header>
  </div>
);
};

export default NavBar;
