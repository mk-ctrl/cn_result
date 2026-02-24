import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { selectedStudents } from './data'

// ── Confetti ──
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

// ── Typing Dots ──
function TypingDots() {
  return (
    <span className="inline-flex gap-1 ml-2">
      {[0, 1, 2].map(i => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ backgroundColor: '#22d3ee' }}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  )
}

// ── Stat Box ──
function StatBox({ label, value }) {
  return (
    <div className="text-center">
      <div className="text-2xl sm:text-3xl font-bold" style={{ color: '#f1f5f9' }}>{value}</div>
      <div className="text-xs mt-1 uppercase tracking-wider" style={{ color: '#64748b' }}>{label}</div>
    </div>
  )
}

export default function App() {
  const [regNumber, setRegNumber] = useState('')
  const [phase, setPhase] = useState('idle')
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
      <header className="sticky top-0 z-30 glass" style={{ borderBottom: '1px solid rgba(99,148,255,0.08)' }}>
        <div className="max-w-2xl mx-auto px-5 py-3 flex items-center justify-between">
          <span className="font-bold tracking-tight text-sm sm:text-base" style={{ color: '#818cf8' }}>
            Coding Ninjas
          </span>
          <span className="text-xs tracking-wider uppercase" style={{ color: '#64748b', fontSize: '10px' }}>
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
            <span style={{
              background: 'linear-gradient(to right, #818cf8, #22d3ee, #6366f1)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              Selection Results
            </span>
          </h1>
          <p className="mt-3 text-sm sm:text-base leading-relaxed max-w-md mx-auto" style={{ color: '#94a3b8' }}>
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
          <div className="w-px self-stretch" style={{ backgroundColor: 'rgba(99,148,255,0.08)' }} />
          <StatBox label="Selected" value="65" />
          <div className="w-px self-stretch" style={{ backgroundColor: 'rgba(99,148,255,0.08)' }} />
          <StatBox label="Accept Rate" value="33.33%" />
        </motion.div>

        {/* Input Card */}
        <AnimatePresence>
          {(phase === 'idle' || phase === 'loading') && (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="glass rounded-2xl p-6"
                style={{ border: '1.5px solid rgba(99,148,255,0.15)' }}>
                <label className="block text-xs font-medium mb-2 tracking-wide uppercase"
                  style={{ color: '#94a3b8' }}>
                  Registration Number
                </label>
                <input
                  ref={inputRef}
                  type="text"
                  value={regNumber}
                  onChange={(e) => setRegNumber(e.target.value)}
                  placeholder="e.g. 281001"
                  disabled={phase === 'loading'}
                  style={{
                    width: '100%',
                    background: '#0a0e1a',
                    border: '1.5px solid rgba(99,148,255,0.15)',
                    borderRadius: '12px',
                    padding: '14px 16px',
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: '1.1rem',
                    color: '#f1f5f9',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(99,148,255,0.4)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.15)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(99,148,255,0.15)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
                {phase === 'idle' ? (
                  <button
                    type="submit"
                    className="btn-shimmer mt-4 w-full rounded-xl font-semibold text-sm sm:text-base py-3.5 cursor-pointer"
                    style={{
                      background: '#6366f1',
                      color: '#fff',
                      border: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#818cf8'
                      e.target.style.boxShadow = '0 4px 14px rgba(99,102,241,0.3)'
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#6366f1'
                      e.target.style.boxShadow = 'none'
                    }}
                  >
                    Check My Status
                  </button>
                ) : (
                  <div className="mt-4 text-center py-3.5 text-sm flex items-center justify-center"
                    style={{ color: '#94a3b8' }}>
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
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.2)' }}
              >
                <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#34d399' }} />
                <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#34d399' }}>
                  Access Granted
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl sm:text-2xl font-bold mb-2"
                style={{ color: '#f1f5f9' }}
              >
                Welcome to Coding Ninjas 2026
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm leading-relaxed mb-6"
                style={{ color: '#94a3b8' }}
              >
                Registration{' '}
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: '#22d3ee' }}>
                  {regNumber.toUpperCase()}
                </span>{' '}
                confirmed. You are among the <span style={{ fontWeight: 600, color: '#f1f5f9' }}>65 selected members</span>.
              </motion.p>

              {/* Divider */}
              <div className="mb-6"
                style={{
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, rgba(99,148,255,0.35), transparent)'
                }} />

              {/* WhatsApp CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <p className="uppercase mb-3"
                  style={{ fontSize: '10px', fontWeight: 600, color: '#64748b', letterSpacing: '0.15em' }}>
                  Next Step
                </p>
                <a
                  href="https://chat.whatsapp.com/FcaSR3tRoIc8Nbq6hhG0p8?mode=gi_t"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-shimmer inline-flex items-center gap-2 w-full justify-center
                    rounded-xl font-semibold text-sm sm:text-base py-3.5 no-underline"
                  style={{
                    background: '#6366f1',
                    color: '#fff',
                    border: 'none',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#818cf8'
                    e.currentTarget.style.boxShadow = '0 4px 14px rgba(99,102,241,0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#6366f1'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
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
                <p className="text-xs mt-3 leading-relaxed" style={{ color: '#64748b' }}>
                  Includes orientation details, first tasks, senior contacts, and community updates.
                  <br />
                  <span style={{ color: '#94a3b8', fontWeight: 500 }}>Link active for 72 hours.</span>
                </p>
              </motion.div>

              <button
                onClick={resetForm}
                className="mt-5 text-xs cursor-pointer"
                style={{ background: 'transparent', border: 'none', color: '#64748b', transition: 'color 0.2s' }}
                onMouseEnter={(e) => e.target.style.color = '#818cf8'}
                onMouseLeave={(e) => e.target.style.color = '#64748b'}
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
              className="glass rounded-2xl p-6 sm:p-8 text-center"
              style={{ border: '1px solid rgba(248,113,113,0.1)' }}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', bounce: 0.4 }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5"
                style={{ background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.15)' }}
              >
                <span className="w-2 h-2 rounded-full" style={{ background: '#f87171' }} />
                <span className="text-xs font-semibold tracking-wide uppercase" style={{ color: '#f87171' }}>
                  Not Selected
                </span>
              </motion.div>

              <h2 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: '#f1f5f9' }}>
                Not Selected This Cycle
              </h2>
              <p className="text-sm leading-relaxed max-w-sm mx-auto" style={{ color: '#94a3b8' }}>
                Your registration was not selected this time. Thank you for participating —
                keep building your skills and come back stronger in the next cycle.
              </p>

              <button
                onClick={resetForm}
                className="mt-6 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-medium cursor-pointer"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(99,148,255,0.08)',
                  color: '#94a3b8',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)'
                  e.currentTarget.style.color = '#818cf8'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(99,148,255,0.08)'
                  e.currentTarget.style.color = '#94a3b8'
                }}
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
          className="text-center leading-relaxed"
          style={{ fontSize: '11px', color: '#64748b' }}
        >
          Results are confidential. No public list is published.
        </motion.p>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 inset-x-0 z-10 text-center py-3"
        style={{ fontSize: '10px', color: 'rgba(100,116,139,0.5)' }}>
        Portal closes in 48 hours · © Coding Ninjas Trichy 2026
      </footer>
    </div>
  )
}
