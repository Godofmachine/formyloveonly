import { useState, useEffect, useRef } from 'react';

export const useAudio = (url: string) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [playing, setPlaying] = useState(false);

    useEffect(() => {
        const audio = new Audio(url);
        audio.loop = true;
        audio.volume = 0.5; // Start at 50% volume
        audioRef.current = audio;

        // Attempt autoplay
        const attemptPlay = () => {
            audio.play()
                .then(() => {
                    setPlaying(true);
                    // Remove listener if successful
                    document.removeEventListener('click', attemptPlay);
                })
                .catch(error => {
                    console.log("Autoplay blocked, waiting for interaction:", error);
                });
        };

        attemptPlay();

        // Add fallback listener for user interaction
        document.addEventListener('click', attemptPlay, { once: true });

        // Cleanup on unmount
        return () => {
            document.removeEventListener('click', attemptPlay);
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, [url]);

    const toggle = () => {
        if (!audioRef.current) return;

        if (playing) {
            audioRef.current.pause();
        } else {
            audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        }
        setPlaying(!playing);
    };

    const play = () => {
        if (!audioRef.current) return;
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
        setPlaying(true);
    }

    return { playing, toggle, play };
};
