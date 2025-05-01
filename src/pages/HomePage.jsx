import { Link } from "react-router-dom";
import {
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import { BookOpen, TrendingUp, Brain, ChevronRight } from "lucide-react";
function HomePage() {
  const isLoggedIn = true; // Replace with actual authentication check
  const userName = "Nguyễn Văn A";
  // Dữ liệu mẫu cho biểu đồ tiến độ học tập
  const progressData = [
    { name: "T2", quizzes: 2, avgScore: 75 },
    { name: "T3", quizzes: 3, avgScore: 80 },
    { name: "T4", quizzes: 1, avgScore: 65 },
    { name: "T5", quizzes: 4, avgScore: 85 },
    { name: "T6", quizzes: 2, avgScore: 90 },
    { name: "T7", quizzes: 5, avgScore: 78 },
    { name: "CN", quizzes: 3, avgScore: 82 },
  ];

  // Dữ liệu mẫu cho gợi ý thông minh
  const suggestions = [
    {
      id: 1,
      topic: "Mạng máy tính",
      description: "Bạn đã làm sai 70% câu hỏi về giao thức TCP/IP",
      icon: <BookOpen className="h-10 w-10 text-blue-500" />,
      color: "bg-blue-100",
    },
    {
      id: 2,
      topic: "Cấu trúc dữ liệu",
      description: "Bạn cần ôn tập thêm về cây nhị phân và đồ thị",
      icon: <TrendingUp className="h-10 w-10 text-green-500" />,
      color: "bg-green-100",
    },
    {
      id: 3,
      topic: "Lập trình hướng đối tượng",
      description: "Bạn thường xuyên nhầm lẫn về tính kế thừa và đa hình",
      icon: <Brain className="h-10 w-10 text-purple-500" />,
      color: "bg-purple-100",
    },
  ];
  return (
    <div className="flex flex-col min-h-screen>">
      {/* Banner section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Xin chào , {userName}!
          </h1>
          <p className="text-xl mb-8">
            Hãy tiếp tục hành trình học tập của bạn với các bài trắc nghiệm CNTT
            tương tác.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/exam"
              className="px-6 py-3 bg-white text-blue-700 font-medium rounded-md text-center hover:bg-blue-50 transition-colors"
            >
              Bắt đầu ôn tập
            </Link>
            <Link
              to="/statistics"
              className="px-6 py-3 border border-white text-white font-medium rounded-md text-center hover:bg-blue-700 transition-colors"
            >
              Xem tiến độ học tập
            </Link>
          </div>
        </div>
      </section>

      {/* Progress Chart Section */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Tiến độ học tập</h2>
                <p className="text-gray-600">
                  Số đề đã làm và điểm trung bình trong 7 ngày qua
                </p>
              </div>
              <Link
                to="/statistics"
                className="text-blue-600 font-medium flex item-center mt-2 md:mt-0 hover:underline"
              >
                Xem chi tiết <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-md">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart
                    data={progressData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      stroke="#82ca9d"
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="quizzes"
                      name="Số đề đã làm"
                      fill="#8884d8"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="avgScore"
                      name="Điểm trung bình"
                      stroke="#82ca9d"
                      strokeWidth={2}
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smart Suggestion Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
              <div>
                <h2 className="text-2xl font-bold mb-2">Gợi ý thông minh</h2>
                <p className="text-gray-600">
                  Các chủ đề bạn cần cải thiện dựa trên kết quả học tập
                </p>
              </div>
              <Link
                to="/suggestions"
                className="text-blue-600 font-medium flex items-center mt-2 md:mt-0 hover:underline"
              >
                Xem tất cả gợi ý <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="p-6">
                    <div
                      className={`w-16 h-16 rounded-full ${suggestion.color} flex items-center justify-center mb-4`}
                    >
                      {suggestion.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">
                      {suggestion.topic}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {suggestion.description}
                    </p>
                    <Link
                      to={`/quiz/topic/${suggestion.id}`}
                      className="text-blue-600 font-medium hover:underline flex items-center"
                    >
                      Ôn tập ngay <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
export default HomePage;
