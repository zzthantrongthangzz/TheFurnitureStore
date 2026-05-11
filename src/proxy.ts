import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // req.nextauth.token chứa toàn bộ dữ liệu bạn đã định nghĩa trong callback jwt()
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Kiểm tra xem user đang truy cập vào nhánh /admin...
    if (path.startsWith("/admin")) {
      // Nếu chưa đăng nhập HOẶC role không phải là "admin"
      if (!token || token.role !== "admin") {
        // Chuyển hướng họ về trang chủ (hoặc một trang báo lỗi tùy bạn)
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Cho phép đi tiếp nếu thỏa mãn điều kiện
    return NextResponse.next();
  },
  {
    callbacks: {
      // Hàm này trả về true thì middleware() ở trên mới được chạy
      // Chúng ta luôn trả về true để middleware tự kiểm tra chi tiết logic bên trong
      authorized: () => true, 
    },
  }
);

// Khai báo những đường dẫn nào sẽ bị middleware này "bắt" lại để kiểm tra
export const config = { 
  matcher: ["/admin/:path*", "/profile/:path*"] 
};