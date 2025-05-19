// Định nghĩa kiểu dữ liệu cho User phù hợp với database mới
export interface User {
  id: string;
  username: string;
  email: string;
  full_name: string;
  profileImage: ProfileImage | null;
  class?: string;
  preferences: UserPreferences;
  active_subscription_id?: number;
  created_at: string;
  updated_at: string;
  role: "student" | "admin";
  is_active: boolean;
}

// Định nghĩa kiểu dữ liệu cho ProfileImage
export interface ProfileImage {
  url: string;
  thumbnailUrl: string;
  fileId: string;
  uploadedAt: string;
}

// Định nghĩa kiểu dữ liệu cho UserPreferences
export interface UserPreferences {
  // Cài đặt giao diện
  theme: "light" | "dark" | "system";
  language: "vi" | "en";

  // Cài đặt thông báo
  emailNotifications: boolean;
  quizReminders: boolean;
  marketingEmails: boolean;

  // Cài đặt quyền riêng tư
  profileVisibility: "public" | "friends" | "private";
  showOnlineStatus: boolean;
  showQuizHistory: boolean;

  // Cài đặt bài kiểm tra
  defaultQuizTimer: number; // Thời gian mặc định cho mỗi câu hỏi (giây)
  autoSubmit: boolean; // Tự động nộp bài khi hết thời gian
  showAnswersAfterQuiz: boolean; // Hiển thị đáp án sau khi làm bài

  // Cài đặt âm thanh
  soundEffects: boolean;
  soundVolume: number; // 0-100
}

// Định nghĩa kiểu dữ liệu cho cập nhật User
export interface UpdateUserData {
  full_name?: string;
  email?: string;
  class?: string;
  preferences?: Partial<UserPreferences>;
}

// Định nghĩa kiểu dữ liệu cho Subscription
export interface Subscription {
  id: number;
  plan_id: number;
  status: "active" | "cancelled" | "expired";
  start_date: string;
  end_date: string;
  auto_renew: boolean;
  billing_cycle: "monthly" | "yearly";
}

// Định nghĩa kiểu dữ liệu cho SubscriptionPlan
export interface SubscriptionPlan {
  id: number;
  name: string;
  description: string;
  price_monthly: number;
  price_yearly: number;
  features: string[];
  is_popular: boolean;
}
