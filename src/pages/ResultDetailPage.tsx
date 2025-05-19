"use client";

import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowLeft,
  BookOpen,
  Clock,
  RefreshCw,
} from "lucide-react";

// Thêm đoạn mã này vào phần đầu file để import PremiumBadge
import PremiumBadge from "../components/PremiumBadge";
import React from "react";
import api from "../utils/api";

interface Option {
  label: string;
  text: string;
  _id: string;
}

interface Question {
  questionId: string;
  order: number;
  points: number;
  content: string;
  options: Option[];
  difficulty: string | null;
  userAnswer: string | null;
  correctAnswer: string | null;
  correctAnswerText: string | null;
  explanation: string | null;
  isCorrect: boolean;
  answered: boolean;
  status: "correct" | "incorrect" | "not_answered" | "not_found";
  hasPrev: boolean;
  hasNext: boolean;
  prevOrder: number | null;
  nextOrder: number | null;
}

interface QuizDetailResult {
  _id: string;
  user: string;
  exam: {
    _id: string;
    title: string;
    description: string;
    timeLimit: number;
    totalPoints: number;
  };
  score: number;
  startTime: string;
  endTime: string;
  timeSpent: number;
  correctAnswers: number;
  wrongAnswers: number;
  skippedQuestions: number;
  status: string;
  autoCompleted: boolean;
  completed: boolean;
  reviewed: boolean;
  resultSummary: {
    totalPoints: number;
    earnedPoints: number;
    correctCount: number;
    incorrectCount: number;
    skippedCount: number;
  };
  questionsWithAnswers: Question[];
  questionStatus: Array<{
    order: number;
    questionId: string;
    answered: boolean;
    userAnswer: string | null;
  }>;
  totalQuestions: number;
  answeredCount: number;
}

