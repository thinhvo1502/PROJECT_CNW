import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Loader, CheckCircle } from "lucide-react";
import React from "react";
const Logout = () => {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"confirming" | "processing" | "success">(
    "confirming"
  );
  const [countdown, setCountdown] = useState(3);
  // xử lý đăng xuất
  const handleLogout = () => {
    setStatus("processing");
    // Giả lập quá trình đăng xuất (trong thực tế sẽ gọi API)
    setTimeout(() => {
      // Xóa token, cookie, session storage, etc.
      localStorage.removeItem("auth_token");
      sessionStorage.removeItem("user_data");

      // Cập nhật trạng thái
      setStatus("success");

      // Bắt đầu đếm ngược để chuyển hướng
      startCountdown();
    }, 1500);
  };
  // xử lý hủy đăng xuất
  const handleCancel = () => {
    navigate(-1);
  };
  // đếm ngược và chuyển hướng
  const startCountdown = () => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  useEffect(() => {
    if (status === "success" && countdown === 0) {
      navigate("/login");
    }
  }, [status, countdown, navigate]);
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        {status === "confirming" && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
              <LogOut className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Đăng xuất</h1>
            <p className="text-gray-600 mb-8">
              Bạn có chắc chắn muốn đăng xuất khỏi tài khoản? Bạn sẽ cần đăng
              nhập lại để tiếp tục sử dụng dịch vụ.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Đăng xuất
              </button>
            </div>
          </>
        )}

        {status === "processing" && (
          <>
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <Loader className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Đang đăng xuất</h1>
            <p className="text-gray-600 mb-4">Vui lòng đợi trong giây lát...</p>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse"></div>
            </div>
          </>
        )}

        {status === "success" && (
          <>
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Đăng xuất thành công</h1>
            <p className="text-gray-600 mb-6">
              Bạn đã đăng xuất thành công. Đang chuyển hướng đến trang đăng nhập
              trong {countdown} giây...
            </p>
            <button
              onClick={() => navigate("/login")}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Đăng nhập lại
            </button>
          </>
        )}
      </div>
    </div>
  );
};
export default Logout;
