"use client";

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Home, BookOpen, ArrowRight } from "lucide-react";
import React from "react";
const PaymentSuccess = () => {
  const [countdown, setCountdown] = useState(5);

  // Đếm ngược thời gian
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Chi tiết đơn hàng - trong thực tế sẽ được lấy từ API
  const orderDetails = {
    orderId:
      "ORD" +
      Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, "0"),
    plan: "Premium",
    price: 99000,
    billingCycle: "Hàng tháng",
    paymentMethod: "Thẻ tín dụng ****1234",
    nextBillingDate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("vi-VN"),
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-500 text-white p-6 text-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Thanh toán thành công!</h1>
            <p className="text-xl">Cảm ơn bạn đã đăng ký gói Premium</p>
          </div>

          <div className="p-8">
            <div className="border border-green-100 rounded-lg bg-green-50 p-4 mb-8">
              <p className="text-green-800">
                Thanh toán của bạn đã được xử lý thành công. Một email xác nhận
                đã được gửi đến địa chỉ email của bạn kèm theo chi tiết đơn
                hàng.
              </p>
            </div>

            <h2 className="text-xl font-semibold mb-4">Chi tiết đơn hàng</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              <div>
                <dt className="text-sm text-gray-600 mb-1">Mã đơn hàng</dt>
                <dd className="font-medium">{orderDetails.orderId}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 mb-1">Gói đăng ký</dt>
                <dd className="font-medium">{orderDetails.plan}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 mb-1">Giá</dt>
                <dd className="font-medium">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                    maximumFractionDigits: 0,
                  }).format(orderDetails.price)}{" "}
                  / {orderDetails.billingCycle}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 mb-1">
                  Phương thức thanh toán
                </dt>
                <dd className="font-medium">{orderDetails.paymentMethod}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 mb-1">Ngày thanh toán</dt>
                <dd className="font-medium">
                  {new Date().toLocaleDateString("vi-VN")}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600 mb-1">
                  Ngày thanh toán tiếp theo
                </dt>
                <dd className="font-medium">{orderDetails.nextBillingDate}</dd>
              </div>
            </dl>

            <h2 className="text-xl font-semibold mb-4">Tiếp theo?</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                  <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs font-bold">
                    1
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">Khám phá các đề thi cao cấp</h3>
                  <p className="text-gray-600 text-sm">
                    Với tư cách thành viên Premium, bạn có quyền truy cập vào
                    tất cả đề thi cao cấp của chúng tôi.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                  <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs font-bold">
                    2
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">
                    Cá nhân hóa trải nghiệm học tập
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Sử dụng tính năng gợi ý thông minh để tìm kiếm nội dung phù
                    hợp với nhu cầu học tập của bạn.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-3 mt-0.5">
                  <span className="flex items-center justify-center w-5 h-5 bg-blue-600 text-white rounded-full text-xs font-bold">
                    3
                  </span>
                </div>
                <div>
                  <h3 className="font-medium">
                    Tận dụng tính năng giải thích chi tiết
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Xem giải thích chi tiết cho mọi câu hỏi để hiểu sâu hơn và
                    cải thiện kiến thức của bạn.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/"
                className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <Home className="mr-2 h-5 w-5" />
                Về trang chủ {countdown > 0 && `(${countdown})`}
              </Link>
              <Link
                to="/quiz?premium=true"
                className="flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-md hover:bg-blue-50 transition-colors"
              >
                <BookOpen className="mr-2 h-5 w-5" />
                Khám phá đề thi cao cấp
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-600 text-sm">
          <p>
            Có vấn đề cần hỗ trợ?{" "}
            <Link to="/contact" className="text-blue-600 hover:underline">
              Liên hệ với chúng tôi
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
