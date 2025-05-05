import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronDown,
  ChevronRight,
  BarChart2,
} from "lucide-react";
import React from "react";
// định nghĩa kiểu dữ liệu cho chủ đề nhỏ
interface SubTopic {
  id: number;
  name: string;
  parentTopic: string;
  parentTopicId: number;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  isMastered: boolean;
  lastPracticed: string;
  description: string;
}
const SmartSuggestionsPage = () => {
  // state cho tab hiện tại
  const [activeTab, setActiveTab] = useState<"all" | "improve" | "mastered">(
    "all"
  );
  // state cho bộ lọc
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedParentTopic, setSelectedParentTopic] = useState<number | null>(
    null
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // state cho danh sách chủ đề nhỏ đã lọc
  const [filteredSubTopics, setFilteredSubTopics] = useState<SubTopic[]>([]);
  // danh sách chủ đề lớn
  const parentTopics = [
    { id: 1, name: "Mạng máy tính" },
    { id: 2, name: "Cấu trúc dữ liệu" },
    { id: 3, name: "Lập trình hướng đối tượng" },
    { id: 4, name: "Cơ sở dữ liệu" },
    { id: 5, name: "An toàn thông tin" },
    { id: 6, name: "Hệ điều hành" },
  ];

  // Dữ liệu mẫu cho các chủ đề nhỏ
  const subTopics: SubTopic[] = [
    {
      id: 1,
      name: "Mạng LAN",
      parentTopic: "Mạng máy tính",
      parentTopicId: 1,
      correctAnswers: 18,
      totalQuestions: 20,
      percentage: 90,
      isMastered: true,
      lastPracticed: "2023-05-15",
      description: "Kiến thức về mạng cục bộ, cấu trúc và cách thức hoạt động.",
    },
    {
      id: 2,
      name: "Giao thức TCP/IP",
      parentTopic: "Mạng máy tính",
      parentTopicId: 1,
      correctAnswers: 12,
      totalQuestions: 15,
      percentage: 80,
      isMastered: true,
      lastPracticed: "2023-05-10",
      description:
        "Hiểu biết về bộ giao thức TCP/IP và cách thức hoạt động của nó.",
    },
    {
      id: 3,
      name: "Mô hình OSI",
      parentTopic: "Mạng máy tính",
      parentTopicId: 1,
      correctAnswers: 8,
      totalQuestions: 15,
      percentage: 53.33,
      isMastered: false,
      lastPracticed: "2023-05-08",
      description:
        "Kiến thức về mô hình 7 tầng OSI và chức năng của từng tầng.",
    },
    {
      id: 4,
      name: "Mạng không dây",
      parentTopic: "Mạng máy tính",
      parentTopicId: 1,
      correctAnswers: 5,
      totalQuestions: 12,
      percentage: 41.67,
      isMastered: false,
      lastPracticed: "2023-05-05",
      description: "Hiểu biết về các công nghệ mạng không dây và bảo mật.",
    },
    {
      id: 5,
      name: "Cây nhị phân",
      parentTopic: "Cấu trúc dữ liệu",
      parentTopicId: 2,
      correctAnswers: 14,
      totalQuestions: 15,
      percentage: 93.33,
      isMastered: true,
      lastPracticed: "2023-05-12",
      description:
        "Kiến thức về cây nhị phân, cây nhị phân tìm kiếm và các thuật toán liên quan.",
    },
    {
      id: 6,
      name: "Đồ thị",
      parentTopic: "Cấu trúc dữ liệu",
      parentTopicId: 2,
      correctAnswers: 10,
      totalQuestions: 20,
      percentage: 50,
      isMastered: false,
      lastPracticed: "2023-05-07",
      description:
        "Hiểu biết về đồ thị, các thuật toán duyệt và tìm đường đi ngắn nhất.",
    },
    {
      id: 7,
      name: "Hàng đợi và Ngăn xếp",
      parentTopic: "Cấu trúc dữ liệu",
      parentTopicId: 2,
      correctAnswers: 18,
      totalQuestions: 20,
      percentage: 90,
      isMastered: true,
      lastPracticed: "2023-05-14",
      description:
        "Kiến thức về cấu trúc dữ liệu hàng đợi (Queue) và ngăn xếp (Stack).",
    },
    {
      id: 8,
      name: "Tính kế thừa",
      parentTopic: "Lập trình hướng đối tượng",
      parentTopicId: 3,
      correctAnswers: 7,
      totalQuestions: 15,
      percentage: 46.67,
      isMastered: false,
      lastPracticed: "2023-05-09",
      description: "Hiểu biết về tính kế thừa trong lập trình hướng đối tượng.",
    },
    {
      id: 9,
      name: "Tính đa hình",
      parentTopic: "Lập trình hướng đối tượng",
      parentTopicId: 3,
      correctAnswers: 6,
      totalQuestions: 15,
      percentage: 40,
      isMastered: false,
      lastPracticed: "2023-05-06",
      description:
        "Kiến thức về tính đa hình và cách áp dụng trong lập trình hướng đối tượng.",
    },
    {
      id: 10,
      name: "Đóng gói dữ liệu",
      parentTopic: "Lập trình hướng đối tượng",
      parentTopicId: 3,
      correctAnswers: 12,
      totalQuestions: 15,
      percentage: 80,
      isMastered: true,
      lastPracticed: "2023-05-11",
      description:
        "Hiểu biết về tính đóng gói và che giấu thông tin trong lập trình hướng đối tượng.",
    },
    {
      id: 11,
      name: "Truy vấn SQL cơ bản",
      parentTopic: "Cơ sở dữ liệu",
      parentTopicId: 4,
      correctAnswers: 18,
      totalQuestions: 20,
      percentage: 90,
      isMastered: true,
      lastPracticed: "2023-05-13",
      description:
        "Kiến thức về các câu lệnh SQL cơ bản như SELECT, INSERT, UPDATE, DELETE.",
    },
    {
      id: 12,
      name: "Truy vấn SQL nâng cao",
      parentTopic: "Cơ sở dữ liệu",
      parentTopicId: 4,
      correctAnswers: 8,
      totalQuestions: 20,
      percentage: 40,
      isMastered: false,
      lastPracticed: "2023-05-04",
      description:
        "Hiểu biết về các truy vấn SQL nâng cao như JOIN, GROUP BY, HAVING, subquery.",
    },
    {
      id: 13,
      name: "Mã hóa dữ liệu",
      parentTopic: "An toàn thông tin",
      parentTopicId: 5,
      correctAnswers: 5,
      totalQuestions: 15,
      percentage: 33.33,
      isMastered: false,
      lastPracticed: "2023-05-03",
      description:
        "Kiến thức về các thuật toán mã hóa và ứng dụng trong bảo mật thông tin.",
    },
    {
      id: 14,
      name: "Bảo mật mạng",
      parentTopic: "An toàn thông tin",
      parentTopicId: 5,
      correctAnswers: 7,
      totalQuestions: 15,
      percentage: 46.67,
      isMastered: false,
      lastPracticed: "2023-05-02",
      description:
        "Hiểu biết về các phương pháp bảo mật mạng và phòng chống tấn công.",
    },
    {
      id: 15,
      name: "Quản lý tiến trình",
      parentTopic: "Hệ điều hành",
      parentTopicId: 6,
      correctAnswers: 14,
      totalQuestions: 15,
      percentage: 93.33,
      isMastered: true,
      lastPracticed: "2023-05-16",
      description: "Kiến thức về quản lý tiến trình trong hệ điều hành.",
    },
    {
      id: 16,
      name: "Quản lý bộ nhớ",
      parentTopic: "Hệ điều hành",
      parentTopicId: 6,
      correctAnswers: 9,
      totalQuestions: 15,
      percentage: 60,
      isMastered: false,
      lastPracticed: "2023-05-01",
      description:
        "Hiểu biết về các phương pháp quản lý bộ nhớ trong hệ điều hành.",
    },
  ];
  // tính toán số lượng chủ đề đã thành thạo
  const masteredCount = subTopics.filter((topic) => topic.isMastered).length;
  const masteryPercentage = (masteredCount / subTopics.length) * 100;
  // lọc chủ đề dựa trên tab và bộ lọc
  useEffect(() => {
    let results = [...subTopics];
    // lọc theo tab
    if (activeTab === "improve") {
      results = results.filter((topic) => !topic.isMastered);
    } else if (activeTab === "mastered") {
      results = results.filter((topic) => topic.isMastered);
    }
    // lọc theo từ khóa
    if (searchKeyword) {
      results = results.filter(
        (topic) =>
          topic.name.toLowerCase().includes(searchKeyword.toLowerCase()) ||
          topic.parentTopic
            .toLowerCase()
            .includes(searchKeyword.toLowerCase()) ||
          topic.description.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }
    // lọc theo chủ đề lớn
    if (selectedParentTopic) {
      results = results.filter(
        (topic) => topic.parentTopicId === selectedParentTopic
      );
    }
    setFilteredSubTopics(results);
  }, [activeTab, searchKeyword, selectedParentTopic]);
  // khởi tạo danh sách chủ đề ban đầu
  useEffect(() => {
    setFilteredSubTopics(subTopics);
  }, []);
  // xử lý reset bộ lọc
  const handleResetFilters = () => {
    setSearchKeyword("");
    setSelectedParentTopic(null);
  };
  // format ngày
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  };
  // lấy gợi ý dựa trên tỉ lệ phần trăm
  const getSuggestion = (topic: SubTopic) => {
    if (topic.isMastered) {
      return "Bạn đã thành thạo chủ đề này. Hãy tiếp tục duy trì kiến thức bằng cách ôn tập định kỳ.";
    } else if (topic.percentage >= 50) {
      return `Bạn đã nắm được các kiến thức cơ bản. Hãy tập trung vào ${
        topic.totalQuestions - topic.correctAnswers
      } câu hỏi còn lại để thành thạo chủ đề này.`;
    } else {
      return "Bạn cần ôn tập lại kiến thức cơ bản về chủ đề này. Hãy bắt đầu với các bài học nền tảng.";
    }
  };
  // Lấy màu sắc dựa trên tỷ lệ phần trăm
  const getColorByPercentage = (percentage: number) => {
    if (percentage >= 80) return "bg-green-100 text-green-800";
    if (percentage >= 50) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Lấy icon dựa trên trạng thái thành thạo
  const getMasteryIcon = (isMastered: boolean) => {
    return isMastered ? (
      <CheckCircle className="h-5 w-5 text-green-600" />
    ) : (
      <AlertCircle className="h-5 w-5 text-yellow-600" />
    );
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Gợi ý thông minh</h1>
        <p className="text-gray-600 mb-8">
          Dựa trên kết quả bài làm của bạn, chúng tôi đã phân tích và đưa ra các
          gợi ý để giúp bạn cải thiện kiến thức.
        </p>
        {/* Thanh tiến trình thanh thạo */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <h2 className="text-lg font-semibold">Tiến trình thành thạo</h2>
              <p className="text-sm text-gray-600">
                Bạn đã thành thạo {masteredCount}/{subTopics.length} chủ đề nhỏ
              </p>
            </div>
            <div className="mt-2 md:mt-0 text-2xl font-bold text-blue-600">
              {masteryPercentage.toFixed(1)}%
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${masteryPercentage}%` }}
            ></div>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span>Thành thạo: {masteredCount}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
              <span>Cần cải thiện: {subTopics.length - masteredCount}</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span>Tổng số chủ đề: {subTopics.length}</span>
            </div>
            <div className="flex items-center">
              <BarChart2 className="w-4 h-4 text-blue-500 mr-2" />
              <span>Mục tiêu: 100%</span>
            </div>
          </div>
        </div>
        {/* Tabs và bộ lọc */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            {/* Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-md">
              <button
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === "all"
                    ? "bg-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Tất cả ({subTopics.length})
              </button>
              <button
                onClick={() => setActiveTab("improve")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === "improve"
                    ? "bg-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Cần cải thiện ({subTopics.filter((t) => !t.isMastered).length})
              </button>
              <button
                onClick={() => setActiveTab("mastered")}
                className={`px-4 py-2 text-sm font-medium rounded-md ${
                  activeTab === "mastered"
                    ? "bg-white shadow-sm"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                Thành thạo ({subTopics.filter((t) => t.isMastered).length})
              </button>
            </div>
            {/* Bộ lọc */}
            <div className="mt-4 md:mt-0 relative">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
              >
                <Filter className="h-4 w-4 mr-2" />
                <span>Bộ lọc</span>
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {isFilterOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-2 z-10 border border-gray-200">
                  <div className="px-3 py-2">
                    <label
                      htmlFor="topic-filter"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Chủ đề lớn
                    </label>
                    <select
                      id="topic-filter"
                      value={selectedParentTopic || ""}
                      onChange={(e) =>
                        setSelectedParentTopic(
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="w-full rounded-md border border-gray-300 py-1.5 px-3 text-sm focus:outline-none focus: ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Tất cả chủ đề</option>
                      {parentTopics.map((topic) => (
                        <option key={topic.id} value={topic.id}>
                          {topic.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="border-t border-gray-200 mt-2 pt-2 px-3">
                    <button
                      onClick={handleResetFilters}
                      className="w-full text-left text-sm text-blue-600 hover:text-blue-800 py-1"
                    >
                      Xóa bộ lọc
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Thanh tìm kiếm */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Tìm kiếm chủ đề"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 focus: outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {/* Danh sách chủ đề */}
          {filteredSubTopics.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <BookOpen className="h-8 w-8 text-gray-500" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                Không tìm thấy chủ đề
              </h3>
              <p className="text-gray-500">
                Không có chủ đề nào phù hợp với bộ lọc của bạn.
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
              {filteredSubTopics.map((topic) => (
                <div
                  key={topic.id}
                  className={`border rounded-lg overflow-hidden hover:shadow-md transition-shadow ${
                    topic.isMastered ? "border-green-200" : "border-yellow-200"
                  } `}
                >
                  <div
                    className={`p-4 ${
                      topic.isMastered
                        ? "bg-green-50 border-b border-green-200"
                        : "bg-yellow-50 border-b border-yellow-200"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span
                          className={`inline-block px-2 py-1 text-xs font-medium rounded-full mb-2 ${getColorByPercentage(
                            topic.percentage
                          )}`}
                        >
                          {topic.percentage}%
                        </span>
                        <h3 className="text-lg font-semibold">{topic.name}</h3>
                        <p className="text-sm text-gray-600">
                          {topic.parentTopic}
                        </p>
                      </div>
                      <div className="flex items-center">
                        {getMasteryIcon(topic.isMastered)}
                        <span className="ml-1 text-sm font-medium">
                          {topic.isMastered ? "Thành thạo" : "Cần cải thiện"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-4">
                      {topic.description}
                    </p>
                    <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                      <div>
                        Đúng: {topic.correctAnswers}/{topic.totalQuestions}
                      </div>
                      <div>Lần cuối: {formatDate(topic.lastPracticed)}</div>
                    </div>
                    <div className="mb-4">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            topic.percentage >= 80
                              ? "bg-green-500"
                              : topic.percentage >= 50
                              ? "bg-yellow-500"
                              : "bg-red-500"
                          }`}
                          style={{ width: `${topic.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mb-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
                      <p>{getSuggestion(topic)}</p>
                    </div>
                    <Link
                      to={`/quiz/topic/${topic.id}`}
                      className="flex items-center justify-center w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Luyện tập ngay
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default SmartSuggestionsPage;
