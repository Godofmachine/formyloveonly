import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Background } from './components/Background'
import { Intro } from './pages/Intro'
import { Auth } from './pages/Auth'
import { Story } from './pages/Story'
import { Proposal } from './pages/Proposal'
import { Success } from './pages/Success'
import { CursorTrail } from './components/CursorTrail'
import { MusicPlayer } from './components/MusicPlayer'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen font-sans text-gray-800 antialiased selection:bg-pink-200 selection:text-pink-900 overflow-hidden cursor-none">
        {/* cursor-none to hide default cursor if using custom one, but maybe just custom trail is enough */}
        <Background />
        <CursorTrail />
        <MusicPlayer />

        <Routes>
          <Route path="/" element={<Navigate to="/intro" replace />} />
          <Route path="/intro" element={<Intro />} />
          <Route path="/auth" element={<Auth />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/story" element={<Story />} />
            <Route path="/proposal" element={<Proposal />} />
            <Route path="/success" element={<Success />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/intro" replace />} />
        </Routes>
      </div>
    </BrowserRouter >
  )
}

export default App
