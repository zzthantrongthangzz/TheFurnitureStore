import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET is required");
}

// Tách cấu hình ra thành biến authOptions và thêm từ khóa 'export'
// Khai báo kiểu NextAuthOptions để TypeScript hỗ trợ tốt nhất
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error("Vui lòng nhập email và mật khẩu!");
        }

        await connectToDatabase();
        const user = await User.findOne({ email: credentials.email }).select(
          "+password",
        );

        if (!user) throw new Error("Email này chưa được đăng ký!");

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password,
        );
        if (!isPasswordCorrect) throw new Error("Mật khẩu không chính xác!");

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phone = user.phone;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.phone = token.phone;
        session.user.role = token.role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/" },
};

// Truyền authOptions vào NextAuth
const handler = NextAuth(authOptions);

// Export handler để xử lý các request GET, POST của Next.js
export { handler as GET, handler as POST };
