import React from "react";

// Định nghĩa kiểu dữ liệu (Props) cho Button
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  children: React.ReactNode;
}

export default function Button({
  variant = "primary",
  children,
  ...props
}: ButtonProps) {
  const baseStyle =
    "px-6 py-2 rounded font-medium transition-colors duration-300";
  const primaryStyle = "bg-amber-700 text-white hover:bg-amber-800"; // Màu gỗ/nội thất
  const outlineStyle =
    "border-2 border-amber-700 text-amber-700 hover:bg-amber-50";

  return (
    <button
      className={`${baseStyle} ${variant === "primary" ? primaryStyle : outlineStyle}`}
      {...props}
    >
      {children}
    </button>
  );
}
