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
  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200 border border-gray-300 rounded-md">
        <thead>
          <tr className="text-md font-semibold text-black">
            <th className="px-6 py-3 text-left ">Email</th>
            <th className="px-6 py-3 text-left">FullName</th>
            <th className="px-6 py-3 text-left">Phone</th>
            <th className="px-6 py-3 text-left">Role</th>
            <th className="px-6 py-3 text-left">Disabled</th>
            <th className="px-6 py-3 text-left">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {listUser.map((user, index) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                {user.email}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {user.fullName}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {user.phone}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                {user.role}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                yes
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-sm font-medium space-x-2">
                <button
                  className="text-blue-500 bg-white p-2 rounded hover:bg-gray-100"
                  onClick={() => handleClickBtnUpdate(user)}
                >
                  <FaRegEdit />
                </button>
                <button
                  className="text-red-500 bg-white p-2 rounded hover:bg-gray-100"
                  onClick={() => handleClickBtnDelete(user)}
                >
                  <IoTrashBinOutline />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="user-pagination">
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          previousLabel="<"
          onPageChange={handlePageClick}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          renderOnZeroPageCount={null}
          forcePage={currentPage - 1}
          containerClassName="flex justify-end items-center gap-2 mt-9 cursor-pointer"
          pageClassName=""
          pageLinkClassName="px-5 py-3 rounded bg-gray-100 hover:bg-gray-300 transition-colors"
          previousClassName=""
          previousLinkClassName="px-5 py-3 rounded bg-gray-100 hover:bg-gray-300 transition-colors"
          nextClassName=""
          nextLinkClassName="px-5 py-3 rounded bg-gray-100 hover:bg-gray-300 transition-colors"
          activeClassName="text-red-500 font-bold "
        />
      </div>
    </div>
  );
};
export default TableUser;
