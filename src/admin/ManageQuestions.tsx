"use client";
import { Link } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { debounce } from "lodash";
import {
  Home,
  FileText,
  Users,
  Settings,
  PlusCircle,
  Search,
  Edit,
  Trash2,
  X,
  BarChart2,
  Filter,
  ChevronDown,
  Menu,
  Bell,
  User,
  AlertTriangle,
  Check,
  Sparkles,
  HelpCircle,
} from "lucide-react";

const API_URL = "https://e5b7-116-110-41-31.ngrok-free.app/api/questions";
const PAGE_SIZE = 10;

// Map English difficulty names to Vietnamese and vice versa
const difficultyMap = {
  Easy: "Dễ",
  Medium: "Trung bình",
  Hard: "Khó",
  "Very Hard": "Rất khó",
};
const vietnameseToEnglishDifficultyMap = Object.fromEntries(
  Object.entries(difficultyMap).map(([k, v]) => [v, k])
);

const ManageQuestions = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Tất cả");
  const [selectedTopic, setSelectedTopic] = useState("Tất cả");
  const [showDifficultyFilter, setShowDifficultyFilter] = useState(false);
  const [showTopicFilter, setShowTopicFilter] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success");
  const [showAIHelper, setShowAIHelper] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [questions, setQuestions] = useState([]);
  const [topics, setTopics] = useState(["Tất cả"]);
  const [difficulties, setDifficulties] = useState(["Tất cả"]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [topicIdMap, setTopicIdMap] = useState(new Map());
  const [formData, setFormData] = useState({
    content: "",
    topic: "",
    difficulty: "",
    options: [
      { id: "A", text: "", isCorrect: false },
      { id: "B", text: "", isCorrect: false },
      { id: "C", text: "", isCorrect: false },
      { id: "D", text: "", isCorrect: false },
    ],
  });

  // Fetch all topics and difficulties from API only
  useEffect(() => {
    const fetchAllQuestions = async () => {
      try {
        setIsLoading(true);
        let allQuestions = [];
        let page = 1;
        let totalPages = 1;

        // Lặp qua tất cả các trang để lấy toàn bộ câu hỏi
        do {
          const params = new URLSearchParams();
          params.append("page", page.toString());
          params.append("limit", "100"); // lấy nhiều nhất có thể mỗi lần
          const response = await axios.get(`${API_URL}?${params.toString()}`, {
            headers: { "ngrok-skip-browser-warning": "true" },
          });
          const data = response.data.data || [];
          allQuestions = allQuestions.concat(data);
          totalPages = response.data.pagination?.pages || 1;
          page++;
        } while (page <= totalPages);

        // Tổng hợp topic (name và id) và difficulty
        const topicMap = new Map();
        const difficultySet = new Set();

        allQuestions.forEach((q) => {
          // Chủ đề
          if (q.topic) {
            let topicName = "";
            let topicId = "";
            if (typeof q.topic === "object" && q.topic !== null) {
              topicName = q.topic.name;
              topicId = q.topic._id || q.topic.id || topicName;
            } else {
              topicName = q.topic;
              topicId = q.topic;
            }
            if (topicName) topicMap.set(topicName, topicId);
          }
          // Mức độ
          if (q.difficulty) {
            let difficultyName =
              typeof q.difficulty === "object" && q.difficulty !== null
                ? q.difficulty.name
                : q.difficulty;
            difficultyName = difficultyMap[difficultyName] || difficultyName;
            if (difficultyName) difficultySet.add(difficultyName);
          }
        });

        setTopics(["Tất cả", ...Array.from(topicMap.keys())]);
        setTopicIdMap(topicMap); // Lưu map name -> id
        setDifficulties(["Tất cả", ...Array.from(difficultySet)]);

        // Khởi tạo formData
        const topicsArray = Array.from(topicMap.keys());
        const difficultiesArray = Array.from(difficultySet);
        if (topicsArray.length > 0) {
          setFormData((prev) => ({ ...prev, topic: topicsArray[0] }));
        }
        if (difficultiesArray.length > 0) {
          setFormData((prev) => ({
            ...prev,
            difficulty: difficultiesArray[0],
          }));
        }
      } catch (error) {
        console.error("Error fetching metadata:", error);
        setTopics(["Tất cả"]);
        setDifficulties(["Tất cả"]);
        showNotificationMessage("Lỗi khi tải danh sách bộ lọc!", "error");
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllQuestions();
  }, []);

  // Fetch questions
  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", PAGE_SIZE.toString());
      if (searchTerm) params.append("search", searchTerm);
      if (selectedDifficulty !== "Tất cả") {
        const apiDifficulty =
          vietnameseToEnglishDifficultyMap[selectedDifficulty] ||
          selectedDifficulty;
        params.append("difficulty", apiDifficulty);
      }
      if (selectedTopic !== "Tất cả") {
        const topicId = topicIdMap.get(selectedTopic) || selectedTopic;
        params.append("topic", topicId);
      }

      const response = await axios.get(`${API_URL}?${params.toString()}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
      });
      const data = response.data.data || [];
      setQuestions(data);
      setTotalPages(response.data.pagination?.pages || 1);

      if (data.length === 0 && currentPage > 1) {
        setCurrentPage(1); // Reset to first page if current page has no results
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      // Generate some sample data if API fails
      const sampleQuestions = generateSampleQuestions();
      setQuestions(sampleQuestions);
      setTotalPages(Math.ceil(sampleQuestions.length / PAGE_SIZE));
      showNotificationMessage(
        "Lỗi khi tải dữ liệu câu hỏi! Đang hiển thị dữ liệu mẫu.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add this helper function to generate sample data when API fails
  const generateSampleQuestions = () => {
    const sampleTopics = topics.filter((t) => t !== "Tất cả");
    const sampleDifficulties = difficulties.filter((d) => d !== "Tất cả");

    return Array.from({ length: 20 }, (_, i) => ({
      id: i + 1,
      content: `Câu hỏi mẫu ${i + 1} cho trường hợp API không hoạt động`,
      topic: sampleTopics[i % sampleTopics.length] || "Lập trình",
      difficulty:
        sampleDifficulties[i % sampleDifficulties.length] || "Trung bình",
      options: [
        { id: "A", text: "Lựa chọn A", isCorrect: i % 4 === 0 },
        { id: "B", text: "Lựa chọn B", isCorrect: i % 4 === 1 },
        { id: "C", text: "Lựa chọn C", isCorrect: i % 4 === 2 },
        { id: "D", text: "Lựa chọn D", isCorrect: i % 4 === 3 },
      ],
      correctAnswer: String.fromCharCode(65 + (i % 4)), // A, B, C, or D
    }));
  };

  useEffect(() => {
    fetchQuestions();
    // eslint-disable-next-line
  }, [currentPage, searchTerm, selectedDifficulty, selectedTopic]);

  const handleAddQuestion = () => {
    setFormData({
      content: "",
      topic: topics[1] || "",
      difficulty: difficulties[1] || "",
      options: [
        { id: "A", text: "", isCorrect: false },
        { id: "B", text: "", isCorrect: false },
        { id: "C", text: "", isCorrect: false },
        { id: "D", text: "", isCorrect: false },
      ],
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, field, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };

    if (field === "isCorrect" && value === true) {
      newOptions.forEach((option, i) => {
        if (i !== index) {
          newOptions[i] = { ...newOptions[i], isCorrect: false };
        }
      });
    }

    setFormData((prev) => ({ ...prev, options: newOptions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleCancel();
    showNotificationMessage(
      "Chức năng này cần kết nối API để lưu dữ liệu!",
      "error"
    );
  };

  const handleSearch = useCallback(
    debounce((value) => {
      setSearchTerm(value);
      setCurrentPage(1);
    }, 300),
    []
  );

  const confirmDeleteQuestion = (id) => {
    setQuestionToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteQuestion = () => {
    setShowDeleteConfirm(false);
    showNotificationMessage(
      "Chức năng này cần kết nối API để xóa dữ liệu!",
      "error"
    );
  };

  const handleEditQuestion = (id) => {
    const questionToEdit = questions.find(
      (question) => question.id === id || question._id === id
    );
    if (questionToEdit) {
      setFormData({
        id: questionToEdit.id || questionToEdit._id,
        content: questionToEdit.content,
        topic:
          typeof questionToEdit.topic === "object" &&
          questionToEdit.topic !== null
            ? questionToEdit.topic.name
            : questionToEdit.topic,
        difficulty:
          typeof questionToEdit.difficulty === "object" &&
          questionToEdit.difficulty !== null
            ? difficultyMap[questionToEdit.difficulty.name] ||
              questionToEdit.difficulty.name
            : difficultyMap[questionToEdit.difficulty] ||
              questionToEdit.difficulty,
        options: Array.isArray(questionToEdit.options)
          ? [...questionToEdit.options]
          : [
              { id: "A", text: "", isCorrect: false },
              { id: "B", text: "", isCorrect: false },
              { id: "C", text: "", isCorrect: false },
              { id: "D", text: "", isCorrect: false },
            ],
      });
      setShowForm(true);
    }
  };

  const handleDifficultyFilter = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setShowDifficultyFilter(false);
    setCurrentPage(1);
  };

  const handleTopicFilter = (topic) => {
    setSelectedTopic(topic);
    setShowTopicFilter(false);
    setCurrentPage(1);
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) {
      showNotificationMessage("Vui lòng nhập nội dung để tạo câu hỏi", "error");
      return;
    }
    setTimeout(() => {
      const newQuestion = {
        content: aiPrompt,
        topic: topics.includes("Trí tuệ nhân tạo")
          ? "Trí tuệ nhân tạo"
          : topics[1] || "",
        difficulty: difficulties.includes("Trung bình")
          ? "Trung bình"
          : difficulties[1] || "",
        options: [
          { id: "A", text: "Đáp án được tạo tự động A", isCorrect: false },
          { id: "B", text: "Đáp án được tạo tự động B", isCorrect: true },
          { id: "C", text: "Đáp án được tạo tự động C", isCorrect: false },
          { id: "D", text: "Đáp án được tạo tự động D", isCorrect: false },
        ],
      };
      setFormData(newQuestion);
      setShowAIHelper(false);
      setShowForm(true);
      showNotificationMessage("Đã tạo câu hỏi từ AI thành công", "success");
    }, 1500);
  };

  // Pagination logic
  const getPaginationRange = () => {
    const maxPagesToShow = 5;
    const halfRange = Math.floor(maxPagesToShow / 2);
    let start = Math.max(1, currentPage - halfRange);
    const end = Math.min(totalPages, start + maxPagesToShow - 1);

    if (end === totalPages) {
      start = Math.max(1, end - maxPagesToShow + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return { start, end, pages };
  };

  const { start, end, pages } = getPaginationRange();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="flex flex-col items-center">
          <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-blue-600"></div>
          <p className="mt-4 text-lg font-medium text-blue-600">
            Đang tải dữ liệu...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-2xl transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Quản trị hệ thống</h1>
            <button
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-6 flex items-center space-x-3 rounded-lg bg-white/10 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-700">
              <User className="h-6 w-6" />
            </div>
            <div>
              <p className="font-medium">Admin</p>
              <p className="text-sm text-white/70">Quản trị viên</p>
            </div>
          </div>

          <nav className="mt-8 flex-1">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-white/50">
              Quản lý
            </p>
            <ul className="space-y-1.5">
              <li>
                <Link
                  to="/admin/home"
                  className="flex items-center rounded-lg p-3 text-white/80 transition-all hover:bg-white/10"
                >
                  <Home className="mr-3 h-5 w-5" />
                  <span>Trang chủ</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-exams"
                  className="flex items-center rounded-lg p-3 text-white/80 transition-all hover:bg-white/10"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  <span>Đề thi</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-users"
                  className="flex items-center rounded-lg p-3 text-white/80 transition-all hover:bg-white/10"
                >
                  <Users className="mr-3 h-5 w-5" />
                  <span>Người dùng</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-questions"
                  className="flex items-center rounded-lg bg-white/10 p-3 text-white transition-all hover:bg-white/20"
                >
                  <BarChart2 className="mr-3 h-5 w-5" />
                  <span>Câu hỏi</span>
                </Link>
              </li>
            </ul>

            <p className="mb-2 mt-8 text-xs font-semibold uppercase tracking-wider text-white/50">
              Hệ thống
            </p>
            <ul className="space-y-1.5">
              <li>
                <a
                  href="#"
                  className="flex items-center rounded-lg p-3 text-white/80 transition-all hover:bg-white/10"
                >
                  <Settings className="mr-3 h-5 w-5" />
                  <span>Cài đặt</span>
                </a>
              </li>
            </ul>
          </nav>

          <div className="mt-auto rounded-lg bg-white/10 p-4">
            <p className="text-sm font-medium">Cần trợ giúp?</p>
            <p className="mt-1 text-xs text-white/70">
              Liên hệ bộ phận hỗ trợ kỹ thuật
            </p>
            <button className="mt-3 w-full rounded-lg bg-white py-2 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-50">
              Liên hệ hỗ trợ
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 bg-gradient-to-r from-blue-50 via-white to-blue-50 p-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="mr-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
                Quản lý Câu hỏi
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi..."
                  className="w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>

              <button className="relative rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  3
                </span>
              </button>

              <div className="flex space-x-2">
                <button
                  onClick={() => setShowAIHelper(true)}
                  className="flex items-center rounded-lg bg-purple-600 px-4 py-2 text-white shadow-md transition-all hover:bg-purple-700 hover:shadow-lg"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Tạo bằng AI</span>
                  <span className="sm:hidden">AI</span>
                </button>

                <button
                  onClick={handleAddQuestion}
                  className="flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Thêm Câu hỏi</span>
                  <span className="sm:hidden">Thêm</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          <div className="mb-6 flex flex-wrap items-center gap-4">
            <div className="relative">
              <button
                onClick={() => setShowDifficultyFilter(!showDifficultyFilter)}
                className={`flex items-center rounded-lg border px-4 py-2 text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 ${
                  selectedDifficulty !== "Tất cả"
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Filter className="mr-2 h-4 w-4" />
                Mức độ: {selectedDifficulty}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              {showDifficultyFilter && (
                <div className="absolute left-0 z-10 mt-2 w-48 rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="py-1">
                    {difficulties.map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => handleDifficultyFilter(difficulty)}
                        className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-blue-50 hover:text-blue-700 ${
                          selectedDifficulty === difficulty
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {difficulty}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <button
                onClick={() => setShowTopicFilter(!showTopicFilter)}
                className={`flex items-center rounded-lg border px-4 py-2 text-gray-600 shadow-sm transition-all hover:bg-gray-50 hover:text-gray-900 ${
                  selectedTopic !== "Tất cả"
                    ? "border-blue-300 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-white"
                }`}
              >
                <Filter className="mr-2 h-4 w-4" />
                Chủ đề: {selectedTopic}
                <ChevronDown className="ml-2 h-4 w-4" />
              </button>
              {showTopicFilter && (
                <div className="absolute left-0 z-10 mt-2 max-h-96 w-64 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="py-1">
                    {topics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleTopicFilter(topic)}
                        className={`block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-blue-50 hover:text-blue-700 ${
                          selectedTopic === topic
                            ? "bg-blue-50 text-blue-700 font-medium"
                            : "text-gray-700"
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {(selectedDifficulty !== "Tất cả" ||
              selectedTopic !== "Tất cả") && (
              <button
                onClick={() => {
                  setSelectedDifficulty("Tất cả");
                  setSelectedTopic("Tất cả");
                  setCurrentPage(1);
                }}
                className="flex items-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600 shadow-sm transition-all hover:bg-gray-50"
              >
                <X className="mr-2 h-4 w-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>

          <div className="mb-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
            <div className="border-b p-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách Câu hỏi
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-sm text-gray-600">
                    <th className="px-6 py-4 text-left font-medium">ID</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Nội dung
                    </th>
                    <th className="px-6 py-4 text-left font-medium">Chủ đề</th>
                    <th className="px-6 py-4 text-left font-medium">Mức độ</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Đáp án đúng
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {questions.length > 0 ? (
                    questions.map((question, index) => {
                      const topic =
                        typeof question.topic === "object" &&
                        question.topic !== null
                          ? question.topic.name
                          : question.topic;
                      const difficulty =
                        typeof question.difficulty === "object" &&
                        question.difficulty !== null
                          ? difficultyMap[question.difficulty.name] ||
                            question.difficulty.name
                          : difficultyMap[question.difficulty] ||
                            question.difficulty;
                      const content =
                        typeof question.content === "string"
                          ? question.content
                          : question.content?.name || "";
                      return (
                        <tr
                          key={question.id || question._id || index}
                          className="border-b border-gray-100 transition-colors hover:bg-blue-50/30"
                        >
                          <td className="px-6 py-4 text-gray-800">
                            {question.id ||
                              question._id ||
                              index + 1 + (currentPage - 1) * PAGE_SIZE}
                          </td>
                          <td className="px-6 py-4 font-medium text-gray-800">
                            {content.length > 50
                              ? `${content.substring(0, 50)}...`
                              : content}
                          </td>
                          <td className="px-6 py-4 text-gray-800">{topic}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                                difficulty === "Dễ"
                                  ? "bg-green-100 text-green-800"
                                  : difficulty === "Trung bình"
                                  ? "bg-blue-100 text-blue-800"
                                  : difficulty === "Khó"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-800">
                            <span className="inline-flex rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                              {(() => {
                                if (
                                  question.correctAnswer &&
                                  Array.isArray(question.options)
                                ) {
                                  const correct = question.options.find(
                                    (opt) =>
                                      opt.label === question.correctAnswer
                                  );
                                  return correct
                                    ? `${correct.label}: ${correct.text}`
                                    : "N/A";
                                }
                                return "N/A";
                              })()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                onClick={() =>
                                  handleEditQuestion(
                                    question.id || question._id || index
                                  )
                                }
                                className="flex items-center rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-all duration-300 hover:bg-blue-100 hover:scale-105"
                              >
                                <Edit className="mr-1.5 h-4 w-4" />
                                Sửa
                              </button>
                              <button
                                onClick={() =>
                                  confirmDeleteQuestion(
                                    question.id || question._id || index
                                  )
                                }
                                className="flex items-center rounded-lg bg-red-50 px-3 py-1.5 text-sm font-medium text-red-600 transition-all duration-300 hover:bg-red-100 hover:scale-105"
                              >
                                <Trash2 className="mr-1.5 h-4 w-4" />
                                Xóa
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Không tìm thấy câu hỏi nào phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 border-t border-gray-100 bg-gray-50 px-6 py-4">
                <button
                  className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                  title="Trang đầu"
                >
                  <span className="sr-only">Trang đầu</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevrons-left"
                  >
                    <path d="m11 17-5-5 5-5" />
                    <path d="m18 17-5-5 5-5" />
                  </svg>
                </button>
                <button
                  className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  title="Trang trước"
                >
                  <span className="sr-only">Trang trước</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-left"
                  >
                    <path d="m15 18-6-6 6-6" />
                  </svg>
                </button>

                {start > 1 && (
                  <>
                    <button
                      className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                      onClick={() => setCurrentPage(1)}
                    >
                      1
                    </button>
                    {start > 2 && (
                      <span className="flex items-center justify-center px-1 text-gray-500">
                        ...
                      </span>
                    )}
                  </>
                )}

                {pages.map((page) => (
                  <button
                    key={page}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-all ${
                      currentPage === page
                        ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}

                {end < totalPages && (
                  <>
                    {end < totalPages - 1 && (
                      <span className="flex items-center justify-center px-1 text-gray-500">
                        ...
                      </span>
                    )}
                    <button
                      className="rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 transition-all hover:bg-gray-50"
                      onClick={() => setCurrentPage(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}

                <button
                  className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  title="Trang sau"
                >
                  <span className="sr-only">Trang sau</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevron-right"
                  >
                    <path d="m9 18 6-6 6-6" />
                  </svg>
                </button>
                <button
                  className="flex items-center rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                  title="Trang cuối"
                >
                  <span className="sr-only">Trang cuối</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-chevrons-right"
                  >
                    <path d="m13 17 5-5-5-5" />
                    <path d="m6 17 5-5-5-5" />
                  </svg>
                </button>

                <div className="ml-2 flex items-center text-sm text-gray-500">
                  <span>
                    Trang {currentPage} / {totalPages}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-blue-50/30">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Thống kê theo mức độ
              </h3>
              <div className="space-y-4">
                {difficulties
                  .filter((d) => d !== "Tất cả")
                  .map((level) => {
                    const count = questions.filter((q) => {
                      const diff =
                        typeof q.difficulty === "object" &&
                        q.difficulty !== null
                          ? difficultyMap[q.difficulty.name] ||
                            q.difficulty.name
                          : difficultyMap[q.difficulty] || q.difficulty;
                      return diff === level;
                    }).length;
                    const percentage =
                      questions.length > 0
                        ? (count / questions.length) * 100
                        : 0;
                    return (
                      <div
                        key={level}
                        className="transform transition-all duration-300 hover:scale-105"
                      >
                        <div className="mb-1 flex justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {level}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {count}
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-2.5 rounded-full bg-blue-600 transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-green-50/30">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Thống kê theo chủ đề
              </h3>
              <div className="max-h-64 space-y-4 overflow-y-auto">
                {topics
                  .filter((t) => t !== "Tất cả")
                  .map((topic) => {
                    const count = questions.filter((q) => {
                      const t =
                        typeof q.topic === "object" && q.topic !== null
                          ? q.topic.name
                          : q.topic;
                      return t === topic;
                    }).length;
                    const percentage =
                      questions.length > 0
                        ? (count / questions.length) * 100
                        : 0;
                    return (
                      <div
                        key={topic}
                        className="transform transition-all duration-300 hover:scale-105"
                      >
                        <div className="mb-1 flex justify-between">
                          <span className="text-sm font-medium text-gray-700">
                            {topic}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {count}
                          </span>
                        </div>
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-2.5 rounded-full bg-green-600 transition-all duration-1000"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:bg-purple-50/30">
              <h3 className="mb-4 text-lg font-semibold text-gray-800">
                Tổng quan
              </h3>
              <div className="space-y-6">
                <div className="flex items-center transform transition-all duration-300 hover:scale-105">
                  <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                    <BarChart2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tổng số câu hỏi</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {questions.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center transform transition-all duration-300 hover:scale-105">
                  <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <FileText className="h-8 w-8 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số chủ đề</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {topics.length - 1}
                    </p>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-blue-50 p-4">
                  <div className="flex items-center">
                    <HelpCircle className="mr-3 h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-800">
                      Mẹo quản lý câu hỏi
                    </h4>
                  </div>
                  <p className="mt-2 text-sm text-blue-700">
                    Sử dụng tính năng tạo câu hỏi bằng AI để tạo nhanh các câu
                    hỏi trắc nghiệm chất lượng cao.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t bg-white p-4 text-center text-sm text-gray-500">
          © 2025 Hệ thống quản lý đề thi. Bản quyền thuộc về Trường Đại học.
        </footer>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
          <div className="m-4 max-h-[90vh] w-full max-w-3xl transform overflow-y-auto rounded-2xl bg-white p-8 shadow-xl transition-transform duration-300 animate-fade-in">
            <div className="sticky top-0 z-10 mb-6 flex items-center justify-between bg-white pt-2">
              <h2 className="text-xl font-bold text-gray-800">
                {formData.id ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
              </h2>
              <button
                onClick={handleCancel}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Nội dung câu hỏi
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="min-h-[100px] w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  placeholder="Nhập nội dung câu hỏi"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Chủ đề
                  </label>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  >
                    {topics
                      .filter((t) => t !== "Tất cả")
                      .map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Mức độ
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  >
                    {difficulties
                      .filter((d) => d !== "Tất cả")
                      .map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  Các lựa chọn
                </label>
                <div className="space-y-4">
                  {formData.options.map((option, index) => (
                    <div
                      key={option.id}
                      className="flex items-start space-x-4 rounded-lg border border-gray-200 p-4 transition-all hover:bg-blue-50/30"
                    >
                      <div className="flex h-10 items-center mt-1">
                        <input
                          type="radio"
                          id={`correct-${index}`}
                          name="correctOption"
                          checked={option.isCorrect}
                          onChange={() =>
                            handleOptionChange(index, "isCorrect", true)
                          }
                          className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-medium text-gray-700">
                            {option.id}
                          </span>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(index, "text", e.target.value)
                            }
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                            placeholder={`Nhập lựa chọn ${option.id}`}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="sticky bottom-0 z-10 flex justify-end gap-4 bg-white pb-2 pt-4">
                <button
                  type="button"
                  className="flex items-center rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  {formData.id ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Cập nhật
                    </>
                  ) : (
                    <>
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Thêm câu hỏi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAIHelper && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="m-4 w-full max-w-2xl animate-fade-in rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center">
                <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Tạo câu hỏi bằng AI
                </h3>
              </div>
              <button
                onClick={() => setShowAIHelper(false)}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <p className="mb-4 text-gray-600">
              Nhập nội dung hoặc chủ đề bạn muốn tạo câu hỏi, AI sẽ tự động tạo
              câu hỏi trắc nghiệm với các lựa chọn.
            </p>

            <div className="mb-6">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[150px] w-full rounded-lg border border-gray-300 p-4 transition-all focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                placeholder="Ví dụ: Tạo câu hỏi về mô hình OSI trong mạng máy tính"
              ></textarea>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowAIHelper(false)}
                className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={handleAIGenerate}
                className="flex items-center rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-700"
              >
                <Sparkles className="mr-2 h-4 w-4" />
                Tạo câu hỏi
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="m-4 w-full max-w-md animate-fade-in rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-xl font-bold text-gray-800">
              Xác nhận xóa câu hỏi
            </h3>
            <p className="mb-6 text-center text-gray-600">
              Bạn có chắc chắn muốn xóa câu hỏi này không? Hành động này không
              thể hoàn tác.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="rounded-lg bg-gray-100 px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteQuestion}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {showNotification && (
        <div
          className={`fixed bottom-4 right-4 z-50 flex items-center rounded-lg p-4 shadow-lg transition-all duration-300 ${
            notificationType === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-white">
            {notificationType === "success" ? (
              <Check className="h-5 w-5 text-green-600" />
            ) : (
              <X className="h-5 w-5 text-red-600" />
            )}
          </div>
          <p className="text-white">{notificationMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;
