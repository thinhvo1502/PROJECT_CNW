import { useState } from "react";
import { useParams, useLocation, Link, To } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Clock,
  Award,
  BarChart3,
  RefreshCw,
  FileText,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import React from "react";
interface QuizResultProps {
  quizId: string | number;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeTaken: number;
  topicResults: TopicResult[];
}
interface TopicResult {
  id: number;
  name: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
}
const ResultPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const quizId = id || "unknown";
  // Trong thực tế, dữ liệu này sẽ được lấy từ state của location hoặc từ API
  // Ở đây tôi sử dụng dữ liệu mẫu
  const [resultData, setResultData] = useState<QuizResultProps>({
    quizId,
    score: 75,
    totalQuestions: 10,
    correctAnswers: 7,
    incorrectAnswers: 3,
    timeTaken: 1230, // 20 phút 30 giây
    topicResults: [
      {
        id: 1,
        name: "Mạng LAN",
        correctAnswers: 3,
        totalQuestions: 3,
        percentage: 100,
      },
      {
        id: 2,
        name: "Giao thức mạng",
        correctAnswers: 2,
        totalQuestions: 3,
        percentage: 66.67,
      },
      {
        id: 3,
        name: "Mô hình OSI",
        correctAnswers: 1,
        totalQuestions: 2,
        percentage: 50,
      },
      {
        id: 4,
        name: "Địa chỉ IP",
        correctAnswers: 1,
        totalQuestions: 2,
        percentage: 50,
      },
    ],
  });
  // dữ liệu cho biểu đồ tròn
  const chartData = [
    { name: "Đúng", value: resultData.correctAnswers, color: "#4ade80" },
    { name: "Sai", value: resultData.incorrectAnswers, color: "#f87171" },
  ];
  // xác định thông điệp dựa trên điểm số
  const getFeedback = () => {
    const percentage = (resultData.score / resultData.totalQuestions) * 100;
    if (percentage >= 90) {
      return {
        label: "Xuất sắc!",
        caption: "Bạn đã thể hiện kiến thức tuyệt vời về chủ đề này.",
        color: "text-green-600",
      };
    } else if (percentage >= 70) {
      return {
        label: "Rất tốt!",
        caption: "Bạn đã nắm vững phần lớn kiến thức về chủ đề này.",
        color: "text-blue-600",
      };
    } else if (percentage >= 50) {
      return {
        label: "Khá tốt",
        caption:
          "Bạn đã hiểu được những điểm cơ bản, nhưng vẫn cần cải thiện thêm.",
        color: "text-yellow-600",
      };
    } else {
      return {
        label: "Cần cố gắng hơn",
        caption: "Bạn nên ôn tập lại kiến thức về chủ đề này.",
        color: "text-red-600",
      };
    }
  };
  // formmat thời gian
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes} phút ${remainingSeconds} giây`;
  };
  const feedback = getFeedback();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* phần tổng quan kết quả */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div text-center mb-6>
            <h1 className={`text-3xl font-bold mb-2 ${feedback.color}`}>
              {feedback.label}
            </h1>
            <p className="text-gray-600">{feedback.caption}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* biểu đồ tròn */}
            <div className="flex flex-col items-center">
              <div className="relative h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value) => [`${value} câu`, "Số câu"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold">{resultData.score}</div>
                    <div className="text-sm text-gray-500">Điểm</div>
                  </div>
                </div>
              </div>
            </div>
            {/* thống kê chi tiết */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Award className="h-6 w-6 text-blue-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Tổng sô câu</div>
                  <div className="text-xl font-semibold">
                    {resultData.totalQuestions} câu
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 mr-3">
                  <span className="text-lg font-bold">✓</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Số câu đúng</div>
                  <div className="text-xl font-semibold text-green-600">
                    {resultData.correctAnswers} câu
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="h-6 w-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 mr-3">
                  <span className="text-lg font-bold">✗</span>
                </div>
                <div>
                  <div className="text-sm text-gray-500">Số câu sai</div>
                  <div className="text-xl font-semibold text-red-600">
                    {resultData.incorrectAnswers} câu
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-blue-500 mr-3" />
                <div>
                  <div className="text-sm text-gray-500">Thời gian làm bài</div>
                  <div className="text-xl font-semibold">
                    {formatTime(resultData.timeTaken)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* các nút hành động */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
            <Link
              to="#"
              className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FileText className="h-5 w-5 mr-2" />
              Xem chi tiết kết quả
            </Link>
            <Link
              to="#"
              className="flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
            >
              <RefreshCw className="h-5 w-5 mr-2" />
              Làm lại bài kiểm tra
            </Link>
          </div>
        </div>
        {/* phân tích theo chủ đề */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Phân tích theo chủ đề</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Chủ dề</th>
                  <th className="py-3 px-4 text-center">Số câu đúng</th>
                  <th className="py-3 px-4 text-center">Tổng số câu</th>
                  <th className="py-3 px-4 text-center">Tỷ lệ</th>
                  <th className="py-3 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {resultData.topicResults.map((topic) => (
                  <tr key={topic.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 text-blue-500 mr-2" />
                        {topic.name}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {topic.correctAnswers}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {topic.totalQuestions}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center">
                        <div
                          className={`h-2 w-16 rounded-full ${
                            topic.percentage >= 70
                              ? "bg-green-200"
                              : topic.percentage >= 40
                              ? "bg-yellow-200"
                              : "bg-red-200"
                          }`}
                        >
                          <div
                            className={`h-2 rounded-full ${
                              topic.percentage >= 70
                                ? "bg-green-500"
                                : topic.percentage >= 40
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${topic.percentage}%` }}
                          ></div>
                        </div>
                        <span className="ml-2">{topic.percentage}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to="#"
                        className="inline-flex items-center text-blue-600 hover:text-blue-800"
                      >
                        Luyện tập
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
