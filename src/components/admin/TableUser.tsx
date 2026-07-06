import { FaRegEdit } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import { User } from "../../models/User";
import ReactPaginate from "react-paginate";
interface TableUserProps {
  listUser: User[];
  handleClickBtnUpdate: (user: User) => void;
  handleClickBtnDelete: (user: User) => void;
  fetchListUsersWithPaginate: (page: number) => void;
  pageCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}
const TableUser = ({
  listUser,
  handleClickBtnUpdate,
  handleClickBtnDelete,
  fetchListUsersWithPaginate,
  pageCount,
  currentPage,
  setCurrentPage,
}: TableUserProps) => {
  const handlePageClick = (event: { selected: number }) => {
    fetchListUsersWithPaginate(+event.selected + 1);
    setCurrentPage(+event.selected + 1);
  };
  const renderStatusBadge = (disabled: boolean | string | undefined) => {
    // If it is strictly "yes", or true, it means blocked. Otherwise active.
    const isDisabled = disabled === true || disabled === "yes" || disabled === "true";
    
    if (isDisabled) {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wider">
          Đã Khóa
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
        Hoạt Động
      </span>
    );
  };

  const renderRoleBadge = (role: string) => {
    const isAdmin = role === "ADMIN";
    const bgClass = isAdmin ? "bg-indigo-50 text-indigo-700 border-indigo-200" : "bg-zinc-100 text-zinc-700 border-zinc-200";
    return (
      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${bgClass}`}>
        {role}
      </span>
    );
  };

  return (
    <div className="overflow-hidden border border-zinc-200 rounded-2xl bg-white shadow-xs mt-6">
      <table className="min-w-full divide-y divide-zinc-200 text-left">
        <thead className="bg-zinc-50/80 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
          <tr>
            <th className="px-6 py-4">Thành viên (Email)</th>
            <th className="px-6 py-4">Họ và tên</th>
            <th className="px-6 py-4">Số điện thoại</th>
            <th className="px-6 py-4 text-center">Vai trò</th>
            <th className="px-6 py-4 text-center">Trạng thái</th>
            <th className="px-6 py-4 text-right">Thao tác</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 bg-white">
          {listUser.map((user, index) => (
            <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors">
              <td className="whitespace-nowrap px-6 py-4 text-sm font-bold text-zinc-800">
                {user.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-zinc-600">
                {user.fullName || "—"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-zinc-500">
                {user.phone || "—"}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-center">
                {renderRoleBadge(user.role)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-center">
                {renderStatusBadge(user.disabled)}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-right font-medium space-x-1.5">
                <button
                  className="text-blue-600 hover:text-blue-800 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                  onClick={() => handleClickBtnUpdate(user)}
                  title="Sửa thông tin"
                >
                  <FaRegEdit className="text-base" />
                </button>
                <button
                  className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 border border-red-200 p-2 rounded-xl transition-all cursor-pointer inline-flex items-center justify-center active:scale-95"
                  onClick={() => handleClickBtnDelete(user)}
                  title="Xóa thành viên"
                >
                  <IoTrashBinOutline className="text-base" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="user-pagination px-6 py-4 border-t border-zinc-100">
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          previousLabel="<"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          forcePage={currentPage - 1}
          containerClassName="flex justify-end items-center gap-2 cursor-pointer"
          pageClassName=""
          pageLinkClassName="px-4 py-2 text-sm font-semibold text-zinc-600 rounded-lg bg-zinc-50 hover:bg-zinc-200 transition-colors"
          previousClassName=""
          previousLinkClassName="px-4 py-2 text-sm font-semibold text-zinc-600 rounded-lg bg-zinc-50 hover:bg-zinc-200 transition-colors"
          nextClassName=""
          nextLinkClassName="px-4 py-2 text-sm font-semibold text-zinc-600 rounded-lg bg-zinc-50 hover:bg-zinc-200 transition-colors"
          activeClassName="text-brand-primary font-bold bg-brand-primary/10 rounded-lg"
        />
      </div>
    </div>
  );
};
export default TableUser;
