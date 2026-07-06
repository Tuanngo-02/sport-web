import React, { useEffect, useState } from "react";
import ModelCreateUser from "../../components/admin/ModelCreateUser";
import { FaRegEdit } from "react-icons/fa";
import { IoTrashBinOutline } from "react-icons/io5";
import TableUser from "../../components/admin/TableUser";
import { getUserWithPaginate } from "../../services/UserService";
import { User } from "../../models/User";
import ModalUpdateUser from "../../components/admin/ModalUpdateUser";
import ModalDeleteUser from "../../components/admin/ModalDeleteUser";
const Member = () => {
  const LIMIT_USER = 5;
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModalCreateUser, setShowModalCreateUser] = useState(false);
  const [showModalUpdateUser, setShowModalUpdateUser] = useState(false);
  const [dataUpdate, setDataUpdate] = useState<User | null>(null);
  const [showModalDeleteUser, setShowModalDeleteUser] = useState(false);
  const [dataDelete, setDataDelete] = useState<User | null>(null);

  const [listUsers, setListUsers] = useState<User[]>([]);
  const [showFilter, setShowFilter] = useState(false);
  const [searchFullName, setSearchFullName] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [searchRole, setSearchRole] = useState("");

  //render -> userEffect: trách lỗi
  useEffect(() => {
    //   fetchListUsers()
    fetchListUsersWithPaginate(1);
  }, []);
  //gọi api cập nhật lại giao diện
  const fetchListUsersWithPaginate = async (page: number) => {
    let res = await getUserWithPaginate(
      page,
      LIMIT_USER,
      searchRole || undefined,
      searchEmail || undefined,
      searchFullName || undefined
    );
    if (res.code === 1000) {
      setListUsers(res.result.data);
      setPageCount(res.result.totalPage);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchListUsersWithPaginate(1);
  };

  const handleClear = async () => {
    setSearchFullName("");
    setSearchEmail("");
    setSearchRole("");
    setCurrentPage(1);

    // Tải lại toàn bộ dữ liệu khi xóa bộ lọc
    let res = await getUserWithPaginate(1, LIMIT_USER);
    if (res.code === 1000) {
      setListUsers(res.result.data);
      setPageCount(res.result.totalPage);
    }
  };

  const handleClickBtnUpdate = (user: User) => {
    setDataUpdate(user);
    setShowModalUpdateUser(true);
  };

  const handleClickBtnDelete = (user: User) => {
    setShowModalDeleteUser(true);
    setDataDelete(user);
  };
  const resetUpdateData = () => {
    setDataUpdate(null);
  };
  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Users</h1>
      </div>
      <div className="sm:flex sm:items-center justify-between mt-3">
        <button
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gray-800 cursor-pointer hover:bg-gray-900 "
          onClick={() => setShowModalCreateUser(true)}
        >
          THÊM NGƯỜI DÙNG
        </button>
        <button
          className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white cursor-pointer transition-colors ${showFilter
              ? "bg-gray-600 hover:bg-gray-700"
              : "bg-gray-800 hover:bg-gray-900"
            }`}
          onClick={() => setShowFilter(!showFilter)}
        >
          {showFilter ? "ẨN BỘ LỌC" : "BỘ LỌC"}
        </button>
      </div>

      {showFilter && (
        <div className="bg-white p-4 rounded-xl border border-gray-200 mt-4 grid grid-cols-1 sm:grid-cols-4 gap-4 items-end shadow-xs">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Họ và tên
            </label>
            <input
              type="text"
              value={searchFullName}
              onChange={(e) => setSearchFullName(e.target.value)}
              placeholder="Nhập tên..."
              className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:border-gray-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Email
            </label>
            <input
              type="text"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              placeholder="Nhập email..."
              className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:border-gray-800 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
              Vai trò (Role)
            </label>
            <select
              value={searchRole}
              onChange={(e) => setSearchRole(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-lg px-3 text-sm focus:border-gray-800 focus:outline-none bg-white"
            >
              <option value="">Tất cả</option>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
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
      <ModelCreateUser
        show={showModalCreateUser}
        setShow={setShowModalCreateUser}
        fetchListUsersWithPaginate={fetchListUsersWithPaginate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <ModalUpdateUser
        show={showModalUpdateUser}
        setShow={setShowModalUpdateUser}
        fetchListUsersWithPaginate={fetchListUsersWithPaginate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        dataUpdate={dataUpdate}
        resetUpdateData={resetUpdateData}
      />
      <ModalDeleteUser
        show={showModalDeleteUser}
        setShow={setShowModalDeleteUser}
        dataDelete={dataDelete}
        fetchListUsersWithPaginate={fetchListUsersWithPaginate}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
      <div className="mt-8 flow-root">
        <div className="-my-2 overflow-x-auto">
          <div className="inline-block min-w-full py-2 align-middle">
            {/* <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Role</th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {users.map((user) => (
                  <tr key={user.email}>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.title}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.email}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">{user.role}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium space-x-2">
                      <button className="text-blue-500 bg-white p-2 rounded hover:bg-gray-100">
                        <FaRegEdit />
                      </button>
                      <button className="text-red-500 bg-white p-2 rounded hover:bg-gray-100">
                        <IoTrashBinOutline />
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
            <TableUser
              listUser={listUsers}
              handleClickBtnUpdate={handleClickBtnUpdate}
              handleClickBtnDelete={handleClickBtnDelete}
              fetchListUsersWithPaginate={fetchListUsersWithPaginate}
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

export default Member;
