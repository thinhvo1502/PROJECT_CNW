import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  BookOpen,
} from "lucide-react";
import React from "react";
interface Question {
  id: number;
  content: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  topic: string;
}
interface QuizDetailResult {
  quizId: string | number;
  quizName: string;
  userAnswers: (number | null)[];
  questions: Question[];
}
const ResultDetailPage = () => {
  const { id } = useParams();
  const quizId = id || "unknown";
  // state cho câu hỏi hiện tại
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // state cho hiển thị/ ẩn giải thích
  const [showExplanations, setShowExplanations] = useState<boolean[]>([]);
  const [resultData, setResultData] = useState<QuizDetailResult>({
    quizId,
    quizName: "Kiến thức cơ bản về mạng LAN",
    userAnswers: [0, 2, 2, 1, 2, 1, 0, 2, 3, 0],
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
        explanation:
          "LAN là viết tắt của Local Area Network (Mạng cục bộ). Đây là một mạng máy tính được giới hạn trong một khu vực nhỏ như văn phòng, trường học hoặc nhà ở.",
        topic: "Mạng LAN",
      },
      {
        id: 2,
        content:
          "Thiết bị nào sau đây được sử dụng để kết nối các máy tính trong mạng LAN?",
        options: ["Modem", "Router", "Switch", "Tất cả các phương án trên"],
        correctAnswer: 2,
        explanation:
          "Switch là thiết bị chính được sử dụng để kết nối các máy tính trong mạng LAN. Switch hoạt động ở tầng Data Link (tầng 2) trong mô hình OSI và chuyển tiếp dữ liệu dựa trên địa chỉ MAC.",
        topic: "Mạng LAN",
      },
      {
        id: 3,
        content:
          "Giao thức nào được sử dụng phổ biến nhất cho truyền thông tin trên Internet?",
        options: ["HTTP", "FTP", "TCP/IP", "SMTP"],
        correctAnswer: 2,
        explanation:
          "TCP/IP (Transmission Control Protocol/Internet Protocol) là bộ giao thức cơ bản được sử dụng cho truyền thông trên Internet. Nó cung cấp khả năng kết nối end-to-end và xác định cách dữ liệu được định dạng, địa chỉ hóa, truyền tải, định tuyến và nhận tại điểm đến.",
        topic: "Giao thức mạng",
      },
      {
        id: 4,
        content: "Địa chỉ IP phiên bản 4 (IPv4) có độ dài bao nhiêu bit?",
        options: ["16 bit", "32 bit", "64 bit", "128 bit"],
        correctAnswer: 1,
        explanation:
          "Địa chỉ IPv4 có độ dài 32 bit, thường được biểu diễn dưới dạng bốn số thập phân từ 0 đến 255, phân tách bởi dấu chấm (ví dụ: 192.168.1.1).",
        topic: "Địa chỉ IP",
      },
      {
        id: 5,
        content: "Mô hình OSI có bao nhiêu tầng?",
        options: ["5 tầng", "6 tầng", "7 tầng", "8 tầng"],
        correctAnswer: 2,
        explanation:
          "Mô hình OSI (Open Systems Interconnection) có 7 tầng: Physical, Data Link, Network, Transport, Session, Presentation và Application.",
        topic: "Mô hình OSI",
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
        explanation:
          "Tầng trình diễn (Presentation) trong mô hình OSI chịu trách nhiệm mã hóa và giải mã dữ liệu, cũng như chuyển đổi dữ liệu giữa các định dạng khác nhau để đảm bảo các hệ thống khác nhau có thể hiểu được dữ liệu.",
        topic: "Mô hình OSI",
      },
      {
        id: 7,
        content:
          "Giao thức nào được sử dụng để phân giải tên miền thành địa chỉ IP?",
        options: ["DHCP", "DNS", "HTTP", "FTP"],
        correctAnswer: 1,
        explanation:
          "DNS (Domain Name System) là giao thức được sử dụng để phân giải tên miền (ví dụ: www.example.com) thành địa chỉ IP tương ứng để máy tính có thể kết nối đến server đúng.",
        topic: "Giao thức mạng",
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
        explanation:
          "Subnet mask 255.255.255.0 tương ứng với địa chỉ IP lớp C. Địa chỉ IP lớp C có 24 bit đầu dành cho phần network và 8 bit cuối dành cho phần host.",
        topic: "Địa chỉ IP",
      },
      {
        id: 9,
        content: "Cổng (port) nào thường được sử dụng cho giao thức HTTP?",
        options: ["Port 21", "Port 25", "Port 80", "Port 443"],
        correctAnswer: 2,
        explanation:
          "Port 80 là cổng mặc định được sử dụng cho giao thức HTTP (Hypertext Transfer Protocol). Port 443 được sử dụng cho HTTPS, Port 21 cho FTP và Port 25 cho SMTP.",
        topic: "Giao thức mạng",
      },
      {
        id: 10,
        content:
          "Công nghệ nào cho phép nhiều mạng LAN ảo hoạt động trên cùng một hạ tầng vật lý?",
        options: ["NAT", "VLAN", "VPN", "MPLS"],
        correctAnswer: 1,
        explanation:
          "VLAN (Virtual Local Area Network) là công nghệ cho phép tạo nhiều mạng LAN ảo trên cùng một hạ tầng vật lý. VLAN giúp phân đoạn mạng một cách logic, cải thiện hiệu suất và bảo mật.",
        topic: "Mạng LAN",
      },
    ],
  });
  // khởi tạo trạng thái hiển thị giải thích
  useEffect(() => {
    setShowExplanations(new Array(resultData.questions.length).fill(false));
  }, [resultData.questions.length]);
  // xử lý chuyển câu hỏi
  const goToQuestion = (index: number) => {
    if (index >= 0 && index < resultData.questions.length) {
      setCurrentQuestionIndex(index);
      window.scrollTo(0, 0); // Cuộn lên đầu trang khi chuyển câu hỏi
    }
  };
  const toggleExplanation = (index: number) => {
    const newShowExplanations = [...showExplanations];
    newShowExplanations[index] = !newShowExplanations[index];
    setShowExplanations(newShowExplanations);
  };
  const currentQuestion = resultData.questions[currentQuestionIndex];
  const userAnswer = resultData.userAnswers[currentQuestionIndex];
  const isCorrect = userAnswer === currentQuestion.correctAnswer;
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            to="#"
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Quay lại kết quả tổng quan
          </Link>
          <h1 className="text-2xl font-bold mb-2">
            Chi tiết bài làm: {resultData.quizName}
          </h1>
          <div className="flex items-center text-gray=600">
            <BookOpen className="h-4 w-4 mr-1" />
            <span>
              Câu hỏi {currentQuestionIndex + 1} / {resultData.questions.length}
            </span>
          </div>
        </div>
        {/* Điều hướng câu hỏi */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {resultData.questions.map((question, index) => {
              const answer = resultData.userAnswers[index];
              const correct = answer === question.correctAnswer;
              return (
                <button
                  key={question.id}
                  onClick={() => goToQuestion(index)}
                  className={`w-10 h-10 rounded-md flex items-center justify-center font-medium transition-colors ${
                    currentQuestionIndex === index
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : ""
                  } ${
                    correct
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : answer != null
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <div className="flex items-center mr-4">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded-sm mr-1"></div>
              <span>Đúng</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded-sm mr-1"></div>
              <span>Sai</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded-sm mr-1"></div>
              <span>Chưa trả lời</span>
            </div>
          </div>
        </div>
        {/* nội dung câu hỏi */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  {currentQuestion.topic}
                </span>
                <h2 className="text-xl font-semibold">
                  Câu {currentQuestionIndex + 1}
                </h2>
              </div>
              {userAnswer != null && (
                <div
                  className={`flex items-center ${
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle className="h-5 w-5 mr-1" />
                  ) : (
                    <XCircle className="h-5 w-5 mr-1" />
                  )}
                  <span>{isCorrect ? "Đúng" : "Sai"}</span>
                </div>
              )}
            </div>
            <p className="text-lg">{currentQuestion.content}</p>
          </div>
          {/* Các đáp án */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option, index) => {
              const isUserAnswer = userAnswer === index;
              const isCorrectAnswer = currentQuestion.correctAnswer === index;
              let optionClass = "border-gray-200";
              if (isUserAnswer) {
                optionClass = isCorrectAnswer
                  ? "border-green-500"
                  : "border-red-500";
              } else if (isUserAnswer && !isCorrectAnswer) {
                optionClass = "border-red-500 bg-red-50";
              } else if (isCorrectAnswer) {
                optionClass = "border-green-500 bg-green-50";
              }
              return (
                <div
                  key={index}
                  className={`p-4 border rounded-lg ${optionClass}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-medium ${
                        isUserAnswer && isCorrectAnswer
                          ? "bg-green-600 text-white"
                          : isUserAnswer && !isCorrectAnswer
                          ? "bg-red-600 text-white"
                          : isCorrectAnswer
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                    {isUserAnswer && isCorrectAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                    )}
                    {isUserAnswer && !isCorrectAnswer && (
                      <XCircle className="h-5 w-5 text-red-600 ml-auto" />
                    )}
                    {!isUserAnswer && isCorrectAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Giải thích */}
          {currentQuestion.explanation && (
            <div className="mt-6">
              <button
                onClick={() => toggleExplanation(currentQuestionIndex)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                {showExplanations[currentQuestionIndex]
                  ? "Ẩn giải thích"
                  : "Xem giải thích"}
              </button>
              {showExplanations[currentQuestionIndex] && (
                <div className="mt-3 p-4 bg-blue-50 border-blue-200 rounded-lg">
                  <h3 className="font-semibold mb-2">Giải thích:</h3>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>
        {/* Điều hướng câu hỏi */}
        <div className="flex justify-between">
          <button
            onClick={() => goToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center px-4 py-2 rounded-md ${
              currentQuestionIndex === 0
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Câu trước
          </button>
          <button
            onClick={() => goToQuestion(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === resultData.questions.length - 1}
            className={`flex items-center px-4 py-2 rounded-md ${
              currentQuestionIndex === resultData.questions.length - 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"
            }`}
          >
            Câu tiếp theo
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};
export default ResultDetailPage;
