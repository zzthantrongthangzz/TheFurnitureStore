import { createHash } from "crypto";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const runtime = "nodejs";

const CLOUDINARY_FOLDER = "furniture/products";

const signCloudinaryParams = (
  params: Record<string, string | number>,
  apiSecret: string,
) => {
  const paramsToSign = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  return createHash("sha1").update(`${paramsToSign}${apiSecret}`).digest("hex");
};

export async function POST() {
  const session = await getServerSession(authOptions);

  if (session?.user?.role !== "admin") {
    return NextResponse.json(
      { message: "Bạn không có quyền upload ảnh sản phẩm" },
      { status: 403 },
    );
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { message: "Thiếu cấu hình Cloudinary trên server" },
      { status: 500 },
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const signature = signCloudinaryParams(
    {
      folder: CLOUDINARY_FOLDER,
      timestamp,
    },
    apiSecret,
  );

  return NextResponse.json({
    apiKey,
    cloudName,
    folder: CLOUDINARY_FOLDER,
    signature,
    timestamp,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
  });
}
