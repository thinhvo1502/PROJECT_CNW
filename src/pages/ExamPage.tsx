import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Clock, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";
import React from "react";
interface Question {
  id: number;
  content: string;
  options: string[];
  correctAnswer: number;
}
interface Exam {
  id: number;
  name: string;
  topic: string;
  difficulty: string;
  difficultyColor: string;
  timeMinutes: number;
  questions: Question[];
}
const ExamPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const quizId = id === "random" ? "random" : Number(id);

  // state cho câu hỏi hiện tại
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // state cho các câu trả lời người dùng
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  // state cho thời gian còn lại
  const [timeLeft, setTimeLeft] = useState<number>(0);
  // state cho trạng thái xác nhận nộp bài
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  // dữ liệu mẫu cho bài thi
  // Dữ liệu mẫu cho bài thi
  const quizData: Exam = {
    id: 1,
    name: "Kiến thức cơ bản về mạng LAN",
    topic: "Mạng máy tính",
    difficulty: "Trung bình",
    difficultyColor: "bg-yellow-100 text-yellow-800",
    timeMinutes: 30,
    questions: [
      {
        id: 1,
        content: "Mạng LAN là viết tắt của thuật ngữ nào?",
        options: [
          "Local Area Network",
          "Large Area Network",
          "Long Access Network",
          "Limited Area Network",
        ],
        correctAnswer: 0,
      },
      {
        id: 2,
        content:
          "Thiết bị nào sau đây được sử dụng để kết nối các máy tính trong mạng LAN?",
        options: ["Modem", "Router", "Switch", "Tất cả các phương án trên"],
        correctAnswer: 2,
      },
      {
        id: 3,
        content:
          "Giao thức nào được sử dụng phổ biến nhất cho truyền thông tin trên Internet?",
        options: ["HTTP", "FTP", "TCP/IP", "SMTP"],
        correctAnswer: 2,
      },
      {
        id: 4,
        content: "Địa chỉ IP phiên bản 4 (IPv4) có độ dài bao nhiêu bit?",
        options: ["16 bit", "32 bit", "64 bit", "128 bit"],
        correctAnswer: 1,
      },
      {
        id: 5,
        content: "Mô hình OSI có bao nhiêu tầng?",
        options: ["5 tầng", "6 tầng", "7 tầng", "8 tầng"],
        correctAnswer: 2,
      },
      {
        id: 6,
        content:
          "Tầng nào trong mô hình OSI chịu trách nhiệm mã hóa và giải mã dữ liệu?",
        options: [
          "Tầng vật lý (Physical)",
          "Tầng ứng dụng (Application)",
          "Tầng trình diễn (Presentation)",
          "Tầng phiên (Session)",
        ],
        correctAnswer: 2,
      },
      {
        id: 7,
        content:
          "Giao thức nào được sử dụng để phân giải tên miền thành địa chỉ IP?",
        options: ["DHCP", "DNS", "HTTP", "FTP"],
        correctAnswer: 1,
      },
      {
        id: 8,
        content: "Subnet mask nào sau đây tương ứng với địa chỉ IP lớp C?",
        options: [
          "255.0.0.0",
          "255.255.0.0",
          "255.255.255.0",
          "255.255.255.255",
        ],
        correctAnswer: 2,
      },
      {
        id: 9,
        content: "Cổng (port) nào thường được sử dụng cho giao thức HTTP?",
        options: ["Port 21", "Port 25", "Port 80", "Port 443"],
        correctAnswer: 2,
      },
      {
        id: 10,
        content:
          "Công nghệ nào cho phép nhiều mạng LAN ảo hoạt động trên cùng một hạ tầng vật lý?",
        options: ["NAT", "VLAN", "VPN", "MPLS"],
        correctAnswer: 1,
      },
    ],
  };
  // khởi tạo mảng câu trả lời người dùng
  useEffect(() => {
    setUserAnswers(new Array(quizData.questions.length).fill(null));
    setTimeLeft(quizData.timeMinutes * 60);
  }, [quizData.questions.length, quizData.timeMinutes]);
  // đếm ngược thời gian
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);
  // xử lý chọn đáp án
  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };
  // xử lý chuyển câu hỏi
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < quizData.questions.length) {
      setCurrentQuestionIndex(index);
    }
  };
  // xử lý nộp bài
  const handleSubmitQuiz = () => {
    navigate(`/quiz/${quizId}/result`, {
      state: {
        userAnswers,
        quizData,
      },
    });
  };
  // format thời gian
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  // lấy câu hỏi hiện tại
  const currentQuestion = quizData.questions[currentQuestionIndex];
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Thông tin bài thi và thời gian */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h1 className="text-2xl font-bold mb-2">{quizData.name}</h1>
              <div className="flex flex-wrap items-center gap-4">
                <span className="text-gray-600">{quizData.topic}</span>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${quizData.difficultyColor}`}
                >
                  {quizData.difficulty}
                </span>
                <span className="text-gray-600">
                  {quizData.questions.length} câu hỏi
                </span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <Clock className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-xl font-semibold text-red-500">16:00</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Bảng số câu hỏi */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-lg font-semibold mb-4">Câu hỏi</h2>
              <div className="grid grid-cols-5 gap-2">
                {quizData.questions.map((question, index) => (
                  <button
                    key={question.id}
                    onClick={() => goToQuestion(index)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center font-medium transition-colors ${
                      currentQuestionIndex === index
                        ? "bg-blue-600 text-white"
                        : userAnswers[index] !== null
                        ? "bg-green-100 text-green-800 border border-green-300"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setShowConfirmSubmit(true)}
                className="w-full mt-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Nộp bài
              </button>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">
                    Câu {currentQuestionIndex + 1}/{quizData.questions.length}
                  </h2>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      userAnswers[currentQuestionIndex] !== null
                        ? "bg-green-100 text-green-800"
                        : " bg-gray-100 text-gray-800"
                    }`}
                  >
                    {userAnswers[currentQuestionIndex] !== null
                      ? "Đã trả lời"
                      : "Chưa trả lời"}
                  </span>
                </div>
                <p className="tg-lg">{currentQuestion.content}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPage;
