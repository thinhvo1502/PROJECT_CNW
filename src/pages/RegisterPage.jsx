import { Link } from "react-router-dom";

function RegisterPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 space-y-6">
          <div className="space-y-1 text-center">
            <h2 className="text-2xl font-bold">Đăng ký tài khoản</h2>
            <p className="text-sm text-gray-500">
              Tạo tài khoản để bắt đầu ôn tập kiến thức CNTT
            </p>
          </div>

          <form className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullname" className="block text-sm font-medium">
                Họ và tên
              </label>
              <input
                type="text"
                id="fullname"
                placeholder="Nguyễn Văn A"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="example@gmail.com"
                className="w-full  px-3 py-2 border border-gray-300 rounded-md focus: outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="block font-medium text-sm">
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium"
              >
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full
            px-4 py-2
            bg-blue-600
            text-white
            font-medium
            rounded-md
            hover:bg-blue-700
            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:ring-offset-2
            "
            >
              Đăng ký
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link to="/login" className="text-blue-600 hover:underline">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default RegisterPage;
