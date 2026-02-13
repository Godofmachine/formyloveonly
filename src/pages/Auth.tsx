import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CONFIG } from '../constants/config'
import { cn } from '../lib/utils'
import { Lock, Unlock, Heart, Hand, Loader2 } from 'lucide-react'

// Obfuscated keys for local storage
const AUTH_TOKEN_KEY = "v8s2_k9p_token"
const AUTH_TOKEN_VALUE = "c7a8b9d0e1f2g3h4i5j6k7l8m9n0o1p2"

// Updated questions list
const QUESTIONS = [
    { id: 'firstName', label: "First things first, what is your first name?", placeholder: "Your first name..." },
    { id: 'middleName', label: "And your middle name?", placeholder: "Your middle name..." },
    { id: 'lastName', label: "Finally, your last name?", placeholder: "Your last name..." },
    { id: 'favoriteColor', label: "What is my favourite colour?", placeholder: "Take a guess..." },
    { id: 'footballTeam', label: "What is our favourite football team?", placeholder: "The best club in the world... (No matter what)" },
    { id: 'manager', label: "Nice try! Who is the current manager of that team?", placeholder: "The gaffer..." },
    { id: 'oriki', label: "What is my Oriki?", placeholder: "The name that sounds like royalty..." },
    { id: 'favoriteMusician', label: "Who is my favourite musician?", placeholder: "The one I listen to all day..." },
    { id: 'favoriteFood', label: "Which meal of yours do I love the most?", placeholder: "That special dish you make..." },
    { id: 'anniversaryDate', label: "When is our anniversary?", placeholder: "", type: 'date' },
    { id: 'jciCreed', label: "Complete this Creed:", placeholder: "", type: 'creed' },
    { id: 'sayLove', label: "Say you love me:", placeholder: "Three magic words..." },
    { id: 'loveNote', label: "In 3 sentences, tell me how much you love me:", placeholder: "Pour your heart out...", type: 'textarea' },
]

