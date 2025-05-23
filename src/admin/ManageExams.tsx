"use client";
import axios from "axios";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import api from "../utils/api";
import { getCookie } from "../utils/cookies";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  Home,
  FileText,
  Users,
  Settings,
  PlusCircle,
  Search,
  Upload,
  FileUp,
  X,
  Edit,
  Trash2,
  BarChart2,
  ChevronDown,
  Menu,
  Bell,
  User,
  AlertTriangle,
  Check,
  Eye,
  Sparkles,
  Award,
  TrendingUp,
  Zap,
  BookOpen,
  Star,
  Info,
} from "lucide-react";
const API_BASE_URL = "https://437f-113-161-89-176.ngrok-free.app";
const attemptsData = [
  { name: "Tháng 1", "Thống Kê Lượt Làm Bài": 120 },
  { name: "Tháng 2", "Thống Kê Lượt Làm Bài": 150 },
  { name: "Tháng 3", "Thống Kê Lượt Làm Bài": 200 },
  { name: "Tháng 4", "Thống Kê Lượt Làm Bài": 250 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

// Danh sách chủ đề CNTT
const itTopics = [
  "",
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

// Danh sách mức độ
const difficultyLevels = ["Dễ", "Trung bình", "Khó", "Rất khó"];

// Dữ liệu đánh giá đề thi
const examRatingData = [
  { name: "5 sao", value: 65 },
  { name: "4 sao", value: 25 },
  { name: "3 sao", value: 8 },
  { name: "2 sao", value: 2 },
  { name: "1 sao", value: 0 },
];

// Dữ liệu câu hỏi mẫu theo chủ đề
const sampleQuestions = {
  "Kỹ thuật phần mềm": [
    {
      id: 1,
      content:
        "Mô hình phát triển phần mềm nào tập trung vào việc phát triển lặp đi lặp lại?",
      difficulty: "Trung bình",
    },
    {
      id: 2,
      content:
        "Phương pháp kiểm thử nào tập trung vào việc kiểm tra từng đơn vị code riêng biệt?",
      difficulty: "Dễ",
    },
    {
      id: 3,
      content:
        "Quy trình nào trong phát triển phần mềm liên quan đến việc thu thập yêu cầu từ khách hàng?",
      difficulty: "Dễ",
    },
    {
      id: 4,
      content: "Mô hình Waterfall có bao nhiêu giai đoạn chính?",
      difficulty: "Trung bình",
    },
    {
      id: 5,
      content: "Phương pháp Agile tập trung vào điều gì?",
      difficulty: "Dễ",
    },
    {
      id: 6,
      content:
        "Design pattern nào được sử dụng để tạo ra một đối tượng duy nhất trong toàn bộ ứng dụng?",
      difficulty: "Khó",
    },
    {
      id: 7,
      content:
        "Khái niệm nào đề cập đến việc tái cấu trúc mã nguồn mà không làm thay đổi chức năng bên ngoài?",
      difficulty: "Trung bình",
    },
  ],
  "Kỹ thuật lập trình": [
    {
      id: 8,
      content:
        "Thuật toán sắp xếp nào có độ phức tạp trung bình là O(n log n)?",
      difficulty: "Khó",
    },
    {
      id: 9,
      content: "Cấu trúc dữ liệu nào phù hợp nhất cho việc tìm kiếm nhanh?",
      difficulty: "Trung bình",
    },
    {
      id: 10,
      content:
        "Ngôn ngữ lập trình nào được sử dụng phổ biến nhất cho phát triển web?",
      difficulty: "Dễ",
    },
    {
      id: 11,
      content:
        "Khái niệm nào trong lập trình hướng đối tượng cho phép một lớp kế thừa từ nhiều lớp cha?",
      difficulty: "Khó",
    },
    { id: 12, content: "Thuật toán đệ quy là gì?", difficulty: "Dễ" },
    {
      id: 13,
      content: "Cấu trúc dữ liệu Stack hoạt động theo nguyên tắc nào?",
      difficulty: "Dễ",
    },
    {
      id: 14,
      content:
        "Big O Notation được sử dụng để làm gì trong phân tích thuật toán?",
      difficulty: "Trung bình",
    },
  ],
  "Trí tuệ nhân tạo": [
    {
      id: 15,
      content: "Thuật toán học máy nào phù hợp cho bài toán phân loại?",
      difficulty: "Khó",
    },
    { id: 16, content: "Deep Learning là gì?", difficulty: "Trung bình" },
    {
      id: 17,
      content: "Mạng neural nhân tạo mô phỏng cấu trúc của cái gì?",
      difficulty: "Dễ",
    },
    {
      id: 18,
      content: "Thuật toán nào được sử dụng để tìm đường đi tối ưu trong AI?",
      difficulty: "Khó",
    },
    {
      id: 19,
      content: "Khái niệm Overfitting trong học máy là gì?",
      difficulty: "Trung bình",
    },
    {
      id: 20,
      content: "Reinforcement Learning dựa trên nguyên tắc nào?",
      difficulty: "Khó",
    },
    {
      id: 21,
      content: "Computer Vision tập trung vào lĩnh vực nào?",
      difficulty: "Dễ",
    },
  ],
  "Cơ sở dữ liệu": [
    {
      id: 22,
      content: "Khóa chính (Primary Key) trong CSDL có đặc điểm nào?",
      difficulty: "Dễ",
    },
    {
      id: 23,
      content: "Mô hình quan hệ trong CSDL được đề xuất bởi ai?",
      difficulty: "Trung bình",
    },
    {
      id: 24,
      content: "Chuẩn hóa dữ liệu được sử dụng để làm gì?",
      difficulty: "Khó",
    },
    { id: 25, content: "SQL là viết tắt của cụm từ nào?", difficulty: "Dễ" },
    {
      id: 26,
      content: "NoSQL databases phù hợp với loại dữ liệu nào?",
      difficulty: "Trung bình",
    },
    {
      id: 27,
      content: "Transaction trong CSDL cần đảm bảo những tính chất nào?",
      difficulty: "Khó",
    },
    {
      id: 28,
      content: "Indexing trong CSDL được sử dụng để làm gì?",
      difficulty: "Trung bình",
    },
  ],
  "Mạng máy tính": [
    { id: 29, content: "Mô hình OSI có bao nhiêu tầng?", difficulty: "Dễ" },
    {
      id: 30,
      content: "Giao thức nào được sử dụng phổ biến nhất cho web?",
      difficulty: "Dễ",
    },
    {
      id: 31,
      content: "Địa chỉ IP phiên bản 4 (IPv4) có độ dài bao nhiêu bit?",
      difficulty: "Trung bình",
    },
    {
      id: 32,
      content: "Tường lửa (Firewall) được sử dụng để làm gì?",
      difficulty: "Dễ",
    },
    { id: 33, content: "VPN là viết tắt của cụm từ nào?", difficulty: "Dễ" },
    {
      id: 34,
      content:
        "Giao thức nào hoạt động ở tầng Transport và đảm bảo độ tin cậy?",
      difficulty: "Trung bình",
    },
    {
      id: 35,
      content: "Kỹ thuật NAT được sử dụng để làm gì?",
      difficulty: "Khó",
    },
  ],
  "An toàn thông tin": [
    {
      id: 36,
      content: "Mã hóa đối xứng khác với mã hóa bất đối xứng như thế nào?",
      difficulty: "Khó",
    },
    { id: 37, content: "Tấn công DDoS là gì?", difficulty: "Dễ" },
    {
      id: 38,
      content: "Tấn công Man-in-the-Middle là gì?",
      difficulty: "Trung bình",
    },
    { id: 39, content: "SSL/TLS được sử dụng để làm gì?", difficulty: "Dễ" },
    {
      id: 40,
      content: "Phishing là hình thức tấn công như thế nào?",
      difficulty: "Dễ",
    },
    {
      id: 41,
      content: "Mã hóa RSA dựa trên nguyên lý toán học nào?",
      difficulty: "Khó",
    },
    {
      id: 42,
      content:
        "Tường lửa thế hệ mới (Next-Generation Firewall) có những tính năng gì?",
      difficulty: "Trung bình",
    },
  ],
  "Hệ điều hành": [
    { id: 43, content: "Hệ điều hành đa nhiệm là gì?", difficulty: "Dễ" },
    {
      id: 44,
      content: "Deadlock trong hệ điều hành là gì?",
      difficulty: "Khó",
    },
    {
      id: 45,
      content: "Virtual Memory được sử dụng để làm gì?",
      difficulty: "Trung bình",
    },
    {
      id: 46,
      content: "Kernel của hệ điều hành có chức năng gì?",
      difficulty: "Dễ",
    },
    {
      id: 47,
      content: "Thuật toán lập lịch CPU nào dựa trên độ ưu tiên?",
      difficulty: "Khó",
    },
    {
      id: 48,
      content: "File System trong hệ điều hành có chức năng gì?",
      difficulty: "Dễ",
    },
    {
      id: 49,
      content: "Semaphore trong hệ điều hành được sử dụng để làm gì?",
      difficulty: "Khó",
    },
  ],
  "Kiến trúc máy tính": [
    {
      id: 50,
      content: "Cache memory nằm ở đâu trong hệ thống máy tính?",
      difficulty: "Trung bình",
    },
    {
      id: 51,
      content: "Kiến trúc Von Neumann bao gồm những thành phần chính nào?",
      difficulty: "Khó",
    },
    {
      id: 52,
      content: "RISC và CISC là hai kiểu kiến trúc gì?",
      difficulty: "Trung bình",
    },
    { id: 53, content: "Pipelining trong CPU là gì?", difficulty: "Khó" },
    {
      id: 54,
      content: "DMA (Direct Memory Access) được sử dụng để làm gì?",
      difficulty: "Trung bình",
    },
    {
      id: 55,
      content: "ALU là viết tắt của cụm từ nào và có chức năng gì?",
      difficulty: "Dễ",
    },
    {
      id: 56,
      content: "Bộ nhớ ảo (Virtual Memory) hoạt động như thế nào?",
      difficulty: "Khó",
    },
  ],
  "Công nghệ Web": [
    {
      id: 57,
      content: "HTML5 có những tính năng mới nào so với HTML4?",
      difficulty: "Dễ",
    },
    {
      id: 58,
      content: "CSS Flexbox được sử dụng để làm gì?",
      difficulty: "Trung bình",
    },
    { id: 59, content: "RESTful API là gì?", difficulty: "Khó" },
    {
      id: 60,
      content: "JavaScript Promises được sử dụng để xử lý vấn đề gì?",
      difficulty: "Khó",
    },
    { id: 61, content: "Responsive Web Design là gì?", difficulty: "Dễ" },
    {
      id: 62,
      content: "Single Page Application (SPA) hoạt động như thế nào?",
      difficulty: "Trung bình",
    },
    {
      id: 63,
      content: "WebSockets được sử dụng trong trường hợp nào?",
      difficulty: "Khó",
    },
  ],
  "Điện toán đám mây": [
    {
      id: 64,
      content:
        "SaaS, PaaS và IaaS là những mô hình gì trong điện toán đám mây?",
      difficulty: "Trung bình",
    },
    {
      id: 65,
      content:
        "Containerization (như Docker) có ưu điểm gì so với virtualization truyền thống?",
      difficulty: "Khó",
    },
    { id: 66, content: "Microservices architecture là gì?", difficulty: "Khó" },
    {
      id: 67,
      content: "Auto-scaling trong điện toán đám mây có tác dụng gì?",
      difficulty: "Trung bình",
    },
    { id: 68, content: "Serverless computing là gì?", difficulty: "Khó" },
    {
      id: 69,
      content: "Multi-tenancy trong điện toán đám mây là gì?",
      difficulty: "Trung bình",
    },
    {
      id: 70,
      content: "Edge computing khác với cloud computing như thế nào?",
      difficulty: "Khó",
    },
  ],
};

const ManageExams = () => {
  const getAuthToken = () => {
    return localStorage.getItem("auth_token");
  };
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [notificationType, setNotificationType] = useState("success"); // success, error
  const [timeFilter, setTimeFilter] = useState("month"); // "day", "week", "month"
  const [animateStats, setAnimateStats] = useState(false);
  const [chartHover, setChartHover] = useState(null);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [questionSearchTerm, setQuestionSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState("Tất cả");
  const [exams, setExams] = useState([]);
  const [topics, setTopics] = useState([]);
  const tableRef = useRef(null);
  const chartsRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const PAGE_SIZE = 10; // Số lượng đề thi mỗi trang
  const [loadingAction, setLoadingAction] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    topicId: "", // Lưu ID của topic
    topicName: "", // Lưu tên hiển thị
    questions: "",
    difficulty: difficultyLevels[0],
    price: "0",
    isPaid: false,
    examContent: "",
    file: null,
    selectedQuestions: [],
  });
  // Thêm console.log kiểm tra filteredUsers
  const filteredUsers = users.filter((user) => {
    const searchRegex = new RegExp(searchTerm, "i");
    return (
      searchRegex.test(user.name) ||
      searchRegex.test(user.email) ||
      searchRegex.test(user.role || "")
    );
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);

      // Kiểm tra token từ cả cookie và localStorage
      const cookieToken = getCookie("auth_token");
      const localToken = localStorage.getItem("auth_token");

      // Log để kiểm tra token
      console.log("Tokens available for user request:");
      console.log(
        "- Cookie:",
        cookieToken ? `${cookieToken.substring(0, 15)}...` : "None"
      );
      console.log(
        "- LocalStorage:",
        localToken ? `${localToken.substring(0, 15)}...` : "None"
      );

      // Nếu không có token, chuyển hướng đến trang đăng nhập
      if (!cookieToken && !localToken) {
        console.error("No token available - redirecting to login");
        window.location.href = "/login";
        return;
      }

      const response = await api.get("/users");
      console.log("API response:", response.data);

      // Xử lý response đúng cấu trúc API
      if (
        response.data &&
        response.data.success &&
        Array.isArray(response.data.data)
      ) {
        setUsers(response.data.data);
        console.log("Users loaded:", response.data.data.length);
      } else {
        console.error("Unexpected API response format", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Thay đổi URL API và cập nhật logic để lấy danh sách chủ đề
  // Cập nhật hàm fetchExams để chuyển đổi dữ liệu
  useEffect(() => {
    fetchExams();
  }, [currentPage]);
  const fetchExams = async () => {
    setIsLoading(true);
    try {
      // Lấy dữ liệu từ API với param phân trang
      const response = await axios.get(
        `https://437f-113-161-89-176.ngrok-free.app/api/exams`,
        {
          params: {
            page: currentPage,
            limit: PAGE_SIZE,
          },
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
        }
      );

      console.log("API response:", response.data);

      // Lấy dữ liệu exams từ response
      const examsData = response.data.data || response.data.exams || [];
      const totalCount = response.data.total || examsData.length;

      // Tính toán tổng số trang
      setTotalPages(Math.ceil(totalCount / PAGE_SIZE));

      // Chuyển đổi dữ liệu để phù hợp với định dạng hiển thị
      const formattedExams = examsData.map((exam) => ({
        id: exam._id || exam.id,
        name: exam.title || exam.name,
        topic: exam.topic?.name || "Chưa phân loại",
        questions:
          exam.questionCount || (exam.questions ? exam.questions.length : 0),
        difficulty: exam.difficulty || "unknown",
        date: new Date(exam.createdAt).toLocaleDateString("vi-VN"),
        avgScore: exam.stats?.averageScore || 0,
        completions: exam.stats?.totalAttempts || 0,
        accessLevel: exam.accessLevel || "free",
        rating: exam.rating || 0, // Thêm trường rating với giá trị mặc định là 0
      }));

      setExams(formattedExams);

      // Lấy danh sách chủ đề từ response nếu có
      if (response.data.topics && Array.isArray(response.data.topics)) {
        setTopics(response.data.topics);
      }
    } catch (error) {
      console.error("Error fetching exams:", error);
      setExams([]);
    } finally {
      setIsLoading(false);
      setTimeout(() => setAnimateStats(true), 300);
    }
  };
  const handleAddExam = () => {
    setShowForm(true);
    setFormData({
      name: "",
      topicId: "",
      topicName: "",
      questions: "",
      difficulty: difficultyLevels[0],
      price: "0",
      isPaid: false,
      examContent: "",
      file: null,
      selectedQuestions: [],
    });
    setSelectedQuestions([]);
    setQuestionSearchTerm("");
    setSelectedDifficulty("Tất cả");
  };

  const handleCancel = () => {
    setShowForm(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "topicId") {
      // Tìm thông tin topic tương ứng để lưu tên
      const selectedTopic = topics.find((topic) => topic._id === value);
      setFormData((prev) => ({
        ...prev,
        topicId: value,
        topicName: selectedTopic ? selectedTopic.name : "",
      }));
    } else if (name === "isPaid") {
      // Code xử lý isPaid giữ nguyên
    } else if (type === "file") {
      // Code xử lý file giữ nguyên
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleQuestionSelect = (question) => {
    // Kiểm tra xem câu hỏi đã được chọn chưa
    const isSelected = selectedQuestions.some((q) => q.id === question.id);

    if (isSelected) {
      // Nếu đã chọn rồi thì bỏ chọn
      setSelectedQuestions(
        selectedQuestions.filter((q) => q.id !== question.id)
      );
    } else {
      // Nếu chưa chọn và chưa đạt giới hạn thì thêm vào
      const maxQuestions = Number(formData.questions) || 0;
      if (selectedQuestions.length < maxQuestions) {
        setSelectedQuestions([...selectedQuestions, question]);
      } else {
        // Hiển thị thông báo nếu đã đạt giới hạn
        showNotificationMessage(
          `Bạn chỉ được chọn tối đa ${maxQuestions} câu hỏi`,
          "error"
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra nếu số câu hỏi được chọn không khớp với số câu hỏi yêu cầu
    if (parseInt(formData.questions) !== formData.selectedQuestions.length) {
      showNotificationMessage(
        `Vui lòng chọn đúng ${formData.questions} câu hỏi (hiện tại đã chọn ${formData.selectedQuestions.length} câu)`,
        "error"
      );
      return;
    }

    setIsLoading(true);
    setLoadingAction("update");

    try {
      // Chuẩn bị dữ liệu để gửi đi
      const examData = {
        title: formData.name,
        topic: formData.topicId,
        description: formData.examContent,
        difficulty: formData.difficulty,
        instructions: formData.instructions,
        timeLimit: parseInt(formData.timeLimit),
        accessLevel: formData.isPaid ? "premium" : "free",
        questions: formData.selectedQuestions.map((q, index) => ({
          question: q.id,
          points: q.points || 1,
          order: index + 1,
        })),
        isPublished: true,
        allowReview: true,
        randomizeQuestions: false,
      };

      console.log("Sending data:", examData);

      let response;
      const token = localStorage.getItem("auth_token");

      if (formData.id) {
        // Cập nhật đề thi hiện có
        response = await axios.put(
          `${API_BASE_URL}/api/exams/${formData.id}`,
          examData,
          {
            headers: {
              "ngrok-skip-browser-warning": "true",
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        showNotificationMessage("Đã cập nhật đề thi thành công!", "success");
      } else {
        // Thêm đề thi mới
        response = await axios.post(`${API_BASE_URL}/api/exams`, examData, {
          headers: {
            "ngrok-skip-browser-warning": "true",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        showNotificationMessage("Đã thêm đề thi mới thành công!", "success");
      }

      console.log("Response:", response.data);

      // Làm mới danh sách đề thi
      await fetchExams();

      // Đóng form
      setShowForm(false);
    } catch (error) {
      console.error("Error saving exam:", error);

      if (error.response) {
        console.error("Error response data:", error.response.data);
        showNotificationMessage(
          `Lỗi: ${error.response.data.message || error.message}`,
          "error"
        );
      } else {
        showNotificationMessage(`Lỗi: ${error.message}`, "error");
      }
    } finally {
      setIsLoading(false);
      setLoadingAction("");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  // Lọc câu hỏi theo từ khóa tìm kiếm và mức độ khó
  const filteredTopicQuestions = useMemo(() => {
    if (!formData.allTopicQuestions) return [];

    return formData.allTopicQuestions.filter((q) => {
      const matchesSearch = q.content
        .toLowerCase()
        .includes(questionSearchTerm.toLowerCase());
      const matchesDifficulty =
        selectedDifficulty === "Tất cả" || q.difficulty === selectedDifficulty;
      return matchesSearch && matchesDifficulty;
    });
  }, [formData.allTopicQuestions, questionSearchTerm, selectedDifficulty]);

  // Xử lý khi chọn/bỏ chọn câu hỏi
  const handleQuestionSelection = (questionId) => {
    setFormData((prevData) => {
      const allQuestions = [...prevData.allTopicQuestions];
      const questionIndex = allQuestions.findIndex((q) => q.id === questionId);

      if (questionIndex === -1) return prevData;

      // Toggle selection
      allQuestions[questionIndex] = {
        ...allQuestions[questionIndex],
        isSelected: !allQuestions[questionIndex].isSelected,
      };

      // Update selectedQuestions
      const selectedQuestions = allQuestions.filter((q) => q.isSelected);

      return {
        ...prevData,
        allTopicQuestions: allQuestions,
        selectedQuestions,
      };
    });
  };

  // Xử lý khi thay đổi điểm của câu hỏi
  const handleQuestionPointsChange = (questionId, points) => {
    setFormData((prevData) => {
      const allQuestions = [...prevData.allTopicQuestions];
      const questionIndex = allQuestions.findIndex((q) => q.id === questionId);

      if (questionIndex === -1) return prevData;

      allQuestions[questionIndex] = {
        ...allQuestions[questionIndex],
        points,
      };

      // Update selectedQuestions
      const selectedQuestions = allQuestions.filter((q) => q.isSelected);

      return {
        ...prevData,
        allTopicQuestions: allQuestions,
        selectedQuestions,
      };
    });
  };

  // Xử lý khi thay đổi chủ đề
  const handleTopicChange = async (e) => {
    const { name, value } = e.target;

    // Cập nhật topic
    const [formData, setFormData] = useState({
      name: "",
      topicId: "",
      topicName: "",
      questions: "",
      difficulty: difficultyLevels[0],
      price: "0",
      isPaid: false,
      examContent: "",
      file: null,
      selectedQuestions: [],
      allTopicQuestions: [], // Thêm trường này
    });
    if (value) {
      try {
        setIsLoading(true);
        setLoadingAction("fetch-questions");

        // Lấy tất cả câu hỏi theo chủ đề mới
        const response = await axios.get(
          `https://437f-113-161-89-176.ngrok-free.app/api/questions`,
          {
            params: {
              topic: value,
              limit: 100,
            },
            headers: {
              "ngrok-skip-browser-warning": "true",
              Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
            },
          }
        );

        const questions = response.data.data || [];
        console.log("Đã tải được câu hỏi:", questions.length);

        const formattedQuestions = questions.map((q) => ({
          id: q._id,
          content: q.content || q.question || "Nội dung câu hỏi",
          difficulty: q.difficulty || "easy",
          isSelected: false,
          points: 1,
        }));

        setFormData((prev) => ({
          ...prev,
          allTopicQuestions: formattedQuestions,
        }));
      } catch (error) {
        console.error("Error fetching questions:", error);
        showNotificationMessage(
          `Lỗi khi tải câu hỏi: ${error.message}`,
          "error"
        );
      } finally {
        setIsLoading(false);
        setLoadingAction("");
      }
    }
  };
  const confirmDeleteExam = (id) => {
    setExamToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteUser = async () => {
    setIsLoading(true);

    try {
      // Gửi DELETE request đến API
      await api.delete(`/users/${userToDelete}`);

      // Cập nhật UI (giữ lại cấu trúc mảng users)
      setUsers((prev) =>
        prev.filter(
          (user) => user.id !== userToDelete && user._id !== userToDelete
        )
      );

      showNotificationMessage("Đã xóa người dùng thành công", "success");
    } catch (error) {
      console.error("Error deleting user:", error);
      showNotificationMessage(
        `Lỗi khi xóa người dùng: ${
          error.response?.data?.message || error.message
        }`,
        "error"
      );
    } finally {
      setIsLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleEditExam = async (examId) => {
    try {
      setIsLoading(true);
      setLoadingAction("fetch-edit");

      // Lấy thông tin chi tiết của đề thi
      const examResponse = await axios.get(
        `${API_BASE_URL}/api/exams/${examId}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "true",
            Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
          },
        }
      );

      // Log ra cấu trúc đầy đủ để kiểm tra
      console.log("Exam response:", examResponse);

      // Kiểm tra cấu trúc dữ liệu của API
      const examData = examResponse.data.data || examResponse.data;
      console.log("Exam data:", examData);

      // Kiểm tra và xác định topicId từ cấu trúc dữ liệu
      let topicId;
      let topicName = "Chưa phân loại";

      // Log dữ liệu để debug
      console.log("Topic data:", {
        topicObject: examData.topic,
        topicId: examData.topicId,
        fullData: examData,
      });

      // Xử lý nhiều trường hợp cấu trúc khác nhau
      if (
        examData.topic &&
        typeof examData.topic === "object" &&
        examData.topic._id
      ) {
        // Trường hợp topic là một object có _id
        topicId = examData.topic._id;
        topicName = examData.topic.name || topicName;
      } else if (examData.topic && typeof examData.topic === "string") {
        // Trường hợp topic là một string (ID)
        topicId = examData.topic;
      } else if (examData.topicId) {
        // Trường hợp API trả về topicId trực tiếp
        topicId = examData.topicId;
        topicName = examData.topicName || topicName;
      } else {
        // Không tìm thấy thông tin topic - sử dụng giá trị mặc định
        console.warn(
          "Không tìm thấy thông tin chủ đề trong dữ liệu đề thi, sử dụng giá trị trống"
        );
        // Không ném lỗi nữa, chỉ ghi log cảnh báo
      }

      // Lấy tất cả câu hỏi cùng chủ đề
      let allTopicQuestions = [];

      if (topicId) {
        try {
          const questionsResponse = await axios.get(
            `${API_BASE_URL}/api/questions`,
            {
              params: {
                topic: topicId,
                limit: 100, // Lấy nhiều câu hỏi để đảm bảo đủ
              },
              headers: {
                "ngrok-skip-browser-warning": "true",
                Authorization: `Bearer ${localStorage.getItem("auth_token")}`,
              },
            }
          );
          allTopicQuestions = questionsResponse.data.data || [];
        } catch (error) {
          console.error("Không thể tải câu hỏi cho chủ đề:", error);
          // Không dừng luồng xử lý khi không thể tải câu hỏi
        }
      }

      // Xác định câu hỏi nào đã được chọn trong đề thi
      const examQuestions = examData.questions || [];
      const examQuestionIds = examQuestions.map((q) =>
        typeof q === "object" ? q.question || q._id : q
      );

      // Chuẩn bị danh sách câu hỏi với trạng thái đã chọn
      const formattedQuestions = allTopicQuestions.map((q) => ({
        id: q._id,
        content: q.content || q.question || "Nội dung câu hỏi",
        difficulty: q.difficulty || "easy",
        isSelected: examQuestionIds.includes(q._id),
        points: 1, // Điểm mặc định
      }));

      // Cập nhật form data với thông tin đề thi
      setFormData({
        id: examData._id || examData.id,
        name: examData.title || examData.name,
        topicId: topicId,
        topicName: topicName,
        questions: examQuestions.length.toString(),
        difficulty: examData.difficulty || "easy",
        price: examData.accessLevel === "premium" ? "10" : "0",
        isPaid: examData.accessLevel === "premium",
        examContent: examData.description || "",
        timeLimit: examData.timeLimit?.toString() || "60",
        instructions: examData.instructions || "",
        file: null,
        selectedQuestions: formattedQuestions.filter((q) => q.isSelected),
        allTopicQuestions: formattedQuestions,
      });

      setShowForm(true);
    } catch (error) {
      console.error("Error fetching exam details:", error);
      showNotificationMessage(
        `Lỗi khi tải thông tin đề thi: ${error.message}`,
        "error"
      );
    } finally {
      setIsLoading(false);
      setLoadingAction("");
    }
  };

  const showNotificationMessage = (message, type) => {
    setNotificationMessage(message);
    setNotificationType(type);
    setShowNotification(true);

    setTimeout(() => {
      setShowNotification(false);
    }, 3000);
  };

  const filteredExams = exams.filter(
    (exam) =>
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.difficulty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.topic.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Lọc câu hỏi theo tìm kiếm và mức độ khó
  const filteredQuestions = availableQuestions.filter(
    (question) =>
      question.content
        .toLowerCase()
        .includes(questionSearchTerm.toLowerCase()) &&
      (selectedDifficulty === "Tất cả" ||
        question.difficulty === selectedDifficulty)
  );

  // Dữ liệu cho biểu đồ tròn
  const examsByTopic = exams.reduce((acc, exam) => {
    if (!acc[exam.topic]) {
      acc[exam.topic] = 0;
    }
    acc[exam.topic]++;
    return acc;
  }, {});

  const pieData = Object.keys(examsByTopic).map((topic, index) => ({
    name: topic,
    value: examsByTopic[topic],
  }));

  // Tính tổng số đề thi và tổng số câu hỏi
  const totalExams = exams.length;
  const totalQuestions = exams.reduce((sum, exam) => sum + exam.questions, 0);
  const totalCompletions = exams.reduce(
    (sum, exam) => sum + exam.completions,
    0
  );
  const avgRating =
    exams.reduce((sum, exam) => sum + exam.rating, 0) / exams.length;

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
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
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
                  className="flex items-center rounded-lg bg-white/10 p-3 text-white transition-all hover:bg-white/20"
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
                  className="flex items-center rounded-lg p-3 text-white/80 transition-all hover:bg-white/10"
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

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="sticky top-0 z-30 bg-white/80 p-4 shadow-sm backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                className="mr-4 rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
                Quản lý Đề thi
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Tìm kiếm đề thi..."
                  className="w-full rounded-full border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>

              <button className="relative rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200">
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  3
                </span>
              </button>

              <button
                onClick={handleAddExam}
                className="group flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-lg"
              >
                <PlusCircle className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />
                <span className="hidden sm:inline">Thêm Đề thi</span>
                <span className="sm:hidden">Thêm</span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div
              className={`group transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                animateStats
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "0ms" }}
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <FileText className="h-7 w-7 text-blue-600 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng số đề thi</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">
                      {totalExams}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      +2
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    <span className="font-medium text-green-600">+15%</span> so
                    với tháng trước
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-blue-500 transition-all duration-1000"
                  style={{ width: animateStats ? "33%" : "0%" }}
                ></div>
              </div>
            </div>

            <div
              className={`group transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                animateStats
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "100ms" }}
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 transition-colors group-hover:bg-green-600 group-hover:text-white">
                  <BookOpen className="h-7 w-7 text-green-600 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tổng số câu hỏi</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">
                      {totalQuestions}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      +15
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    <span className="font-medium text-green-600">+8%</span> so
                    với tháng trước
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-green-500 transition-all duration-1000"
                  style={{ width: animateStats ? "66%" : "0%" }}
                ></div>
              </div>
            </div>

            <div
              className={`group transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                animateStats
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 transition-colors group-hover:bg-purple-600 group-hover:text-white">
                  <TrendingUp className="h-7 w-7 text-purple-600 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Lượt làm bài</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">
                      {totalCompletions}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      +12%
                    </p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    <span className="font-medium text-green-600">+35</span> lượt
                    trong tuần
                  </p>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-purple-500 transition-all duration-1000"
                  style={{ width: animateStats ? "75%" : "0%" }}
                ></div>
              </div>
            </div>

            <div
              className={`group transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-1 hover:shadow-xl ${
                animateStats
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex items-center">
                <div className="mr-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 transition-colors group-hover:bg-amber-600 group-hover:text-white">
                  <Star className="h-7 w-7 text-amber-600 transition-colors group-hover:text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Đánh giá trung bình</p>
                  <div className="flex items-end">
                    <p className="text-3xl font-bold text-gray-800">
                      {avgRating.toFixed(1)}
                    </p>
                    <p className="ml-2 text-sm font-medium text-green-600">
                      +0.2
                    </p>
                  </div>
                  <div className="mt-1 flex text-xs text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-current" />
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
                <div
                  className="h-1 rounded-full bg-amber-500 transition-all duration-1000"
                  style={{ width: animateStats ? "90%" : "0%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Bảng danh sách đề kiểm tra */}
          <div
            ref={tableRef}
            className="mb-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl "
          >
            <div className="border-b p-6">
              <h2 className="text-lg font-semibold text-gray-800">
                Danh sách Đề thi
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-sm text-gray-600">
                    <th className="px-6 py-4 text-left font-medium">ID</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Tên Đề thi
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Chủ đề liên quan
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Số câu hỏi
                    </th>
                    <th className="px-6 py-4 text-left font-medium">Mức độ</th>

                    <th className="px-6 py-4 text-left font-medium">Điểm TB</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Mức truy cập
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Hành động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredExams.length > 0 ? (
                    filteredExams.map((exam, index) => (
                      <tr
                        key={exam.id}
                        className="border-b border-gray-100 transition-colors hover:bg-blue-50/30"
                        style={{
                          animationDelay: `${index * 100}ms`,
                          animation: "fadeIn 0.5s ease-in-out forwards",
                        }}
                      >
                        <td className="px-6 py-4 text-gray-800">{exam.id}</td>
                        <td className="px-6 py-4 font-medium text-gray-800">
                          {exam.name}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {exam.topic}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {exam.questions}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                              exam.difficulty === "easy"
                                ? "bg-green-100 text-green-800"
                                : exam.difficulty === "medium"
                                ? "bg-blue-100 text-blue-800"
                                : exam.difficulty === "hard"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {exam.difficulty === "easy"
                              ? "Easy"
                              : exam.difficulty === "medium"
                              ? "Medium"
                              : exam.difficulty === "hard"
                              ? "Hard"
                              : "Very Hard"}
                          </span>
                        </td>
                        {/* Bỏ cột Lượt làm */}
                        {/* Bỏ cột Đánh giá */}
                        <td className="px-6 py-4">
                          {exam.avgScore > 0 ? (
                            <span
                              className={`font-medium ${
                                exam.avgScore >= 8
                                  ? "text-green-600"
                                  : exam.avgScore >= 6.5
                                  ? "text-blue-600"
                                  : "text-orange-600"
                              }`}
                            >
                              {exam.avgScore.toFixed(1)}
                            </span>
                          ) : (
                            <span className="text-gray-400">
                              Chưa có dữ liệu
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {exam.accessLevel === "premium" ? (
                            <span className="inline-flex rounded-full bg-purple-100 px-2 py-1 text-xs font-medium text-purple-800">
                              Premium
                            </span>
                          ) : (
                            <span className="inline-flex rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                              Miễn phí
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => handleEditExam(exam.id)}
                              className="group flex items-center rounded-lg bg-blue-50 px-2 py-1 text-xs font-medium text-blue-600 transition-colors hover:bg-blue-100"
                            >
                              <Edit className="mr-1 h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
                              Sửa
                            </button>
                            <button
                              onClick={() => confirmDeleteExam(exam.id)}
                              className="group flex items-center rounded-lg bg-red-50 px-2 py-1 text-xs font-medium text-red-600 transition-colors hover:bg-red-100"
                            >
                              <Trash2 className="mr-1 h-3 w-3 transition-transform duration-300 group-hover:scale-110" />
                              Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        Không tìm thấy đề thi nào phù hợp với tìm kiếm
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
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

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Tính toán số trang hiển thị để đảm bảo trang hiện tại luôn ở giữa khi có thể
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    if (currentPage + 2 <= totalPages) {
                      pageNum = currentPage - 2 + i;
                    } else {
                      pageNum = totalPages - 4 + i;
                    }
                  }
                }

                return (
                  <button
                    key={`page-${pageNum}`}
                    className={`rounded-md border px-3 py-1.5 text-sm font-medium transition-all ${
                      currentPage === pageNum
                        ? "border-blue-500 bg-blue-500 text-white hover:bg-blue-600"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                    onClick={() => setCurrentPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                );
              })}

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
                  <path d="m9 18 6-6-6-6" />
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

          {/* Biểu đồ */}
          <div
            ref={chartsRef}
            className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2 "
          >
            {/* Biểu đồ lượt làm bài - Thay thế bằng Area Chart từ admin-home */}
            <div
              className="transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
              onMouseEnter={() => setChartHover("attempts")}
              onMouseLeave={() => setChartHover(null)}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Thống kê Lượt làm bài
                </h2>
                <div className="flex items-center space-x-1 rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setTimeFilter("day")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      timeFilter === "day"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Ngày
                  </button>
                  <button
                    onClick={() => setTimeFilter("week")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      timeFilter === "week"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Tuần
                  </button>
                  <button
                    onClick={() => setTimeFilter("month")}
                    className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
                      timeFilter === "month"
                        ? "bg-white text-blue-600 shadow-sm"
                        : "text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Tháng
                  </button>
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={attemptsData}>
                    <defs>
                      <linearGradient
                        id="colorAttempts"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#3b82f6"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="#3b82f6"
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280" }} />
                    <YAxis tick={{ fill: "#6b7280" }} />
                    <Tooltip
                      formatter={(value) => [`${value} lượt`, "Lượt Làm Bài"]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="Thống Kê Lượt Làm Bài"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorAttempts)"
                      animationDuration={1500}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Biểu đồ phân bố đề thi theo chủ đề */}
            <div
              className="transform rounded-xl border border-gray-100 bg-white p-6 shadow-lg transition-all duration-300 hover:shadow-xl"
              onMouseEnter={() => setChartHover("distribution")}
              onMouseLeave={() => setChartHover(null)}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Phân bố đề thi theo chủ đề
                </h2>
                <div
                  className={`flex items-center text-blue-600 transition-opacity duration-300 ${
                    chartHover === "distribution" ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span className="text-sm font-medium">Xem chi tiết</span>
                  <ChevronDown className="ml-1 h-4 w-4 -rotate-90" />
                </div>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      animationDuration={1500}
                      animationBegin={300}
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${value} đề thi`, name]}
                      contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </main>

        <footer className="border-t bg-white p-4 text-center text-sm text-gray-500">
          © 2025 Hệ thống quản lý đề thi. Bản quyền thuộc về Trường Đại học.
        </footer>
      </div>

      {/* Form thêm đề thi */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50 backdrop-blur-sm transition-all duration-300">
          <div className="m-4 max-h-[90vh] w-full max-w-3xl transform overflow-y-auto rounded-2xl bg-white p-8 shadow-xl transition-transform duration-300 animate-fade-in">
            <div className="sticky top-0 z-10 mb-6 flex items-center justify-between bg-white pt-2">
              <h2 className="text-xl font-bold text-gray-800">
                {formData.id ? "Chỉnh sửa đề thi" : "Thêm đề thi mới"}
              </h2>
              <button
                onClick={handleCancel}
                className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Xóa phần select trùng lặp, chỉ giữ lại một */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Chủ đề
                  </label>
                  <select
                    name="topicId"
                    value={formData.topicId || ""}
                    onChange={handleTopicChange} // Thay đổi từ handleInputChange sang handleTopicChange
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    required
                  >
                    <option value="">Chọn chủ đề</option>
                    {topics.map((topic) => (
                      <option key={topic._id} value={topic._id}>
                        {topic.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Số lượng câu hỏi
                  </label>
                  <input
                    type="number"
                    name="questions"
                    value={formData.questions}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Nhập số lượng câu hỏi"
                    required
                  />
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
                    {difficultyLevels.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <div className="mb-2 flex items-center">
                    <input
                      type="checkbox"
                      id="isPaid"
                      name="isPaid"
                      checked={formData.isPaid}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor="isPaid"
                      className="ml-2 block text-sm font-medium text-gray-700"
                    >
                      Đề thi có phí
                    </label>
                  </div>
                  {formData.isPaid && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Giá tiền (VNĐ)
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        placeholder="Nhập giá tiền"
                        required
                      />
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Nội dung đề thi
                  </label>
                  <textarea
                    name="examContent"
                    value={formData.examContent}
                    onChange={handleInputChange}
                    className="mt-1 w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Nhập mô tả hoặc nội dung đề thi"
                    rows={3}
                  ></textarea>

                  {formData.topicId ? (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-md font-medium text-gray-800">
                          Chọn câu hỏi cho đề thi{" "}
                          {formData.questions && (
                            <span className="text-sm font-normal text-gray-500">
                              (Đã chọn {formData.selectedQuestions.length}/
                              {formData.questions})
                            </span>
                          )}
                        </h3>

                        <div className="flex space-x-2">
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                              type="text"
                              placeholder="Tìm kiếm câu hỏi..."
                              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              value={questionSearchTerm}
                              onChange={(e) =>
                                setQuestionSearchTerm(e.target.value)
                              }
                            />
                          </div>

                          <select
                            value={selectedDifficulty}
                            onChange={(e) =>
                              setSelectedDifficulty(e.target.value)
                            }
                            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="Tất cả">Tất cả mức độ</option>
                            {difficultyLevels.map((level) => (
                              <option key={level} value={level}>
                                {level}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Danh sách câu hỏi */}
                      <div className="max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
                        {isLoading && loadingAction === "fetch-questions" ? (
                          <div className="flex h-32 items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                            <p className="ml-3 text-gray-600">
                              Đang tải câu hỏi...
                            </p>
                          </div>
                        ) : filteredTopicQuestions &&
                          filteredTopicQuestions.length > 0 ? (
                          <div className="space-y-3">
                            {filteredTopicQuestions.map((question) => (
                              <div
                                key={question.id}
                                onClick={() =>
                                  handleQuestionSelection(question.id)
                                }
                                className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                                  question.isSelected
                                    ? "border-blue-500 bg-blue-50 shadow-md"
                                    : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                                }`}
                              >
                                <div className="flex items-start">
                                  <div className="mr-3 mt-0.5">
                                    <div
                                      className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                                        question.isSelected
                                          ? "border-blue-500 bg-blue-500 text-white"
                                          : "border-gray-300 bg-white"
                                      }`}
                                    >
                                      {question.isSelected && (
                                        <Check className="h-4 w-4" />
                                      )}
                                    </div>
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                      <h4 className="font-medium text-gray-800">
                                        {question.content}
                                      </h4>
                                      <span
                                        className={`ml-2 rounded-full px-2 py-1 text-xs font-medium ${
                                          question.difficulty === "easy"
                                            ? "bg-green-100 text-green-800"
                                            : question.difficulty === "medium"
                                            ? "bg-blue-100 text-blue-800"
                                            : question.difficulty === "hard"
                                            ? "bg-orange-100 text-orange-800"
                                            : "bg-red-100 text-red-800"
                                        }`}
                                      >
                                        {question.difficulty}
                                      </span>
                                    </div>
                                    {question.isSelected && (
                                      <div className="mt-2 flex items-center">
                                        <label className="mr-2 text-sm text-gray-600">
                                          Điểm:
                                        </label>
                                        <select
                                          value={question.points || 1}
                                          onChange={(e) =>
                                            handleQuestionPointsChange(
                                              question.id,
                                              parseInt(e.target.value)
                                            )
                                          }
                                          onClick={(e) => e.stopPropagation()}
                                          className="rounded border border-gray-300 px-2 py-1 text-sm"
                                        >
                                          <option value="1">1</option>
                                          <option value="2">2</option>
                                          <option value="3">3</option>
                                          <option value="4">4</option>
                                          <option value="5">5</option>
                                        </select>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex h-32 items-center justify-center">
                            <p className="text-gray-500">
                              {formData.allTopicQuestions &&
                              formData.allTopicQuestions.length === 0
                                ? "Không tìm thấy câu hỏi nào cho chủ đề này"
                                : "Không tìm thấy câu hỏi nào phù hợp với tìm kiếm"}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4 flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                      <div className="text-center">
                        <FileText className="mx-auto h-10 w-10 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Vui lòng chọn chủ đề để hiển thị câu hỏi
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tải file đề thi (tùy chọn)
                  </label>
                  <div className="flex w-full items-center justify-center">
                    <label className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pb-6 pt-5">
                        <Upload className="mb-3 h-8 w-8 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">
                            Click để tải file
                          </span>{" "}
                          hoặc kéo thả file vào đây
                        </p>
                        <p className="text-xs text-gray-500">
                          Hỗ trợ PDF, DOCX, TXT (Tối đa 10MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        name="file"
                        className="hidden"
                        onChange={handleInputChange}
                      />
                    </label>
                  </div>
                  {formData.fileName && (
                    <p className="mt-2 text-sm text-gray-600">
                      File đã chọn: {formData.fileName}
                    </p>
                  )}
                </div>
              </div>
              {isLoading && loadingAction === "update" && (
                <div className="mt-4 rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Đang lưu đề thi, vui lòng đợi...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hiển thị khi đang tải câu hỏi */}
              {isLoading && loadingAction === "fetch-questions" && (
                <div className="mt-4 rounded-md bg-blue-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        Đang tải danh sách câu hỏi theo chủ đề...
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Hiển thị nếu chọn sai số lượng câu hỏi */}
              {formData.questions &&
                parseInt(formData.questions) !==
                  formData.selectedQuestions.length && (
                  <div className="mt-4 rounded-md bg-yellow-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-yellow-700">
                          {formData.selectedQuestions.length >
                          parseInt(formData.questions)
                            ? `Bạn đã chọn nhiều hơn ${
                                formData.selectedQuestions.length -
                                parseInt(formData.questions)
                              } câu hỏi so với yêu cầu.`
                            : `Bạn cần chọn thêm ${
                                parseInt(formData.questions) -
                                formData.selectedQuestions.length
                              } câu hỏi.`}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              <div className="sticky bottom-0 z-10 flex justify-end gap-4 bg-white pb-2 pt-4">
                <button
                  type="button"
                  className="flex items-center rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
                  onClick={handleCancel}
                >
                  Hủy
                </button>
                <button
                  type="button"
                  className="flex items-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  Import đề thi
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
                      Thêm đề thi
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="m-4 w-full max-w-md animate-fade-in rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </div>
            <h3 className="mb-2 text-center text-xl font-bold text-gray-800">
              Xác nhận xóa đề thi
            </h3>
            <p className="mb-6 text-center text-gray-600">
              Bạn có chắc chắn muốn xóa đề thi này không? Hành động này không
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
                onClick={handleDeleteExam}
                className="rounded-lg bg-red-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
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

      {/* Global CSS for animations */}
      {/* Global CSS for animations */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }

    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
  `,
        }}
      />
    </div>
  );
};

export default ManageExams;
