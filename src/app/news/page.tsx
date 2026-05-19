import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Clock,
  Lightbulb,
  Newspaper,
  Ruler,
  ShieldCheck,
} from "lucide-react";

const featuredArticle = {
  title: "Xu hướng nội thất gỗ hiện đại cho không gian sống 2026",
  excerpt:
    "Các thiết kế gọn, bền, dễ phối màu và tối ưu công năng đang trở thành lựa chọn chính cho căn hộ đô thị.",
  category: "Xu hướng",
  date: "18/05/2026",
  readTime: "5 phút đọc",
  image: "/images/design/phongkhach.jpg",
  href: "/design",
};

const articles = [
  {
    title: "Cách chọn sofa phù hợp với diện tích phòng khách",
    excerpt:
      "Những nguyên tắc về kích thước, chất liệu và bố cục giúp phòng khách thoáng hơn mà vẫn đủ điểm nhấn.",
    category: "Phòng khách",
    date: "12/05/2026",
    readTime: "4 phút đọc",
    image: "/images/products/ghe_sofa_2m5_florence.png",
    href: "/phong-khach",
  },
  {
    title: "Bố trí phòng ngủ nhỏ: ưu tiên lưu trữ và ánh sáng",
    excerpt:
      "Tủ áo, giường và tab đầu giường nên được chọn theo cùng một trục màu để căn phòng nhẹ và dễ nghỉ ngơi.",
    category: "Phòng ngủ",
    date: "08/05/2026",
    readTime: "3 phút đọc",
    image: "/images/design/phongngu.jpg",
    href: "/phong-ngu",
  },
  {
    title: "Bàn ăn gỗ tự nhiên: khi nào nên chọn dáng tròn?",
    excerpt:
      "Bàn tròn phù hợp với không gian gia đình cần sự gần gũi, ít góc cạnh và di chuyển linh hoạt hơn.",
    category: "Phòng ăn",
    date: "02/05/2026",
    readTime: "4 phút đọc",
    image: "/images/products/ban_an_tron_oslo.jpg",
    href: "/phong-an",
  },
  {
    title: "Những lỗi thường gặp khi đo kích thước nội thất",
    excerpt:
      "Đo thiếu khoảng mở cửa, lối đi và chiều cao ổ cắm có thể khiến sản phẩm đẹp nhưng khó sử dụng thực tế.",
    category: "Kinh nghiệm",
    date: "25/04/2026",
    readTime: "6 phút đọc",
    image: "/images/design/duan2.jpg",
    href: "/design",
  },
  {
    title: "Bảo quản nội thất gỗ trong mùa mưa",
    excerpt:
      "Giữ độ ẩm ổn định, tránh ánh nắng trực tiếp và vệ sinh đúng cách giúp bề mặt gỗ bền màu hơn.",
    category: "Bảo quản",
    date: "18/04/2026",
    readTime: "3 phút đọc",
    image: "/images/products/tu_quan_ao_go.jpg",
    href: "/products",
  },
  {
    title: "Gợi ý phối màu nội thất cho căn hộ trẻ",
    excerpt:
      "Nền trung tính, điểm nhấn gỗ ấm và một mảng màu chủ đạo giúp không gian có cá tính nhưng không rối mắt.",
    category: "Cảm hứng",
    date: "10/04/2026",
    readTime: "5 phút đọc",
    image: "/images/design/duan3.jpg",
    href: "/collections",
  },
];

const categories = [
  { name: "Xu hướng nội thất", count: 8, icon: Newspaper },
  { name: "Kinh nghiệm chọn mua", count: 12, icon: Lightbulb },
  { name: "Tư vấn kích thước", count: 6, icon: Ruler },
  { name: "Bảo quản sản phẩm", count: 5, icon: ShieldCheck },
];

