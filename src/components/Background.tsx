import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const FloatingHeart = ({ delay }: { delay: number }) => {
    const randomX = Math.random() * 100
    const size = Math.random() * 20 + 10
    const duration = Math.random() * 10 + 10

    return (
        <motion.div
            initial={{ y: "110vh", x: `${randomX}vw`, opacity: 0, scale: 0 }}
            animate={{
                y: "-10vh",
                opacity: [0, 1, 1, 0],
                scale: [0, 1, 0.5],
                rotate: [0, 180, 360],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                delay: delay,
                ease: "linear",
            }}
            className="absolute text-pink-300 pointer-events-none blur-[1px]"
            style={{ fontSize: size }}
        >
            ❤
        </motion.div>
    )
}

export const Background = () => {
    const [hearts, setHearts] = useState<number[]>([])

    useEffect(() => {
        // Generate fixed set of hearts to avoid re-renders or hydration mismatches if possible, 
        // but random is fine for client-only.
        const count = 20
        setHearts(Array.from({ length: count }, (_, i) => i))
    }, [])

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-red-50">
            <div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-20 mix-blend-overlay"></div>
            {hearts.map((i) => (
                <FloatingHeart key={i} delay={Math.random() * 20} />
            ))}
        </div>
    )
}
