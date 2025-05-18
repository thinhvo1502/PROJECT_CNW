import api from "../utils/api";

// Định nghĩa kiểu dữ liệu cho đề thi
export interface Exam {
  _id: string;
  title: string;
  description?: string;
  instructions?: string;
  timeLimit: number;
  passingScore: number;
  questions: Array<{
    question: string;
    points: number;
    order: number;
    _id: string;
  }>;
  totalPoints: number;
  isPublished: boolean;
  allowReview: boolean;
  randomizeQuestions: boolean;
  attemptCount: number;
  createdBy: {
    _id: string;
    name: string;
    id: string;
  };
  tags: Array<
    | {
        _id: string;
        name: string;
      }
    | string
  >;
  topics: Array<
    | {
        _id: string;
        name: string;
      }
    | string
  >;
  accessLevel: "free" | "premium";
  createdAt: string;
  updatedAt: string;
  questionCount: number;
  id: string;
  stats: {
    totalAttempts: number;
    completionRate: number;
    averageScore: number;
    passRate: number;
  };
}

// Định nghĩa kiểu dữ liệu cho bộ lọc
export interface ExamFilters {
  page?: number;
  limit?: number;
  search?: string;
  topics?: string;
  difficulty?: "easy" | "medium" | "hard" | "mixed";
  examType?: "practice" | "midterm" | "final" | "custom";
  isPremium?: boolean;
  isPersonal?: boolean;
  status?: "draft" | "published" | "archived";
}

// Định nghĩa kiểu dữ liệu cho kết quả trả về
interface ExamResponse {
  success: boolean;
  message: string;
  data: Exam[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Hàm lấy danh sách đề thi
export const getExams = async (
  filters: ExamFilters = {}
): Promise<{
  exams: Exam[];
  pagination: { page: number; limit: number; total: number; pages: number };
}> => {
  try {
    // Tạo query string từ filters
    const queryParams = new URLSearchParams();

    if (filters.page) queryParams.append("page", filters.page.toString());
    if (filters.limit) queryParams.append("limit", filters.limit.toString());
    if (filters.search) queryParams.append("searchText", filters.search);
    if (filters.topics) queryParams.append("topic", filters.topics);
    if (filters.difficulty)
      queryParams.append("difficulty", filters.difficulty.toLocaleLowerCase());
    // if (filters.examType) queryParams.append("examType", filters.examType);
    if (filters.isPremium !== undefined)
      queryParams.append("accessLevel", "premium");
    // if (filters.isPersonal !== undefined)
    //   queryParams.append("isPersonal", filters.isPersonal.toString());
    // if (filters.status) queryParams.append("status", filters.status);
    console.log("Query params:", queryParams.toString());
    // Gọi API
    const response = await api.get<ExamResponse>(
      `/exams?${queryParams.toString()}`
    );

    // Kiểm tra response
    if (response.data && response.data.success) {
      return {
        exams: response.data.data,
        pagination: response.data.pagination,
      };
    } else {
      throw new Error(
        response.data?.message || "Không thể lấy danh sách đề thi"
      );
    }
  } catch (error: any) {
    console.error("Error fetching exams:", error);

    // Nếu có lỗi, trả về mảng rỗng và phân trang mặc định
    return {
      exams: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    };
  }
};

// Hàm lấy chi tiết đề thi
export const getExamById = async (id: string): Promise<Exam> => {
  try {
    // Thêm header để ngrok không hiển thị trang xác nhận
    const config = {
      headers: {
        "ngrok-skip-browser-warning": "true",
      },
    };

    const response = await api.get<{
      success: boolean;
      message: string;
      data: Exam;
    }>(`/exams/${id}`, config);

    if (response.data && response.data.success) {
      return response.data.data;
    } else {
      throw new Error(
        response.data?.message || "Không thể lấy thông tin đề thi"
      );
    }
  } catch (error: any) {
    console.error(`Error fetching exam ${id}:`, error);
    throw error;
  }
};

// Hàm chuyển đổi accessLevel sang isPremium
export const isPremiumExam = (exam: Exam): boolean => {
  return exam.accessLevel === "premium";
};

// Hàm chuyển đổi độ khó sang tiếng Việt
export const getDifficultyInVietnamese = (difficulty: string): string => {
  const difficultyMap: Record<string, string> = {
    easy: "Dễ",
    medium: "Trung bình",
    hard: "Khó",
    mixed: "Hỗn hợp",
  };

  return difficultyMap[difficulty] || "Không xác định";
};

// Hàm lấy màu cho độ khó
export const getDifficultyColor = (difficulty: string): string => {
  const colorMap: Record<string, string> = {
    easy: "bg-green-100 text-green-800",
    medium: "bg-yellow-100 text-yellow-800",
    hard: "bg-red-100 text-red-800",
    mixed: "bg-blue-100 text-blue-800",
  };

  return colorMap[difficulty] || "bg-gray-100 text-gray-800";
};

// Hàm chuyển đổi loại đề thi sang tiếng Việt
export const getExamTypeInVietnamese = (examType: string): string => {
  const examTypeMap: Record<string, string> = {
    practice: "Luyện tập",
    midterm: "Giữa kỳ",
    final: "Cuối kỳ",
    custom: "Tùy chỉnh",
  };

  return examTypeMap[examType] || "Không xác định";
};
