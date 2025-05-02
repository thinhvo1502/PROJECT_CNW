import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import HomePage from "../pages/HomePage";
import ExamListPage from "../pages/ExamListPage";
import ExamPage from "../pages/ExamPage";
import ResultPage from "../pages/ResultPage";
import ResultDetailPage from "../pages/ResultDetailPage";
import HistoryPage from "../pages/HistoryPage";
import StatisticsPage from "../pages/StatisticsPage";
import SmartSuggestionsPage from "../pages/SmartSuggestionsPage";
import ProfilePage from "../pages/ProfilePage";
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/exam-list" element={<ExamListPage />} />
      <Route path="/exam/:id" element={<ExamPage />} />
      <Route path="/result/:id" element={<ResultPage />} />
      <Route path="/result-detail/:id" element={<ResultDetailPage />} />
      <Route path="/history" element={<HistoryPage />}></Route>
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/suggestions" element={<SmartSuggestionsPage />} />
      <Route path="/profile" element={<ProfilePage />} />

      {/* Nếu URL không hợp lệ, chuyển về /login */}
      {/* <Route path="*" element={<Navigate to="/login" />} /> */}
    </Routes>
  );
}
