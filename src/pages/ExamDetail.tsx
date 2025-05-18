"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Clock,
  BarChart3,
  BookMarked,
  Tag,
  User,
  Calendar,
  Award,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Play,
  Lock,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getExamById, isPremiumExam } from "../services/examService";
import PremiumBadge from "../components/PremiumBadge";
import { formatDate } from "../utils/formatters";
import quizAttemptService from "../services/quizAttemptService";

const ExamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [exam, setExam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { examId } = useParams<{ examId: string }>();

  const [startingQuiz, setStartingQuiz] = useState<boolean>(false);

  // Đây là giả định trạng thái premium của người dùng
  // Trong thực tế, sẽ lấy từ state hoặc context
  const isPremiumUser = false;

  useEffect(() => {
    const fetchExamDetails = async () => {
      if (!id) return;
      try {
        setIsLoading(true);
        setError(null);
        const examData = await getExamById(id);
        console.log("examdata: ", examData);
        setExam(examData);
      } catch (error: any) {
        console.error("Error fetching exam details:", error);
        setError(error.message || "Không thể tải thông tin đề thi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExamDetails();
  }, [id]);

  // Xử lý khi bắt đầu làm bài
  const handleStartQuiz = async () => {
    if (!id || !isAuthenticated) return;

    // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/exam/${examId}` } });
      return;
    }

    // Kiểm tra xem người dùng có quyền làm bài không (ví dụ: bài thi premium)
    if (exam.isPremium) {
      navigate("/pricing");
      return;
    }

    try {
      setStartingQuiz(true);
      const quizAttempt = await quizAttemptService.startQuiz(id);
      const attemptId = quizAttempt._id;
      navigate(`/quiz/${attemptId}`);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra khi bắt đầu bài thi");
      setStartingQuiz(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (error || !exam) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-center flex-col text-center">
            <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Không thể tải thông tin đề thi
            </h2>
            <p className="text-gray-600 mb-6">
              {error ||
                "Đã xảy ra lỗi khi tải thông tin đề thi. Vui lòng thử lại sau."}
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate(-1)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Nút quay lại */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Quay lại danh sách đề thi
        </button>

        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6 relative">
          {isPremiumExam(exam.exam) && (
            <div className="absolute top-4 right-4">
              <PremiumBadge size="lg" />
            </div>
          )}

          <h1 className="text-3xl font-bold mb-3 pr-24">{exam.exam.title}</h1>

          {exam.description && (
            <p className="text-gray-600 mb-6">{exam.exam.description}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center text-gray-700">
              <Clock className="h-5 w-5 mr-2 text-blue-600" />
              <span>
                Thời gian: <strong>{exam.exam.timeLimit} phút</strong>
              </span>
            </div>

            <div className="flex items-center text-gray-700">
              <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
              <span>
                Số câu hỏi: <strong>{exam.metadata.totalQuestions} câu</strong>
              </span>
            </div>

            {/* <div className="flex items-center text-gray-700">
              <Award className="h-5 w-5 mr-2 text-blue-600" />
              <span>
                Điểm đạt: <strong>{exam.passingScore}%</strong>
              </span>
            </div> */}

            <div className="flex items-center text-gray-700">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              <span>
                Ngày tạo: <strong>{formatDate(exam.exam.createdAt)}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {Array.isArray(exam.exam.topics) &&
              exam.exam.topics.length > 0 &&
              exam.exam.topics.map((topic: any, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                >
                  <BookMarked className="h-3 w-3 mr-1" />
                  {typeof topic === "string" ? topic : topic.name}
                </span>
              ))}

            {Array.isArray(exam.tags) &&
              exam.tags.length > 0 &&
              exam.tags.map((tag: any, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {typeof tag === "string" ? tag : tag.name}
                </span>
              ))}
          </div>

          <div className="flex items-center text-gray-700 mb-6">
            <User className="h-5 w-5 mr-2 text-blue-600" />
            <span>
              Tạo bởi:{" "}
              <strong>{exam.exam.createdBy?.name || "Không xác định"}</strong>
            </span>
          </div>

          <button
            onClick={handleStartQuiz}
            className={`w-full py-3 rounded-md text-white font-medium flex items-center justify-center ${
              isPremiumExam(exam) && !isPremiumUser
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
                : "bg-blue-600 hover:bg-blue-700"
            } transition-colors`}
          >
            {isPremiumExam(exam) && !isPremiumUser ? (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Mở khóa đề thi Premium
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Bắt đầu làm bài
              </>
            )}
          </button>
        </div>

        {/* Thống kê */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Thống kê đề thi</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-blue-600 font-bold text-2xl mb-1">
                {exam.stats?.totalAttempts || 0}
              </div>
              <div className="text-gray-600 text-sm">Lượt làm bài</div>
            </div>

            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-green-600 font-bold text-2xl mb-1">
                {exam.stats?.completionRate || 0}%
              </div>
              <div className="text-gray-600 text-sm">Tỷ lệ hoàn thành</div>
            </div>

            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <div className="text-yellow-600 font-bold text-2xl mb-1">
                {exam.stats?.averageScore || 0}%
              </div>
              <div className="text-gray-600 text-sm">Điểm trung bình</div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-purple-600 font-bold text-2xl mb-1">
                {exam.stats?.passRate || 0}%
              </div>
              <div className="text-gray-600 text-sm">Tỷ lệ đạt</div>
            </div>
          </div>
        </div>

        {/* Hướng dẫn */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Hướng dẫn làm bài</h2>

          {exam.instructions ? (
            <p className="text-gray-700">{exam.instructions}</p>
          ) : (
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>
                  Đọc kỹ câu hỏi và các phương án trả lời trước khi chọn đáp án.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>
                  Thời gian làm bài là {exam.timeLimit} phút, hệ thống sẽ tự
                  động nộp bài khi hết thời gian.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>
                  Điểm đạt tối thiểu là {exam.passingScore}% tổng số điểm.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>
                  Bạn có thể xem lại kết quả và giải thích sau khi hoàn thành
                  bài thi.
                </span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                <span>
                  Không thoát khỏi trang khi đang làm bài để tránh mất dữ liệu.
                </span>
              </li>
            </ul>
          )}
        </div>

        {/* Nút bắt đầu */}
        <div className="flex justify-center">
          <button
            onClick={handleStartQuiz}
            className={`px-8 py-3 rounded-md text-white font-medium flex items-center ${
              isPremiumExam(exam) && !isPremiumUser
                ? "bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700"
                : "bg-blue-600 hover:bg-blue-700"
            } transition-colors`}
          >
            {isPremiumExam(exam) && !isPremiumUser ? (
              <>
                <Lock className="h-5 w-5 mr-2" />
                Mở khóa đề thi Premium
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2" />
                Bắt đầu làm bài
              </>
            )}
          </button>
        </div>
      </div>

      {/* Modal Premium */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-2 bg-yellow-100 rounded-full mb-4">
                <PremiumBadge size="lg" />
              </div>
              <h3 className="text-xl font-bold mb-2">Đề thi Premium</h3>
              <p className="text-gray-600">
                Đề thi "{exam.title}" là nội dung dành riêng cho thành viên
                Premium.
              </p>
            </div>

            <div className="bg-blue-50 rounded-md p-4 mb-6">
              <h4 className="font-medium mb-2">Lợi ích của gói Premium:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  <span>Truy cập tất cả đề thi cao cấp</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  <span>Xem giải thích chi tiết cho từng câu hỏi</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  <span>Không hiển thị quảng cáo</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  <span>Gợi ý thông minh cá nhân hóa</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/pricing"
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                Nâng cấp lên Premium
              </Link>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Không, cảm ơn
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamDetail;