const QuizResultDetail = () => {
  const { attemptId } = useParams();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showExplanations, setShowExplanations] = useState<boolean[]>([]);
  const [isPremiumUser] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [resultData, setResultData] = useState<QuizDetailResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/quiz-attempts/${attemptId}/result`);
        const data = response.data;
        if (data.success) {
          setResultData(data.data);
          setShowExplanations(
            new Array(data.data.questionsWithAnswers.length).fill(false)
          );
        } else {
          setError(data.message || "Failed to fetch result");
        }
      } catch (err) {
        setError("Error fetching result");
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [attemptId]);

  const goToQuestion = (index: number) => {
    if (
      resultData &&
      index >= 0 &&
      index < resultData.questionsWithAnswers.length
    ) {
      setCurrentQuestionIndex(index);
      window.scrollTo(0, 0);
    }
  };

  const toggleExplanation = (index: number) => {
    if (!isPremiumUser) {
      setShowPremiumModal(true);
      return;
    }
    const newShowExplanations = [...showExplanations];
    newShowExplanations[index] = !newShowExplanations[index];
    setShowExplanations(newShowExplanations);
  };

  const handleRetakeQuiz = async () => {
    try {
      const response = await api.post(
        `/quiz-attempts/retake/${resultData?.exam._id}`
      );
      if (response.data.success) {
        // Navigate to the new quiz attempt
        navigate(`/quiz/${response.data.data._id}`);
      }
    } catch (error) {
      console.error("Error retaking quiz:", error);
      // You might want to show an error message to the user here
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !resultData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">
            {error || "Failed to load result"}
          </span>
        </div>
        <Link
          to="/quiz-history"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to Quiz History
        </Link>
      </div>
    );
  }

  const currentQuestion = resultData.questionsWithAnswers[currentQuestionIndex];
  const userAnswer = currentQuestion.userAnswer;
  const isCorrect = currentQuestion.isCorrect;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <Link
              to={`/quiz-result/${attemptId}`}
              className="flex items-center text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Overview
            </Link>
            <button
              onClick={handleRetakeQuiz}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Retake Quiz
            </button>
          </div>
          <h1 className="text-2xl font-bold mb-2">{resultData.exam.title}</h1>
          <div className="flex items-center text-gray-600 space-x-4">
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 mr-1" />
              <span>
                Question {currentQuestionIndex + 1} /{" "}
                {resultData.totalQuestions}
              </span>
            </div>
            <div className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              <span>Time spent: {resultData.timeSpent} seconds</span>
            </div>
          </div>
        </div>

        {/* Question Navigation */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            {resultData.questionsWithAnswers.map((question, index) => (
              <button
                key={question.questionId}
                onClick={() => goToQuestion(index)}
                className={`w-10 h-10 rounded-md flex items-center justify-center font-medium transition-colors
                  ${
                    currentQuestionIndex === index
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : ""
                  }
                  ${
                    question.status === "correct"
                      ? "bg-green-100 text-green-800 border border-green-300"
                      : question.status === "incorrect"
                      ? "bg-red-100 text-red-800 border border-red-300"
                      : question.status === "not_answered"
                      ? "bg-yellow-100 text-yellow-800 border border-yellow-300"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <div className="flex items-center text-sm text-gray-600 mb-2">
            <div className="flex items-center mr-4">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded-sm mr-1"></div>
              <span>Correct</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-4 h-4 bg-red-100 border border-red-300 rounded-sm mr-1"></div>
              <span>Incorrect</span>
            </div>
            <div className="flex items-center mr-4">
              <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded-sm mr-1"></div>
              <span>Not Answered</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded-sm mr-1"></div>
              <span>Not Found</span>
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2">
                  {currentQuestion.difficulty || "Unknown"}
                </span>
                <h2 className="text-xl font-semibold">
                  Question {currentQuestionIndex + 1}
                </h2>
              </div>
              {currentQuestion.answered && (
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
                  <span>{isCorrect ? "Correct" : "Incorrect"}</span>
                </div>
              )}
            </div>
            <p className="text-lg">{currentQuestion.content}</p>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            {currentQuestion.options.map((option) => {
              const isUserAnswer = userAnswer === option._id;
              const isCorrectAnswer =
                currentQuestion.correctAnswer === option.label;
              let optionClass = "border-gray-200";

              if (isUserAnswer && isCorrectAnswer) {
                optionClass = "border-green-500 bg-green-50";
              } else if (isUserAnswer && !isCorrectAnswer) {
                optionClass = "border-red-500 bg-red-50";
              } else if (isCorrectAnswer) {
                optionClass = "border-green-500 bg-green-50";
              }

              return (
                <div
                  key={option._id}
                  className={`p-4 border rounded-lg ${optionClass}`}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-medium
                      ${
                        isUserAnswer && isCorrectAnswer
                          ? "bg-green-600 text-white"
                          : isUserAnswer && !isCorrectAnswer
                          ? "bg-red-600 text-white"
                          : isCorrectAnswer
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {option.label}
                    </div>
                    <span>{option.text}</span>
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

          {/* Explanation */}
          {currentQuestion.explanation && (
            <div className="mt-6">
              <button
                onClick={() => toggleExplanation(currentQuestionIndex)}
                className="flex items-center text-blue-600 hover:text-blue-800"
              >
                <AlertCircle className="h-5 w-5 mr-2" />
                {showExplanations[currentQuestionIndex]
                  ? "Hide Explanation"
                  : "Show Explanation"}
              </button>
              {showExplanations[currentQuestionIndex] && (
                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h3 className="font-semibold mb-2">Explanation:</h3>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={() => goToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className={`flex items-center px-4 py-2 rounded-md
              ${
                currentQuestionIndex === 0
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous Question
          </button>

          <button
            onClick={() => goToQuestion(currentQuestionIndex + 1)}
            disabled={
              currentQuestionIndex ===
              resultData.questionsWithAnswers.length - 1
            }
            className={`flex items-center px-4 py-2 rounded-md
              ${
                currentQuestionIndex ===
                resultData.questionsWithAnswers.length - 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-gray-100 text-gray-800 hover:bg-gray-200"
              }`}
          >
            Next Question
            <ChevronRight className="h-5 w-5 ml-1" />
          </button>
        </div>
      </div>

      {/* Premium Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center p-2 bg-yellow-100 rounded-full mb-4">
                <PremiumBadge size="lg" />
              </div>
              <h3 className="text-xl font-bold mb-2">Detailed Explanation</h3>
              <p className="text-gray-600">
                Viewing detailed explanations is a premium feature.
              </p>
            </div>

            <div className="bg-blue-50 rounded-md p-4 mb-6">
              <h4 className="font-medium mb-2">
                Benefits of detailed explanations:
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  <span>
                    Better understanding of correct and incorrect answers
                  </span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  <span>Improve your knowledge faster</span>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5 mr-2">
                    <span className="text-blue-600 text-xs">✓</span>
                  </div>
                  <span>Access expert knowledge</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to="/pricing"
                className="flex-1 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-center"
              >
                Upgrade to Premium
              </Link>
              <button
                onClick={() => setShowPremiumModal(false)}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                No, thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizResultDetail;
