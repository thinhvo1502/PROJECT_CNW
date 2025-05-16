"use client";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
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

  // Refs for scroll animations
  const tableRef = useRef(null);
  const chartsRef = useRef(null);

  const [exams, setExams] = useState([
    {
      id: 1,
      name: "Cơ sở dữ liệu",
      topic: "Cơ sở dữ liệu",
      questions: 50,
      difficulty: "Trung bình",
      date: "01/01/2025",
      price: 50000,
      avgScore: 7.5,
      completions: 120,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Cấu Trúc Dữ Liệu",
      topic: "Kỹ thuật lập trình",
      questions: 40,
      difficulty: "Khó",
      date: "15/02/2025",
      price: 45000,
      avgScore: 6.8,
      completions: 85,
      rating: 4.2,
    },
    {
      id: 3,
      name: "Lập trình hướng đối tượng",
      topic: "Kỹ thuật lập trình",
      questions: 45,
      difficulty: "Dễ",
      date: "20/02/2025",
      price: 0,
      avgScore: 8.2,
      completions: 150,
      rating: 4.9,
    },
    {
      id: 4,
      name: "Mạng máy tính",
      topic: "Mạng máy tính",
      questions: 60,
      difficulty: "Khó",
      date: "05/03/2025",
      price: 60000,
      avgScore: 7.0,
      completions: 95,
      rating: 4.5,
    },
  ]);

  const [formData, setFormData] = useState({
    name: "",
    topic: "",
    questions: "",
    difficulty: difficultyLevels[0],
    price: "0",
    isPaid: false,
    examContent: "",
    file: null,
    selectedQuestions: [],
  });

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);

      // Trigger stats animation after loading
      setTimeout(() => {
        setAnimateStats(true);
      }, 300);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Scroll animation observer
  useEffect(() => {
    if (!isLoading) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (entry.target === tableRef.current) {
                entry.target.classList.add("animate-fade-in-up");
              } else if (entry.target === chartsRef.current) {
                entry.target.classList.add("animate-fade-in-up");
              }
            }
          });
        },
        { threshold: 0.1 }
      );

      if (tableRef.current) observer.observe(tableRef.current);
      if (chartsRef.current) observer.observe(chartsRef.current);

      return () => {
        if (tableRef.current) observer.unobserve(tableRef.current);
        if (chartsRef.current) observer.unobserve(chartsRef.current);
      };
    }
  }, [isLoading]);

  // Cập nhật danh sách câu hỏi khi chọn chủ đề
  useEffect(() => {
    if (formData.topic) {
      setAvailableQuestions(sampleQuestions[formData.topic] || []);
      setSelectedQuestions([]);
    } else {
      setAvailableQuestions([]);
      setSelectedQuestions([]);
    }
  }, [formData.topic]);

  const handleAddExam = () => {
    setShowForm(true);
    setFormData({
      name: "",
      topic: "",
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

    if (name === "isPaid") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
        price: checked ? prev.price : "0",
      }));
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        file: e.target.files[0],
        fileName: e.target.files[0]?.name || "",
      }));
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Kiểm tra xem đã chọn đủ số câu hỏi chưa
    const requiredQuestions = Number(formData.questions) || 0;
    if (selectedQuestions.length < requiredQuestions) {
      showNotificationMessage(
        `Vui lòng chọn đủ ${requiredQuestions} câu hỏi (hiện tại: ${selectedQuestions.length})`,
        "error"
      );
      return;
    }

    const newExam = {
      id: formData.id || Math.floor(Math.random() * 10000),
      name: formData.name,
      topic: formData.topic,
      questions: Number(formData.questions),
      difficulty: formData.difficulty,
      date: new Date().toLocaleDateString("vi-VN"),
      price: formData.isPaid ? Number(formData.price) : 0,
      avgScore: formData.id
        ? exams.find((e) => e.id === formData.id)?.avgScore || 0
        : 0,
      completions: formData.id
        ? exams.find((e) => e.id === formData.id)?.completions || 0
        : 0,
      rating: formData.id
        ? exams.find((e) => e.id === formData.id)?.rating || 0
        : 0,
      selectedQuestions: selectedQuestions,
    };

    if (formData.id) {
      // Update existing exam
      setExams((prev) =>
        prev.map((exam) => (exam.id === formData.id ? newExam : exam))
      );
      showNotificationMessage("Đã cập nhật đề thi thành công", "success");
    } else {
      // Add new exam
      setExams((prev) => [...prev, newExam]);
      showNotificationMessage("Đã thêm đề thi mới thành công", "success");
    }

    handleCancel();
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const confirmDeleteExam = (id) => {
    setExamToDelete(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteExam = () => {
    setExams((prev) => prev.filter((exam) => exam.id !== examToDelete));
    setShowDeleteConfirm(false);
    showNotificationMessage("Đã xóa đề thi thành công", "success");
  };

  const handleEditExam = (id) => {
    const examToEdit = exams.find((exam) => exam.id === id);
    if (examToEdit) {
      setFormData({
        id: examToEdit.id,
        name: examToEdit.name,
        topic: examToEdit.topic,
        questions: examToEdit.questions.toString(),
        difficulty: examToEdit.difficulty,
        price: examToEdit.price.toString(),
        isPaid: examToEdit.price > 0,
        examContent: "",
        file: null,
      });
      setSelectedQuestions(examToEdit.selectedQuestions || []);
      setAvailableQuestions(sampleQuestions[examToEdit.topic] || []);
      setShowForm(true);
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
            className="mb-8 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg transition-all duration-300 hover:shadow-xl opacity-0"
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
                    <th className="px-6 py-4 text-left font-medium">
                      Lượt làm
                    </th>
                    <th className="px-6 py-4 text-left font-medium">
                      Đánh giá
                    </th>
                    <th className="px-6 py-4 text-left font-medium">Điểm TB</th>
                    <th className="px-6 py-4 text-left font-medium">
                      Thành tiền
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
                              exam.difficulty === "Dễ"
                                ? "bg-green-100 text-green-800"
                                : exam.difficulty === "Trung bình"
                                ? "bg-blue-100 text-blue-800"
                                : exam.difficulty === "Khó"
                                ? "bg-orange-100 text-orange-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {exam.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-800">
                          {exam.completions}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className="mr-1 font-medium text-gray-800">
                              {exam.rating.toFixed(1)}
                            </span>
                            <Star className="h-4 w-4 fill-current text-amber-500" />
                          </div>
                        </td>
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
                          {exam.price > 0 ? (
                            `${exam.price.toLocaleString()} VNĐ`
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
                        colSpan={10}
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

          {/* Biểu đồ */}
          <div
            ref={chartsRef}
            className="mb-8 grid grid-cols-1 gap-8 lg:grid-cols-2 opacity-0"
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
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Tên Đề thi
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    placeholder="Nhập tên đề thi"
                    required
                  />
                </div>
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
                    {itTopics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic || "Chọn chủ đề"}
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

                  {formData.topic ? (
                    <div className="mt-4 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-md font-medium text-gray-800">
                          Chọn câu hỏi cho đề thi{" "}
                          {formData.questions && (
                            <span className="text-sm font-normal text-gray-500">
                              (Đã chọn {selectedQuestions.length}/
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

                      {/* Hiển thị thông tin về số lượng câu hỏi */}
                      {formData.questions && (
                        <div className="flex items-center rounded-lg bg-blue-50 p-3 text-blue-700">
                          <Info className="mr-2 h-5 w-5" />
                          <p className="text-sm">
                            Vui lòng chọn <strong>{formData.questions}</strong>{" "}
                            câu hỏi cho đề thi này. Nhấp vào mỗi câu hỏi để
                            chọn.
                          </p>
                        </div>
                      )}

                      {/* Danh sách câu hỏi */}
                      <div className="max-h-[400px] overflow-y-auto rounded-lg border border-gray-200 bg-gray-50 p-4">
                        {filteredQuestions.length > 0 ? (
                          <div className="space-y-3">
                            {filteredQuestions.map((question) => {
                              const isSelected = selectedQuestions.some(
                                (q) => q.id === question.id
                              );
                              return (
                                <div
                                  key={question.id}
                                  onClick={() => handleQuestionSelect(question)}
                                  className={`cursor-pointer rounded-lg border p-4 transition-all duration-200 ${
                                    isSelected
                                      ? "border-blue-500 bg-blue-50 shadow-md"
                                      : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                                  }`}
                                >
                                  <div className="flex items-start">
                                    <div className="mr-3 mt-0.5">
                                      <div
                                        className={`flex h-6 w-6 items-center justify-center rounded-full border ${
                                          isSelected
                                            ? "border-blue-500 bg-blue-500 text-white"
                                            : "border-gray-300 bg-white"
                                        }`}
                                      >
                                        {isSelected && (
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
                                            question.difficulty === "Dễ"
                                              ? "bg-green-100 text-green-800"
                                              : question.difficulty ===
                                                "Trung bình"
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-orange-100 text-orange-800"
                                          }`}
                                        >
                                          {question.difficulty}
                                        </span>
                                      </div>
                                      <p className="mt-1 text-sm text-gray-500">
                                        ID: {question.id}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="flex h-32 items-center justify-center">
                            <p className="text-gray-500">
                              Không tìm thấy câu hỏi nào phù hợp
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Hiển thị câu hỏi đã chọn */}
                      {selectedQuestions.length > 0 && (
                        <div className="rounded-lg border border-gray-200 bg-white p-4">
                          <h4 className="mb-3 font-medium text-gray-800">
                            Câu hỏi đã chọn ({selectedQuestions.length})
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedQuestions.map((question) => (
                              <div
                                key={question.id}
                                className="flex items-center rounded-lg bg-blue-100 px-3 py-1.5 text-sm text-blue-800"
                              >
                                <span className="mr-1.5">
                                  ID: {question.id}
                                </span>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleQuestionSelect(question);
                                  }}
                                  className="ml-1 rounded-full p-0.5 text-blue-600 hover:bg-blue-200 hover:text-blue-800"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex h-40 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
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
      <style jsx global>{`
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
      `}</style>
    </div>
  );
};

export default ManageExams;
