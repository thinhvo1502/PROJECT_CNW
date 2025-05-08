// Định nghĩa kiểu dữ liệu cho đề thi
export interface Quiz {
  id: number;
  name: string;
  topic: string;
  timeMinutes: number;
  questionCount: number;
  difficulty: "Dễ" | "Trung bình" | "Khó";
  difficultyColor: string;
  isPremium?: boolean; // Đánh dấu đề thi trả phí
  price?: number; // Giá tiền (VND)
  description?: string; // Mô tả chi tiết về đề thi
  benefits?: string[]; // Lợi ích khi mua đề thi này
}

// Định nghĩa kiểu dữ liệu cho câu hỏi
export interface Question {
  id: number;
  content: string;
  options: string[];
  correctAnswer: number; // 0-3 tương ứng với A-D
  explanation?: string;
  topic: string;
}

// Định nghĩa kiểu dữ liệu cho gói đăng ký
export interface Subscription {
  id: number;
  name: string;
  price: number; // Giá tiền (VND)
  duration: number; // Thời gian (tháng)
  features: string[]; // Các tính năng của gói
  isPopular?: boolean; // Đánh dấu gói phổ biến
}

// Định nghĩa kiểu dữ liệu cho giao dịch
export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: "quiz" | "subscription";
  itemId: number; // ID của đề thi hoặc gói đăng ký
  status: "pending" | "completed" | "failed";
  paymentMethod: "card" | "banking" | "wallet";
  createdAt: string;
}

// Định nghĩa kiểu dữ liệu cho đề thi đã mua
export interface PurchasedQuiz {
  id: number;
  quizId: number;
  userId: string;
  purchaseDate: string;
  expiryDate?: string; // Ngày hết hạn (nếu có)
  transactionId: string;
}

// Định nghĩa kiểu dữ liệu cho thông tin người dùng
export interface UserProfile {
  id: string;
  fullName: string;
  email: string;
  username: string;
  phone: string;
  birthDate: string;
  avatar: string;
  createdAt: string;
  lastLogin: string;
  totalQuizzes: number;
  averageScore: number;
  completedTopics: number;
  totalTopics: number;
  subscription?: {
    plan: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  };
  purchasedQuizzes?: number[]; // Danh sách ID các đề thi đã mua
}
