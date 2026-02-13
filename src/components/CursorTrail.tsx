import { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export const CursorTrail = () => {
    const [points, setPoints] = useState<{ x: number, y: number, id: number }[]>([])
    const cursorRef = useRef<HTMLImageElement>(null)
    const [isVisible, setIsVisible] = useState(false)
    const [isPointer, setIsPointer] = useState(false)

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e

            // Direct DOM manipulation for performance (no re-renders)
            if (cursorRef.current) {
                cursorRef.current.style.left = `${clientX}px`
                cursorRef.current.style.top = `${clientY}px`
            }

            // Batch point updates or verify if strict frame updates are needed? 
            // Keeping state for trail for now as it needs rendering multiple divs, 
            // but we can throttle it if needed. For now, let's keep trail logic but optimized cursor image.
            const newPoint = { x: clientX, y: clientY, id: Date.now() }
            setPoints(prev => [...prev.slice(-10), newPoint]) // Reduced trail length for perf

            setIsVisible(true)

            // Check if hovering over clickable element
            const target = e.target as HTMLElement
            const computedStyle = window.getComputedStyle(target)
            const isClickable = computedStyle.cursor === 'pointer' || target.tagName === 'BUTTON' || target.tagName === 'A'
            setIsPointer(isClickable)
        }

        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseEnter = () => setIsVisible(true)

        window.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseleave', handleMouseLeave)
        document.addEventListener('mouseenter', handleMouseEnter)

        return () => {
            window.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseleave', handleMouseLeave)
            document.removeEventListener('mouseenter', handleMouseEnter)
        }
    }, [])

    return (
        <div style={{ zIndex: 9999 }} className={`pointer-events-none fixed inset-0 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* Main Cursor Image */}
            <img
                ref={cursorRef}
                src={isPointer ? "/assets/pointer.png" : "/assets/cursor.png"}
                alt="cursor"
                className="absolute h-6 w-auto object-contain pointer-events-none drop-shadow-lg transition-transform duration-200 will-change-transform" // Reduced size to h-6 (24px)
                style={{
                    // Initial position (will be updated by ref)
                    left: 0,
                    top: 0,
                    transform: `translate(-50%, -50%) scale(${isPointer ? 1.1 : 1})`
                }}
            />

            <AnimatePresence>
                {points.map((point) => (
                    <motion.div
                        key={point.id}
                        initial={{ opacity: 0.8, scale: 0.8 }}
                        animate={{ opacity: 0, scale: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }} // Shorter duration
                        className="absolute w-2 h-2 bg-pink-400/40 rounded-full blur-[0.5px]" // Smaller trail particles
                        style={{ left: point.x, top: point.y, transform: 'translate(-50%, -50%)' }}
                    />
                ))}
            </AnimatePresence>
        </div>
    )
}
