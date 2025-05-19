import api from "../utils/api";

export interface RecentScore {
  attemptId: string;
  examTitle: string;
  score: number;
  date: string;
}

export interface Overall {
  totalAttempts: number;
  totalQuestions: number;
  averageScore: number;
  totalTimeSpent: number;
  countAbove80: number;
  countBelow50: number;
  bestScore: number;
  correctAnswers: number;
  incorrectAnswers: number;
  accuracy: number;
  recentScores: RecentScore[];
  topicStats: {
    learned: number;
    total: number;
  };
}

export interface OverallResponse {
  success: boolean;
  message: string;
  data: Overall;
}

export const getOverall = async (): Promise<OverallResponse> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("type", "overall");

    const response = await api.get(
      `/learning-analytics/analytics?${queryParams.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.log("Error", error);
    return {
      success: false,
      message: "Failed to fetch learning statistics",
      data: {
        totalAttempts: 0,
        totalQuestions: 0,
        averageScore: 0,
        totalTimeSpent: 0,
        countAbove80: 0,
        countBelow50: 0,
        bestScore: 0,
        correctAnswers: 0,
        incorrectAnswers: 0,
        accuracy: 0,
        recentScores: [],
        topicStats: {
          learned: 0,
          total: 0,
        },
      },
    };
  }
};

export interface TopicAnalytics {
  topicId: string;
  name: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number | null;
  totalAttempts: number;
}

export const getTopicAnalytics = async (): Promise<{
  success: boolean;
  message: string;
  data: TopicAnalytics[];
}> => {
  try {
    const response = await api.get("/learning-analytics/analytics/?type=topic");
    return response.data;
  } catch (error) {
    console.error("Error fetching topic analytics:", error);
    throw error;
  }
};
