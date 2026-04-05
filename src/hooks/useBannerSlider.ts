import { useState, useEffect, useCallback } from 'react';

export function useBannerSlider(bannersLength: number, interval: number = 5000) {
    const [currentBanner, setCurrentBanner] = useState(0);

    const nextBanner = useCallback(() => {
        setCurrentBanner((prev) => (prev + 1) % bannersLength);
    }, [bannersLength]);

    const prevBanner = useCallback(() => {
        setCurrentBanner((prev) => (prev - 1 + bannersLength) % bannersLength);
    }, [bannersLength]);

    useEffect(() => {
        const timer = setInterval(nextBanner, interval);
        return () => clearInterval(timer);
    }, [nextBanner, interval]);

    return { currentBanner, setCurrentBanner, nextBanner, prevBanner };
}