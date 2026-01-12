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

  //render -> userEffect: trách lỗi
  useEffect(() => {
    //   fetchListUsers()
    fetchListUsersWithPaginate(1);
  }, []);
  //gọi api cập nhật lại giao diện
  const fetchListUsersWithPaginate = async (page: number) => {
    let res = await getUserWithPaginate(page, LIMIT_USER);
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
          ADD USER
        </button>
        <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white custom-bg-1 cursor-pointer ">
          FITTER USER
        </button>
      </div>
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
