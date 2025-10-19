import { useState, useEffect } from 'react';

export const useCountdown = (targetDate: Date) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0,
    });
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = targetDate.getTime() - new Date().getTime();
            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return null;
        };

        const initialTimeLeft = calculateTimeLeft();
        if (initialTimeLeft) {
            setTimeLeft(initialTimeLeft);
        } else {
            setIsFinished(true);
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        }

        const timer = setInterval(() => {
            const newTimeLeft = calculateTimeLeft();
            if (newTimeLeft) {
                setTimeLeft(newTimeLeft);
            } else {
                setIsFinished(true);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    return { timeLeft, isFinished };
};
