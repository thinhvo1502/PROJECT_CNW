"use client";
import { Link } from "react-router-dom";
import { useState } from "react";
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
} from "lucide-react";

const difficultyLevels = ["Tất cả", "Dễ", "Trung bình", "Khó", "Rất khó"];

// Danh sách chủ đề CNTT
const itTopics = [
  "Tất cả",
  "Kỹ thuật phần mềm",
  "Kỹ thuật lập trình",
  "Trí tuệ nhân tạo",
  "Cơ sở dữ liệu",
  "Mạng máy tính",
  "An toàn thông tin",
  "Hệ điều hành",
  "Kiến trúc máy tính",
  "Công nghệ Web",
  "Điện toán đám mây",
];

const ManageQuestions = () => {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Tất cả");
  const [selectedTopic, setSelectedTopic] = useState("Tất cả");
  const [showDifficultyFilter, setShowDifficultyFilter] = useState(false);
  const [showTopicFilter, setShowTopicFilter] = useState(false);
  const [questions, setQuestions] = useState([
    {
      id: 1,
      content: "Mô hình OSI có bao nhiêu tầng?",
      topic: "Mạng máy tính",
      difficulty: "Dễ",
      options: [
        { id: "A", text: "5 tầng", isCorrect: false },
        { id: "B", text: "6 tầng", isCorrect: false },
        { id: "C", text: "7 tầng", isCorrect: true },
        { id: "D", text: "8 tầng", isCorrect: false },
      ],
    },
    {
      id: 2,
      content: "Thuật toán nào sau đây không phải là thuật toán sắp xếp?",
      topic: "Kỹ thuật lập trình",
      difficulty: "Trung bình",
      options: [
        { id: "A", text: "Bubble Sort", isCorrect: false },
        { id: "B", text: "Quick Sort", isCorrect: false },
        { id: "C", text: "Binary Search", isCorrect: true },
        { id: "D", text: "Merge Sort", isCorrect: false },
      ],
    },
    {
      id: 3,
      content: "Khóa chính (Primary Key) trong CSDL có đặc điểm nào?",
      topic: "Cơ sở dữ liệu",
      difficulty: "Dễ",
      options: [
        { id: "A", text: "Có thể trùng lặp", isCorrect: false },
        { id: "B", text: "Có thể null", isCorrect: false },
        { id: "C", text: "Không thể trùng lặp và không null", isCorrect: true },
        { id: "D", text: "Không có ràng buộc gì", isCorrect: false },
      ],
    },
    {
      id: 4,
      content: "Thuật toán học máy nào phù hợp cho bài toán phân loại?",
      topic: "Trí tuệ nhân tạo",
      difficulty: "Khó",
      options: [
        { id: "A", text: "Linear Regression", isCorrect: false },
        { id: "B", text: "Random Forest", isCorrect: true },
        { id: "C", text: "K-means", isCorrect: false },
        { id: "D", text: "Principal Component Analysis", isCorrect: false },
      ],
    },
  ]);

  const [formData, setFormData] = useState({
    content: "",
    topic: itTopics[1],
    difficulty: difficultyLevels[1],
    options: [
      { id: "A", text: "", isCorrect: false },
      { id: "B", text: "", isCorrect: false },
      { id: "C", text: "", isCorrect: false },
      { id: "D", text: "", isCorrect: false },
    ],
  });

  const handleAddQuestion = () => {
    setFormData({
      content: "",
      topic: itTopics[1],
      difficulty: difficultyLevels[1],
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

    // Nếu đang đặt một lựa chọn là đúng, đặt tất cả các lựa chọn khác là sai
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
    const newQuestion = {
      id: Math.floor(Math.random() * 10000),
      content: formData.content,
      topic: formData.topic,
      difficulty: formData.difficulty,
      options: formData.options,
    };
    setQuestions((prev) => [...prev, newQuestion]);
    handleCancel();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDeleteQuestion = (id) => {
    setQuestions((prev) => prev.filter((question) => question.id !== id));
  };

  const handleEditQuestion = (id) => {
    const questionToEdit = questions.find((question) => question.id === id);
    if (questionToEdit) {
      setFormData({
        content: questionToEdit.content,
        topic: questionToEdit.topic,
        difficulty: questionToEdit.difficulty,
        options: [...questionToEdit.options],
      });
      setShowForm(true);
    }
  };

  const handleDifficultyFilter = (difficulty) => {
    setSelectedDifficulty(difficulty);
    setShowDifficultyFilter(false);
  };

  const handleTopicFilter = (topic) => {
    setSelectedTopic(topic);
    setShowTopicFilter(false);
  };

  // Lọc câu hỏi theo tìm kiếm, chủ đề và mức độ
  const filteredQuestions = questions.filter(
    (question) =>
      question.content.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedDifficulty === "Tất cả" ||
        question.difficulty === selectedDifficulty) &&
      (selectedTopic === "Tất cả" || question.topic === selectedTopic)
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-blue-700 to-blue-900 text-white shadow-lg">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Danh mục quản lý</h1>
          <nav>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/admin/home"
                  className="flex items-center p-3 rounded-lg text-white/80 hover:bg-white/10 transition-all"
                >
                  <Home className="mr-3 h-5 w-5" />
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-exams"
                  className="flex items-center p-3 rounded-lg text-white/80 hover:bg-white/10 transition-all"
                >
                  <FileText className="mr-3 h-5 w-5" />
                  <span>Đề thi</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-users"
                  className="flex items-center p-3 rounded-lg text-white/80 hover:bg-white/10 transition-all"
                >
                  <Users className="mr-3 h-5 w-5" />
                  <span>Người dùng</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/manage-questions"
                  className="flex items-center p-3 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-all"
                >
                  <BarChart2 className="mr-3 h-5 w-5" />
                  <span>Câu hỏi</span>
                </Link>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center p-3 rounded-lg text-white/80 hover:bg-white/10 transition-all"
                >
                  <Settings className="mr-3 h-5 w-5" />
                  <span>Cài đặt</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Quản lý Câu hỏi</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Tìm kiếm câu hỏi..."
                className="pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
            <button
              onClick={handleAddQuestion}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Thêm Câu hỏi
            </button>
          </div>
        </header>

        <main className="p-6">
          {/* Bộ lọc */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="relative">
              <button
                onClick={() => setShowDifficultyFilter(!showDifficultyFilter)}
                className="flex items-center text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Mức độ: {selectedDifficulty}
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {showDifficultyFilter && (
                <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                  <div className="py-1">
                    {difficultyLevels.map((difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => handleDifficultyFilter(difficulty)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                className="flex items-center text-gray-600 hover:text-gray-900 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm"
              >
                <Filter className="h-4 w-4 mr-2" />
                Chủ đề: {selectedTopic}
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              {showTopicFilter && (
                <div className="absolute left-0 mt-2 w-64 bg-white rounded-md shadow-lg z-10 border border-gray-200 max-h-96 overflow-y-auto">
                  <div className="py-1">
                    {itTopics.map((topic) => (
                      <button
                        key={topic}
                        onClick={() => handleTopicFilter(topic)}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bảng danh sách câu hỏi */}
          <div className="bg-white shadow-sm rounded-xl mb-8 border border-gray-100">
            <div className="p-6 border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách Câu hỏi
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm">
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
                  {filteredQuestions.length > 0 ? (
                    filteredQuestions.map((question) => (
                      <tr
                        key={question.id}
                        className="border-b border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 text-gray-800">
                          {question.id}
                        </td>
                        <td className="px-6 py-4 text-gray-800 font-medium">
                          {question.content.length > 50
                            ? `${question.content.substring(0, 50)}...`
                            : question.content}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {question.topic}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {question.difficulty}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {question.options.find((opt) => opt.isCorrect)?.id ||
                            "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditQuestion(question.id)}
                              className="text-blue-600 hover:text-blue-800 flex items-center"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteQuestion(question.id)}
                              className="text-red-600 hover:text-red-800 flex items-center"
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Không tìm thấy câu hỏi nào phù hợp với tìm kiếm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Thống kê */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Thống kê theo mức độ
              </h3>
              <div className="space-y-3">
                {difficultyLevels
                  .filter((d) => d !== "Tất cả")
                  .map((level) => {
                    const count = questions.filter(
                      (q) => q.difficulty === level
                    ).length;
                    const percentage = (count / questions.length) * 100;
                    return (
                      <div key={level}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {level}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {count}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-blue-600 h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Thống kê theo chủ đề
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {itTopics
                  .filter((t) => t !== "Tất cả")
                  .map((topic) => {
                    const count = questions.filter(
                      (q) => q.topic === topic
                    ).length;
                    const percentage =
                      questions.length > 0
                        ? (count / questions.length) * 100
                        : 0;
                    return (
                      <div key={topic}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            {topic}
                          </span>
                          <span className="text-sm font-medium text-gray-700">
                            {count}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-green-600 h-2.5 rounded-full"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Tổng quan
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="rounded-full bg-blue-100 p-3 mr-4">
                    <BarChart2 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tổng số câu hỏi</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {questions.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="rounded-full bg-green-100 p-3 mr-4">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số chủ đề</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {new Set(questions.map((q) => q.topic)).size}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Form thêm/sửa câu hỏi */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm transition-all duration-300 overflow-y-auto">
          <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl m-4 transform scale-100 transition-transform duration-300 animate-fade-in max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 sticky top-0 bg-white pt-2">
              <h2 className="text-xl font-bold text-gray-800">
                {formData.id ? "Chỉnh sửa câu hỏi" : "Thêm câu hỏi mới"}
              </h2>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung câu hỏi
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px]"
                  placeholder="Nhập nội dung câu hỏi"
                  required
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Chủ đề
                  </label>
                  <select
                    name="topic"
                    value={formData.topic}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    {itTopics
                      .filter((t) => t !== "Tất cả")
                      .map((topic) => (
                        <option key={topic} value={topic}>
                          {topic}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mức độ
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    {difficultyLevels
                      .filter((d) => d !== "Tất cả")
                      .map((level) => (
                        <option key={level} value={level}>
                          {level}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  Các lựa chọn
                </label>
                <div className="space-y-4">
                  {formData.options.map((option, index) => (
                    <div key={option.id} className="flex items-start space-x-4">
                      <div className="flex items-center h-10 mt-1">
                        <input
                          type="radio"
                          id={`correct-${index}`}
                          name="correctOption"
                          checked={option.isCorrect}
                          onChange={() =>
                            handleOptionChange(index, "isCorrect", true)
                          }
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center font-medium text-gray-700 mr-2">
                            {option.id}
                          </span>
                          <input
                            type="text"
                            value={option.text}
                            onChange={(e) =>
                              handleOptionChange(index, "text", e.target.value)
                            }
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder={`Nhập lựa chọn ${option.id}`}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 sticky bottom-0 bg-white pb-2">
                <button
                  type="button"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  {formData.id ? "Cập nhật câu hỏi" : "Thêm câu hỏi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageQuestions;
