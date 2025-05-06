import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "Tháng 1", doanhThu: 4000 },
  { name: "Tháng 2", doanhThu: 3000 },
  { name: "Tháng 3", doanhThu: 5000 },
  { name: "Tháng 4", doanhThu: 7000 },
];

const RevenueStatistics = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Thống kê Doanh thu</h1>
      <div className="bg-white p-4 rounded shadow-md">
        <BarChart width={600} height={300} data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="doanhThu" fill="#8884d8" />
        </BarChart>
      </div>
    </div>
  );
};

export default RevenueStatistics;
