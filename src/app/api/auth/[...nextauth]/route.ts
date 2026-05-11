import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();

        const user = await User.findOne({ email: credentials?.email }).select(
          "+password",
        );

        if (!user) {
          throw new Error("Email này chưa được đăng ký!");
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials!.password,
          user.password,
        );

        if (!isPasswordCorrect) {
          throw new Error("Mật khẩu không chính xác!");
        }

        // TRẢ VỀ ĐẦY ĐỦ THÔNG TIN (Gồm cả phone)
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          phone: user.phone, // Đã thêm lấy số điện thoại
        };
      },
    }),
  ],
  // DÙNG CALLBACKS ĐỂ TRUYỀN PHONE VÀO SESSION
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.phone = (user as any).phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).phone = token.phone;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "chuoi_bi_mat_cua_3t_home",
  pages: {
    signIn: "/",
  },
});

export { handler as GET, handler as POST };
