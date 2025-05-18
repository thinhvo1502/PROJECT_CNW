"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import quizAttemptService, {
  type QuizResult as QuizResultType,
} from "../services/quizAttemptService";
import { formatDate, formatDuration } from "../utils/formatters";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import {
  Clock,
  Award,
  BarChart3,
  RefreshCw,
  FileText,
  ChevronRight,
  BookOpen,
  AlertCircle,
} from "lucide-react";

const QuizResult: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<QuizResultType | null>(null);
  const [feedback, setFeedback] = useState<{
    rating: number;
    comment: string;
  }>({
    rating: 0,
    comment: "",
  });
  const [submittingFeedback, setSubmittingFeedback] = useState<boolean>(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState<boolean>(false);

  // Lấy kết quả bài thi
  useEffect(() => {
    const fetchQuizResult = async () => {
      if (!attemptId) return;

      try {
        setLoading(true);
        console.log("Fetching quiz result for attemptId:", attemptId);
        const data = await quizAttemptService.getQuizResult(attemptId);
        console.log("Quiz result data:", data);
        setResult(data);

        // Kiểm tra xem đã có feedback chưa
        if (data.feedback) {
          setFeedback(data.feedback);
          setFeedbackSubmitted(true);
        }

        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching quiz result:", err);
        setError(err.message || "Có lỗi xảy ra khi tải kết quả bài thi");
        setLoading(false);
      }
    };

    fetchQuizResult();
  }, [attemptId]);

  // Xử lý khi gửi feedback
  const handleSubmitFeedback = async () => {
    if (!attemptId || !feedback.rating) return;

    try {
      setSubmittingFeedback(true);
      await quizAttemptService.addFeedback(attemptId, feedback);
      setFeedbackSubmitted(true);
      setSubmittingFeedback(false);
    } catch (err: any) {
      console.error("Error submitting feedback:", err);
      setError(err.message || "Có lỗi xảy ra khi gửi đánh giá");
      setSubmittingFeedback(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => navigate("/quiz-selection")}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Quay lại trang chọn bài thi
        </button>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">Không tìm thấy kết quả bài thi</p>
      </div>
    );
  }

  const isPassed = result.score >= (result.exam?.passingScore || 0);
  const totalQuestions =
    result.correctAnswers + result.wrongAnswers + result.skippedQuestions;

  // Dữ liệu cho biểu đồ tròn
  const chartData = [
    { name: "Đúng", value: result.correctAnswers, color: "#4ade80" },
    { name: "Sai", value: result.wrongAnswers, color: "#f87171" },
    { name: "Bỏ qua", value: result.skippedQuestions, color: "#9ca3af" },
  ];

  // Tạo dữ liệu phân tích theo chủ đề (nếu có)
  const topicResults = result.topicResults || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h1 className="text-2xl font-bold mb-2">
          {result.exam?.title || "Kết quả bài thi"}
        </h1>
        <p className="text-gray-600 mb-4">{result.exam?.description || ""}</p>

        <div className="flex flex-col md:flex-row justify-between">
          <div>
            <p className="text-sm text-gray-600">
              Ngày làm bài: {formatDate(result.startTime)}
            </p>
            <p className="text-sm text-gray-600">
              Thời gian làm bài: {formatDuration(result.timeSpent)}
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <div
              className={`text-center p-3 rounded-lg ${
                isPassed
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              <p className="font-bold text-lg">
                {isPassed ? "Đạt" : "Chưa đạt"}
              </p>
              <p>Điểm số: {result.score.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phần tổng quan kết quả */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">Tổng quan kết quả</h2>
          <p className="text-gray-600">
            {isPassed
              ? "Chúc mừng! Bạn đã hoàn thành bài thi thành công."
              : "Bạn chưa đạt điểm yêu cầu. Hãy xem lại các câu hỏi và thử lại."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Biểu đồ tròn */}
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
                  <Tooltip formatter={(value) => [`${value} câu`, "Số câu"]} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-3xl font-bold">
                    {result.score.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-500">Điểm</div>
                </div>
              </div>
            </div>
          </div>

          {/* Thống kê chi tiết */}
          <div className="space-y-4">
            <div className="flex items-center">
              <Award className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Tổng số câu</div>
                <div className="text-xl font-semibold">
                  {totalQuestions} câu
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
                  {result.correctAnswers} câu
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
                  {result.wrongAnswers} câu
                </div>
              </div>
            </div>
            <div className="flex items-center">
              <Clock className="h-6 w-6 text-blue-500 mr-3" />
              <div>
                <div className="text-sm text-gray-500">Thời gian làm bài</div>
                <div className="text-xl font-semibold">
                  {formatDuration(result.timeSpent)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Các nút hành động */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link
            to={`/quiz-result-detail/${attemptId}`}
            className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <FileText className="h-5 w-5 mr-2" />
            Xem chi tiết kết quả
          </Link>
          <Link
            to={`/quiz/${result.exam?._id}`}
            className="flex items-center justify-center px-6 py-3 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Làm lại bài kiểm tra
          </Link>
        </div>
      </div>

      {/* Phân tích theo chủ đề */}
      {topicResults.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-xl font-semibold">Phân tích theo chủ đề</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-3 px-4 text-left">Chủ đề</th>
                  <th className="py-3 px-4 text-center">Số câu đúng</th>
                  <th className="py-3 px-4 text-center">Tổng số câu</th>
                  <th className="py-3 px-4 text-center">Tỷ lệ</th>
                  <th className="py-3 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {topicResults.map((topic, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
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
                        <span className="ml-2">
                          {topic.percentage.toFixed(1)}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Link
                        to={`/quiz/topic/${topic.id}`}
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
      )}

      {/* Detailed results or message */}
      {result.isDetailedResultsHidden ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Kết quả chi tiết sẽ được hiển thị sau khi hết thời gian làm bài.
                Điều này giúp đảm bảo tính công bằng cho tất cả người tham gia.
              </p>
            </div>
          </div>
        </div>
      ) : (
        result.questionsWithAnswers &&
        result.questionsWithAnswers.length > 0 && (
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Kết quả chi tiết</h2>
              <Link
                to={`/quiz-result-detail/${attemptId}`}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Xem chi tiết từng câu
              </Link>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        STT
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Câu hỏi
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Đáp án của bạn
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Đáp án đúng
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Kết quả
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {result.questionsWithAnswers.map((question, index) => (
                      <tr
                        key={index}
                        className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          <div className="line-clamp-2">{question.content}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {question.userAnswer || "Không trả lời"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {question.correctAnswer}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {question.answered ? (
                            question.isCorrect ? (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Đúng
                              </span>
                            ) : (
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                Sai
                              </span>
                            )
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                              Bỏ qua
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )
      )}

      {/* Feedback section */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Đánh giá bài thi</h2>

        {feedbackSubmitted ? (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Cảm ơn bạn đã gửi đánh giá về bài thi này!
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đánh giá của bạn
              </label>
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedback({ ...feedback, rating: star })}
                    className="text-2xl focus:outline-none"
                  >
                    {star <= feedback.rating ? (
                      <span className="text-yellow-400">★</span>
                    ) : (
                      <span className="text-gray-300">★</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="comment"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Nhận xét của bạn
              </label>
              <textarea
                id="comment"
                rows={3}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Nhập nhận xét của bạn về bài thi này..."
                value={feedback.comment}
                onChange={(e) =>
                  setFeedback({ ...feedback, comment: e.target.value })
                }
              ></textarea>
            </div>

            <button
              type="button"
              onClick={handleSubmitFeedback}
              disabled={!feedback.rating || submittingFeedback}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${
                !feedback.rating || submittingFeedback
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              }`}
            >
              {submittingFeedback ? "Đang gửi..." : "Gửi đánh giá"}
            </button>
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <Link
          to="/quiz-selection"
          className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg text-center"
        >
          Quay lại danh sách bài thi
        </Link>

        <Link
          to="/quiz-history"
          className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg text-center"
        >
          Xem lịch sử làm bài
        </Link>
      </div>
    </div>
  );
};

export default QuizResult;
