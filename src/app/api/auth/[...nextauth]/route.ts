import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectToDatabase } from "@/lib/db";

// 1. TÁCH CỤC CONFIG RA VÀ THÊM TỪ KHÓA 'export'
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials?.email }).select("+password");

        if (!user) throw new Error("Email này chưa được đăng ký!");

        const isPasswordCorrect = await bcrypt.compare(credentials!.password, user.password);
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.phone = (user as any).phone;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).phone = token.phone;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" as const }, // Ép kiểu cho chắc chắn
  secret: process.env.NEXTAUTH_SECRET || "chuoi_bi_mat_cua_3t_home",
  pages: { signIn: "/" },
};

// 2. TRUYỀN authOptions VÀO NextAuth VÀ EXPORT HANDLER NHƯ BÌNH THƯỜNG
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };