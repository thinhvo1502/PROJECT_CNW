import React from "react";

const ManageQuestions = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Quản lý Câu hỏi</h1>
      <div className="flex gap-4 mb-6">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Thêm Câu hỏi
        </button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">
          Sửa Câu hỏi
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          Xóa Câu hỏi
        </button>
      </div>
      <table className="w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 text-left">ID</th>
            <th className="p-3 text-left">Nội dung</th>
            <th className="p-3 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="p-3">1</td>
            <td className="p-3">Câu hỏi mẫu</td>
            <td className="p-3">
              <button className="text-blue-500 hover:underline">Sửa</button>
              <button className="text-red-500 hover:underline ml-4">Xóa</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ManageQuestions;