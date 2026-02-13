import { useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useScroll, useTransform as useScrollTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ArrowDown, Heart, Play, Pause, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'
import { CONFIG } from '../constants/config'

// Updated data with user's content
const MEMORIES = [
    {
        title: "The Thing I Wasn’t Searching For",
        content: "I don’t think I realised what was missing in my life… until you showed up.\n\nI wasn’t searching.\nWasn’t expecting anything to change.\nWasn’t looking for someone who would quietly become part of my everyday.\n\nBut somehow… you happened.\n\nAnd slowly… naturally…\nYou became the answer to a question I didn’t even know my heart was asking."
    },
    {
        title: "The Way You Love",
        content: "What really pulled me in wasn’t just you… it was how you love.\n\nYou don’t love halfway.\nYou don’t pretend things are fine when they’re not.\nYou speak. You explain. You fight for understanding… you fight for us.\n\nYou made me realise love isn’t just about liking someone…\nIt’s about choosing them… again and again… even when it’s easier not to.\n\nAnd you do that so effortlessly."
    },
    {
        title: "The Peace I Didn’t Know I Needed",
        content: "Being with you made me understand something I never really thought about before.\n\nI didn’t just want excitement…\nI needed peace too.\n\nAnd somehow… you give me both.\n\nWith you, things feel honest.\nWith you, things feel simple.\nWith you, I don’t feel like I have to guess emotions or decode meanings…\n\nI just get to be real.\nAnd you make that feel safe."
    },
    {
        title: "Your Heart, Even When It’s Guarded",
        content: "One thing about you that always stays with me… is how deeply you care.\n\nEven when you’re hurt.\nEven when you’re explaining why I stressed you.\nEven when you’re standing firmly on how you feel.\n\nYou still find space to check on me.\n\nLike your heart refuses to stop being kind…\nEven when it has every reason to step back.\n\nAnd honestly…\nThat quiet kindness is one of the things that made me realise how rare you are."
    },
    {
        title: "Soft… But Unshakeable",
        content: "You’re soft… but not fragile.\nGentle… but never weak.\n\nYou stand on your principles like they’re stitched into who you are.\nYou speak when something hurts you.\nAnd instead of giving up on us… you stay and choose to work through things with me.\n\nThat kind of strength doesn’t shout.\nIt shows up quietly… consistently… beautifully.\n\nAnd I didn’t know how much I admired that… until I saw it in you."
    },
    {
        title: "The Answer I Found In You",
        content: "You didn’t just find a place in my life…\n\nYou became one of the most important parts of it.\n\nYou’re the person I want to tell things to first.\nThe person whose opinion stays in my head.\nThe person who can change an ordinary day… just by being in it.\n\nI thought I understood what I wanted before I met you…\nBut now I realise… I was only guessing.\n\nBecause somewhere between our conversations… our moments… our little everything…\n\nYou became something I never planned for…\nBut now can’t imagine my life without."
    }
]

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 })
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 })

    const rotateX = useTransform(mouseY, [-0.5, 0.5], ["5deg", "-5deg"])
    const rotateY = useTransform(mouseX, [-0.5, 0.5], ["-5deg", "5deg"])

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseXFromCenter = e.clientX - rect.left - width / 2
        const mouseYFromCenter = e.clientY - rect.top - height / 2
        x.set(mouseXFromCenter / width)
        y.set(mouseYFromCenter / height)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={cn("relative transition-all duration-200 ease-out", className)}
        >
            <div style={{ transform: "translateZ(30px)" }}>
                {children}
            </div>
        </motion.div>
    )
}