export const Auth = () => {
    const navigate = useNavigate()
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
    const [answer, setAnswer] = useState('')
    const [creedInputs, setCreedInputs] = useState<string[]>(Array(11).fill(''))
    const [error, setError] = useState('')
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isVerifying, setIsVerifying] = useState(false)
    const [showImposterCheck, setShowImposterCheck] = useState(true)
    const [isShaking, setIsShaking] = useState(false)

    const currentQuestion = QUESTIONS[currentQuestionIndex]
    const progress = ((currentQuestionIndex) / QUESTIONS.length) * 100

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (currentQuestion.id === 'jciCreed') {
            // Validate Creed
            const isCorrect = creedInputs.every((input, index) => {
                const encodedInput = btoa(input.toLowerCase().trim())
                return encodedInput === CONFIG.creedAnswers[index]
            })

            if (isCorrect) {
                if (currentQuestionIndex < QUESTIONS.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1)
                    setAnswer('')
                    setError('')
                } else {
                    handleSuccess()
                }
            } else {
                triggerError()
            }
            return
        }

        if (currentQuestion.id === 'loveNote') {
            // Validate Love Note (Length check for ~3 sentences approx 50 chars)
            if (answer.trim().length > 20) {
                // Correct
                if (currentQuestionIndex < QUESTIONS.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1)
                    setAnswer('')
                    setError('')
                } else {
                    handleSuccess()
                }
            } else {
                setError("Is that all? I need at least 3 sentences! 🥺")
                setIsShaking(true)
                setTimeout(() => setIsShaking(false), 500)
            }
            return
        }

        const key = currentQuestion.id as keyof typeof CONFIG.validAnswers
        const validAnswers = CONFIG.validAnswers[key]

        if (validAnswers) {
            const encodedAnswer = btoa(answer.toLowerCase().trim())

            if (validAnswers.includes(encodedAnswer)) {
                // Correct
                if (currentQuestionIndex < QUESTIONS.length - 1) {
                    setCurrentQuestionIndex(prev => prev + 1)
                    setAnswer('')
                    setError('')
                } else {
                    handleSuccess()
                }
            } else {
                triggerError()
            }
        } else {
            triggerError()
        }
    }

    const triggerError = () => {
        const randomMsg = CONFIG.messages.wrongAnswer[Math.floor(Math.random() * CONFIG.messages.wrongAnswer.length)]
        setError(randomMsg)
        setIsShaking(true)
        setTimeout(() => setIsShaking(false), 500)
    }

    const handleSuccess = () => {
        setIsVerifying(true)
        setTimeout(() => {
            setIsVerifying(false)
            setIsAuthenticated(true)
            localStorage.setItem(AUTH_TOKEN_KEY, AUTH_TOKEN_VALUE)
            setTimeout(() => {
                navigate('/story')
            }, 3000)
        }, 2000)
    }

    const handleCreedChange = (index: number, value: string) => {
        const newInputs = [...creedInputs]
        newInputs[index] = value
        setCreedInputs(newInputs)
        if (error) setError('')
    }

    // ... (Imposter Check and Identity Confirmed render logic remains the same)

    // ... (Imposter Check and Identity Confirmed render logic remains the same)

    if (showImposterCheck) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center z-10 relative">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60 max-w-sm"
                >
                    <div className="bg-red-100 p-4 rounded-full inline-block mb-6">
                        <Hand className="w-12 h-12 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-heading font-bold text-red-500 mb-4">Hold Up! ✋</h2>
                    <p className="text-lg text-gray-700 mb-8 font-medium">
                        First, we have to confirm that this is not an imposter.
                    </p>
                    <button
                        onClick={() => setShowImposterCheck(false)}
                        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold shadow-lg transform active:scale-95 transition-all"
                    >
                        It's really me, the love of your life! 😇
                    </button>
                </motion.div>
            </div>
        )
    }

    if (isVerifying) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center z-10 relative">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/60"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="mb-4"
                    >
                        <Loader2 className="w-12 h-12 text-pink-500 mx-auto" />
                    </motion.div>
                    <p className="text-xl font-medium text-pink-600 animate-pulse">
                        Verifying Soulmate Status...
                    </p>
                </motion.div>
            </div>
        )
    }

    if (isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center z-10 relative">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white/40 backdrop-blur-xl p-12 rounded-3xl shadow-2xl border border-white/60"
                >
                    <div className="mb-6 relative h-24 w-24 mx-auto">
                        <AnimatePresence mode='wait'>
                            <motion.div
                                key="locked"
                                initial={{ opacity: 1, scale: 1 }}
                                animate={{ opacity: 0, scale: 0, rotate: -10 }}
                                transition={{ duration: 0.4, delay: 0.2 }}
                                className="absolute inset-0"
                            >
                                <Lock className="w-24 h-24 text-pink-500" />
                            </motion.div>

                            <motion.div
                                key="unlocked"
                                initial={{ opacity: 0, scale: 0, rotate: 10 }}
                                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                transition={{ duration: 0.4, delay: 0.6, type: "spring" }}
                                className="absolute inset-0"
                            >
                                <Unlock className="w-24 h-24 text-green-500" />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    <h2 className="text-3xl font-heading font-bold text-pink-600 mb-4">Identity Confirmed</h2>
                    <p className="text-xl text-gray-700">Access granted to my heart.</p>
                    <motion.div
                        animate={{
                            scale: [1, 1.3, 1],
                            rotate: [0, 10, -10, 0]
                        }}
                        transition={{
                            repeat: Infinity,
                            duration: 0.8,
                            ease: "easeInOut"
                        }}
                        className="mt-8"
                    >
                        <Heart className="w-20 h-20 text-red-500 fill-red-500 mx-auto drop-shadow-xl" />
                    </motion.div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                    opacity: 1,
                    y: 0,
                    x: isShaking ? [-10, 10, -10, 10, 0] : 0,
                }}
                transition={{ duration: 0.4 }}
                className={cn(
                    "bg-white/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl w-full max-w-md border relative overflow-hidden transition-colors duration-300",
                    isShaking ? "border-red-500 bg-red-50/50" : "border-white/60",
                    currentQuestion.type === 'creed' ? "max-w-2xl" : "max-w-md"
                )}
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gray-200">
                    <motion.div
                        className="h-full bg-pink-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ type: "spring", stiffness: 50 }}
                    />
                </div>

                <div className="flex justify-center mb-6 mt-4">
                    <div className={cn("p-3 rounded-full transition-colors duration-300", isShaking ? "bg-red-100" : "bg-pink-100")}>
                        {isShaking ? (
                            <motion.div animate={{ rotate: [0, 15, -15, 0] }} transition={{ duration: 0.5 }}>
                                <Lock className="w-8 h-8 text-red-500" />
                            </motion.div>
                        ) : (
                            <Lock className="w-8 h-8 text-pink-500" />
                        )}
                    </div>
                </div>

                <h2 className={cn("text-2xl font-bold text-center mb-2 transition-colors", isShaking ? "text-red-500" : "text-pink-600")}>
                    {isShaking ? "Access Denied!" : "Love Security Check"}
                </h2>
                <p className="text-center text-gray-600 mb-8 text-sm">Girlfriend Authenticity Level: {Math.round(progress)}%</p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <AnimatePresence mode='wait'>
                        <motion.div
                            key={currentQuestion.id}
                            initial={{ x: 20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <label className="block text-gray-700 font-medium mb-2 text-center">{currentQuestion.label}</label>

                            {currentQuestion.type === 'creed' ? (
                                <div className="text-gray-800 text-base leading-loose font-medium bg-white/50 p-6 rounded-xl border border-gray-200 shadow-inner">
                                    <p className="mb-2 font-bold text-pink-600">We Believe:</p>
                                    <p>
                                        That <input
                                            value={creedInputs[0]}
                                            onChange={e => handleCreedChange(0, e.target.value)}
                                            className="w-16 px-2 py-1 mx-1 border-b-2 border-pink-300 bg-transparent focus:outline-none focus:border-pink-600 text-center"
                                            placeholder="..."
                                        /> in <input
                                            value={creedInputs[1]}
                                            onChange={e => handleCreedChange(1, e.target.value)}
                                            className="w-12 px-2 py-1 mx-1 border-b-2 border-pink-300 bg-transparent focus:outline-none focus:border-pink-600 text-center"
                                            placeholder="..."
                                        /> gives meaning and purpose to human life;
                                    </p>
                                    <p>
                                        That the <input
                                            value={creedInputs[2]}
                                            onChange={e => handleCreedChange(2, e.target.value)}
                                            className="w-24 px-2 py-1 mx-1 border-b-2 border-pink-300 bg-transparent focus:outline-none focus:border-pink-600 text-center"
                                            placeholder="..."
                                        /> of man transcends the <input
                                            value={creedInputs[3]}
                                            onChange={e => handleCreedChange(3, e.target.value)}
                                            className="w-24 px-2 py-1 mx-1 border-b-2 border-pink-300 bg-transparent focus:outline-none focus:border-pink-600 text-center"
                                            placeholder="..."
                                        /> of nations;
                                    </p>
                                    <p>
                                        That <input
                                            value={creedInputs[4]}
                                            onChange={e => handleCreedChange(4, e.target.value)}
                                            className="w-32 px-2 py-1 mx-1 border-b-2 border-pink-300 bg-transparent focus:outline-none focus:border-pink-600 text-center"
                                            placeholder="..."
                                        /> can best be won by free men through <input
                                            value={creedInputs[5]}
                                            onChange={e => handleCreedChange(5, e.target.value)}
                                            className="w-32 px-2 py-1 mx-1 border-b-2 border-pink-300 bg-transparent focus:outline-none focus:border-pink-600 text-center"
                                            placeholder="..."
                                        />;
                                    </p>
                                    <p>
                                        That <input
                                            value={creedInputs[6]}
                                            onChange={e => handleCreedChange(6, e.target.value)}
                                            className="w-24 px-2 py-1 mx-1 border-b-2 border-pink-300 bg-transparent focus:outline-none focus:border-pink-600 text-center"
                                            placeholder="..."
                                        /> should be of laws rather than of <input
                                            value={creedInputs[7]}
                                            onChange={e => handleCreedChange(7, e.target.value)}
                                            className="w-12 px-2 py-1 mx-1 border-b-2 border-pink-300 bg-transparent focus:outline-none focus:border-pink-600 text-center"
                                            placeholder="..."
                                        />;
                                    </p>
                                    <p>
                                        That earth’s great treasure lies in human <input
                                            value={creedInputs[8]}
                                            onChange={e => handleCreedChange(8, e.target.value)}
                                            className="w-24 px-2 py-1 mx-1 border-b-2 border-pink-300 bg-transparent focus:outline-none focus:border-pink-600 text-center"
                                            placeholder="..."
                                        />;
                                    </p>
                                    <p>
                                        And that <input
                                            value={creedInputs[9]}
                                            onChange={e => handleCreedChange(9, e.target.value)}
                                            className="w-20 px-2 py-1 mx-1 border-b-2 border-pink-300 bg-transparent focus:outline-none focus:border-pink-600 text-center"
                                            placeholder="..."
                                        /> to <input
                                            value={creedInputs[10]}
                                            onChange={e => handleCreedChange(10, e.target.value)}
                                            className="w-20 px-2 py-1 mx-1 border-b-2 border-pink-300 bg-transparent focus:outline-none focus:border-pink-600 text-center"
                                            placeholder="..."
                                        /> is the best work of life.
                                    </p>
                                </div>
                            ) : currentQuestion.type === 'textarea' ? (
                                <textarea
                                    value={answer}
                                    onChange={(e) => {
                                        setAnswer(e.target.value)
                                        if (error) setError('')
                                    }}
                                    placeholder={currentQuestion.placeholder}
                                    className={cn(
                                        "w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 bg-white/50 transition-all min-h-[120px]",
                                        error ? "border-red-400 focus:ring-red-400" : "focus:ring-pink-400"
                                    )}
                                    autoFocus
                                />
                            ) : (
                                <input
                                    type={currentQuestion.type || "text"}
                                    value={answer}
                                    onChange={(e) => {
                                        setAnswer(e.target.value)
                                        if (error) setError('')
                                    }}
                                    placeholder={currentQuestion.placeholder}
                                    className={cn(
                                        "w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 bg-white/50 transition-all",
                                        error ? "border-red-400 focus:ring-red-400" : "focus:ring-pink-400"
                                    )}
                                    autoFocus
                                />
                            )}

                            {error && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-red-500 text-sm mt-2 font-medium text-center"
                                >
                                    {error} 🚨
                                </motion.p>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <button
                        type="submit"
                        disabled={isShaking}
                        className={cn(
                            "w-full py-3 text-white rounded-xl font-bold shadow-lg transform active:scale-95 transition-all",
                            isShaking ? "bg-red-500 hover:bg-red-600 cursor-not-allowed" : "bg-pink-500 hover:bg-pink-600"
                        )}
                    >
                        {isShaking ? "Try Again!" : "Verify"}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}
