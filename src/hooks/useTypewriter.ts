import { useState, useEffect } from 'react';

export const useTypewriter = (text: string, speed = 50, startDelay = 0) => {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let timeout: ReturnType<typeof setTimeout>;
        let charIndex = 0;

        const startTyping = () => {
            const interval = setInterval(() => {
                if (charIndex <= text.length) {
                    setDisplayText(text.slice(0, charIndex));
                    charIndex++;
                } else {
                    clearInterval(interval);
                    setIsComplete(true);
                }
            }, speed);

            return () => clearInterval(interval);
        };

        if (startDelay > 0) {
            timeout = setTimeout(startTyping, startDelay);
        } else {
            startTyping();
        }

        return () => {
            clearTimeout(timeout);
        };
    }, [text, speed, startDelay]);

    return { displayText, isComplete };
};
