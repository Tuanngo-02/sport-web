import React from 'react'
import ProductList from '../../components/ProductList'
import { useState } from 'react'
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { ChevronDownIcon, FunnelIcon, MinusIcon, PlusIcon, Squares2X2Icon } from '@heroicons/react/20/solid'
import BreadcrumbBox from '../../components/BreadcrumbBox'

const sortOptions = [
  { name: 'Phổ biến nhất', href: '#', current: true },
  { name: 'Đánh giá tốt nhất', href: '#', current: false },
  { name: 'Mới nhất', href: '#', current: false },
  { name: 'Giá: Thấp đến Cao', href: '#', current: false },
  { name: 'Giá: Cao đến Thấp', href: '#', current: false },
]
const subCategories = [
  { name: 'Trang phục nam', href: '#' },
  { name: 'Trang phục nữ', href: '#' },
  { name: 'Thiết bị leo núi', href: '#' },
  { name: 'Dụng cụ chạy bộ', href: '#' },
  { name: 'Phụ kiện dã ngoại', href: '#' },
]
const filters = [
  {
    id: 'color',
    name: 'Màu sắc',
    options: [
      { value: 'white', label: 'Trắng', checked: false },
      { value: 'black', label: 'Đen', checked: false },
      { value: 'blue', label: 'Xanh dương', checked: true },
      { value: 'grey', label: 'Xám', checked: false },
      { value: 'green', label: 'Xanh lá', checked: false },
      { value: 'orange', label: 'Cam', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Danh mục',
    options: [
      { value: 'new-arrivals', label: 'Hàng mới về', checked: false },
      { value: 'sale', label: 'Giảm giá', checked: false },
      { value: 'outdoor', label: 'Dã ngoại', checked: true },
      { value: 'training', label: 'Luyện tập', checked: false },
      { value: 'accessories', label: 'Phụ kiện', checked: false },
    ],
  },
  {
    id: 'size',
    name: 'Kích cỡ',
    options: [
      { value: 's', label: 'Size S', checked: false },
      { value: 'm', label: 'Size M', checked: false },
      { value: 'l', label: 'Size L', checked: false },
      { value: 'xl', label: 'Size XL', checked: false },
      { value: 'xxl', label: 'Size XXL', checked: true },
    ],
  },
]

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ');
}

const ProductUserPage = () => {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  return (
    <div className="bg-brand-bg min-h-screen font-sans">
      <div>
        {/* Mobile filter dialog */}
        <Dialog open={mobileFiltersOpen} onClose={setMobileFiltersOpen} className="relative z-50 lg:hidden">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-brand-primary/45 backdrop-blur-xs transition-opacity duration-300 ease-linear data-closed:opacity-0"
          />

          <div className="fixed inset-0 z-50 flex">
            <DialogPanel
              transition
              className="relative ml-auto flex size-full max-w-xs transform flex-col overflow-y-auto bg-white pt-4 pb-6 shadow-2xl transition duration-300 ease-in-out data-closed:translate-x-full"
            >
              <div className="flex items-center justify-between px-4 border-b border-brand-gray-border pb-3">
                <h2 className="text-lg font-bold text-brand-primary font-display">Bộ Lọc</h2>
                <button
                  type="button"
                  onClick={() => setMobileFiltersOpen(false)}
                  className="relative -mr-2 flex size-10 items-center justify-center rounded-full text-brand-gray-text hover:bg-brand-gray-light hover:text-brand-primary transition-all"
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon aria-hidden="true" className="size-6" />
                </button>
              </div>

              {/* Filters Mobile */}
              <form className="mt-4 px-4">
                <h3 className="text-xs font-bold text-brand-gray-text uppercase tracking-wider mb-3">Loại sản phẩm</h3>
                <ul role="list" className="space-y-2 pb-6 text-sm font-semibold text-brand-primary">
                  {subCategories.map((category) => (
                    <li key={category.name}>
                      <a href={category.href} className="block py-1 hover:text-brand-accent transition-colors">
                        {category.name}
                      </a>
                    </li>
                  ))}
                </ul>

                {filters.map((section) => (
                  <Disclosure key={section.id} as="div" className="border-t border-brand-gray-border py-4">
                    <h3 className="-mx-2 -my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-white px-2 py-3 text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors">
                        <span>{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="size-4 group-data-open:hidden text-brand-gray-text" />
                          <MinusIcon aria-hidden="true" className="size-4 group-not-data-open:hidden text-brand-gray-text" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-4">
                      <div className="space-y-4 pl-1">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center gap-3">
                            <input
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-mobile-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="size-4 rounded border-brand-gray-border text-brand-accent focus:ring-brand-accent accent-brand-accent cursor-pointer"
                            />
                            <label
                              htmlFor={`filter-mobile-${section.id}-${optionIdx}`}
                              className="text-sm font-medium text-brand-gray-text cursor-pointer hover:text-brand-primary"
                            >
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>
            </DialogPanel>
          </div>
        </Dialog>

        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-4 pb-20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-brand-gray-border pb-4 gap-4">
            <BreadcrumbBox />

            <div className="flex items-center gap-4 self-end md:self-auto">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <MenuButton className="group inline-flex justify-center items-center text-xs font-bold uppercase tracking-wider text-brand-gray-text hover:text-brand-primary transition-colors cursor-pointer">
                    Sắp xếp
                    <ChevronDownIcon
                      aria-hidden="true"
                      className="-mr-1 ml-1.5 size-4 text-brand-gray-text group-hover:text-brand-primary"
                    />
                  </MenuButton>
                </div>

                <MenuItems
                  transition
                  className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-xl bg-white shadow-xl ring-1 ring-black/5 focus:outline-hidden transition duration-100 ease-out data-closed:scale-95 data-closed:transform data-closed:opacity-0"
                >
                  <div className="py-1.5 px-1.5 space-y-0.5">
                    {sortOptions.map((option) => (
                      <MenuItem key={option.name}>
                        <a
                          href={option.href}
                          className={classNames(
                            option.current ? 'bg-brand-accent/10 text-brand-accent font-bold' : 'text-brand-primary hover:bg-brand-gray-light',
                            'block px-3 py-2 text-xs font-semibold rounded-lg transition-all',
                          )}
                        >
                          {option.name}
                        </a>
                      </MenuItem>
                    ))}
                  </div>
                </MenuItems>
              </Menu>

              <button type="button" className="p-2 text-brand-gray-text hover:text-brand-primary rounded-full hover:bg-brand-gray-light transition-all cursor-pointer">
                <span className="sr-only">View grid</span>
                <Squares2X2Icon aria-hidden="true" className="size-4.5" />
              </button>

              <button
                type="button"
                onClick={() => setMobileFiltersOpen(true)}
                className="p-2 text-brand-gray-text hover:text-brand-primary rounded-full hover:bg-brand-gray-light transition-all lg:hidden cursor-pointer"
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon aria-hidden="true" className="size-4.5" />
              </button>
            </div>
          </div>

          <section aria-labelledby="products-heading" className="pt-8">
            <h2 id="products-heading" className="sr-only">
              Products
            </h2>

            <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4 items-start">
              {/* Sidebar Filters Desktop */}
              <form className="hidden lg:block space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-brand-gray-text uppercase tracking-widest mb-3">Loại sản phẩm</h3>
                  <ul role="list" className="space-y-2 text-sm font-semibold text-brand-primary">
                    {subCategories.map((category) => (
                      <li key={category.name}>
                        <a href={category.href} className="hover:text-brand-accent transition-colors block py-0.5">
                          {category.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {filters.map((section) => (
                  <Disclosure key={section.id} as="div" className="border-t border-brand-gray-border pt-5">
                    <h3 className="-my-3 flow-root">
                      <DisclosureButton className="group flex w-full items-center justify-between bg-brand-bg py-2 text-sm font-bold text-brand-primary hover:text-brand-accent transition-colors">
                        <span>{section.name}</span>
                        <span className="ml-6 flex items-center">
                          <PlusIcon aria-hidden="true" className="size-4 group-data-open:hidden text-brand-gray-text" />
                          <MinusIcon aria-hidden="true" className="size-4 group-not-data-open:hidden text-brand-gray-text" />
                        </span>
                      </DisclosureButton>
                    </h3>
                    <DisclosurePanel className="pt-4">
                      <div className="space-y-3.5">
                        {section.options.map((option, optionIdx) => (
                          <div key={option.value} className="flex items-center gap-3">
                            <input
                              defaultValue={option.value}
                              defaultChecked={option.checked}
                              id={`filter-${section.id}-${optionIdx}`}
                              name={`${section.id}[]`}
                              type="checkbox"
                              className="size-4 rounded border-brand-gray-border text-brand-accent focus:ring-brand-accent accent-brand-accent cursor-pointer"
                            />
                            <label htmlFor={`filter-${section.id}-${optionIdx}`} className="text-sm font-semibold text-brand-gray-text cursor-pointer hover:text-brand-primary transition-colors">
                              {option.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </DisclosurePanel>
                  </Disclosure>
                ))}
              </form>

              {/* Product grid */}
              <div className="lg:col-span-3">
                <ProductList />
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default ProductUserPage
