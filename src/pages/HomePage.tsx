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
  History,
  Award,
  BookOpen,
  TrendingUp,
  Brain,
  ChevronRight,
  BarChart2,
  PlusCircle,
  Lightbulb,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { useState } from "react";
import React from "react";
function HomePage() {
  const isLoggedIn = true; // Replace with actual authentication check
  const userName = "Nguyễn Văn A";
  // State để kiểm soát trạng thái dữ liệu
  const [hasQuizData, setHasQuizData] = useState(false); // Đặt thành false để xem trạng thái trống
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
  // Dữ liệu mẫu cho lịch sử làm bài gần đây
  const recentQuizHistory = [
    {
      id: 1,
      quizName: "Kiến thức cơ bản về mạng LAN",
      topic: "Mạng máy tính",
      score: 85,
      totalQuestions: 10,
      correctAnswers: 8.5,
      dateTime: "2023-05-20T14:30:00",
    },
    {
      id: 2,
      quizName: "Giao thức TCP/IP và mô hình OSI",
      topic: "Mạng máy tính",
      score: 70,
      totalQuestions: 15,
      correctAnswers: 10.5,
      dateTime: "2023-05-18T10:15:00",
    },
    {
      id: 3,
      quizName: "Cấu trúc dữ liệu cây và đồ thị",
      topic: "Cấu trúc dữ liệu",
      score: 92,
      totalQuestions: 20,
      correctAnswers: 18.4,
      dateTime: "2023-05-15T16:45:00",
    },
  ];
  // Format ngày giờ
  const formatDateTime = (dateTimeString: string) => {
    const date = new Date(dateTimeString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };
  return (
    <div className="flex flex-col min-h-screen>">
      {/* Banner section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="flex flex-col md:flex-row items-center justify-between">
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

      {/* Recent Quiz History Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">
                  Lịch sử làm bài gần đây
                </h2>
                <p className="text-gray-600">
                  Ba bài kiểm tra gần nhất bạn đã hoàn thành
                </p>
              </div>
              <Link
                to="/history"
                className="text-blue-600 font-medium flex items-center mt-2 md:mt-0 hover:underline"
              >
                Xem tất cả <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            {hasQuizData ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentQuizHistory.map((quiz) => (
                  <div
                    key={quiz.id}
                    className="bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-lg font-semibold line-clamp-2">
                          {quiz.quizName}
                        </h3>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            quiz.score >= 80
                              ? "bg-green-100 text-green-800"
                              : quiz.score >= 60
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {quiz.score}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <BookOpen className="h-4 w-4 mr-2" />
                          <span>{quiz.topic}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Award className="h-4 w-4 mr-2" />
                          <span>
                            {quiz.correctAnswers}/{quiz.totalQuestions} câu đúng
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDateTime(quiz.dateTime)}</span>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Link
                          to={`/quiz/${quiz.id}/result`}
                          className="flex-1 text-center py-2 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          Xem kết quả
                        </Link>
                        <Link
                          to={`/quiz/${quiz.id}`}
                          className="flex items-center justify-center px-3 py-2 text-sm border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                  <History className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Chưa có lịch sử làm bài
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Bạn chưa hoàn thành bài kiểm tra nào. Hãy bắt đầu làm bài để
                  xem lịch sử làm bài của mình.
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
}
export default HomePage;
