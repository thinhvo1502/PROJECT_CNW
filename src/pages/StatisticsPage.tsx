import { useState } from "react";
import {
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ReferenceArea,
  ReferenceLine,
} from "recharts";
import {
  Calendar,
  TrendingUp,
  Award,
  BookOpen,
  ChevronDown,
  Filter,
} from "lucide-react";
import React from "react";
interface TopicScore {
  topic: string;
  score: number;
  fullMark: number;
}
interface ProgressData {
  name: string;
  quizzes: number;
  avgScore: number;
}
interface ScoreOverTime {
  date: string;
  score: number;
  quizName: string;
  topic: string;
}
interface StatsSummary {
  totalQuizzes: number;
  averageScore: number;
  highestScore: number;
  lowestScore: number;
  completedTopics: number;
  totalTopics: number;
}
const StatisticsPage = () => {
  const [timeFilter, setTimeFilter] = useState<"week" | "month" | "year">(
    "week"
  );
  const [progressTimeFilter, setProgressTimeFilter] = useState<
    "week" | "month"
  >("week");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Dữ liệu mẫu cho biểu đồ radar
  const radarData: TopicScore[] = [
    { topic: "Mạng máy tính", score: 85, fullMark: 100 },
    { topic: "Cấu trúc dữ liệu", score: 78, fullMark: 100 },
    { topic: "Lập trình hướng đối tượng", score: 92, fullMark: 100 },
    { topic: "Cơ sở dữ liệu", score: 70, fullMark: 100 },
    { topic: "An toàn thông tin", score: 65, fullMark: 100 },
    { topic: "Hệ điều hành", score: 80, fullMark: 100 },
  ];

  // Dữ liệu mẫu cho biểu đồ tiến độ theo tuần
  const weeklyProgressData: ProgressData[] = [
    { name: "T2", quizzes: 2, avgScore: 75 },
    { name: "T3", quizzes: 3, avgScore: 80 },
    { name: "T4", quizzes: 1, avgScore: 65 },
    { name: "T5", quizzes: 4, avgScore: 85 },
    { name: "T6", quizzes: 2, avgScore: 90 },
    { name: "T7", quizzes: 5, avgScore: 78 },
    { name: "CN", quizzes: 3, avgScore: 82 },
  ];

  // Dữ liệu mẫu cho biểu đồ tiến độ theo tháng
  const monthlyProgressData: ProgressData[] = [
    { name: "Tuần 1", quizzes: 10, avgScore: 78 },
    { name: "Tuần 2", quizzes: 15, avgScore: 82 },
    { name: "Tuần 3", quizzes: 8, avgScore: 75 },
    { name: "Tuần 4", quizzes: 12, avgScore: 88 },
  ];

  // Dữ liệu mẫu cho biểu đồ điểm số theo thời gian
  const scoreOverTimeData: ScoreOverTime[] = [
    {
      date: "01/05",
      score: 75,
      quizName: "Kiến thức cơ bản về mạng LAN",
      topic: "Mạng máy tính",
    },
    {
      date: "03/05",
      score: 82,
      quizName: "Giao thức TCP/IP và mô hình OSI",
      topic: "Mạng máy tính",
    },
    {
      date: "05/05",
      score: 68,
      quizName: "Cấu trúc dữ liệu cây và đồ thị",
      topic: "Cấu trúc dữ liệu",
    },
    {
      date: "08/05",
      score: 90,
      quizName: "Lập trình hướng đối tượng với Java",
      topic: "Lập trình hướng đối tượng",
    },
    {
      date: "10/05",
      score: 85,
      quizName: "Cơ sở dữ liệu quan hệ và SQL",
      topic: "Cơ sở dữ liệu",
    },
    {
      date: "12/05",
      score: 72,
      quizName: "Bảo mật và mã hóa thông tin",
      topic: "An toàn thông tin",
    },
    {
      date: "15/05",
      score: 78,
      quizName: "Hệ điều hành Linux cơ bản",
      topic: "Hệ điều hành",
    },
    {
      date: "18/05",
      score: 88,
      quizName: "Quản lý tiến trình trong hệ điều hành",
      topic: "Hệ điều hành",
    },
    {
      date: "20/05",
      score: 92,
      quizName: "Lập trình hướng đối tượng nâng cao",
      topic: "Lập trình hướng đối tượng",
    },
    {
      date: "22/05",
      score: 65,
      quizName: "Mạng không dây và bảo mật",
      topic: "Mạng máy tính",
    },
  ];

  // Dữ liệu thống kê tổng quan
  const statsSummary: StatsSummary = {
    totalQuizzes: 25,
    averageScore: 79.5,
    highestScore: 95,
    lowestScore: 60,
    completedTopics: 6,
    totalTopics: 8,
  };
  // lọc dữ liệu điểm số theo thời gian dựa trên bộ lọc
  const getFilteredScoreData = () => {
    return scoreOverTimeData;
  };
  // lấy dữ liệu tiến độ dựa trên bộ lọc
  const getProgressData = () => {
    return progressTimeFilter === "week"
      ? weeklyProgressData
      : monthlyProgressData;
  };
  // custom tooltip cho biểu đồ điểm số theo thời gian
  const ScoreTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
          <p className="font-semibold">{data.quizName}</p>
          <p className="text-sm tex-gray-600">{data.topic}</p>
          <p className="text-sm">
            Ngày: <span className="font-medium">{data.date}</span>
          </p>
          <p className="text-sm">
            Điểm: <span className="font-medium">{data.score}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  // custom tooltip cho biểu đồ tiến độ
  const ProgressTooltip = ({ active, payload, lable }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-md shadow-md">
          <p className="font-semibold">{lable}</p>
          <p className="text-sm">
            Số đề đã làm:{" "}
            <span className="font-medium">{payload[0].value}</span>
          </p>
          <p className="text-sm">
            Điểm trung bình:{" "}
            <span className="font-medium">{payload[1].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-3xl font-bold">Thống kê học tập</h1>

          {/* bộ lọc thời gian */}
          <div className="mt-4 md:mt-0 relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
            >
              <Filter className="h-4 w-4 mr-2" />
              <span>Bộ lọc thời gian</span>
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>

            {isFilterOpen && (
              <div className="absolute right-0 mt-0 w-48 bg-white rounde-md shadow-lg py-1 z-10 border border-gray-200">
                <button
                  onClick={() => {
                    setTimeFilter("week");
                    setIsFilterOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    timeFilter === "week"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  7 ngày gần đây
                </button>
                <button
                  onClick={() => {
                    setTimeFilter("month");
                    setIsFilterOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    timeFilter === "month"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  30 ngày gần đây
                </button>
                <button
                  onClick={() => {
                    setTimeFilter("year");
                    setIsFilterOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    timeFilter === "year"
                      ? "bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50"
                  }`}
                >
                  365 ngày gần đây
                </button>
              </div>
            )}
          </div>
        </div>
        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-blue-100 p-3 mr-4">
                <BookOpen className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Tổng số bài đã làm</p>
                <p className="text-2xl font-bold">
                  {statsSummary.totalQuizzes}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-purple-100 p-3 mr-4">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Điểm trung bình</p>
                <p className="text-2xl font-bold">
                  {statsSummary.averageScore.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-green-100 p-3 mr-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Điểm cao nhất</p>
                <p className="text-2xl font-bold">
                  {statsSummary.highestScore}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="rounded-full bg-orange-100 p-3 mr-4">
                <Calendar className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Chủ đề đã học</p>
                <p className="text-2xl font-bold">
                  {statsSummary.completedTopics}/{statsSummary.totalTopics}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Biểu đồ radar điểm số theo chủ đề */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Điểm số theo chủ đề</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                <PolarGrid />
                <PolarAngleAxis
                  dataKey="topic"
                  tick={{ fill: "#4b563", fontSize: 12 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Điểm số"
                  dataKey="score"
                  stroke="#3B82F6"
                  fill="#3B82F6"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Điểm tối đa"
                  dataKey="fullMark"
                  stroke="#9CA3AF"
                  fill="#9CA3AF"
                  fillOpacity={0.1}
                />
                <Legend />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Biểu đồ tiến độ học tập */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <h2 className="text-xl font-semibold">Tiến độ học tập</h2>
            <div className="mt-2 md:mt-0 flex items-center space-x-2">
              <button
                onClick={() => {
                  setProgressTimeFilter("week");
                }}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  progressTimeFilter === "week"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Theo tuần
              </button>
              <button
                onClick={() => setProgressTimeFilter("month")}
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  progressTimeFilter === "month"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Theo tháng
              </button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer>
              <ComposedChart
                data={getProgressData()}
                margin={{ top: 20, right: 20, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip content={<ProgressTooltip />} />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="quizzes"
                  name="Số đề đã làm"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                  barSize={30}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="avgScore"
                  name="Điểm trung bình"
                  stroke="#82ca9d"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <ReferenceLine
                  yAxisId="right"
                  y={80}
                  stroke="#82ca9d"
                  strokeDasharray="3 3"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm tex-gray-500 text-center">
            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
            Đường tham chiếu 80 điểm
          </div>
        </div>
        {/* Biểu đồ điểm số theo thời gian */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">
            Điểm số các bài kiểm tra theo thời gian
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={getFilteredScoreData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip content={<ScoreTooltip />} />
                <Legend />
                <ReferenceLine
                  y={80}
                  stroke="green"
                  strokeDasharray="3 3"
                  label="Mục tiêu"
                />
                <ReferenceLine
                  y={50}
                  stroke="red"
                  strokeDasharray="3 3"
                  label="Ngưỡng đạt"
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="Điểm số"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: "#3B82F6" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-500 text-center">
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>{" "}
                Mục tiêu: 80 điểm
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>{" "}
                Ngưỡng đạt: 50 điểm
              </div>
            </div>
          </div>
        </div>
        {/* phần gợi ý cải thiện */}
        {/* Phần gợi ý cải thiện */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-blue-800 mb-4">
            Gợi ý cải thiện
          </h2>
          <div className="space-y-3">
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mt-0.5">
                <span className="text-blue-800 text-xs font-bold">1</span>
              </div>
              <p className="ml-3 text-blue-800">
                Bạn nên tập trung cải thiện chủ đề{" "}
                <strong>An toàn thông tin</strong> vì đây là chủ đề có điểm số
                thấp nhất.
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mt-0.5">
                <span className="text-blue-800 text-xs font-bold">2</span>
              </div>
              <p className="ml-3 text-blue-800">
                Hãy duy trì việc học tập đều đặn. Bạn có xu hướng đạt điểm cao
                hơn khi làm nhiều bài kiểm tra trong một ngày.
              </p>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-200 flex items-center justify-center mt-0.5">
                <span className="text-blue-800 text-xs font-bold">3</span>
              </div>
              <p className="ml-3 text-blue-800">
                Thử thách: Hãy cố gắng đạt điểm trên 80 cho tất cả các chủ đề
                trong tháng tới.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default StatisticsPage;
