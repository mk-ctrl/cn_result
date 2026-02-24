import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { selectedStudents } from './data'

// ── Confetti Particle Component ──
function Confetti({ count = 60 }) {
  const colors = ['#6366f1', '#818cf8', '#22d3ee', '#34d399', '#f1f5f9', '#a78bfa']
  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {Array.from({ length: count }).map((_, i) => {
        const left = Math.random() * 100
        const delay = Math.random() * 0.8
        const size = 4 + Math.random() * 6
        const duration = 2 + Math.random() * 2
        const color = colors[Math.floor(Math.random() * colors.length)]
        const rotate = Math.random() * 720 - 360
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: 0, opacity: 1, rotate: 0 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 900,
              x: (Math.random() - 0.5) * 200,
              opacity: 0,
              rotate,
            }}
            transition={{ duration, delay, ease: 'easeIn' }}
            style={{
              position: 'absolute',
              left: `${left}%`,
              top: 0,
              width: size,
              height: size,
              borderRadius: Math.random() > 0.5 ? '50%' : '2px',
              background: color,
            }}
          />
        )
      })}
    </div>
  )
}

// ── Typing Indicator ──
function TypingDots() {
  return (
    <span className="inline-flex gap-1 ml-2">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-cyan-400"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  )
}

// ── Stat Counter ──
function StatBox({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-bold text-text">{value}</div>
      <div className="text-xs text-text-muted mt-1 uppercase tracking-wider">{label}</div>
    </div>
  )
}

export default function App() {
  const [regNumber, setRegNumber] = useState('')
  const [phase, setPhase] = useState('idle') // idle | loading | granted | denied
  const [showConfetti, setShowConfetti] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    if (phase === 'idle') inputRef.current?.focus()
  }, [phase])

  function handleSubmit(e) {
    e?.preventDefault()
    const val = regNumber.trim().toUpperCase()
    if (!val || phase === 'loading') return

    setPhase('loading')
    setTimeout(() => {
      if (selectedStudents.has(val)) {
        setPhase('granted')
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 4000)
      } else {
        setPhase('denied')
      }
    }, 1500)
  }

  function resetForm() {
    setRegNumber('')
    setPhase('idle')
    setShowConfetti(false)
  }

  return (
    <div className="relative min-h-screen grid-pattern">
      {/* Background orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Confetti */}
      <AnimatePresence>{showConfetti && <Confetti />}</AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-border">
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <span className="font-bold text-accent-light tracking-tight text-sm sm:text-base">
            Coding Ninjas
          </span>
          <span className="text-[10px] sm:text-xs text-text-muted tracking-wider uppercase">
            Selection 2026
          </span>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 max-w-lg mx-auto px-5 pt-10 pb-24 sm:pt-16 flex flex-col gap-8">

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            <span className="bg-gradient-to-r from-accent-light via-cyan to-accent bg-clip-text text-transparent">
              Selection Results
            </span>
          </h1>
          <p className="text-text-secondary mt-3 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Enter your registration number below to privately check if you've been
            selected for Coding Ninjas 2026.
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass rounded-2xl p-5 flex justify-around"
        >
          <StatBox label="Applied" value="195" />
          <div className="w-px bg-border self-stretch" />
          <StatBox label="Selected" value="65" />
          <div className="w-px bg-border self-stretch" />
          <StatBox label="Accept Rate" value="33.33%" />
        </motion.div>

        {/* Input Card */}
        <AnimatePresence mode="wait">
          {(phase === 'idle' || phase === 'loading') && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, delay: 0.25 }}
            >
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 gradient-border">
                <label className="block text-xs font-medium text-text-secondary mb-2 tracking-wide uppercase">
                  Registration Number
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="e.g. 281001"
                  disabled={phase === 'loading'}
                  className="w-full rounded-xl bg-bg border border-border px-4 py-3.5
                    text-base sm:text-lg font-mono text-text tracking-widest uppercase
                    placeholder:text-text-muted placeholder:text-sm placeholder:tracking-normal placeholder:normal-case
                    focus:outline-none focus:border-border-focus focus:ring-2 focus:ring-accent/20
                    transition-all duration-200 disabled:opacity-50"
                />
                {phase === 'idle' ? (
                  <button
                    type="submit"
                    className="btn-shimmer mt-4 w-full rounded-xl bg-accent hover:bg-accent-light
                      text-white font-semibold text-sm sm:text-base py-3.5
                      transition-all duration-200 hover:shadow-lg hover:shadow-accent/25
                      active:scale-[0.98] cursor-pointer"
                  >
                    Check My Status
                  </button>
                ) : (
                  <div className="mt-4 text-center py-3.5 text-text-secondary text-sm flex items-center justify-center">
                    Verifying your registration <TypingDots />
                  </div>
                )}
              </form>
            </motion.div>
          )}

          {/* ── ACCESS GRANTED ── */}
          {phase === 'granted' && (
            <motion.div
              key="granted"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: 'spring', bounce: 0.3 }}
              className="glass rounded-2xl p-6 sm:p-8 text-center"
              style={{ animation: 'glow-pulse 3s ease-in-out infinite' }}
            >
              {/* Badge */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', bounce: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                  bg-green-glow border border-green/20 mb-5"
              >
                <span className="w-2 h-2 rounded-full bg-green animate-pulse" />
                <span className="text-green text-xs font-semibold tracking-wide uppercase">
                  Access Granted
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl font-bold text-text mb-2"
              >
                Welcome to Coding Ninjas 2026
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-text-secondary text-sm leading-relaxed mb-6"
              >
                Registration{' '}
                <span className="font-mono font-semibold text-cyan">{regNumber.toUpperCase()}</span>{' '}
                confirmed. You are among the <span className="font-semibold text-text">65 selected members</span>.
              </motion.p>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-border-focus to-transparent mb-6" />

              {/* WhatsApp CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="text-[10px] font-semibold text-text-muted uppercase tracking-[0.15em] mb-3">
                  Next Step
                </p>
                <a
                  href="https://chat.whatsapp.com/FcaSR3tRoIc8Nbq6hhG0p8?mode=gi_t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shimmer inline-flex items-center gap-2 w-full justify-center
                    rounded-xl bg-accent hover:bg-accent-light text-white font-semibold
                    text-sm sm:text-base py-3.5 transition-all duration-200
                    hover:shadow-lg hover:shadow-accent/25 active:scale-[0.98]
                    no-underline"
                >
                  Enter WhatsApp Group
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="text-lg"
                  >
                    →
                  </motion.span>
                </a>
                <p className="text-text-muted text-xs mt-3 leading-relaxed">
                  Includes orientation details, first tasks, senior contacts, and community updates.
                  <br />
                  <span className="text-text-secondary font-medium">Link active for 72 hours.</span>
                </p>
              </motion.div>

              <button
                onClick={resetForm}
                className="mt-5 text-xs text-text-muted hover:text-accent-light transition-colors cursor-pointer bg-transparent border-none"
              >
                ← Check another number
              </button>
            </motion.div>
          )}

          {/* ── ACCESS DENIED ── */}
          {phase === 'denied' && (
            <motion.div
              key="denied"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="glass rounded-2xl p-6 sm:p-8 text-center border border-red/10"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', bounce: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                  bg-red-glow border border-red/15 mb-5"
              >
                <span className="w-2 h-2 rounded-full bg-red" />
                <span className="text-red text-xs font-semibold tracking-wide uppercase">
                  Not Selected
                </span>
              </motion.div>

              <h2 className="text-xl sm:text-2xl font-bold text-text mb-3">
                Not Selected This Cycle
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed max-w-sm mx-auto">
                Your registration was not selected this time. Thank you for participating —
                keep building your skills and come back stronger in the next cycle.
              </p>

              <button
                onClick={resetForm}
                className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl
                  border border-border text-text-secondary text-sm font-medium
                  hover:border-accent/30 hover:text-accent-light hover:bg-accent/5
                  transition-all duration-200 cursor-pointer bg-transparent"
              >
                ← Try Again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Info note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-[11px] text-text-muted leading-relaxed"
        >
          Results are confidential. No public list is published.
        </motion.p>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 inset-x-0 z-10 text-center py-3 text-[10px] sm:text-xs text-text-muted/50">
        Portal closes in 48 hours · © Coding Ninjas Trichy 2026
      </footer>
    </div>
  )
}
