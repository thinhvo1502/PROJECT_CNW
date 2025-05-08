"use client";

import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, HelpCircle, X, Shield, Award, Zap } from "lucide-react";
import React from "react";
const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const [showFeatureModal, setShowFeatureModal] = useState(false);
  const [featureDetail, setFeatureDetail] = useState({
    title: "",
    description: "",
  });

  // Calculate discount percentage for yearly billing
  const yearlyDiscountPercent = 20;

  // Pricing data
  const pricingPlans = [
    {
      name: "Cơ bản",
      description: "Dành cho người mới bắt đầu học tập",
      price: { monthly: 0, yearly: 0 },
      features: [
        { name: "Truy cập tất cả đề thi cơ bản", included: true },
        { name: "Làm không giới hạn đề thi miễn phí", included: true },
        { name: "Xem thống kê học tập cơ bản", included: true },
        { name: "Lưu lịch sử làm bài", included: true },
        { name: "Nhận hỗ trợ qua email", included: true },
        { name: "Truy cập đề thi cao cấp", included: false },
        { name: "Gợi ý thông minh cá nhân hóa", included: false },
        { name: "Xem giải thích chi tiết", included: false },
        { name: "Không hiển thị quảng cáo", included: false },
        { name: "Tải xuống đề thi offline", included: false },
      ],
      popular: false,
      ctaText: "Bắt đầu miễn phí",
      ctaLink: "/signup",
    },
    {
      name: "Premium",
      description: "Dành cho người học nghiêm túc",
      price: { monthly: 99000, yearly: 948000 },
      features: [
        { name: "Truy cập tất cả đề thi cơ bản", included: true },
        { name: "Làm không giới hạn đề thi miễn phí", included: true },
        { name: "Xem thống kê học tập cơ bản", included: true },
        { name: "Lưu lịch sử làm bài", included: true },
        { name: "Nhận hỗ trợ qua email", included: true },
        { name: "Truy cập đề thi cao cấp", included: true },
        { name: "Gợi ý thông minh cá nhân hóa", included: true },
        { name: "Xem giải thích chi tiết", included: true },
        { name: "Không hiển thị quảng cáo", included: true },
        { name: "Tải xuống đề thi offline", included: false },
      ],
      popular: true,
      ctaText: "Đăng ký ngay",
      ctaLink: "/checkout?plan=premium",
    },
    {
      name: "Pro",
      description: "Dành cho người chuẩn bị thi chứng chỉ",
      price: { monthly: 199000, yearly: 1908000 },
      features: [
        { name: "Truy cập tất cả đề thi cơ bản", included: true },
        { name: "Làm không giới hạn đề thi miễn phí", included: true },
        { name: "Xem thống kê học tập cơ bản", included: true },
        { name: "Lưu lịch sử làm bài", included: true },
        { name: "Nhận hỗ trợ qua email", included: true },
        { name: "Truy cập đề thi cao cấp", included: true },
        { name: "Gợi ý thông minh cá nhân hóa", included: true },
        { name: "Xem giải thích chi tiết", included: true },
        { name: "Không hiển thị quảng cáo", included: true },
        { name: "Tải xuống đề thi offline", included: true },
      ],
      popular: false,
      ctaText: "Đăng ký Pro",
      ctaLink: "/checkout?plan=pro",
    },
  ];

  // Feature detail descriptions
  const featureDetails = {
    "Truy cập đề thi cao cấp": {
      title: "Truy cập đề thi cao cấp",
      description:
        "Mở khóa hơn 500+ đề thi chuyên sâu, bao gồm các đề thi mô phỏng chứng chỉ quốc tế như CCNA, CompTIA, AWS, và nhiều đề thi khác được biên soạn bởi các chuyên gia hàng đầu trong ngành CNTT.",
    },
    "Gợi ý thông minh cá nhân hóa": {
      title: "Gợi ý thông minh cá nhân hóa",
      description:
        "Hệ thống AI phân tích kết quả học tập của bạn và đưa ra các đề xuất cá nhân hóa, giúp bạn tập trung vào các lĩnh vực cần cải thiện nhất, tiết kiệm thời gian và tối ưu hiệu quả học tập.",
    },
    "Xem giải thích chi tiết": {
      title: "Xem giải thích chi tiết",
      description:
        "Mọi câu hỏi đều có giải thích chi tiết được soạn thảo bởi các chuyên gia, giúp bạn hiểu rõ nguyên lý, khái niệm và lý do tại sao một đáp án là đúng hoặc sai.",
    },
    "Không hiển thị quảng cáo": {
      title: "Không hiển thị quảng cáo",
      description:
        "Trải nghiệm học tập không bị gián đoạn bởi quảng cáo, giúp bạn tập trung hoàn toàn vào nội dung và tiết kiệm thời gian.",
    },
    "Tải xuống đề thi offline": {
      title: "Tải xuống đề thi offline",
      description:
        "Tải xuống đề thi dưới dạng PDF để học tập ngay cả khi không có kết nối internet. Tính năng này đặc biệt hữu ích cho việc ôn tập khi di chuyển hoặc ở những nơi không có kết nối mạng.",
    },
  };

  // Format price as VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Handle feature info click
  const handleFeatureInfoClick = (featureName: string) => {
    if (featureDetails[featureName as keyof typeof featureDetails]) {
      setFeatureDetail(
        featureDetails[featureName as keyof typeof featureDetails]
      );
      setShowFeatureModal(true);
    }
  };

  // Calculate yearly price with discount
  const getYearlyPrice = (monthlyPrice: number) => {
    const yearlyPrice = monthlyPrice * 12;
    const discountAmount = (yearlyPrice * yearlyDiscountPercent) / 100;
    return yearlyPrice - discountAmount;
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Chọn gói học tập phù hợp với bạn
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Nâng cao kiến thức CNTT của bạn với các gói học tập đa dạng, từ
              gói miễn phí đến gói cao cấp với đầy đủ tính năng.
            </p>

            {/* Billing cycle selector */}
            <div className="mt-8 inline-flex p-1 bg-gray-100 rounded-full">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`py-2 px-4 rounded-full text-sm font-medium ${
                  billingCycle === "monthly"
                    ? "bg-white shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Thanh toán hàng tháng
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`py-2 px-4 rounded-full text-sm font-medium flex items-center ${
                  billingCycle === "yearly"
                    ? "bg-white shadow-sm"
                    : "text-gray-700 hover:text-gray-900"
                }`}
              >
                Thanh toán hàng năm
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  Tiết kiệm {yearlyDiscountPercent}%
                </span>
              </button>
            </div>
          </div>

          {/* Pricing cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 ${
                  plan.popular ? "ring-2 ring-blue-500 relative" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                      Phổ biến nhất
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline">
                      <span className="text-3xl md:text-4xl font-bold">
                        {formatPrice(
                          billingCycle === "monthly"
                            ? plan.price.monthly
                            : plan.price.yearly
                        )}
                      </span>
                      {plan.price.monthly > 0 && (
                        <span className="text-gray-600 ml-2">
                          /{billingCycle === "monthly" ? "tháng" : "năm"}
                        </span>
                      )}
                    </div>
                    {billingCycle === "yearly" && plan.price.monthly > 0 && (
                      <p className="text-green-600 text-sm mt-1">
                        Tiết kiệm{" "}
                        {formatPrice(
                          plan.price.monthly * 12 - plan.price.yearly
                        )}{" "}
                        khi thanh toán hàng năm
                      </p>
                    )}
                  </div>

                  <Link
                    to={plan.ctaLink}
                    className={`block w-full py-3 px-4 rounded-md text-center font-medium ${
                      plan.popular
                        ? "bg-blue-600 text-white hover:bg-blue-700"
                        : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                    } transition-colors mb-6`}
                  >
                    {plan.ctaText}
                  </Link>

                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start">
                        {feature.included ? (
                          <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        ) : (
                          <X className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        )}
                        <span
                          className={`ml-3 ${
                            feature.included ? "text-gray-900" : "text-gray-500"
                          }`}
                        >
                          {feature.name}
                        </span>
                        {featureDetails[
                          feature.name as keyof typeof featureDetails
                        ] && (
                          <button
                            onClick={() => handleFeatureInfoClick(feature.name)}
                            className="ml-1 text-gray-400 hover:text-gray-600"
                          >
                            <HelpCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6 text-center">
              Câu hỏi thường gặp
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Làm thế nào để nâng cấp gói học tập?
                </h3>
                <p className="text-gray-600">
                  Bạn có thể nâng cấp gói học tập bất kỳ lúc nào từ trang Cài
                  đặt tài khoản. Phần chênh lệch sẽ được tính theo tỷ lệ dựa
                  trên thời gian còn lại của gói hiện tại.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Tôi có thể hủy gói đăng ký không?
                </h3>
                <p className="text-gray-600">
                  Có, bạn có thể hủy đăng ký bất kỳ lúc nào. Bạn vẫn sẽ có quyền
                  truy cập vào tất cả các tính năng cho đến cuối kỳ thanh toán
                  hiện tại.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Phương thức thanh toán nào được chấp nhận?
                </h3>
                <p className="text-gray-600">
                  Chúng tôi chấp nhận các phương thức thanh toán phổ biến như
                  thẻ tín dụng, thẻ ghi nợ, ví điện tử (Momo, ZaloPay, VnPay) và
                  chuyển khoản ngân hàng.
                </p>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">
                  Có được hoàn tiền nếu tôi không hài lòng không?
                </h3>
                <p className="text-gray-600">
                  Có, chúng tôi cung cấp chính sách hoàn tiền trong vòng 7 ngày.
                  Nếu bạn không hài lòng với dịch vụ, hãy liên hệ với chúng tôi
                  để được hỗ trợ.
                </p>
              </div>
            </div>
          </div>

          {/* Trust signals */}
          <div className="mt-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-2">
                Được tin dùng bởi hơn 10,000+ học viên
              </h2>
              <p className="text-gray-600">
                Với hệ thống bảo mật và trải nghiệm người dùng hàng đầu
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2">Thanh toán bảo mật</h3>
                <p className="text-gray-600 text-sm">
                  Tất cả thông tin thanh toán được mã hóa và bảo vệ bằng tiêu
                  chuẩn bảo mật cao nhất.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold mb-2">Đảm bảo chất lượng</h3>
                <p className="text-gray-600 text-sm">
                  Nội dung học tập được biên soạn và kiểm duyệt bởi các chuyên
                  gia trong ngành CNTT.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2">Hỗ trợ 24/7</h3>
                <p className="text-gray-600 text-sm">
                  Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giải đáp mọi thắc
                  mắc của bạn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature detail modal */}
      {showFeatureModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-bold">{featureDetail.title}</h3>
              <button
                onClick={() => setShowFeatureModal(false)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{featureDetail.description}</p>
            <button
              onClick={() => setShowFeatureModal(false)}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pricing;
