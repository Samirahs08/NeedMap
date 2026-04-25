import { useState, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  MapPin, Eye, EyeOff, Check, AlertCircle, CheckCircle2,
  X, ArrowLeft,
} from 'lucide-react'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../services/firebase'

/* ─── tiny helpers ─────────────────────────────────────────────────────────── */
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

function passwordStrength(pw) {
  if (!pw) return { level: 0, label: '', color: '' }
  let score = 0
  if (pw.length >= 8)  score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  if (score <= 1) return { level: 1, label: 'Weak',   color: '#ef4444' }
  if (score <= 3) return { level: 2, label: 'Medium', color: '#f59e0b' }
  return              { level: 3, label: 'Strong', color: '#22c55e' }
}

/* ─── reusable input ───────────────────────────────────────────────────────── */
function Field({ id, label, type = 'text', value, onChange, onBlur, error, placeholder, right }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">{label}</label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          className={`w-full px-4 py-3 rounded-xl border text-sm text-slate-800 bg-white
            placeholder:text-slate-400 outline-none transition-all duration-200 pr-${right ? '11' : '4'}
            ${error
              ? 'border-red-400 ring-2 ring-red-100'
              : 'border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-100'
            }`}
        />
        {right && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">{right}</div>
        )}
      </div>
      {error && (
        <p className="flex items-center gap-1 text-xs text-red-500 mt-0.5">
          <AlertCircle className="w-3 h-3 flex-shrink-0" />{error}
        </p>
      )}
    </div>
  )
}

/* ─── password field ───────────────────────────────────────────────────────── */
function PasswordField({ id, label, value, onChange, onBlur, error, placeholder }) {
  const [show, setShow] = useState(false)
  return (
    <Field
      id={id} label={label} type={show ? 'text' : 'password'}
      value={value} onChange={onChange} onBlur={onBlur}
      error={error} placeholder={placeholder}
      right={
        <button type="button" onClick={() => setShow(s => !s)}
          className="text-slate-400 hover:text-slate-600 transition-colors">
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      }
    />
  )
}

/* ─── password strength bar ────────────────────────────────────────────────── */
function StrengthBar({ password }) {
  const { level, label, color } = passwordStrength(password)
  if (!password) return null
  return (
    <div className="mt-1">
      <div className="flex gap-1 mb-1">
        {[1,2,3].map(n => (
          <div key={n} className="h-1 flex-1 rounded-full transition-all duration-300"
               style={{ background: n <= level ? color : '#e2e8f0' }} />
        ))}
      </div>
      <p className="text-xs font-medium" style={{ color }}>
        {label} password
      </p>
    </div>
  )
}

/* ─── toast ────────────────────────────────────────────────────────────────── */
function Toast({ toast, onClose }) {
  if (!toast) return null
  const isError   = toast.type === 'error'
  const isSuccess = toast.type === 'success'
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-start gap-3 px-5 py-4 rounded-2xl shadow-2xl
      max-w-sm animate-fade-up border backdrop-blur-sm
      ${isError   ? 'bg-red-50   border-red-200   text-red-800'   : ''}
      ${isSuccess ? 'bg-green-50 border-green-200 text-green-800' : ''}`}>
      {isError   && <AlertCircle   className="w-5 h-5 text-red-500   flex-shrink-0 mt-0.5" />}
      {isSuccess && <CheckCircle2  className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />}
      <p className="text-sm font-medium leading-relaxed">{toast.message}</p>
      <button onClick={onClose} className="ml-auto text-current opacity-50 hover:opacity-100 transition-opacity">
        <X className="w-4 h-4" />
      </button>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   LOGIN FORM
══════════════════════════════════════════════════════════════════════════════ */
function LoginForm({ onSuccess, onError }) {
  const [form, setForm]     = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.email)                  e.email    = 'Email is required'
    else if (!isValidEmail(form.email)) e.email  = 'Enter a valid email address'
    if (!form.password)               e.password = 'Password is required'
    return e
  }

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, form.email.trim(), form.password)
      onSuccess()
    } catch (err) {
      onError(err.message.replace('Firebase: ', '') || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      <Field
        id="login-email" label="Email Address" type="email"
        value={form.email} onChange={set('email')}
        onBlur={() => {
          if (form.email && !isValidEmail(form.email))
            setErrors(e => ({ ...e, email: 'Enter a valid email address' }))
          else setErrors(e => ({ ...e, email: '' }))
        }}
        error={errors.email} placeholder="you@ngo.org"
      />
      <PasswordField
        id="login-password" label="Password"
        value={form.password} onChange={set('password')}
        onBlur={() => {
          if (!form.password) setErrors(e => ({ ...e, password: 'Password is required' }))
          else setErrors(e => ({ ...e, password: '' }))
        }}
        error={errors.password} placeholder="Enter your password"
      />

      <button
        id="login-submit"
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 
          disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signing in…
          </>
        ) : 'Log In'}
      </button>

      <p className="text-center">
        <a href="#" id="forgot-password-link" className="text-sm text-brand-600 hover:text-brand-700 font-medium transition-colors">
          Forgot Password?
        </a>
      </p>
    </form>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   REGISTER FORM
