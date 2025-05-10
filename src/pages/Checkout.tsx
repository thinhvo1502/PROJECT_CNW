"use client";
import { useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import {
  CreditCard,
  Shield,
  CheckCircle,
  ArrowLeft,
  Lock,
  AlertCircle,
  Info,
  X,
} from "lucide-react";
import React from "react";
// Định nghĩa kiểu dữ liệu cho form thanh toán
interface PaymentForm {
  cardNumber: string;
  cardholderName: string;
  expiryDate: string;
  cvv: string;
  saveCard: boolean;
}

// Định nghĩa kiểu dữ liệu cho thông tin thanh toán
interface PlanInfo {
  name: string;
  price: number;
  billingCycle: "monthly" | "yearly";
  features: string[];
}

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const planParam = queryParams.get("plan") || "premium";
  const cycleParam = (queryParams.get("cycle") || "monthly") as
    | "monthly"
    | "yearly";

  // State cho form thanh toán
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    cardNumber: "",
    cardholderName: "",
    expiryDate: "",
    cvv: "",
    saveCard: false,
  });

  // State cho lỗi validation
  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof PaymentForm, string>>
  >({});

  // State cho trạng thái thanh toán
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  // State cho thông báo lỗi
  const [errorMessage, setErrorMessage] = useState("");

  // State cho việc hiển thị/ ẩn thông tin CVV
  const [showCvvInfo, setShowCvvInfo] = useState(false);

  // State cho thông tin gói đăng ký
  const [planInfo, setPlanInfo] = useState<PlanInfo>({
    name: "",
    price: 0,
    billingCycle: cycleParam,
    features: [],
  });

  // Dữ liệu các gói
  const plans = {
    premium: {
      name: "Premium",
      price: { monthly: 99000, yearly: 948000 },
      features: [
        "Truy cập tất cả đề thi cơ bản và cao cấp",
        "Gợi ý thông minh cá nhân hóa",
        "Xem giải thích chi tiết",
        "Không hiển thị quảng cáo",
      ],
    },
    pro: {
      name: "Pro",
      price: { monthly: 199000, yearly: 1908000 },
      features: [
        "Tất cả tính năng của gói Premium",
        "Tải xuống đề thi offline",
        "Ưu tiên hỗ trợ 24/7",
        "Cập nhật đề thi mới nhất và độc quyền",
      ],
    },
  };

  // Khởi tạo thông tin gói đăng ký
  useEffect(() => {
    const selectedPlan = planParam === "pro" ? plans.pro : plans.premium;
    setPlanInfo({
      name: selectedPlan.name,
      price: selectedPlan.price[cycleParam],
      billingCycle: cycleParam,
      features: selectedPlan.features,
    });
  }, [planParam, cycleParam]);

  // Format số thẻ tín dụng
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts: string[] = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  // Format ngày hết hạn
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");

    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }

    return value;
  };

  // Xử lý thay đổi giá trị input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    // Clear error when user starts typing
    if (formErrors[name as keyof PaymentForm]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (name === "cardNumber") {
      setPaymentForm((prev) => ({ ...prev, [name]: formatCardNumber(value) }));
    } else if (name === "expiryDate") {
      setPaymentForm((prev) => ({ ...prev, [name]: formatExpiryDate(value) }));
    } else if (type === "checkbox") {
      setPaymentForm((prev) => ({ ...prev, [name]: checked }));
    } else {
      setPaymentForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate form
  const validateForm = () => {
    const errors: Partial<Record<keyof PaymentForm, string>> = {};

    if (!paymentForm.cardNumber.replace(/\s/g, "").match(/^\d{16}$/)) {
      errors.cardNumber = "Vui lòng nhập số thẻ 16 chữ số hợp lệ";
    }

    if (!paymentForm.cardholderName.trim()) {
      errors.cardholderName = "Vui lòng nhập tên chủ thẻ";
    }

    if (!paymentForm.expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      errors.expiryDate = "Vui lòng nhập ngày hết hạn theo định dạng MM/YY";
    } else {
      // Check if card is expired
      const [month, year] = paymentForm.expiryDate.split("/");
      const expiryDate = new Date(
        2000 + Number.parseInt(year),
        Number.parseInt(month) - 1,
        1
      );
      const today = new Date();

      if (expiryDate < today) {
        errors.expiryDate = "Thẻ đã hết hạn";
      }
    }

    if (!paymentForm.cvv.match(/^\d{3,4}$/)) {
      errors.cvv = "CVV phải có 3 hoặc 4 chữ số";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Simulate payment processing
    setPaymentStatus("processing");

    // Simulate API call
    setTimeout(() => {
      // Random success/failure (80% success rate for demo)
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        setPaymentStatus("success");
        // Redirect to success page after a delay
        setTimeout(() => {
          navigate("/payment-success");
        }, 2000);
      } else {
        setPaymentStatus("error");
        setErrorMessage(
          "Giao dịch bị từ chối. Vui lòng kiểm tra thông tin thẻ hoặc liên hệ với ngân hàng của bạn."
        );
      }
    }, 2000);
  };

  // Format giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Xử lý đóng thông báo lỗi
  const handleCloseError = () => {
    setPaymentStatus("idle");
    setErrorMessage("");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Link
              to="/pricing"
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span>Quay lại trang bảng giá</span>
            </Link>
            <h1 className="text-3xl font-bold">Thanh toán</h1>
            <p className="text-gray-600">
              Hoàn tất đăng ký gói {planInfo.name} của bạn
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Payment Form */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-6 flex items-center">
                  <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                  Thông tin thanh toán
                </h2>

                {paymentStatus === "success" ? (
                  <div className="py-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      Thanh toán thành công
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Cảm ơn bạn đã đăng ký. Đang chuyển hướng...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    {paymentStatus === "error" && (
                      <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="text-red-800">{errorMessage}</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleCloseError}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>
                    )}

                    <div className="mb-4">
                      <label
                        htmlFor="cardNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Số thẻ
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="cardNumber"
                          name="cardNumber"
                          value={paymentForm.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.cardNumber
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300"
                          }`}
                          disabled={paymentStatus === "processing"}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <img
                            src="/placeholder.svg?height=24&width=36"
                            alt="Card types"
                            className="h-6"
                          />
                        </div>
                      </div>
                      {formErrors.cardNumber && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.cardNumber}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="cardholderName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Tên chủ thẻ
                      </label>
                      <input
                        type="text"
                        id="cardholderName"
                        name="cardholderName"
                        value={paymentForm.cardholderName}
                        onChange={handleInputChange}
                        placeholder="Nguyễn Văn A"
                        className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                          formErrors.cardholderName
                            ? "border-red-500 bg-red-50"
                            : "border-gray-300"
                        }`}
                        disabled={paymentStatus === "processing"}
                      />
                      {formErrors.cardholderName && (
                        <p className="mt-1 text-sm text-red-600">
                          {formErrors.cardholderName}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label
                          htmlFor="expiryDate"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          Ngày hết hạn
                        </label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={paymentForm.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.expiryDate
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300"
                          }`}
                          disabled={paymentStatus === "processing"}
                        />
                        {formErrors.expiryDate && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.expiryDate}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="cvv"
                          className="block text-sm font-medium text-gray-700 mb-1"
                        >
                          <div className="flex items-center">
                            <span>Mã bảo mật (CVV)</span>
                            <button
                              type="button"
                              onClick={() => setShowCvvInfo(!showCvvInfo)}
                              className="ml-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                            >
                              <Info className="h-4 w-4" />
                            </button>
                          </div>
                        </label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={paymentForm.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={4}
                          className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                            formErrors.cvv
                              ? "border-red-500 bg-red-50"
                              : "border-gray-300"
                          }`}
                          disabled={paymentStatus === "processing"}
                        />
                        {formErrors.cvv && (
                          <p className="mt-1 text-sm text-red-600">
                            {formErrors.cvv}
                          </p>
                        )}
                      </div>
                    </div>

                    {showCvvInfo && (
                      <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
                        <p>
                          Mã CVV là 3 hoặc 4 chữ số được in ở mặt sau của thẻ
                          tín dụng, thường nằm ở bên phải của chữ ký.
                        </p>
                      </div>
                    )}

                    <div className="flex items-center mb-6">
                      <input
                        type="checkbox"
                        id="saveCard"
                        name="saveCard"
                        checked={paymentForm.saveCard}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        disabled={paymentStatus === "processing"}
                      />
                      <label
                        htmlFor="saveCard"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Lưu thông tin thẻ cho lần thanh toán sau
                      </label>
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                      <button
                        type="submit"
                        disabled={paymentStatus === "processing"}
                        className={`w-full py-3 px-4 rounded-md text-white font-medium flex items-center justify-center ${
                          paymentStatus === "processing"
                            ? "bg-blue-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {paymentStatus === "processing" ? (
                          <>
                            <svg
                              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Đang xử lý...
                          </>
                        ) : (
                          <>Thanh toán {formatPrice(planInfo.price)}</>
                        )}
                      </button>

                      <div className="flex items-center justify-center mt-4 text-xs text-gray-500">
                        <Lock className="h-3 w-3 mr-1" />
                        <span>Thanh toán an toàn và bảo mật</span>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Order summary */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>

                <div className="mb-4">
                  <div className="flex justify-between font-medium mb-2">
                    <span>Gói {planInfo.name}</span>
                    <span>{formatPrice(planInfo.price)}</span>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Thanh toán{" "}
                    {planInfo.billingCycle === "monthly"
                      ? "hàng tháng"
                      : "hàng năm"}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4 mb-4">
                  <div className="flex justify-between font-medium mb-1">
                    <span>Tổng cộng</span>
                    <span>{formatPrice(planInfo.price)}</span>
                  </div>
                  {planInfo.billingCycle === "yearly" && (
                    <div className="text-sm text-green-600">
                      Tiết kiệm 20% so với thanh toán hàng tháng
                    </div>
                  )}
                </div>

                <div className="rounded-md bg-gray-50 p-4 mb-4">
                  <h3 className="font-medium mb-2">Bao gồm:</h3>
                  <ul className="space-y-2">
                    {planInfo.features.map((feature, index) => (
                      <li key={index} className="flex items-start text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 text-gray-500 mr-2" />
                  <span className="text-gray-600">
                    Đảm bảo hoàn tiền trong 7 ngày nếu bạn không hài lòng với
                    dịch vụ.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
