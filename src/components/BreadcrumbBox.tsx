import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { getAllCategory, getCategoryById } from '../services/CategoryService';
import { Category } from '../models/Category';
import { MdNavigateNext } from "react-icons/md";
interface BreadcrumbBoxProps {
  categoryId?: number;
}

const BreadcrumbBox: React.FC<BreadcrumbBoxProps> = ({ categoryId }) => {
  const [categoriesMap, setCategoriesMap] = useState<Map<number, string>>(new Map());
  const [breadcrumbs, setBreadcrumbs] = useState<{ id: number; name: string }[]>([]);

  // 1. Fetch all categories on mount to build id -> name map
  useEffect(() => {
    const fetchAll = async () => {
      const res = await getAllCategory();
      if (res && res.code === 1000) {
        const map = new Map<number, string>();
        res.result.forEach((cat) => {
          if (cat.id !== undefined) {
            map.set(cat.id, cat.name);
          }
        });
        setCategoriesMap(map);
      }
    };
    fetchAll();
  }, []);

  // 2. Fetch specific category details when categoryId changes to parse the full hierarchy path
  useEffect(() => {
    if (!categoryId || categoriesMap.size === 0) {
      setBreadcrumbs([]);
      return;
    }

    const fetchCategoryPath = async () => {
      const res = await getCategoryById(categoryId);
      if (res && res.code === 1000 && res.result.path) {
        const pathStr = res.result.path; // e.g. "/46/48/50"
        const ids = pathStr
          .split('/')
          .filter((x) => x.trim() !== '')
          .map(Number);

        const list = ids.map((id) => ({
          id,
          name: categoriesMap.get(id) || `Danh mục ${id}`,
        }));
        setBreadcrumbs(list);
      } else {
        // Fallback: if path is missing, just show the current category
        const currentName = categoriesMap.get(categoryId) || `Danh mục ${categoryId}`;
        setBreadcrumbs([{ id: categoryId, name: currentName }]);
      }
    };

    fetchCategoryPath();
  }, [categoryId, categoriesMap]);

  return (
    <div className="mb-6">
      <ul className="flex items-center text-sm font-medium">
        <li className="flex items-center">
          <Link to="/" className="text-gray-600 hover:text-gray-900 transition-colors">
            TRANG CHỦ
          </Link>
          <MdNavigateNext />
          <i className="fas fa-chevron-right mx-2 text-gray-400 text-xs"></i>
        </li>
        {categoryId ? (
          <>
            <li className="flex items-center">
              <Link to="/product" className="text-gray-600 hover:text-gray-900 transition-colors">
                MÔN THỂ THAO
              </Link>
              <MdNavigateNext />
              <i className="fas fa-chevron-right mx-2 text-gray-400 text-xs"></i>
            </li>
            {breadcrumbs.map((crumb, index) => (
              <li key={crumb.id} className="flex items-center">
                {index === breadcrumbs.length - 1 ? (
                  <span className="text-gray-900 font-semibold uppercase">{crumb.name}</span>
                ) : (
                  <>
                    <Link
                      to={`/product?category=${crumb.id}`}
                      className="text-gray-600 hover:text-gray-900 transition-colors uppercase"
                    >
                      {crumb.name}
                    </Link>
                    <MdNavigateNext />
                    <i className="fas fa-chevron-right mx-2 text-gray-400 text-xs"></i>
                  </>
                )}
              </li>
            ))}
          </>
        ) : (
          <li className="flex items-center">
            <span className="text-gray-900 font-semibold">TẤT CẢ SẢN PHẨM</span>
          </li>
        )}
      </ul>
    </div>
  );
};

export default BreadcrumbBox;