══════════════════════════════════════════════════════════════════════════════ */
const INIT_REG = {
  fullName: '', ngoName: '', regNumber: '', email: '',
  phone: '', cityState: '', password: '', confirmPassword: '', agreed: false,
}

function RegisterForm({ onSuccess }) {
  const [form, setForm]     = useState(INIT_REG)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [touched, setTouched] = useState({})

  const set = (k) => (e) =>
    setForm(f => ({ ...f, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }))

  const touch = (k) => () => setTouched(t => ({ ...t, [k]: true }))

  const validate = useCallback(() => {
    const e = {}
    if (!form.fullName.trim())        e.fullName      = 'Full name is required'
    if (!form.ngoName.trim())         e.ngoName       = 'NGO name is required'
    if (!form.regNumber.trim())       e.regNumber     = 'Registration number is required'
    if (!form.email)                  e.email         = 'Email is required'
    else if (!isValidEmail(form.email)) e.email       = 'Enter a valid email address'
    if (!form.phone.trim())           e.phone         = 'Phone number is required'
    if (!form.cityState.trim())       e.cityState     = 'City and state is required'
    if (!form.password)               e.password      = 'Password is required'
    else if (form.password.length < 8) e.password     = 'Password must be at least 8 characters'
    if (!form.confirmPassword)        e.confirmPassword = 'Please confirm your password'
    else if (form.confirmPassword !== form.password)
                                      e.confirmPassword = 'Passwords do not match'
    if (!form.agreed)                 e.agreed        = 'You must agree to the Terms of Service'
    return e
  }, [form])

  const handleSubmit = async (ev) => {
    ev.preventDefault()
    const e = validate()
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, form.email.trim(), form.password)
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        fullName: form.fullName,
        ngoName: form.ngoName,
        regNumber: form.regNumber,
        email: form.email,
        phone: form.phone,
        cityState: form.cityState,
        createdAt: new Date().toISOString()
      })
      onSuccess()
    } catch (err) {
      setErrors({ email: err.message.replace('Firebase: ', '') || 'Failed to register' })
    } finally {
      setLoading(false)
    }
  }

  /* live confirm-password error */
  const confirmBlur = () => {
    if (touched.confirmPassword && form.confirmPassword && form.confirmPassword !== form.password)
      setErrors(e => ({ ...e, confirmPassword: 'Passwords do not match' }))
    else setErrors(e => ({ ...e, confirmPassword: '' }))
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {/* Row 1 */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="reg-fullname" label="Full Name" value={form.fullName}
          onChange={set('fullName')} onBlur={touch('fullName')}
          error={errors.fullName} placeholder="Priya Sharma" />
        <Field id="reg-ngoname" label="NGO Name" value={form.ngoName}
          onChange={set('ngoName')} onBlur={touch('ngoName')}
          error={errors.ngoName} placeholder="HelpReach Foundation" />
      </div>

      {/* Row 2 */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="reg-regno" label="NGO Registration Number" value={form.regNumber}
          onChange={set('regNumber')} onBlur={touch('regNumber')}
          error={errors.regNumber} placeholder="MH/NGO/2021/00123" />
        <Field id="reg-email" label="Email Address" type="email" value={form.email}
          onChange={set('email')} onBlur={() => {
            touch('email')()
            if (form.email && !isValidEmail(form.email))
              setErrors(e => ({ ...e, email: 'Enter a valid email address' }))
          }}
          error={errors.email} placeholder="coordinator@ngo.org" />
      </div>

      {/* Row 3 */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field id="reg-phone" label="Phone Number" value={form.phone}
          onChange={set('phone')} onBlur={touch('phone')}
          error={errors.phone} placeholder="+91 98765 43210" />
        <Field id="reg-citystate" label="City and State" value={form.cityState}
          onChange={set('cityState')} onBlur={touch('cityState')}
          error={errors.cityState} placeholder="Mumbai, Maharashtra" />
      </div>

      {/* Password */}
      <div>
        <PasswordField id="reg-password" label="Password" value={form.password}
          onChange={set('password')} onBlur={touch('password')}
          error={errors.password} placeholder="Minimum 8 characters" />
        <StrengthBar password={form.password} />
      </div>

      {/* Confirm Password */}
      <PasswordField id="reg-confirm" label="Confirm Password" value={form.confirmPassword}
        onChange={set('confirmPassword')}
        onBlur={() => { touch('confirmPassword')(); confirmBlur() }}
        error={errors.confirmPassword} placeholder="Re-enter your password" />

      {/* Terms checkbox */}
      <div className="flex flex-col gap-1">
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-all duration-200
            ${form.agreed
              ? 'border-brand-500 bg-brand-500'
              : 'border-slate-300 group-hover:border-brand-400'}`}>
            <input id="reg-terms" type="checkbox" checked={form.agreed} onChange={set('agreed')}
              className="sr-only" />
            {form.agreed && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
          </div>
          <span className="text-sm text-slate-600 leading-relaxed">
            I agree to the{' '}
            <a href="#" className="text-brand-600 hover:underline font-medium">Terms of Service</a>
            {' '}and{' '}
            <a href="#" className="text-brand-600 hover:underline font-medium">Privacy Policy</a>
          </span>
        </label>
        {errors.agreed && (
          <p className="flex items-center gap-1 text-xs text-red-500 ml-8">
            <AlertCircle className="w-3 h-3 flex-shrink-0" />{errors.agreed}
          </p>
        )}
      </div>

      <button
        id="register-submit"
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-300
          disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-1"
        style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow: '0 4px 20px rgba(34,197,94,0.35)' }}
      >
        {loading ? (
          <>
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating account…
          </>
        ) : 'Create Account'}
      </button>
    </form>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   LEFT PANEL
══════════════════════════════════════════════════════════════════════════════ */
function LeftPanel() {
  const bullets = [
    'Real-time urgency map of community needs',
    'Automated volunteer matching via WhatsApp',
    'Instant donor reports, zero manual effort',
  ]
  return (
    <div
      className="relative flex flex-col justify-between p-8 lg:p-12 overflow-hidden"
      style={{ background: 'linear-gradient(145deg, #15803d 0%, #166534 40%, #0d2818 100%)' }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.04]"
           style={{
             backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
             backgroundSize: '48px 48px',
           }} />

      {/* Glow orbs */}
      <div className="absolute top-1/4 -right-20 w-64 h-64 rounded-full opacity-20"
           style={{ background: 'radial-gradient(circle, rgba(134,239,172,0.8), transparent)', filter: 'blur(50px)' }} />
      <div className="absolute bottom-1/4 -left-10 w-48 h-48 rounded-full opacity-15"
           style={{ background: 'radial-gradient(circle, rgba(20,184,166,0.8), transparent)', filter: 'blur(40px)' }} />

      {/* Top — Logo */}
      <div className="relative z-10">
        <Link to="/" className="flex items-center gap-2 mb-12 group w-fit">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-white/15 backdrop-blur-sm
              border border-white/20 group-hover:bg-white/25 transition-all">
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-2xl text-white">NeedMap</span>
        </Link>

        {/* Tagline */}
        <h2 className="font-display font-bold text-3xl lg:text-4xl text-white leading-tight mb-6">
          Coordinate impact.<br />
          <span className="text-green-300">Not chaos.</span>
        </h2>

        {/* Bullets */}
        <ul className="flex flex-col gap-4">
          {bullets.map((b, i) => (
            <li key={i} className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                   style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <Check className="w-3.5 h-3.5 text-green-300" strokeWidth={3} />
              </div>
              <span className="text-green-100 text-sm leading-relaxed">{b}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Bottom — trust line */}
      <div className="relative z-10 mt-10">
        <div className="h-px mb-6" style={{ background: 'rgba(255,255,255,0.12)' }} />
        <div className="flex items-center gap-3">
          <div className="flex -space-x-2">
            {['PS', 'AR', 'MK', 'SJ'].map((name, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-green-900 flex items-center justify-center
                  text-xs font-bold text-white"
                   style={{ background: ['#166534','#15803d','#14532d','#052e16'][i] }}>
                {name}
              </div>
            ))}
          </div>
          <p className="text-green-200 text-sm">
            Trusted by <span className="text-white font-semibold">NGOs across India</span>
          </p>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   MAIN PAGE
══════════════════════════════════════════════════════════════════════════════ */
export default function AuthPage() {
  const navigate = useNavigate()
  const [tab, setTab]     = useState('login')   // 'login' | 'register'
  const [toast, setToast] = useState(null)
  const [regDone, setRegDone] = useState(false)

  const showToast = (type, message) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 5000)
  }

  const onLoginSuccess = () => {
    showToast('success', 'Signed in successfully! Redirecting to Dashboard…')
    setTimeout(() => navigate('/dashboard'), 1500)
  }

  const onRegisterSuccess = () => {
    setRegDone(true)
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* ── Left Panel ── */}
      <div className="lg:w-5/12 xl:w-2/5 lg:min-h-screen">
        {/* Mobile banner (collapsed) */}
        <div className="lg:hidden"
             style={{ background: 'linear-gradient(135deg, #15803d, #0d2818)', padding: '1.5rem 1.5rem 1rem' }}>
          <Link to="/" className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-white/15">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-xl text-white">NeedMap</span>
          </Link>
          <p className="text-green-200 text-sm font-medium">Coordinate impact. Not chaos.</p>
        </div>

        {/* Desktop full panel */}
        <div className="hidden lg:flex flex-col h-full">
          <LeftPanel />
        </div>
      </div>

      {/* ── Right (form) Panel ── */}
      <div className="flex-1 flex items-start lg:items-center justify-center p-6 lg:p-12 bg-white">
        <div className="w-full max-w-lg">

          {/* Back to home */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600
              font-medium transition-colors mb-8 group" id="back-to-home">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Back to NeedMap
          </Link>

          {!regDone ? (
            <>
              {/* Tab switcher */}
              <div className="flex rounded-xl p-1 mb-8"
                   style={{ background: '#f1f5f9', border: '1px solid #e2e8f0' }}>
                {['login','register'].map(t => (
                  <button
                    key={t}
                    id={`tab-${t}`}
                    type="button"
                    onClick={() => setTab(t)}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      tab === t
                        ? 'bg-white text-slate-800 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {t === 'login' ? 'Log In' : 'Create Account'}
                  </button>
                ))}
              </div>

              {/* Heading */}
              <div className="mb-7">
                {tab === 'login' ? (
                  <>
                    <h1 className="font-display font-bold text-2xl text-slate-800 mb-1">
                      Welcome back
                    </h1>
                    <p className="text-slate-500 text-sm">
                      Sign in to your NeedMap coordinator account.
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="font-display font-bold text-2xl text-slate-800 mb-1">
                      Register your NGO
                    </h1>
                    <p className="text-slate-500 text-sm">
                      Get your organization set up in under 2 minutes.
                    </p>
                  </>
                )}
              </div>

              {/* Forms */}
              {tab === 'login'
                ? <LoginForm onSuccess={onLoginSuccess} onError={(msg) => showToast('error', msg)} />
                : <RegisterForm onSuccess={onRegisterSuccess} />
              }

              {/* Divider */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-200" />
                <span className="text-xs text-slate-400 font-medium">or</span>
                <div className="flex-1 h-px bg-slate-200" />
              </div>

              {/* Switch tab link */}
              <p className="mt-5 text-center text-sm text-slate-500">
                {tab === 'login' ? (
                  <>Don&apos;t have an account?{' '}
                    <button id="switch-to-register" onClick={() => setTab('register')}
                      className="text-brand-600 hover:text-brand-700 font-semibold transition-colors">
                      Register your NGO
                    </button>
                  </>
                ) : (
                  <>Already have an account?{' '}
                    <button id="switch-to-login" onClick={() => setTab('login')}
                      className="text-brand-600 hover:text-brand-700 font-semibold transition-colors">
                      Log in here
                    </button>
                  </>
                )}
              </p>
            </>
          ) : (
            /* ── Registration success message ── */
            <div className="text-center py-8">
              <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                   style={{ background: 'linear-gradient(135deg,#dcfce7,#bbf7d0)' }}>
                <CheckCircle2 className="w-10 h-10 text-brand-600" />
              </div>
              <h2 className="font-display font-bold text-2xl text-slate-800 mb-3">
                Account created! 🎉
              </h2>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm mx-auto mb-8">
                Check your email to verify your account before logging in.
                We&apos;ve sent a confirmation link to your registered email address.
              </p>
              <button
                id="go-to-login"
                onClick={() => { setRegDone(false); setTab('login') }}
                className="px-8 py-3 rounded-xl font-semibold text-white text-sm transition-all duration-300"
                style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', boxShadow: '0 4px 18px rgba(34,197,94,0.3)' }}
              >
                Go to Login
              </button>
              <p className="mt-4 text-xs text-slate-400">
                Didn&apos;t receive an email?{' '}
                <a href="#" className="text-brand-600 hover:underline">Resend verification</a>
              </p>
            </div>
          )}

          {/* Field worker note */}
          <div className="mt-8 p-4 rounded-xl"
               style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <p className="text-xs text-green-700 text-center leading-relaxed">
              <span className="font-semibold">Field workers & volunteers</span> — you don&apos;t need to log in here.
              You interact with NeedMap exclusively via WhatsApp. 📱
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
