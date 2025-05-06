import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Tháng 1", luotLamBai: 120 },
  { name: "Tháng 2", luotLamBai: 150 },
  { name: "Tháng 3", luotLamBai: 200 },
  { name: "Tháng 4", luotLamBai: 250 },
];

const ExamAttemptsStatistics = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Thống kê Lượt làm bài</h1>
      <div className="bg-white p-4 rounded shadow-md">
        <LineChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="luotLamBai" stroke="#82ca9d" />
        </LineChart>
      </div>
    </div>
  );
};

export default ExamAttemptsStatistics;
