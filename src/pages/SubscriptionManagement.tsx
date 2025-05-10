import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Calendar,
  Download,
  FileText,
  Clock,
  ArrowUpCircle,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Info,
  X,
} from "lucide-react";
import React from "react";
const SubscriptionManagement = () => {
  // state cho modal xac nhan huy dang ky
  const [showCancelModal, setShowCancelModal] = useState(false);
  // state cho lịch sử thanh toán
  const [showBillingHistory, setShowBillingHistory] = useState(false);
  // State cho thông báo
  const [notification, setNotification] = useState<{
    show: boolean;
    type: "success" | "error" | "info";
    message: string;
  }>({
    show: false,
    type: "info",
    message: "",
  });
  // Dữ liệu mẫu cho thông tin đăng ký
  const subscriptionData = {
    plan: "Premium",
    status: "active",
    startDate: "15/05/2023",
    nextBillingDate: "15/06/2023",
    amount: 99000,
    paymentMethod: "Thẻ tín dụng ****1234",
    autoRenew: true,
    features: [
      "Truy cập tất cả đề thi cao cấp",
      "Gợi ý thông minh cá nhân hóa",
      "Xem giải thích chi tiết",
      "Không hiển thị quảng cáo",
    ],
  };

  // Dữ liệu mẫu cho lịch sử thanh toán
  const billingHistory = [
    {
      id: 1,
      date: "15/05/2023",
      amount: 99000,
      status: "success",
      invoice: "INV-001",
    },
    {
      id: 2,
      date: "15/04/2023",
      amount: 99000,
      status: "success",
      invoice: "INV-002",
    },
    {
      id: 3,
      date: "15/03/2023",
      amount: 99000,
      status: "success",
      invoice: "INV-003",
    },
    {
      id: 4,
      date: "15/02/2023",
      amount: 99000,
      status: "success",
      invoice: "INV-004",
    },
  ];
  // xử lý nút nâng cấp gói
  const handleUpgrade = () => {
    window.location.href = "/pricing";
  };
  // xử lý cập nhật phương thức thanh toán
  const handleUpdatePayment = () => {
    setNotification({
      show: true,
      type: "info",
      message: "Tính năng cập nhật phương thức thanh toán sẽ sớm d",
    });
    setTimeout(() => {
      setNotification({ show: false, type: "info", message: "" });
    }, 3000);
  };
  // xử lý hủy đăng ký
  const handleCancelSubscription = () => {
    setShowCancelModal(false);
    setNotification({
      show: true,
      type: "success",
      message:
        "Đăng ký của bạn đã được hủy. Bạn vẫn có thể sử dụng dịch vụ cho đến ngày 15/06/2023.",
    });
    setTimeout(() => {
      setNotification({ show: false, type: "success", message: "" });
    }, 5000);
  };
  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/profile"
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Quay lại hồ sơ cá nhân</span>
            </Link>
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Quản lý đăng ký</h1>
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-yellow-500 mr-2" />
                <span className="font-medium">Thành viên Premium</span>
              </div>
            </div>
          </div>
          {/* Notification */}
          {notification.show && (
            <div
              className={`mb-6 p-4 rounded-md flex items-start ${
                notification.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : notification.type === "error"
                  ? "bg-red-50 border border-red-200"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              {notification.type === "success" ? (
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
              ) : notification.type === "error" ? (
                <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              ) : (
                <Info className="h-5 w-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p
                  className={
                    notification.type === "success"
                      ? "text-green-800"
                      : notification.type === "error"
                      ? "text-red-800"
                      : "text-blue-800"
                  }
                >
                  {notification.message}
                </p>
              </div>
              <button
                onClick={() =>
                  setNotification((prev) => ({ ...prev, show: false }))
                }
                className="ml-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          {/* Subscription details */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="bg-blue-600 text-white p-6">
              <h2 className="text-xl font-semibold mb-2">Thông tin đăng ký</h2>
              <p className="text-blue-100">
                Bạn đang sử dụng gói{" "}
                <span className="font-bold">{subscriptionData.plan}</span>
              </p>
            </div>

            <div className="p-6">
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <dt className="text-sm text-gray-600 mb-1">Trạng thái</dt>
                  <dd className="font-medium flex items-center">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Đang hoạt động
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 mb-1">Ngày bắt đầu</dt>
                  <dd className="font-medium">{subscriptionData.startDate}</dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 mb-1">
                    Chu kỳ thanh toán
                  </dt>
                  <dd className="font-medium">
                    {formatPrice(subscriptionData.amount)} / tháng
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 mb-1">
                    Ngày thanh toán tiếp theo
                  </dt>
                  <dd className="font-medium">
                    {subscriptionData.nextBillingDate}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 mb-1">
                    Phương thức thanh toán
                  </dt>
                  <dd className="font-medium flex items-center">
                    <CreditCard className="h-4 w-4 text-gray-500 mr-2" />
                    {subscriptionData.paymentMethod}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm text-gray-600 mb-1">
                    Tự động gia hạn
                  </dt>
                  <dd className="font-medium">
                    {subscriptionData.autoRenew ? "Bật" : "Tắt"}
                  </dd>
                </div>
              </dl>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="font-medium mb-4">Quyền lợi của bạn:</h3>
                <ul className="space-y-2">
                  {subscriptionData.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={handleUpgrade}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <ArrowUpCircle className="h-5 w-5 mr-2" />
                  Nâng cấp gói
                </button>
                <button
                  onClick={handleUpdatePayment}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <CreditCard className="h-5 w-5 mr-2 text-gray-600" />
                  Cập nhật thanh toán
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  <X className="h-5 w-5 mr-2 text-gray-600" />
                  Hủy đăng ký
                </button>
              </div>
            </div>

            {/* Billing history */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <button
                  onClick={() => setShowBillingHistory(!showBillingHistory)}
                  className="flex items-center justify-between w-full text-left font-semibold"
                >
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <span>Lịch sử thanh toán</span>
                  </div>
                  <svg
                    className={`h-5 w-5 text-gray-500 transform transition-transform ${
                      showBillingHistory ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
              {showBillingHistory && (
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Ngày
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Số tiền
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Trạng thái
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Hóa đơn
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {billingHistory.map((item) => (
                          <tr key={item.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {item.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatPrice(item.amount)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  item.status === "success"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {item.status === "success"
                                  ? "Thành công"
                                  : "Thất bại"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              <button className="text-blue-600 hover:text-blue-800 flex items-center">
                                <Download className="h-4 w-4 mr-1" />
                                {item.invoice}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Cancel subscription modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-bold">Xác nhận hủy đăng ký</h3>
            </div>

            <p className="mb-4 text-gray-600">
              Bạn có chắc chắn muốn hủy đăng ký gói {subscriptionData.plan} của
              mình? Sau khi hủy:
            </p>

            <ul className="mb-6 space-y-2 text-sm text-gray-600">
              <li className="flex items-start">
                <Clock className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  Bạn vẫn có thể sử dụng tất cả tính năng cao cấp cho đến{" "}
                  {subscriptionData.nextBillingDate}
                </span>
              </li>
              <li className="flex items-start">
                <FileText className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>
                  Sau thời gian này, tài khoản của bạn sẽ được chuyển về gói Cơ
                  bản
                </span>
              </li>
              <li className="flex items-start">
                <Info className="h-4 w-4 text-gray-500 mt-0.5 mr-2 flex-shrink-0" />
                <span>Bạn có thể đăng ký lại bất kỳ lúc nào</span>
              </li>
            </ul>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Giữ đăng ký của tôi
              </button>
              <button
                onClick={handleCancelSubscription}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Hủy đăng ký
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default SubscriptionManagement;
