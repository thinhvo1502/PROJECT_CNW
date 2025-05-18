/**
 * Định dạng ngày tháng từ chuỗi ISO sang định dạng ngày/tháng/năm
 * @param dateString Chuỗi ngày tháng dạng ISO
 * @returns Chuỗi ngày tháng đã định dạng
 */
export const formatDate = (dateString: string): string => {
  if (!dateString) return "Không xác định";

  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Không xác định";
  }
};

/**
 * Định dạng số thành chuỗi có dấu phân cách hàng nghìn
 * @param number Số cần định dạng
 * @returns Chuỗi số đã định dạng
 */
export const formatNumber = (number: number): string => {
  if (number === undefined || number === null) return "0";

  try {
    return number.toLocaleString("vi-VN");
  } catch (error) {
    console.error("Error formatting number:", error);
    return number.toString();
  }
};

/**
 * Định dạng thời gian từ giây sang định dạng phút:giây
 * @param seconds Số giây
 * @returns Chuỗi thời gian đã định dạng
 */
export const formatTime = (seconds: number): string => {
  if (!seconds && seconds !== 0) return "00:00";

  try {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
    const formattedSeconds =
      remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${formattedMinutes}:${formattedSeconds}`;
  } catch (error) {
    console.error("Error formatting time:", error);
    return "00:00";
  }
};
export function formatDuration(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return "00:00";
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) {
    return [h, m, s].map((v) => v.toString().padStart(2, "0")).join(":");
  }
  return [m, s].map((v) => v.toString().padStart(2, "0")).join(":");
}
