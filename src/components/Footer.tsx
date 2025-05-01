import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-6 w-6" />
              <span className="text-xl font-bold">IT Quiz</span>
            </div>
            <p className="text-gray-400">
              Nền tảng ôn tập kiến thức CNTT qua hình thức trắc nghiệm tương
              tác.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  to="/exam-list"
                  className="text-gray-400 hover:text-white"
                >
                  Làm bài trắc nghiệm
                </Link>
              </li>
              <li>
                <Link to="/history" className="text-gray-400 hover:text-white">
                  Lịch sử làm bài
                </Link>
              </li>
              <li>
                <Link
                  to="/statistics"
                  className="text-gray-400 hover:text-white"
                >
                  Thống kê học tập
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2">
              <li className="text-gray-400">Email: vothinh1504@gmail.com</li>
              <li className="text-gray-400">Điện thoại: 0862424570</li>
              <li className="text-gray-400">
                Địa chỉ: 123 Thành Thái, Quận 10, TP.HCM
              </li>
              <li className="text-gray-400">
                Facebook:{" "}
                <a
                  href="https://www.facebook.com/vothinh1504"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white"
                >
                  Võ Thịnh
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>
            &copy; {new Date().getFullYear()} IT Quiz. Tất cả các quyền được bảo
            lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;
