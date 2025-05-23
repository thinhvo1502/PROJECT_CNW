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

const API_URL = " https://437f-113-161-89-176.ngrok-free.app/api/questions";
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
const getAuthToken = () => {
  // Kiểm tra token trong localStorage
  const token = localStorage.getItem("auth_token");

  // Nếu không có token trong localStorage, kiểm tra trong cookies
  if (!token) {
    // Hàm lấy cookie theo tên
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(";").shift();
      return null;
    };

    return getCookie("auth_token");
  }

  return token;
};
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
  const [tagsData, setTagsData] = useState([]);
  const [loadingAction, setLoadingAction] = useState("");
  const [failedActions, setFailedActions] = useState({});
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
  // Thêm vào useEffect ban đầu
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

        // Thêm gọi API để lấy tags data
        fetchTagsData();
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

      const token = getAuthToken();

      const response = await axios.get(`${API_URL}?${params.toString()}`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Authorization: token ? `Bearer ${token}` : undefined,
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
  // Thêm hàm fetch tags
  const fetchTagsData = async () => {
    try {
      const token = getAuthToken();

      const response = await axios.get(
        "https://437f-113-161-89-176.ngrok-free.app/api/tags",
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: token ? `Bearer ${token}` : undefined,
          },
        }
      );

      if (response.data && Array.isArray(response.data.data)) {
        setTagsData(response.data.data);
      } else {
        console.error("Unexpected tags data format:", response.data);
        setTagsData([]);
      }
    } catch (error) {
      console.error("Error fetching tags:", error);
      setTagsData([]);
    }
  };
  // Thêm hàm helper để tìm tag phù hợp với topic
  const findTagForQuestion = (question) => {
    if (!question || !question.topic || tagsData.length === 0) return null;

    let questionTopicId = "";

    // Lấy topic ID từ câu hỏi
    if (typeof question.topic === "object" && question.topic !== null) {
      questionTopicId = question.topic._id || question.topic.id;
    } else {
      // Nếu topic là string, có thể đó là ID hoặc tên
      // Kiểm tra xem nó có phải là ID trong map không
      for (const [name, id] of topicIdMap.entries()) {
        if (question.topic === name || question.topic === id) {
          questionTopicId = id;
          break;
        }
      }

      // Nếu không tìm thấy, dùng giá trị gốc
      if (!questionTopicId) {
        questionTopicId = question.topic;
      }
    }

    // Tìm tag có topic trùng với topic của câu hỏi
    const matchingTag = tagsData.find((tag) => tag.topic === questionTopicId);
    return matchingTag ? matchingTag.description : null;
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
    console.log(`Changing ${field} for option ${index} to:`, value);

    const newOptions = [...formData.options];
    newOptions[index] = { ...newOptions[index], [field]: value };

    // Đảm bảo chỉ có một đáp án được chọn là đúng
    if (field === "isCorrect" && value === true) {
      console.log("Setting other options to false");
      newOptions.forEach((option, i) => {
        if (i !== index) {
          newOptions[i] = { ...newOptions[i], isCorrect: false };
        }
      });
    }

    setFormData((prev) => {
      const updated = { ...prev, options: newOptions };
      console.log("Updated formData:", updated);
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    showNotificationMessage("Đang xử lý...", "info");
    try {
      // Thêm debug để kiểm tra các options
      console.log("Options trước khi submit:", formData.options);

      // Sửa đoạn code lấy correctAnswer trong hàm handleSubmit
      const correctOptionIndex = formData.options.findIndex(
        (opt) => opt.isCorrect === true
      );
      console.log("correctOptionIndex:", correctOptionIndex);

      // Thêm logging để debug
      console.log("Option được chọn:", formData.options[correctOptionIndex]);

      const correctAnswer =
        correctOptionIndex >= 0
          ? formData.options[correctOptionIndex].id ||
            formData.options[correctOptionIndex].label ||
            String.fromCharCode(65 + correctOptionIndex) // Tạo ID (A, B, C, D) nếu không có
          : null;
      console.log("correctAnswer:", correctAnswer);

      // Kiểm tra xem đã chọn đáp án đúng chưa
      if (!correctAnswer) {
        showNotificationMessage("Vui lòng chọn một đáp án đúng!", "error");
        setIsLoading(false);
        return;
      }

      const validatedOptions = formData.options.map((opt, idx) => ({
        ...opt,
        id: opt.id || opt.label || String.fromCharCode(65 + idx),
      }));

      // Chuyển đổi các giá trị sang định dạng API
      const apiDifficulty =
        vietnameseToEnglishDifficultyMap[formData.difficulty] ||
        formData.difficulty;
      const topicId = topicIdMap.get(formData.topic) || formData.topic;

      // Thay thế đoạn code tạo apiData trong hàm handleSubmit
      const apiData = {
        content: formData.content,
        topic: topicId, // Giữ nguyên - Đã đúng
        difficulty: apiDifficulty, // Giữ nguyên - Đã đúng
        // Sửa đổi options để chỉ giữ label và text
        options: validatedOptions.map((opt) => ({
          label: opt.id, // Chỉ sử dụng label thay vì id và label
          text: opt.text,
          // Không thêm _id vào
        })),
        correctAnswer: correctAnswer,
      };

      console.log("Dữ liệu gửi đi:", apiData);

      // Lấy token xác thực
      const token = getAuthToken();

      if (!token) {
        showNotificationMessage(
          "Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại",
          "error"
        );
        setIsLoading(false);
        return;
      }
      let response;
      // Cập nhật câu hỏi hiện có
      if (formData.id) {
        // Cập nhật câu hỏi hiện có
        const apiUrl = `https://437f-113-161-89-176.ngrok-free.app/api/questions/${formData.id}`;

        // In ra URL và dữ liệu gửi đi
        console.log("Request URL:", apiUrl);
        console.log("Request data:", JSON.stringify(apiData, null, 2));

        response = await axios.put(apiUrl, apiData, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Cập nhật thành công:", response.data);

        // Cập nhật câu hỏi trong state
        setQuestions((prevQuestions) =>
          prevQuestions.map((q) =>
            q.id === formData.id || q._id === formData.id
              ? {
                  ...q,
                  content: formData.content,
                  difficulty: apiDifficulty,
                  topic: formData.topic,
                  options: formData.options,
                  correctAnswer: correctAnswer,
                }
              : q
          )
        );

        showNotificationMessage(
          "Câu hỏi đã được cập nhật thành công!",
          "success"
        );
      } else {
        // Thêm câu hỏi mới
        const apiUrl =
          "https://d97a-113-161-89-176.ngrok-free.app/api/questions";
        const response = await axios.post(apiUrl, apiData, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Thêm authorization header
          },
        });

        console.log("Thêm mới thành công:", response.data);

        // Thêm câu hỏi mới vào danh sách
        setQuestions((prevQuestions) => [response.data, ...prevQuestions]);
        showNotificationMessage(
          "Câu hỏi mới đã được thêm thành công!",
          "success"
        );
      }

      // Đóng form
      handleCancel();

      // Tải lại dữ liệu để đảm bảo hiển thị chính xác
      await fetchQuestions();
    } catch (error) {
      console.error("Lỗi khi lưu câu hỏi:", error);

      // Thêm đoạn debug chi tiết ở đây
      if (error.response) {
        console.error("Chi tiết lỗi từ API:", {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
        });
      }

      showNotificationMessage(
        `Lỗi khi lưu câu hỏi: ${
          error.response?.data?.message || error.message
        }`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
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

  const handleDeleteQuestion = async () => {
    setLoadingAction("delete-" + questionToDelete);
    if (!questionToDelete) {
      setShowDeleteConfirm(false);
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = `https://437f-113-161-89-176.ngrok-free.app/api/questions/${questionToDelete}`;
      console.log(`Đang gửi yêu cầu xóa câu hỏi với ID: ${questionToDelete}`);

      const token = getAuthToken();

      // Sử dụng DELETE thay vì PATCH
      await axios.delete(apiUrl, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      // Cập nhật UI
      setQuestions((prevQuestions) =>
        prevQuestions.filter(
          (q) => q.id !== questionToDelete && q._id !== questionToDelete
        )
      );

      showNotificationMessage("Câu hỏi đã được xóa thành công!", "success");

      // Đóng dialog
      setShowDeleteConfirm(false);
      setQuestionToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa câu hỏi:", error);

      // Hiển thị chi tiết lỗi
      if (error.response) {
        console.error("Chi tiết lỗi từ API:", {
          status: error.response.status,
          data: error.response.data,
        });

        if (error.response.status === 404) {
          // Nếu không tìm thấy câu hỏi (404), có thể đã bị xóa rồi
          showNotificationMessage(
            "Câu hỏi này có thể đã bị xóa hoặc không tồn tại.",
            "error"
          );

          // Cập nhật UI để loại bỏ câu hỏi nếu vẫn còn trong danh sách
          setQuestions((prevQuestions) =>
            prevQuestions.filter(
              (q) => q.id !== questionToDelete && q._id !== questionToDelete
            )
          );

          // Đóng dialog
          setShowDeleteConfirm(false);
          setQuestionToDelete(null);
        } else if (error.response.status === 403) {
          // Nếu không có quyền xóa
          showNotificationMessage(
            "Bạn không có quyền xóa câu hỏi này.",
            "error"
          );
        } else {
          // Các lỗi khác
          showNotificationMessage(
            `Lỗi khi xóa câu hỏi: ${
              error.response.data?.message || error.message
            }`,
            "error"
          );
        }
      } else {
        showNotificationMessage(`Lỗi kết nối: ${error.message}`, "error");
      }

      // Đóng dialog trong trường hợp lỗi 404
      if (error.response && error.response.status === 404) {
        setShowDeleteConfirm(false);
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleDeactivateQuestion = async (id) => {
    try {
      const apiUrl = `https://20d2-116-110-41-31.ngrok-free.app/api/questions/${id}`;
      const token = getAuthToken();

      // Gọi PATCH để cập nhật trạng thái thay vì DELETE
      await axios.patch(
        apiUrl,
        { isActive: false },
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Cập nhật giao diện tương tự như khi xóa
      setQuestions((prevQuestions) =>
        prevQuestions.filter((q) => q.id !== id && q._id !== id)
      );

      showNotificationMessage(
        "Câu hỏi đã được vô hiệu hóa thành công!",
        "success"
      );
    } catch (error) {
      console.error("Lỗi khi vô hiệu hóa câu hỏi:", error);
      showNotificationMessage(
        `Lỗi khi vô hiệu hóa câu hỏi: ${error.message}`,
        "error"
      );
    }
  };
  const handleEditQuestion = (id) => {
    setLoadingAction("edit-" + id);
    const questionToEdit = questions.find(
      (question) => question.id === id || question._id === id
    );

    if (questionToEdit) {
      // Chuẩn bị options và đánh dấu đáp án đúng
      let options = [];

      // Thay thế đoạn code chuẩn bị options trong handleEditQuestion
      if (Array.isArray(questionToEdit.options)) {
        options = questionToEdit.options.map((opt, idx) => {
          // Đảm bảo mỗi option đều có id
          const id = opt.id || opt.label || String.fromCharCode(65 + idx);
          // Đánh dấu đáp án đúng dựa vào correctAnswer
          const isCorrect =
            id === questionToEdit.correctAnswer ||
            opt.label === questionToEdit.correctAnswer;
          return { ...opt, id, isCorrect };
        });
      } else {
        options = [
          { id: "A", text: "", isCorrect: false },
          { id: "B", text: "", isCorrect: false },
          { id: "C", text: "", isCorrect: false },
          { id: "D", text: "", isCorrect: false },
        ];
      }

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
        options: options,
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
                    <th className="px-6 py-4 text-left font-medium">Tags</th>
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
                      const tagDescription = findTagForQuestion(question);

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
                          <td className="px-6 py-4 text-gray-600">
                            {tagDescription ? (
                              <span className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                                {tagDescription.length > 30
                                  ? `${tagDescription.substring(0, 30)}...`
                                  : tagDescription}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">
                                Không có tag
                              </span>
                            )}
                          </td>
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
                                      opt.id === question.correctAnswer ||
                                      opt.label === question.correctAnswer
                                  );
                                  return correct
                                    ? `${correct.id || correct.label}: ${
                                        correct.text
                                      }`
                                    : question.correctAnswer;
                                }
                                return "N/A";
                              })()}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-2">
                              <button
                                className={`rounded-lg bg-blue-100 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-200 ${
                                  isLoading &&
                                  loadingAction === "edit" &&
                                  loadingAction === question.id
                                    ? "opacity-50 cursor-wait"
                                    : ""
                                }`}
                                onClick={() => {
                                  setLoadingAction(
                                    "edit-" + (question.id || question._id)
                                  );
                                  handleEditQuestion(
                                    question.id || question._id
                                  );
                                }}
                                disabled={isLoading}
                                title="Sửa"
                              >
                                {isLoading &&
                                loadingAction ===
                                  "edit-" + (question.id || question._id) ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                                ) : (
                                  <Edit className="h-4 w-4" />
                                )}
                                <span className="sr-only">Sửa</span>
                              </button>
                              <button
                                className={`rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-200 ${
                                  isLoading &&
                                  loadingAction ===
                                    "delete-" + (question.id || question._id)
                                    ? "opacity-50 cursor-wait"
                                    : ""
                                }`}
                                onClick={() => {
                                  setLoadingAction(
                                    "delete-" + (question.id || question._id)
                                  );
                                  confirmDeleteQuestion(
                                    question.id || question._id
                                  );
                                }}
                                disabled={isLoading}
                                title="Xóa"
                              >
                                {isLoading &&
                                loadingAction ===
                                  "delete-" + (question.id || question._id) ? (
                                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-t-transparent"></div>
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                                <span className="sr-only">Xóa</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan={7} // Tăng số cột lên 7
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
                    key={`page-${page}`}
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
                      key={`option-${option.id || index}`} // Thêm index để tránh trùng lặp key
                      className={`flex items-start space-x-4 rounded-lg border p-4 transition-all ${
                        option.isCorrect
                          ? "border-green-300 bg-green-50/50"
                          : "border-gray-200 hover:bg-blue-50/30"
                      }`}
                    >
                      <div className="flex h-10 items-center mt-1">
                        <input
                          type="radio"
                          id={`correct-${option.id}`} // Đổi tên id để tránh xung đột
                          name="correctOption"
                          checked={option.isCorrect === true} // Sử dụng so sánh chính xác
                          onChange={() => {
                            // In ra debug trước khi thay đổi
                            console.log(
                              "Trước khi chọn:",
                              formData.options.map((o) => ({
                                id: o.id,
                                isCorrect: o.isCorrect,
                              }))
                            );
                            handleOptionChange(index, "isCorrect", true);
                            // In ra debug sau khi thay đổi
                            setTimeout(
                              () =>
                                console.log(
                                  "Sau khi chọn:",
                                  formData.options.map((o) => ({
                                    id: o.id,
                                    isCorrect: o.isCorrect,
                                  }))
                                ),
                              0
                            );
                          }}
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
                            value={option.text || ""}
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
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent border-white"></div>
                    Đang xử lý...
                  </div>
                ) : (
                  "Xác nhận xóa"
                )}
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
