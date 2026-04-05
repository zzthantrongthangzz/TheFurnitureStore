import HeroBanner from '@/features/home/HeroBanner';
import ProductSection from '@/features/home/ProductSection';
import ReviewSection from '@/features/home/ReviewSection';

export default function HomePage() {
    return (
        <main className="flex-grow bg-gray-50 font-sans">
            <HeroBanner />
            <ProductSection />
            <ReviewSection />
        </main>
    );
}