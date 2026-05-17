type ProductAttributePayload = {
  key?: string;
  value?: string;
};

type ProductVariantPayload = {
  sku?: string;
  color?: string;
  size?: string;
  price?: number;
  inStock?: number;
  imageUrl?: string;
};

export type ProductPayload = {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  originalPrice?: number;
  discountPercent?: number;
  imageUrl?: string;
  gallery?: string[];
  category?: string;
  subCategory?: string;
  collectionName?: string;
  attributes?: ProductAttributePayload[];
  variants?: ProductVariantPayload[];
  inStock?: boolean;
  isActive?: boolean;
};

type NormalizeOptions = {
  partial?: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const readString = (value: unknown) =>
  typeof value === "string" ? value.trim() : undefined;

const readNumber = (value: unknown) => {
  if (value === undefined || value === null || value === "") return undefined;
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : undefined;
};

const readBoolean = (value: unknown) =>
  typeof value === "boolean" ? value : undefined;

const readStringArray = (value: unknown) =>
  Array.isArray(value)
    ? value.map(readString).filter((item): item is string => Boolean(item))
    : undefined;

const readAttributes = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter(isRecord)
        .map((item) => ({
          key: readString(item.key),
          value: readString(item.value),
        }))
        .filter((item) => item.key || item.value)
    : undefined;

const readVariants = (value: unknown) =>
  Array.isArray(value)
    ? value
        .filter(isRecord)
        .map((item) => ({
          sku: readString(item.sku),
          color: readString(item.color),
          size: readString(item.size),
          price: readNumber(item.price),
          inStock: readNumber(item.inStock),
          imageUrl: readString(item.imageUrl),
        }))
        .filter((item) =>
          Object.values(item).some((field) => field !== undefined),
        )
    : undefined;

export const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : String(error);

export function normalizeProductPayload(
  input: unknown,
  options: NormalizeOptions = {},
): { payload?: ProductPayload; error?: string } {
  if (!isRecord(input)) {
    return { error: "Dữ liệu sản phẩm không hợp lệ" };
  }

  const payload: ProductPayload = {};
  const stringFields = [
    "name",
    "slug",
    "description",
    "imageUrl",
    "category",
    "subCategory",
    "collectionName",
  ] as const;

  for (const field of stringFields) {
    const value = readString(input[field]);
    if (value !== undefined) payload[field] = value;
  }

  for (const field of ["price", "originalPrice", "discountPercent"] as const) {
    const value = readNumber(input[field]);
    if (value !== undefined) payload[field] = value;
  }

  for (const field of ["inStock", "isActive"] as const) {
    const value = readBoolean(input[field]);
    if (value !== undefined) payload[field] = value;
  }

  const gallery = readStringArray(input.gallery);
  if (gallery !== undefined) payload.gallery = gallery;

  const attributes = readAttributes(input.attributes);
  if (attributes !== undefined) payload.attributes = attributes;

  const variants = readVariants(input.variants);
  if (variants !== undefined) payload.variants = variants;

  if (payload.price !== undefined && payload.price < 0) {
    return { error: "Giá sản phẩm không hợp lệ" };
  }

  if (!options.partial) {
    for (const field of [
      "name",
      "slug",
      "price",
      "imageUrl",
      "category",
    ] as const) {
      if (payload[field] === undefined || payload[field] === "") {
        return { error: `Thiếu trường bắt buộc: ${field}` };
      }
    }
  }

  if (options.partial && Object.keys(payload).length === 0) {
    return { error: "Không có trường hợp lệ để cập nhật" };
  }

  return { payload };
}
