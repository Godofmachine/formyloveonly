import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
import { CONFIG } from '../constants/config'

const NO_PHRASES = [
    "No", // 0
    "Are you sure?", // 1
    "Wrong answer detected",
    "Illegal selection",
    "Try again 😂",
    "That option is unavailable",
    "Error 404: No found",
    "Don't do this 🥺"
]

export const Proposal = () => {
    const navigate = useNavigate()
    const [showQuestion, setShowQuestion] = useState(false)
    const [noCount, setNoCount] = useState(0)
    const [noPosition, setNoPosition] = useState({ x: 0, y: 0 })
    const [showModal, setShowModal] = useState(false)

    // Start question reveal after some time
    useEffect(() => {
        const timer = setTimeout(() => setShowQuestion(true), 2000)
        return () => clearTimeout(timer)
    }, [])

    // Reset no button after 5 seconds of inactivity
    useEffect(() => {
        if (noCount === 0) return

        const timer = setTimeout(() => {
            setNoCount(0)
            setNoPosition({ x: 0, y: 0 })
        }, 5000)

        return () => clearTimeout(timer)
    }, [noCount])

    const handleNoInteraction = (type: 'hover' | 'click') => {
        // First interaction must be a click
        if (noCount === 0 && type === 'hover') return

        const x = Math.random() * (window.innerWidth - 200) - (window.innerWidth / 2 - 100)
        const y = Math.random() * (window.innerHeight - 200) - (window.innerHeight / 2 - 100)

        setNoPosition({ x, y })
        setNoCount(prev => prev + 1)

        if (noCount > 0 && noCount % 15 === 0) {
            setShowModal(true)
        }
    }

    const handleYes = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ec4899', '#db2777', '#f472b6']
        })
        navigate('/success')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 py-20 text-center overflow-hidden relative">
            <AnimatePresence>
                {!showQuestion ? (
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-4xl md:text-6xl font-heading font-bold text-pink-600"
                    >
                        {CONFIG.messages.proposal.setup}
                    </motion.h1>
                ) : (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="z-10"
                    >
                        <h1 className="text-5xl md:text-7xl font-heading font-bold text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-600 mb-6 drop-shadow-sm leading-tight">
                            {CONFIG.messages.proposal.question}
                        </h1>

                        <p className="text-lg md:text-xl text-gray-700 mb-8 max-w-2xl mx-auto whitespace-pre-line font-medium leading-relaxed">
                            {CONFIG.messages.proposal.subText}
                        </p>

                        <motion.p
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                            className="text-xl md:text-2xl text-rose-600 font-bold mb-12 font-heading tracking-wide drop-shadow-sm"
                        >
                            {CONFIG.messages.proposal.dareText}
                        </motion.p>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-4 relative h-40">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleYes}
                                className="w-64 py-5 bg-linear-to-r from-green-400 to-emerald-500 text-white text-2xl font-bold rounded-full shadow-lg hover:shadow-green-200/50 hover:shadow-2xl transition-all z-20"
                            >
                                YES ❤️
                            </motion.button>

                            {/* Ghost Button to hold space - ONLY visible when real button starts moving */}
                            {noCount > 0 && (
                                <div className="hidden md:flex flex-col items-center opacity-0 pointer-events-none select-none">
                                    <button className="w-64 py-5 text-2xl font-bold rounded-full">
                                        No
                                    </button>
                                </div>
                            )}

                            {/* Desktop No Button Container */}
                            <motion.div
                                animate={noPosition}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                onMouseEnter={() => handleNoInteraction('hover')}
                                onClick={() => handleNoInteraction('click')}
                                style={{ position: noCount > 0 ? 'absolute' : 'relative', zIndex: 10 }}
                                className={`hidden md:flex flex-col items-center ${noCount === 0 ? '' : 'top-0 left-0'}`}
                            >
                                <button
                                    className="w-64 py-5 bg-white text-red-500 text-2xl font-bold rounded-full shadow-lg hover:shadow-red-200/50 hover:shadow-2xl transition-all cursor-not-allowed"
                                >
                                    No 💔
                                </button>
                                {noCount > 0 && (
                                    <motion.span
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={noCount}
                                        className="mt-2 text-pink-500 font-bold text-sm whitespace-nowrap bg-white/80 backdrop-blur-sm px-3 py-1 rounded-lg pointer-events-none"
                                    >
                                        {NO_PHRASES[Math.min(noCount, NO_PHRASES.length - 1)]}
                                    </motion.span>
                                )}
                            </motion.div>

                            {/* Mobile No Button Container */}
                            <motion.div
                                animate={noPosition}
                                onClick={() => handleNoInteraction('click')}
                                className="md:hidden flex flex-col items-center mt-4"
                                style={{ position: noCount > 0 ? 'absolute' : 'relative', zIndex: 10 }}
                            >
                                <button
                                    className="w-64 py-5 bg-white text-red-500 text-2xl font-bold rounded-full shadow-lg hover:shadow-red-200/50"
                                >
                                    No 💔
                                </button>
                                {noCount > 0 && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        key={noCount}
                                        className="mt-2 text-pink-500 font-bold text-xs whitespace-nowrap bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg pointer-events-none"
                                    >
                                        {NO_PHRASES[Math.min(noCount, NO_PHRASES.length - 1)]}
                                    </motion.span>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => {
                            setShowModal(false)
                            setNoCount(0)
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            className="bg-white p-8 rounded-3xl max-w-sm text-center shadow-2xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-bold text-pink-600 mb-4">Nice try... 😏</h3>
                            <p className="text-gray-700 mb-6">{CONFIG.messages.proposal.no}</p>
                            <button
                                onClick={() => {
                                    setShowModal(false)
                                    setNoCount(0)
                                }}
                                className="px-6 py-2 bg-pink-500 text-white rounded-full font-bold hover:bg-pink-600"
                            >
                                Okay, I'll say YES!
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
