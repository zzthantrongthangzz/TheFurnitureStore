import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Tên khách hàng là bắt buộc"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Email là bắt buộc"],
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Email không hợp lệ",
      ],
    },
    phone: {
      type: String,
      required: [true, "Số điện thoại là bắt buộc"],
    },
    password: {
      type: String,
      required: [true, "Mật khẩu là bắt buộc"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
