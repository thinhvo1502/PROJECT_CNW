"use client";

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Shuffle,
  Clock,
  BarChart3,
  Lock,
  Tag,
  BookMarked,
} from "lucide-react";
import PremiumBadge from "../components/PremiumBadge";
import { useAuth } from "../context/AuthContext";
import {
  getExams,
  type Exam,
  type ExamFilters,
  getDifficultyInVietnamese,
  getDifficultyColor,
  isPremiumExam,
} from "../services/examService";

const QuizSelection = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State cho từ khóa tìm kiếm
  const [searchKeyword, setSearchKeyword] = useState("");

  // State cho bộ lọc
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(
    null
  );
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);

  // State cho danh sách đề thi
  const [exams, setExams] = useState<Exam[]>([]);
  const [filteredExams, setFilteredExams] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State cho phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalExams, setTotalExams] = useState(0);

  // State cho modal Premium
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  // Đây là giả định trạng thái premium của người dùng
  // Trong thực tế, sẽ lấy từ state hoặc context
  const isPremiumUser = false;

  // Danh sách độ khó
  const difficulties = ["easy", "medium", "hard", "mixed"];

  // Lấy danh sách đề thi từ API
  useEffect(() => {
    const fetchExams = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Xây dựng bộ lọc
        const filters: ExamFilters = {
          page,
          limit: 12,
          search: searchKeyword || undefined,
          isPersonal: false, // Chỉ lấy đề thi công khai
          status: "published", // Chỉ lấy đề thi đã xuất bản
        };

        if (selectedTopic) {
          filters.topics = selectedTopic;
        }

        if (selectedDifficulty) {
          filters.difficulty = selectedDifficulty as any;
        }

        if (showPremiumOnly) {
          filters.isPremium = true;
        }

        const result = await getExams(filters);
        setExams(result.exams);
        setFilteredExams(result.exams);
        setTotalPages(result.pagination.pages);
        setTotalExams(result.pagination.total);
      } catch (error: any) {
        console.error("Error fetching exams:", error);
        setError(error.message || "Không thể tải danh sách đề thi");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExams();
  }, [page, selectedTopic, selectedDifficulty, showPremiumOnly, searchKeyword]);

  // Xử lý reset bộ lọc
  const handleResetFilters = () => {
    setSearchKeyword("");
    setSelectedTopic(null);
    setSelectedDifficulty(null);
    setShowPremiumOnly(false);
    setPage(1);
  };

  // Xử lý khi click vào đề thi Premium
  const handleExamClick = (exam: Exam) => {
    if (isPremiumExam(exam) && !isPremiumUser) {
      setSelectedExam(exam);
      setShowPremiumModal(true);
    } else {
      navigate(`/exam/${exam._id}`);
    }
  };

  // Xử lý chuyển trang
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  // Lấy danh sách tất cả các chủ đề từ exams
  const getAllTopics = () => {
    const topicsSet = new Set<string>();
    const topicsMap = new Map<string, { _id: string; name: string }>();

    exams.forEach((exam) => {
      if (Array.isArray(exam.topics)) {
        exam.topics.forEach((topic) => {
          if (typeof topic !== "string") {
            topicsSet.add(topic.name);
            topicsMap.set(topic._id, topic);
          }
        });
      }
    });

    return Array.from(topicsMap.values());
  };

  const handleRandomQuiz = async () => {
    try {
      setIsLoading(true);
      // Lấy danh sách đề thi với bộ lọc hiện tại
      const filters: ExamFilters = {
        limit: 100, // Lấy nhiều đề thi để có nhiều lựa chọn ngẫu nhiên
        status: "published",
      };

      if (selectedTopic) {
        filters.topics = selectedTopic;
      }

      if (selectedDifficulty) {
        filters.difficulty = selectedDifficulty as any;
      }

      if (showPremiumOnly) {
        filters.isPremium = true;
      }

      const result = await getExams(filters);

      if (result.exams.length === 0) {
        setError("Không tìm thấy đề thi phù hợp để làm bài ngẫu nhiên");
        setIsLoading(false);
        return;
      }

      // Chọn một đề thi ngẫu nhiên
      const randomIndex = Math.floor(Math.random() * result.exams.length);
      const randomExam = result.exams[randomIndex];

      // Kiểm tra nếu là đề thi premium
      if (isPremiumExam(randomExam) && !isPremiumUser) {
        setSelectedExam(randomExam);
        setShowPremiumModal(true);
      } else {
        navigate(`/exam/${randomExam._id}`);
      }

      setIsLoading(false);
    } catch (error: any) {
      console.error("Error fetching random exam:", error);
      setError(error.message || "Không thể tải đề thi ngẫu nhiên");
      setIsLoading(false);
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
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
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
                onChange={(e) => setSelectedTopic(e.target.value || null)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả chủ đề</option>
                {getAllTopics().map((topic) => (
                  <option key={topic._id} value={topic._id}>
                    {topic.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Bộ lọc độ khó */}
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Độ khó
              </label>
              <select
                id="difficulty"
                value={selectedDifficulty || ""}
                onChange={(e) => setSelectedDifficulty(e.target.value || null)}
                className="w-full rounded-md border border-gray-300 py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Tất cả độ khó</option>
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {getDifficultyInVietnamese(difficulty)}
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

            <button
              onClick={handleRandomQuiz}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Shuffle className="h-5 w-5 mr-2" />
              Làm bài ngẫu nhiên
            </button>
          </div>
        </div>

        {/* Kết quả tìm kiếm */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Danh sách đề thi</h2>
            <p className="text-gray-600">{totalExams} đề thi</p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-6">
              <p>{error}</p>
              <button
                onClick={handleResetFilters}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Thử lại
              </button>
            </div>
          ) : filteredExams.length === 0 ? (
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExams.map((exam) => (
                  <div
                    key={exam._id}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow relative cursor-pointer"
                    onClick={() => handleExamClick(exam)}
                  >
                    {isPremiumExam(exam) && (
                      <div className="absolute top-3 right-3">
                        <PremiumBadge />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex flex-col mb-4">
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-semibold">
                            {exam.title}
                          </h3>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span
                            className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(
                              "medium" // Giả sử độ khó mặc định là trung bình
                            )}`}
                          >
                            {getDifficultyInVietnamese("medium")}
                          </span>
                        </div>
                      </div>

                      {exam.description && (
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                          {exam.description}
                        </p>
                      )}

                      <div className="space-y-3 mb-6">
                        {/* Chủ đề */}
                        {Array.isArray(exam.topics) &&
                          exam.topics.length > 0 && (
                            <div className="flex items-center text-gray-600">
                              <BookMarked className="h-4 w-4 mr-2" />
                              <span>
                                {exam.topics
                                  .map((topic) =>
                                    typeof topic === "string"
                                      ? topic
                                      : topic.name
                                  )
                                  .join(", ")}
                              </span>
                            </div>
                          )}

                        {/* Thời gian */}
                        <div className="flex items-center text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{exam.timeLimit} phút</span>
                        </div>

                        {/* Số câu hỏi */}
                        <div className="flex items-center text-gray-600">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          <span>{exam.questionCount} câu hỏi</span>
                        </div>

                        {/* Tags */}
                        {Array.isArray(exam.tags) && exam.tags.length > 0 && (
                          <div className="flex items-center text-gray-600">
                            <Tag className="h-4 w-4 mr-2" />
                            <div className="flex flex-wrap gap-1">
                              {exam.tags.slice(0, 3).map((tag, index) => (
                                <span
                                  key={index}
                                  className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded"
                                >
                                  {typeof tag === "string" ? tag : tag.name}
                                </span>
                              ))}
                              {exam.tags.length > 3 && (
                                <span className="inline-block text-gray-500 text-xs">
                                  +{exam.tags.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleExamClick(exam);
                        }}
                        className={`block w-full text-center py-2 rounded-md transition-colors ${
                          isPremiumExam(exam) && !isPremiumUser
                            ? "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white hover:from-yellow-500 hover:to-yellow-700 flex items-center justify-center"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                      >
                        {isPremiumExam(exam) && !isPremiumUser ? (
                          <>
                            <Lock className="h-4 w-4 mr-2" />
                            Mở khóa
                          </>
                        ) : (
                          "Xem chi tiết"
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Phân trang */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                      className={`px-3 py-1 rounded-md ${
                        page === 1
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Trước
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNumber) => (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-1 rounded-md ${
                            pageNumber === page
                              ? "bg-blue-600 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {pageNumber}
                        </button>
                      )
                    )}
                    <button
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                      className={`px-3 py-1 rounded-md ${
                        page === totalPages
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      Sau
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal Premium */}
      {showPremiumModal && selectedExam && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-2 bg-yellow-100 rounded-full mb-4">
                <PremiumBadge size="lg" />
              </div>
              <h3 className="text-xl font-bold mb-2">Đề thi Premium</h3>
              <p className="text-gray-600">
                Đề thi "{selectedExam.title}" là nội dung dành riêng cho thành
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

export default QuizSelection;
