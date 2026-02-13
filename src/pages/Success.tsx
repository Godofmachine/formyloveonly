import { useEffect } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import { Heart } from 'lucide-react'
import { CONFIG } from '../constants/config'

export const Success = () => {

    useEffect(() => {
        // Continuous confetti or just on mount
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, [])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "backOut" }}
                className="bg-white/40 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/60 max-w-2xl"
            >
                <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="text-8xl mb-6"
                >
                    💍
                </motion.div>

                <h1 className="text-4xl md:text-6xl font-heading font-bold text-pink-600 mb-6">
                    She Said YES!
                </h1>

                <p className="text-2xl text-gray-800 font-medium mb-8">
                    {CONFIG.messages.proposal.yes}
                </p>

                <div className="p-8 bg-white/60 rounded-2xl border border-pink-100 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-pink-300 to-red-300"></div>
                    <p className="text-gray-700 italic text-lg leading-relaxed font-serif">
                        "{CONFIG.messages.proposal.successMessage}"
                    </p>
                    <div className="mt-4 flex justify-center">
                        <Heart className="w-6 h-6 text-pink-400 fill-pink-100 animate-pulse" />
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
