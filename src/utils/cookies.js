// Hàm để thiết lập cookie
export const setCookie = (name, value, days = 7, path = "/") => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(
    value
  )}; expires=${expires}; path=${path}; SameSite=Strict`;
};

// Hàm để lấy giá trị cookie
export const getCookie = (name) => {
  return document.cookie.split("; ").reduce((r, v) => {
    const parts = v.split("=");
    return parts[0] === name ? decodeURIComponent(parts[1]) : r;
  }, "");
};

// Hàm để xóa cookie
export const deleteCookie = (name, path = "/") => {
  setCookie(name, "", -1, path);
};
