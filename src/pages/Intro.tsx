import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CONFIG } from '../constants/config'

// Extracted and stabilized TypingText component
const TypingText = ({ text, delay = 0, speed = 50, onComplete, className }: { text: string; delay?: number; speed?: number; onComplete?: () => void; className?: string }) => {
    const [displayedText, setDisplayedText] = useState('')
    // Removed unused 'started' state

    // Use a ref for the callback to avoid re-triggering the effect when the parent re-renders
    const onCompleteRef = useRef(onComplete)

    useEffect(() => {
        onCompleteRef.current = onComplete
    }, [onComplete])

    useEffect(() => {
        const startTimeout = setTimeout(() => {
            let currentIndex = 0
            const interval = setInterval(() => {
                if (currentIndex < text.length) {
                    setDisplayedText(text.slice(0, currentIndex + 1))
                    currentIndex++
                } else {
                    clearInterval(interval)
                    if (onCompleteRef.current) onCompleteRef.current()
                }
            }, speed)
            return () => clearInterval(interval)
        }, delay)

        return () => clearTimeout(startTimeout)
    }, [text, delay, speed])

    return <span className={className}>{displayedText}</span>
}

export const Intro = () => {
    const navigate = useNavigate()
    const [step, setStep] = useState(0)

    // Use config messages
    const messages = [
        `Hey ${CONFIG.herName}...`,
        "I made something small...",
        "Because you mean something big to me."
    ]

    const handleNextStep = () => {
        setStep((prev) => prev + 1)
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
            <div className="max-w-md space-y-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-3xl font-heading font-bold text-pink-600 min-h-[3rem]"
                >
                    {step >= 0 && (
                        <TypingText
                            text={messages[0]}
                            onComplete={() => setTimeout(handleNextStep, 1000)}
                        />
                    )}
                </motion.div>

                <div className="min-h-[2rem]">
                    {step >= 1 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xl text-gray-700 font-medium"
                        >
                            <TypingText
                                text={messages[1]}
                                delay={500}
                                onComplete={() => setTimeout(handleNextStep, 1500)}
                            />
                        </motion.div>
                    )}
                </div>

                <div className="min-h-[2.5rem]">
                    {step >= 2 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl text-pink-500 font-semibold"
                        >
                            <TypingText text={messages[2]} delay={500} onComplete={handleNextStep} />
                        </motion.div>
                    )}
                </div>

                {step >= 3 && (
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        onClick={() => navigate('/auth')}
                        className="mt-8 px-8 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-bold shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Continue
                    </motion.button>
                )}
            </div>
        </div>
    )
}
