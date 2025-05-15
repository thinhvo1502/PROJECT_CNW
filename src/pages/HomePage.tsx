"use client";

import { useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import {
  BookOpen,
  TrendingUp,
  Brain,
  ChevronRight,
  Award,
  BarChart2,
  PlusCircle,
  Clock,
  Star,
  TrendingDown,
  Zap,
  Lightbulb,
  Users,
  Sparkles,
  CheckCircle,
  Crown,
} from "lucide-react";

// Thêm đoạn mã sau vào phần import ở đầu file
import PremiumBadge from "../components/PremiumBadge";
import { getCookie } from "../utils/cookies";

const Home = () => {
  const token = getCookie("auth_token");
  console.log("token home", token);
  // Giả định người dùng đã đăng nhập
  const isLoggedIn = true;
  const userName = "Nguyễn Văn A";
  const isPremium = false;
  // State để kiểm soát trạng thái dữ liệu
  const [hasQuizData, setHasQuizData] = useState(true); // Đặt thành false để xem trạng thái trống

  // Dữ liệu mẫu cho biểu đồ tiến độ học tập
  const progressData = [
    { name: "T2", quizzes: 2, avgScore: 75 },
    { name: "T3", quizzes: 3, avgScore: 80 },
    { name: "T4", quizzes: 1, avgScore: 65 },
    { name: "T5", quizzes: 4, avgScore: 85 },
    { name: "T6", quizzes: 2, avgScore: 90 },
    { name: "T7", quizzes: 5, avgScore: 78 },
    { name: "CN", quizzes: 3, avgScore: 82 },
  ];

  // Dữ liệu mẫu cho gợi ý thông minh
  const suggestions = [
    {
      id: 1,
      topic: "Mạng máy tính",
      description: "Bạn đã làm sai 70% câu hỏi về giao thức TCP/IP",
      icon: <BookOpen className="h-10 w-10 text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      id: 2,
      topic: "Cấu trúc dữ liệu",
      description: "Bạn cần ôn tập thêm về cây nhị phân và đồ thị",
      icon: <TrendingUp className="h-10 w-10 text-green-500" />,
      color: "bg-green-100",
    },
    {
      id: 3,
      topic: "Lập trình hướng đối tượng",
      description: "Bạn thường xuyên nhầm lẫn về tính kế thừa và đa hình",
      icon: <Brain className="h-10 w-10 text-purple-500" />,
      color: "bg-purple-100",
    },
  ];

  // Dữ liệu mẫu cho đề thi được đề xuất
  const recommendedQuizzes = [
    {
      id: 1,
      name: "Giao thức TCP/IP và mô hình OSI",
      topic: "Mạng máy tính",
      difficulty: "Trung bình",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      questionCount: 15,
      timeMinutes: 30,
      recommendReason: "Dựa trên điểm yếu của bạn về giao thức mạng",
      recommendIcon: <TrendingDown className="h-4 w-4 text-red-500" />,
    },
    {
      id: 2,
      name: "Cấu trúc dữ liệu cây và đồ thị",
      topic: "Cấu trúc dữ liệu",
      difficulty: "Khó",
      difficultyColor: "bg-red-100 text-red-800",
      questionCount: 20,
      timeMinutes: 45,
      recommendReason: "Phù hợp với sở thích của bạn về cấu trúc dữ liệu",
      recommendIcon: <Star className="h-4 w-4 text-yellow-500" />,
    },
    {
      id: 3,
      name: "Lập trình hướng đối tượng nâng cao",
      topic: "Lập trình hướng đối tượng",
      difficulty: "Trung bình",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      questionCount: 25,
      timeMinutes: 40,
      recommendReason: "Giúp cải thiện kiến thức về tính kế thừa và đa hình",
      recommendIcon: <Zap className="h-4 w-4 text-purple-500" />,
    },
    {
      id: 4,
      name: "Bảo mật mạng và mã hóa",
      topic: "An toàn thông tin",
      difficulty: "Khó",
      difficultyColor: "bg-red-100 text-red-800",
      questionCount: 30,
      timeMinutes: 60,
      recommendReason: "Đề thi mới và phổ biến trong cộng đồng",
      recommendIcon: <Sparkles className="h-4 w-4 text-blue-500" />,
    },
    {
      id: 5,
      name: "Cơ sở dữ liệu quan hệ và SQL",
      topic: "Cơ sở dữ liệu",
      difficulty: "Dễ",
      difficultyColor: "bg-green-100 text-green-800",
      questionCount: 20,
      timeMinutes: 30,
      recommendReason: "Phù hợp với trình độ hiện tại của bạn",
      recommendIcon: <Users className="h-4 w-4 text-green-500" />,
    },
    {
      id: 6,
      name: "Quản lý tiến trình trong hệ điều hành",
      topic: "Hệ điều hành",
      difficulty: "Trung bình",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      questionCount: 15,
      timeMinutes: 25,
      recommendReason: "Bổ sung kiến thức mới cho bạn",
      recommendIcon: <Lightbulb className="h-4 w-4 text-amber-500" />,
    },
  ];

  // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập (có thể xử lý bằng React Router)
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto flex flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Nền tảng ôn tập kiến thức CNTT
        </h1>
        <p className="mb-8 max-w-2xl text-lg text-gray-600">
          Cải thiện kiến thức công nghệ thông tin của bạn thông qua các bài trắc
          nghiệm tương tác và thú vị
        </p>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md text-center"
          >
            Bắt đầu ngay
          </Link>
          <Link
            to="/signup"
            className="px-6 py-3 border border-blue-600 text-blue-600 font-medium rounded-md text-center"
          >
            Tạo tài khoản mới
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-center">
            <div className="max-w-2xl mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Xin chào, {userName}!
              </h1>
              <p className="text-xl mb-8">
                Hãy tiếp tục hành trình học tập của bạn với các bài trắc nghiệm
                CNTT tương tác.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/quiz"
                  className="px-6 py-3 bg-white text-blue-700 font-medium rounded-md text-center hover:bg-blue-50 transition-colors"
                >
                  Bắt đầu ôn tập
                </Link>
                {!isPremium && (
                  <Link
                    to="/pricing"
                    className="px-6 py-3 bg-amber-500 text-white font-medium rounded-md text-center hover:bg-amber-600 transition-colors flex items-center justify-center"
                  >
                    <Crown className="h-5 w-5 mr-2" />
                    Nâng cấp Premium
                  </Link>
                )}
                <Link
                  to="/statistics"
                  className="px-6 py-3 border border-white text-white font-medium rounded-md text-center hover:bg-blue-700 transition-colors"
                >
                  Xem tiến độ học tập
                </Link>
              </div>
            </div>
            <div className="w-full md:w-1/3 flex justify-center max-h-64 md:max-h-100 md:max-w-100">
              <img
                src="/src/assets/banner1.png"
                alt="Học tập trực tuyến"
                className="max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Progress Chart Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Tiến độ học tập</h2>
                <p className="text-gray-600">
                  Số đề đã làm và điểm trung bình trong 7 ngày qua
                </p>
              </div>
              <Link
                to="/statistics"
                className="text-blue-600 font-medium flex items-center mt-2 md:mt-0 hover:underline"
              >
                Xem chi tiết <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {hasQuizData ? (
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart
                      data={progressData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis
                        yAxisId="left"
                        orientation="left"
                        stroke="#8884d8"
                      />
                      <YAxis
                        yAxisId="right"
                        orientation="right"
                        stroke="#82ca9d"
                      />
                      <Tooltip />
                      <Legend />
                      <Bar
                        yAxisId="left"
                        dataKey="quizzes"
                        name="Số đề đã làm"
                        fill="#8884d8"
                        radius={[4, 4, 0, 0]}
                      />
                      <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="avgScore"
                        name="Điểm trung bình"
                        stroke="#82ca9d"
                        strokeWidth={2}
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <BarChart2 className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Chưa có dữ liệu tiến độ
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Bạn chưa hoàn thành bài kiểm tra nào. Hãy bắt đầu làm bài để
                  xem tiến độ học tập của mình.
                </p>
                <Link
                  to="/quiz"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Bắt đầu làm bài
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recommended Quizzes Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Đề thi được đề xuất cho bạn
                </h2>
                <p className="text-gray-600">
                  Dựa trên lịch sử làm bài và sở thích của bạn
                </p>
              </div>
              <Link
                to="/quiz"
                className="text-blue-600 font-medium flex items-center mt-2 md:mt-0 hover:underline"
              >
                Xem tất cả đề thi <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {hasQuizData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendedQuizzes.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold line-clamp-2">
                          {quiz.name}
                        </h3>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${quiz.difficultyColor}`}
                        >
                          {quiz.difficulty}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span>{quiz.topic}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="h-4 w-4 mr-2" />
                          <span>{quiz.questionCount} câu hỏi</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{quiz.timeMinutes} phút</span>
                        </div>
                        <div className="flex items-center text-sm text-blue-600 bg-blue-50 p-2 rounded-md">
                          {quiz.recommendIcon}
                          <span className="ml-2">{quiz.recommendReason}</span>
                        </div>
                      </div>

                      <Link
                        to={`/quiz/${quiz.id}`}
                        className="block w-full text-center py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                      >
                        Bắt đầu
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <Sparkles className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Chưa có đề xuất cá nhân hóa
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Hệ thống cần dữ liệu từ các bài kiểm tra bạn đã làm để đưa ra
                  đề xuất phù hợp. Dưới đây là một số đề thi phổ biến để bạn bắt
                  đầu.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-medium mb-2">Mạng máy tính cơ bản</h4>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Award className="h-4 w-4 mr-1" />
                      <span>15 câu hỏi</span>
                    </div>
                    <Link
                      to="/quiz/1"
                      className="block w-full text-center py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Bắt đầu
                    </Link>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-medium mb-2">Cấu trúc dữ liệu</h4>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Award className="h-4 w-4 mr-1" />
                      <span>20 câu hỏi</span>
                    </div>
                    <Link
                      to="/quiz/2"
                      className="block w-full text-center py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Bắt đầu
                    </Link>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                    <h4 className="font-medium mb-2">Lập trình OOP</h4>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <Award className="h-4 w-4 mr-1" />
                      <span>25 câu hỏi</span>
                    </div>
                    <Link
                      to="/quiz/3"
                      className="block w-full text-center py-1.5 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Bắt đầu
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Premium Plan Section */}
      <section className="py-12 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <PremiumBadge size="lg" />
                  <h2 className="text-3xl font-bold">
                    Nâng cao trải nghiệm học tập của bạn
                  </h2>
                </div>
                <p className="text-xl mb-6 text-blue-100">
                  Mở khóa tất cả các tính năng cao cấp và truy cập vào hơn 500+
                  đề thi độc quyền
                </p>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center">
                    <div className="bg-blue-500 bg-opacity-30 p-1 rounded-full mr-3">
                      <CheckCircle className="h-5 w-5 text-yellow-300" />
                    </div>
                    <span>Truy cập không giới hạn tất cả đề thi cao cấp</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-blue-500 bg-opacity-30 p-1 rounded-full mr-3">
                      <CheckCircle className="h-5 w-5 text-yellow-300" />
                    </div>
                    <span>Gợi ý thông minh cá nhân hóa</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-blue-500 bg-opacity-30 p-1 rounded-full mr-3">
                      <CheckCircle className="h-5 w-5 text-yellow-300" />
                    </div>
                    <span>Xem giải thích chi tiết cho từng câu hỏi</span>
                  </li>
                  <li className="flex items-center">
                    <div className="bg-blue-500 bg-opacity-30 p-1 rounded-full mr-3">
                      <CheckCircle className="h-5 w-5 text-yellow-300" />
                    </div>
                    <span>Không hiển thị quảng cáo</span>
                  </li>
                </ul>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/pricing"
                    className="px-6 py-3 bg-yellow-500 text-blue-900 font-medium rounded-md hover:bg-yellow-400 transition-colors text-center"
                  >
                    Khám phá các gói Premium
                  </Link>
                  <Link
                    to="/quiz?premium=true"
                    className="px-6 py-3 bg-blue-800 bg-opacity-50 text-white border border-blue-400 rounded-md hover:bg-blue-800 hover:bg-opacity-70 transition-colors text-center"
                  >
                    Xem đề thi cao cấp
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="absolute -top-6 -left-6 bg-blue-500 bg-opacity-30 p-4 rounded-lg">
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm text-blue-200">Đề thi cao cấp</div>
                  </div>
                  <div className="absolute -bottom-6 -right-6 bg-blue-500 bg-opacity-30 p-4 rounded-lg">
                    <div className="text-3xl font-bold">24/7</div>
                    <div className="text-sm text-blue-200">Hỗ trợ</div>
                  </div>
                  <div className="bg-blue-800 bg-opacity-50 p-8 rounded-lg">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="bg-blue-700 bg-opacity-60 p-4 rounded-lg">
                        <Sparkles className="h-8 w-8 text-yellow-300 mb-2" />
                        <h3 className="font-bold mb-1">Gợi ý thông minh</h3>
                        <p className="text-sm text-blue-200">
                          Cá nhân hóa theo tiến độ học tập của bạn
                        </p>
                      </div>
                      <div className="bg-blue-700 bg-opacity-60 p-4 rounded-lg">
                        <BookOpen className="h-8 w-8 text-yellow-300 mb-2" />
                        <h3 className="font-bold mb-1">Giải thích chi tiết</h3>
                        <p className="text-sm text-blue-200">
                          Hiểu sâu hơn về từng câu hỏi
                        </p>
                      </div>
                      <div className="bg-blue-700 bg-opacity-60 p-4 rounded-lg">
                        <Award className="h-8 w-8 text-yellow-300 mb-2" />
                        <h3 className="font-bold mb-1">Đề thi cao cấp</h3>
                        <p className="text-sm text-blue-200">
                          Bao gồm đề thi mô phỏng chứng chỉ
                        </p>
                      </div>
                      <div className="bg-blue-700 bg-opacity-60 p-4 rounded-lg">
                        <TrendingUp className="h-8 w-8 text-yellow-300 mb-2" />
                        <h3 className="font-bold mb-1">Phân tích chi tiết</h3>
                        <p className="text-sm text-blue-200">
                          Theo dõi tiến bộ qua thời gian
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Suggestions Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Gợi ý thông minh</h2>
                <p className="text-gray-600">
                  Các chủ đề bạn cần cải thiện dựa trên kết quả học tập
                </p>
              </div>
              <Link
                to="/suggestions"
                className="text-blue-600 font-medium flex items-center mt-2 md:mt-0 hover:underline"
              >
                Xem tất cả gợi ý <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {hasQuizData ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {suggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="p-6">
                      <div
                        className={`w-16 h-16 rounded-full ${suggestion.color} flex items-center justify-center mb-4`}
                      >
                        {suggestion.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {suggestion.topic}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        {suggestion.description}
                      </p>
                      <Link
                        to={`/quiz/topic/${suggestion.id}`}
                        className="text-blue-600 font-medium hover:underline flex items-center"
                      >
                        Ôn tập ngay <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-md text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Lightbulb className="h-10 w-10 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Chưa có gợi ý thông minh
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Hệ thống cần dữ liệu từ các bài kiểm tra bạn đã làm để đưa ra
                  gợi ý phù hợp. Hãy hoàn thành một số bài kiểm tra để nhận gợi
                  ý cá nhân hóa.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Mạng máy tính</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Kiến thức cơ bản về mạng và giao thức
                    </p>
                    <Link
                      to="/quiz/topic/1"
                      className="text-blue-600 text-sm font-medium hover:underline flex items-center"
                    >
                      Khám phá <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Cấu trúc dữ liệu</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Các cấu trúc dữ liệu cơ bản và nâng cao
                    </p>
                    <Link
                      to="/quiz/topic/2"
                      className="text-green-600 text-sm font-medium hover:underline flex items-center"
                    >
                      Khám phá <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Lập trình OOP</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Nguyên lý và ứng dụng của OOP
                    </p>
                    <Link
                      to="/quiz/topic/3"
                      className="text-purple-600 text-sm font-medium hover:underline flex items-center"
                    >
                      Khám phá <ChevronRight className="h-3 w-3 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
