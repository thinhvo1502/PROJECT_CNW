"use client";

import React from "react";
import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import quizAttemptService, {
  type QuizAttemptDetail,
} from "../services/quizAttemptService";
import { Clock, AlertCircle } from "lucide-react";

const QuizTaking: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttemptDetail | null>(
    null
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<string>("");
  const [isTimeWarning, setIsTimeWarning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState<boolean>(false);

  // Lấy thông tin phiên làm bài
  const fetchQuizAttempt = useCallback(async () => {
    if (!attemptId) return;

    try {
      setLoading(true);
      const data = await quizAttemptService.getQuizAttempt(attemptId);
      setQuizAttempt(data);

      // Nếu bài thi đã hoàn thành, chuyển đến trang kết quả
      if (data.status === "completed") {
        navigate(`/quiz-result/${attemptId}`);
        return;
      }

      // Tìm câu hỏi đầu tiên chưa trả lời hoặc sử dụng câu hỏi đầu tiên
      const unansweredIndex = data.questionsWithDetail.findIndex(
        (q) => !q.answered
      );
      const newIndex = unansweredIndex !== -1 ? unansweredIndex : 0;
      setCurrentQuestionIndex(newIndex);

      // Lấy câu trả lời đã chọn (nếu có)
      if (data.questionsWithDetail[newIndex]) {
        setSelectedAnswer(
          data.questionsWithDetail[newIndex].answered
            ? data.questionsWithDetail[newIndex].userAnswer
            : null
        );
      }

      setLoading(false);
    } catch (err: any) {
      console.error("Error fetching quiz attempt:", err);
      setError(err.message || "Có lỗi xảy ra khi tải thông tin bài thi");
      setLoading(false);
    }
  }, [attemptId, navigate]);

  // Cập nhật thời gian còn lại
  useEffect(() => {
    if (!quizAttempt) return;

    const updateRemainingTime = () => {
      const remainingMinutes = quizAttemptService.calculateRemainingTime(
        quizAttempt.startTime,
        quizAttempt.exam.timeLimit
      );

      const formattedTime =
        quizAttemptService.formatRemainingTime(remainingMinutes);
      setRemainingTime(formattedTime);

      // Hiển thị cảnh báo khi còn ít hơn 5 phút
      setIsTimeWarning(remainingMinutes < 5);

      // Tự động nộp bài khi hết thời gian
      if (remainingMinutes <= 0) {
        handleAutoSubmit();
      }
    };

    updateRemainingTime();
    const timer = setInterval(updateRemainingTime, 1000);

    return () => clearInterval(timer);
  }, [quizAttempt]);

  // Lấy thông tin ban đầu
  useEffect(() => {
    fetchQuizAttempt();
  }, [fetchQuizAttempt]);

  // Xử lý khi chọn câu trả lời
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };

  // Xử lý khi gửi câu trả lời
  const handleSubmitAnswer = async () => {
    if (!quizAttempt || !selectedAnswer || submitting) return;

    const currentQuestion =
      quizAttempt.questionsWithDetail[currentQuestionIndex];
    console.log("selectedAnswer", selectedAnswer);
    try {
      setSubmitting(true);
      const response = await quizAttemptService.submitAnswer(
        attemptId!,
        currentQuestion.questionId,
        selectedAnswer
      );

      // Cập nhật trạng thái câu hỏi hiện tại
      const updatedQuestions = [...quizAttempt.questionsWithDetail];
      updatedQuestions[currentQuestionIndex] = {
        ...currentQuestion,
        answered: true,
        userAnswer: selectedAnswer,
      };

      setQuizAttempt({
        ...quizAttempt,
        questionsWithDetail: updatedQuestions,
        answeredCount:
          quizAttempt.answeredCount + (currentQuestion.answered ? 0 : 1),
        questionStatus: quizAttempt.questionStatus.map((q, idx) =>
          idx === currentQuestionIndex
            ? { ...q, answered: true, userAnswer: selectedAnswer }
            : q
        ),
      });

      setSubmitting(false);

      // Tự động chuyển đến câu hỏi tiếp theo nếu có
      if (
        response.nextQuestionId &&
        currentQuestionIndex < quizAttempt.totalQuestions - 1
      ) {
        handleNavigateQuestion(currentQuestionIndex + 1);
      }
    } catch (err: any) {
      console.error("Error submitting answer:", err);
      setError(err.message || "Có lỗi xảy ra khi gửi câu trả lời");
      setSubmitting(false);
    }
  };

  // Xử lý khi chuyển câu hỏi
  const handleNavigateQuestion = (index: number) => {
    if (
      !quizAttempt ||
      index < 0 ||
      index >= quizAttempt.questionsWithDetail.length
    )
      return;

    setCurrentQuestionIndex(index);

    // Lấy câu trả lời đã chọn (nếu có)
    const question = quizAttempt.questionsWithDetail[index];
    setSelectedAnswer(question.answered ? question.userAnswer : null);
  };

  // Xử lý khi tự động nộp bài do hết thời gian
  const handleAutoSubmit = async () => {
    if (!quizAttempt || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await quizAttemptService.completeQuiz(attemptId!);
      navigate(`/quiz-result/${attemptId}`);
    } catch (err: any) {
      console.error("Error auto-completing quiz:", err);
      setError(err.message || "Có lỗi xảy ra khi nộp bài");
      setIsSubmitting(false);
    }
  };

  // Xử lý khi hoàn thành bài thi
  const handleCompleteQuiz = async () => {
    if (!quizAttempt || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await quizAttemptService.completeQuiz(attemptId!);
      navigate(`/quiz-result/${attemptId}`);
    } catch (err: any) {
      console.error("Error completing quiz:", err);
      setError(err.message || "Có lỗi xảy ra khi nộp bài");
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{error}</span>
        </div>
        <button
          onClick={() => navigate("/quiz-selection")}
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Quay lại trang chọn bài thi
        </button>
      </div>
    );
  }

  if (!quizAttempt) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-600">
          Không tìm thấy thông tin bài thi
        </p>
      </div>
    );
  }

  const currentQuestion = quizAttempt.questionsWithDetail[currentQuestionIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <div>
          <h1 className="text-2xl font-bold">{quizAttempt.exam.title}</h1>
          <p className="text-gray-600">Đang làm bài thi</p>
        </div>

        {/* Thời gian còn lại */}
        <div
          className={`mt-4 md:mt-0 text-center ${
            isTimeWarning ? "text-red-600 animate-pulse" : "text-blue-600"
          }`}
        >
          <div className="flex items-center">
            <Clock className="mr-2" />
            <p className="text-2xl font-bold">{remainingTime}</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Câu hỏi */}
        <div className="w-full md:w-3/4 bg-white p-6 rounded-lg shadow">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">
                Câu hỏi {currentQuestionIndex + 1}/{quizAttempt.totalQuestions}
              </h2>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                {currentQuestion.points} điểm
              </span>
            </div>

            <div className="mb-6">
              <p className="text-lg">{currentQuestion.content}</p>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => handleAnswerSelect(option._id)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedAnswer === option._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-300"
                  }`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-6 h-6 flex items-center justify-center rounded-full mr-3 ${
                        selectedAnswer === option._id
                          ? "bg-blue-500 text-white"
                          : "border border-gray-400"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => handleNavigateQuestion(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded ${
                currentQuestionIndex === 0
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Câu trước
            </button>

            <button
              onClick={handleSubmitAnswer}
              disabled={
                !selectedAnswer || submitting || currentQuestion.answered
              }
              className={`px-6 py-2 rounded font-medium ${
                !selectedAnswer || submitting || currentQuestion.answered
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              {submitting
                ? "Đang lưu..."
                : currentQuestion.answered
                ? "Đã trả lời"
                : "Lưu câu trả lời"}
            </button>

            <button
              onClick={() => handleNavigateQuestion(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === quizAttempt.totalQuestions - 1}
              className={`px-4 py-2 rounded ${
                currentQuestionIndex === quizAttempt.totalQuestions - 1
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300"
              }`}
            >
              Câu tiếp
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/4">
          {/* Question navigation */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Danh sách câu hỏi</h3>
            <div className="grid grid-cols-5 gap-2">
              {quizAttempt.questionStatus.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleNavigateQuestion(index)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    index === currentQuestionIndex
                      ? "bg-blue-500 text-white"
                      : question.answered
                      ? "bg-green-100 text-green-800 border border-green-500"
                      : "bg-gray-100 text-gray-800 border border-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-sm">
              <div className="flex items-center">
                <div className="w-4 h-4 bg-green-100 border border-green-500 rounded-full mr-1"></div>
                <span>Đã trả lời</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded-full mr-1"></div>
                <span>Chưa trả lời</span>
              </div>
            </div>
          </div>

          {/* Quiz progress */}
          <div className="bg-white p-4 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-2">Tiến độ làm bài</h3>
            <div className="mb-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{
                    width: `${
                      (quizAttempt.answeredCount / quizAttempt.totalQuestions) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Đã trả lời: {quizAttempt.answeredCount}/
              {quizAttempt.totalQuestions} câu
            </p>
          </div>

          {/* Submit button */}
          <button
            onClick={() => setShowConfirmSubmit(true)}
            disabled={isSubmitting}
            className={`w-full py-3 rounded-lg font-medium text-white ${
              isSubmitting
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {isSubmitting ? "Đang nộp bài..." : "Nộp bài"}
          </button>
        </div>
      </div>

      {/* Modal xác nhận nộp bài */}
      {showConfirmSubmit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex items-center text-amber-500 mb-4">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-semibold">Xác nhận nộp bài</h3>
            </div>

            <p className="mb-2">Bạn có chắc chắn muốn nộp bài?</p>

            <div className="text-sm text-gray-600 mb-6">
              <p>
                - Số câu đã trả lời: {quizAttempt.answeredCount}/
                {quizAttempt.totalQuestions}
              </p>
              <p>
                - Số câu chưa trả lời:{" "}
                {quizAttempt.totalQuestions - quizAttempt.answeredCount}/
                {quizAttempt.totalQuestions}
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmSubmit(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Hủy
              </button>
              <button
                onClick={handleCompleteQuiz}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizTaking;