const recentPosts = articles.slice(0, 4);

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-white text-gray-800 pb-20">
      <section className="w-full relative aspect-[21/9] md:aspect-[1920/400] bg-gray-100 overflow-hidden">
        <Image
          src="/images/banner-products.jpg"
          alt="Tin tức 3T Home"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/25" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-[1400px] mx-auto w-full px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl text-white">
              <p className="text-sm md:text-base font-semibold uppercase tracking-[0.2em] mb-3"></p>
              <h1 className="text-3xl md:text-5xl font-bold uppercase leading-tight"></h1>
              <p className="mt-4 text-sm md:text-base text-white/90 leading-relaxed"></p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 xl:py-12">
        <div className="mb-8 border-b border-gray-100 pb-4 flex flex-col md:flex-row justify-between md:items-end gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wider text-gray-900 mb-2">
              Bài viết mới nhất
            </h2>
            <p className="text-sm text-gray-500 font-medium">
              Góc chia sẻ dành cho khách hàng đang hoàn thiện nhà ở, căn hộ và
              không gian làm việc.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 hover:text-orange-700 transition"
          >
            Xem sản phẩm
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-10 xl:gap-12">
          <div className="space-y-10">
            <article className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
              <Link
                href={featuredArticle.href}
                className="relative aspect-[4/3] md:aspect-auto bg-gray-100 overflow-hidden group"
              >
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </Link>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-600 font-semibold">
                    {featuredArticle.category}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <CalendarDays size={14} />
                    {featuredArticle.date}
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-snug mb-4">
                  {featuredArticle.title}
                </h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {featuredArticle.excerpt}
                </p>
                <Link
                  href={featuredArticle.href}
                  className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:text-orange-700 transition"
                >
                  Đọc thêm
                  <ArrowRight size={17} />
                </Link>
              </div>
            </article>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {articles.map((article) => (
                <article
                  key={article.title}
                  className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:border-orange-200 transition flex flex-col"
                >
                  <Link
                    href={article.href}
                    className="relative aspect-[4/3] bg-gray-100 overflow-hidden"
                  >
                    <Image
                      src={article.image}
                      alt={article.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </Link>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center justify-between gap-3 text-xs text-gray-500 mb-3">
                      <span className="font-semibold text-orange-600">
                        {article.category}
                      </span>
                      <span className="inline-flex items-center gap-1 whitespace-nowrap">
                        <Clock size={13} />
                        {article.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-orange-600 transition">
                      {article.title}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-5 flex-1">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-xs text-gray-500">
                        {article.date}
                      </span>
                      <Link
                        href={article.href}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-gray-800 hover:text-orange-600 transition"
                      >
                        Đọc thêm
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="space-y-8">
            <div className="border border-gray-100 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-5">
                Danh mục tin tức
              </h3>
              <div className="space-y-3">
                {categories.map((category) => {
                  const Icon = category.icon;

                  return (
                    <div
                      key={category.name}
                      className="flex items-center justify-between gap-4 rounded-lg border border-gray-100 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-orange-600">
                          <Icon size={18} />
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {category.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-400">
                        {category.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="border border-gray-100 rounded-xl bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4 mb-5">
                Bài viết gần đây
              </h3>
              <div className="space-y-5">
                {recentPosts.map((post) => (
                  <Link
                    href={post.href}
                    key={post.title}
                    className="grid grid-cols-[84px_minmax(0,1fr)] gap-4 group"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={post.image}
                        alt={post.title}
                        fill
                        sizes="84px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">{post.date}</p>
                      <h4 className="text-sm font-bold text-gray-800 leading-snug group-hover:text-orange-600 transition line-clamp-2">
                        {post.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-100 rounded-xl p-6">
              <h3 className="text-xl font-bold text-orange-900 mb-3">
                Cần tư vấn nội thất?
              </h3>
              <p className="text-sm text-orange-800 leading-relaxed mb-5">
                Đội ngũ 3T Home có thể gợi ý sản phẩm, kích thước và cách phối
                đồ phù hợp với mặt bằng thực tế.
              </p>
              <Link
                href="/design"
                className="inline-flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-orange-700 transition"
              >
                Tư vấn thiết kế
                <ArrowRight size={16} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