const StoryCard = ({ memory, index }: { memory: typeof MEMORIES[0]; index: number }) => {
    const isEven = index % 2 === 0

    return (
        <motion.div
            initial={{ opacity: 0, x: isEven ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={cn(
                "flex w-full mb-16 items-center justify-between",
                isEven ? "flex-row" : "flex-row-reverse"
            )}
        >
            {/* Card Content */}
            <div className="w-full md:w-5/12">
                <TiltCard className="bg-white/40 backdrop-blur-md p-8 rounded-3xl shadow-xl border border-white/50 hover:shadow-2xl transition-all duration-300">
                    <h3 className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-100 text-pink-600 text-lg font-heading font-bold mb-4">
                        <motion.span
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                        >
                            <Heart className="w-4 h-4 fill-current" />
                        </motion.span>
                        {memory.title}
                    </h3>
                    <p className="text-lg text-gray-700 leading-relaxed font-sans whitespace-pre-line">{memory.content}</p>
                </TiltCard>
            </div>

            {/* Timeline Dot */}
            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    className="w-4 h-4 bg-pink-500 rounded-full border-4 border-white shadow-lg z-10"
                />
            </div>

            {/* Empty space for the other side */}
            <div className="hidden md:block w-5/12" />
        </motion.div>
    )
}

const VideoSection = () => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isMuted, setIsMuted] = useState(false)
    const [progress, setProgress] = useState(0)

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause()
            } else {
                videoRef.current.play()
            }
            setIsPlaying(!isPlaying)
        }
    }

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted
            setIsMuted(!isMuted)
        }
    }

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            const currentProgress = (videoRef.current.currentTime / videoRef.current.duration) * 100
            setProgress(currentProgress || 0)
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = parseFloat(e.target.value)
        setProgress(newProgress)
        if (videoRef.current) {
            const newTime = (newProgress / 100) * videoRef.current.duration
            videoRef.current.currentTime = newTime
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="w-full max-w-4xl mx-auto my-32 px-4"
        >
            <h3 className="text-3xl font-heading font-bold text-pink-700 text-center mb-8">My Muse</h3>
            <div className="relative w-full max-w-3xl mx-auto aspect-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 group bg-black">
                <video
                    ref={videoRef}
                    onClick={togglePlay}
                    onTimeUpdate={handleTimeUpdate}
                    className="w-full h-full object-cover cursor-pointer"
                    loop
                    playsInline
                >
                    <source src="/assets/her-edit.mp4" type="video/mp4" />
                    Your browser does not support the video tag.
                </video>

                {/* Controls Bar (Bottom) */}
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col gap-4">
                    {/* Seek Bar */}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress}
                        onChange={handleSeek}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-pink-500 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:hover:scale-125 [&::-webkit-slider-thumb]:transition-transform"
                    />

                    <div className="flex items-center justify-center gap-6">
                        <button
                            onClick={(e) => { e.stopPropagation(); togglePlay(); }}
                            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-all text-white hover:scale-110"
                        >
                            {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                            className="p-3 bg-white/20 backdrop-blur-md rounded-full hover:bg-white/40 transition-all text-white hover:scale-110"
                        >
                            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                {/* Big Center Play Button (Only visible when paused) */}
                {!isPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="p-6 bg-black/30 backdrop-blur-md rounded-full shadow-lg border border-white/20">
                            <Play className="w-12 h-12 text-white ml-2 opacity-90" />
                        </div>
                    </div>
                )}
            </div>
            <p className="text-center text-gray-600 mt-4 italic">Just watching you be you...</p>
        </motion.div>
    )
}

const HeroWithScroll = () => {
    const { scrollY } = useScroll();
    const opacity = useScrollTransform(scrollY, [0, 300], [1, 0]);
    const scale = useScrollTransform(scrollY, [0, 300], [1, 0.9]);

    return (
        <motion.div
            style={{ opacity, scale }}
            className="h-[90vh] flex flex-col items-center justify-center text-center relative z-10"
        >
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="mb-6"
            >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/30 backdrop-blur-sm border border-white/40 text-pink-700 font-semibold mb-6">
                    <Sparkles className="w-4 h-4 fill-current" />
                    <span>Dear {CONFIG.herName}</span>
                    <Sparkles className="w-4 h-4 fill-current" />
                </div>
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-5xl md:text-7xl lg:text-8xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-sm leading-[1.1]"
            >
                Somewhere Along<br />The Way...
            </motion.h1>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="text-xl md:text-3xl text-gray-700 font-medium mt-6 max-w-2xl mx-auto"
            >
                You became my favourite story.
            </motion.p>

            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, delay: 1.5 }}
                className="absolute bottom-20"
            >
                <p className="text-sm text-gray-500 mb-2 font-medium tracking-widest uppercase">Start Reading</p>
                <ArrowDown className="text-pink-400 w-6 h-6 mx-auto" />
            </motion.div>
        </motion.div>
    )
}

export const Story = () => {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-black/80 text-white relative overflow-hidden font-sans pb-20 md:pb-0">
            {/* Timeline Line (starts after Hero) */}
            <div className="absolute left-1/2 top-[100vh] bottom-40 w-1 bg-gradient-to-b from-transparent via-pink-200 to-transparent transform -translate-x-1/2 hidden md:block" />

            <HeroWithScroll />

            <div className="relative max-w-6xl mx-auto">
                {MEMORIES.map((memory, index) => (
                    <StoryCard key={index} memory={memory} index={index} />
                ))}
            </div>

            <VideoSection />

            <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-20 mb-20"
            >
                <p className="text-2xl font-heading font-medium text-gray-700 mb-8 max-w-2xl mx-auto">
                    And honestly... I don't want to imagine a Valentine without you in it.
                </p>
                <button
                    onClick={() => navigate('/proposal')}
                    className="px-8 py-4 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-full font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-110 transition-all"
                >
                    Continue ❤️
                </button>
            </motion.div>
        </div>
    )
}
