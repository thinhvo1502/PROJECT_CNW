import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Shuffle,
  Clock,
  BookOpen,
  BarChart3,
  Lock,
} from "lucide-react";
import React from "react";
import PremiumBadge from "../components/PremiumBadge";
interface Quiz {
  id: number;
  name: string;
  topic: string;
  timeMinutes: number;
  questionCount: number;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  difficultyColor: string;
  isPremium: boolean;
  price?: number;
  isOwned?: boolean;
}
interface Topic {
  id: number;
  name: string;
}
function ExamListPage() {
  const navigate = useNavigate();
  // state cho từ khóa tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState("");
  // state cho bộ lọc
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [selectedPriceFilter, setSelectedPriceFilter] = useState<
    "all" | "free" | "premium" | "owned"
  >("all");

  // state cho danh sách đề thi đã lọc
  const [filteredQuizzes, setFilteredQuizzes] = useState<Quiz[]>([]);

  // State cho modal Premium
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  // Đây là giả định trạng thái premium của người dùng
  // Trong thực tế, sẽ lấy từ state hoặc context
  const isPremiumUser = false;

  // Danh sách chủ đề mẫu
  const topics: Topic[] = [
    { id: 1, name: "Mạng máy tính" },
    { id: 2, name: "Cấu trúc dữ liệu" },
    { id: 3, name: "Lập trình hướng đối tượng" },
    { id: 4, name: "Cơ sở dữ liệu" },
    { id: 5, name: "An toàn thông tin" },
    { id: 6, name: "Hệ điều hành" },
  ];

  // Danh sách mức độ
  const difficulties = ["Dễ", "Trung bình", "Khó"];

  // Danh sách đề thi mẫu
  const quizzes: Quiz[] = [
    {
      id: 1,
      name: "Kiến thức cơ bản về mạng LAN",
      topic: "Mạng máy tính",
      timeMinutes: 30,
      questionCount: 20,
      difficulty: "Dễ",
      difficultyColor: "bg-green-100 text-green-800",
      isPremium: false,
    },
    {
      id: 2,
      name: "Giao thức TCP/IP và mô hình OSI",
      topic: "Mạng máy tính",
      timeMinutes: 45,
      questionCount: 30,
      difficulty: "Trung bình",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      isPremium: false,
    },
    {
      id: 3,
      name: "Cấu trúc dữ liệu cây và đồ thị",
      topic: "Cấu trúc dữ liệu",
      timeMinutes: 60,
      questionCount: 40,
      difficulty: "Khó",
      difficultyColor: "bg-red-100 text-red-800",
      isPremium: true,
      price: 50000,
      isOwned: true,
    },
    {
      id: 4,
      name: "Lập trình hướng đối tượng với Java",
      topic: "Lập trình hướng đối tượng",
      timeMinutes: 45,
      questionCount: 25,
      difficulty: "Trung bình",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      isPremium: true,
      price: 50000,
    },
    {
      id: 5,
      name: "Cơ sở dữ liệu quan hệ và SQL",
      topic: "Cơ sở dữ liệu",
      timeMinutes: 40,
      questionCount: 30,
      difficulty: "Trung bình",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      isPremium: false,
    },
    {
      id: 6,
      name: "Bảo mật và mã hóa thông tin",
      topic: "An toàn thông tin",
      timeMinutes: 60,
      questionCount: 35,
      difficulty: "Khó",
      difficultyColor: "bg-red-100 text-red-800",
      isPremium: true,
      price: 50000,
    },
    {
      id: 7,
      name: "Hệ điều hành Linux cơ bản",
      topic: "Hệ điều hành",
      timeMinutes: 30,
      questionCount: 20,
      difficulty: "Dễ",
      difficultyColor: "bg-green-100 text-green-800",
      isPremium: false,
    },
    {
      id: 8,
      name: "Quản lý tiến trình trong hệ điều hành",
      topic: "Hệ điều hành",
      timeMinutes: 45,
      questionCount: 25,
      difficulty: "Trung bình",
      difficultyColor: "bg-yellow-100 text-yellow-800",
      isPremium: true,
      price: 50000,
      isOwned: true,
    },
  ];

  // lọc đề thi dựa trên bộ lọc
  useEffect(() => {
    let results = [...quizzes];
    if (searchKeyword) {
      results = results.filter(
        (quiz) =>
          quiz.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          quiz.topic.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    // loc theo chủ đề
    if (selectedTopic) {
      const topicName = topics.find((t) => t.id === selectedTopic)?.name;
      if (topicName) {
        results = results.filter((quiz) => quiz.topic === topicName);
      }
    }
    // loc theo độ khó
    if (selectedDifficulty) {
      results = results.filter(
        (quiz) => quiz.difficulty === selectedDifficulty
      );
    }
    // lọc theo giá
    // Lọc theo Premium
    if (showPremiumOnly) {
      results = results.filter((quiz) => quiz.isPremium);
    }
    setFilteredQuizzes(results);
  }, [searchKeyword, selectedTopic, selectedDifficulty, showPremiumOnly]);

  useEffect(() => {
    setFilteredQuizzes(quizzes);
  }, []);
  // xử lý reset bộ lọc
  const handleResetFilters = () => {
    setSelectedTopic(null);
    setSelectedDifficulty(null);
    setSearchKeyword("");
    setShowPremiumOnly(false);
  };
  // Định dạng giá tiền
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };
  // Xử lý khi click vào đề thi Premium
  const handleQuizClick = (quiz: Quiz) => {
    if (quiz.isPremium && !isPremiumUser) {
      setSelectedQuiz(quiz);
      setShowPremiumModal(true);
    } else {
      navigate(`/quiz/${quiz.id}`);
    }
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Chọn đề thi</h1>

        {/* Phần tìm kiếm và bộ lọc */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Thanh tìm kiếm */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none pb-5">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm đề thi..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Bộ lọc chủ đề */}
            <div>
              <label
                htmlFor="topic"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Chủ đề
              </label>
              <select
                id="topic"
                value={selectedTopic || ""}
                onChange={(e) =>
                  setSelectedTopic(
                    e.target.value ? Number(e.target.value) : null
                  )
                }
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả chủ đề</option>
                {topics.map((topic) => (
                  <option key={topic.id} value={topic.id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bộ lọc mức độ */}
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Mức độ
              </label>
              <select
                id="difficulty"
                value={selectedDifficulty || ""}
                onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả mức độ</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lọc Premium và các nút khác */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6">
            <div className="flex items-center mb-4 sm:mb-0">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPremiumOnly}
                  onChange={(e) => setShowPremiumOnly(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm font-medium flex items-center">
                  Chỉ hiển thị đề thi{" "}
                  <PremiumBadge size="sm" className="ml-1" />
                </span>
              </label>
              <button
                onClick={handleResetFilters}
                className="flex items-center ml-6 text-blue-600 hover:text-blue-800 text-sm"
              >
                <Filter className="h-4 w-4 mr-1" />
                Xóa bộ lọc
              </button>
            </div>

            <Link
              to="/quiz/random"
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Shuffle className="h-5 w-5 mr-2" />
              Làm bài ngẫu nhiên
            </Link>
          </div>
        </div>

        {/* Kết quả tìm kiếm */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Danh sách đề thi</h2>
            <p className="text-gray-600">{filteredQuizzes.length} đề thi</p>
          </div>

          {filteredQuizzes.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-500 text-lg">
                Không tìm thấy đề thi phù hợp với bộ lọc của bạn.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
              >
                Xóa bộ lọc và thử lại
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative"
                >
                  {quiz.isPremium && (
                    <div className="absolute top-3 right-3">
                      <PremiumBadge />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold pr-20">
                        {quiz.name}
                      </h3>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${quiz.difficultyColor}`}
                      >
                        {quiz.difficulty}
                      </span>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-600">
                        <BookOpen className="h-4 w-4 mr-2" />
                        <span>{quiz.topic}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>{quiz.timeMinutes} phút</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        <span>{quiz.questionCount} câu hỏi</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleQuizClick(quiz)}
                      className={`block w-full text-center py-2 rounded-md transition-colors ${
                        quiz.isPremium && !isPremiumUser
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700 flex items-center justify-center"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      {quiz.isPremium && !isPremiumUser ? (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Mở khóa
                        </>
                      ) : (
                        "Bắt đầu"
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal Premium */}
      {showPremiumModal && selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-2 bg-yellow-100 rounded-full mb-4">
                <PremiumBadge size="lg" />
              </div>
              <h3 className="text-xl font-bold mb-2">Đề thi Premium</h3>
              <p className="text-gray-600">
                Đề thi "{selectedQuiz.name}" là nội dung dành riêng cho thành
                viên Premium.
              </p>
            </div>

            <div className="bg-blue-50 rounded-md p-4 mb-6">
              <h4 className="font-medium mb-2">Lợi ích của gói Premium:</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  <span>
                    Truy cập tất cả đề thi cao cấp (
                    {quizzes.filter((q) => q.isPremium).length}+ đề thi)
                  </span>
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
}
export default ExamListPage;
