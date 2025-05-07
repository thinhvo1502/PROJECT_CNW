import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Logout from "../pages/Logout";
import HomePage from "../pages/HomePage";
import ExamListPage from "../pages/ExamListPage";
import ExamPage from "../pages/ExamPage";
import ResultPage from "../pages/ResultPage";
import ResultDetailPage from "../pages/ResultDetailPage";
import HistoryPage from "../pages/HistoryPage";
import StatisticsPage from "../pages/StatisticsPage";
import SmartSuggestionsPage from "../pages/SmartSuggestionsPage";
import ProfilePage from "../pages/ProfilePage";
import ManageExams from "../admin/ManageExams";
import ManageQuestions from "../admin/ManageQuestions";
import ManageUsers from "../admin/ManageUsers";
import RevenueStatistics from "../admin/RevenueStatistics";
import ExamAttemptsStatistics from "../admin/ExamAttemptsStatistics";
import AdminHome from "../admin/AdminHome";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/exam" element={<ExamListPage />} />
      <Route path="/exam/:id" element={<ExamPage />} />
      <Route path="/result/:id" element={<ResultPage />} />
      <Route path="/result-detail/:id" element={<ResultDetailPage />} />
      <Route path="/history" element={<HistoryPage />}></Route>
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/suggestions" element={<SmartSuggestionsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/admin/manage-exams" element={<ManageExams />} />
      <Route path="/admin/manage-questions" element={<ManageQuestions />} />
      <Route path="/admin/manage-users" element={<ManageUsers />} />
      <Route path="/admin/revenue-statistics" element={<RevenueStatistics />} />
      <Route
        path="/admin/exam-attempts-statistics"
        element={<ExamAttemptsStatistics />}
      />
      <Route path="/admin/home" element={<AdminHome />} />
      {/* Nếu URL không hợp lệ, chuyển về /login */}
      {/* <Route path="*" element={<Navigate to="/login" />} /> */}
    </Routes>
  );
}
