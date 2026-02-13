import { Music, Music2 } from 'lucide-react'
import { useAudio } from '../hooks/useAudio'
import { CONFIG } from '../constants/config'
import { useState } from 'react'

export const MusicPlayer = () => {
    const { playing, toggle } = useAudio(CONFIG.music.background)
    const [hover, setHover] = useState(false)

    return (
        <button
            onClick={toggle}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-white/90 backdrop-blur-md rounded-full shadow-xl border border-pink-200 text-pink-600 hover:scale-105 transition-all duration-300 group"
        >
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${playing || hover ? 'max-w-xs opacity-100' : 'max-w-0 opacity-0'}`}>
                <span className="font-medium text-sm whitespace-nowrap pr-1">
                    {CONFIG.music.title} 🎵
                </span>
            </div>

            <div className="relative">
                {playing ? (
                    <Music2 className="w-6 h-6 animate-[spin_3s_linear_infinite]" />
                ) : (
                    <Music className="w-6 h-6 opacity-50" />
                )}
            </div>
        </button>
    )
}
