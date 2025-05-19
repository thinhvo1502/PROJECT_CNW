import api from "../utils/api";

export interface OptionDetail {
  label: string;
  text: string;
  _id: string;
}

// Định nghĩa các interface
export interface QuestionWithDetail {
  questionId: string;
  order: number;
  points: number;
  content: string;
  options: OptionDetail[];
  difficulty: string;
  answered: boolean;
  userAnswer: string | null;
  correctAnswer?: string;
  explanation?: string;
  isCorrect?: boolean;
  hasPrev?: boolean;
  hasNext?: boolean;
  prevOrder?: number | null;
  nextOrder?: number | null;
  topic?: string;
  question?: {
    content: string;
    options: string[];
    correctAnswer: number | string;
    explanation?: string;
    topic?: string;
  };
}

export interface QuestionStatus {
  order: number;
  questionId: string;
  answered: boolean;
  userAnswer: string | null;
}

export interface TopicResult {
  id: number | string;
  name: string;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
}

export interface QuizAttemptDetail {
  _id: string;
  user: string;
  exam: {
    _id: string;
    title: string;
    description: string;
    timeLimit: number;
    questions: any[];
  };
  score: number;
  startTime: string;
  endTime: string;
  timeSpent: number;
  status: "in_progress" | "completed" | "abandoned";
  answers: any[];
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  completed: boolean;
  questionsWithDetail: QuestionWithDetail[];
  questionStatus: QuestionStatus[];
  totalQuestions: number;
  answeredCount: number;
}

export interface QuizResult {
  _id: string;
  user: string;
  exam?: {
    _id: string;
    title: string;
    description: string;
    timeLimit: number;
    questions: any[];
    totalPoints: number;
    passingScore: number;
  };
  score: number;
  startTime: string;
  endTime: string;
  timeSpent: number;
  status: string;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  completed: boolean;
  questionsWithAnswers?: QuestionWithDetail[];
  isDetailedResultsHidden?: boolean;
  feedback?: {
    rating: number;
    comment: string;
  };
  topicResults?: TopicResult[];
}

export interface SubmitAnswerResponse {
  success: boolean;
  questionId: string;
  answered: boolean;
  nextQuestionId?: string;
  nextQuestionOrder?: number;
}

export interface CompleteQuizResponse {
  score: number;
  totalPoints: number;
  earnedPoints: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  timeSpent: number;
  passed: boolean;
  autoCompleted: boolean;
  isDetailedResultsHidden?: boolean;
}

const quizAttemptService = {
  // Bắt đầu làm bài thi
  async startQuiz(examId: string): Promise<QuizAttemptDetail> {
    try {
      const response = await api.post("/quiz-attempts/start", { examId });
      return response.data.data;
    } catch (error) {
      console.error("Error starting quiz:", error);
      throw error;
    }
  },

  // Lấy thông tin phiên làm bài
  async getQuizAttempt(attemptId: string): Promise<QuizAttemptDetail> {
    try {
      const response = await api.get(`/quiz-attempts/${attemptId}`);
      return response.data.data;
    } catch (error) {
      console.error("Error getting quiz attempt:", error);
      throw error;
    }
  },

  // Gửi câu trả lời
  async submitAnswer(
    attemptId: string,
    questionId: string,
    answer: string
  ): Promise<SubmitAnswerResponse> {
    try {
      const response = await api.post(`/quiz-attempts/${attemptId}/answer`, {
        questionId,
        answer,
      });
      console.log("nộp nè", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error submitting answer:", error);
      throw error;
    }
  },

  // Kết thúc làm bài
  async completeQuiz(attemptId: string): Promise<CompleteQuizResponse> {
    try {
      const response = await api.post(`/quiz-attempts/${attemptId}/complete`);
      console.log("Complete quiz response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error completing quiz:", error);
      throw error;
    }
  },

  // Lấy kết quả chi tiết
  async getQuizResult(attemptId: string): Promise<QuizResult> {
    try {
      console.log("yaa", attemptId);
      const response = await api.get(`/quiz-attempts/${attemptId}/summary`);
      console.log("yaa", response.data.data);
      return response.data.data;
    } catch (error) {
      console.error("Error getting quiz result:", error);
      throw error;
    }
  },

  // Lấy danh sách các lần làm bài
  async getUserQuizAttempts(params = {}): Promise<any> {
    try {
      const response = await api.get("/quiz-attempts", { params });
      return response.data;
    } catch (error) {
      console.error("Error getting user quiz attempts:", error);
      throw error;
    }
  },

  // Thêm đánh giá
  async addFeedback(attemptId: string, feedback: any): Promise<any> {
    try {
      const response = await api.post(
        `/quiz-attempts/${attemptId}/feedback`,
        feedback
      );
      return response.data.data;
    } catch (error) {
      console.error("Error adding feedback:", error);
      throw error;
    }
  },

  // Tính thời gian còn lại (phút)
  calculateRemainingTime(startTime: string, timeLimit: number): number {
    const start = new Date(startTime).getTime();
    const now = new Date().getTime();
    const elapsedMinutes = (now - start) / (1000 * 60);
    return Math.max(0, timeLimit - elapsedMinutes);
  },

  // Format thời gian còn lại thành MM:SS
  formatRemainingTime(minutes: number): string {
    const mins = Math.floor(minutes);
    const secs = Math.floor((minutes - mins) * 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  },
};

export default quizAttemptService;
