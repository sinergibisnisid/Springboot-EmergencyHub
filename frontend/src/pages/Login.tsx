import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    await new Promise(r => setTimeout(r, 800));

    if ((username === 'operator' && password === 'operator123') ||
        (username === 'admin' && password === 'admin123')) {
      localStorage.setItem('ehub_user', username);
      navigate('/dashboard');
    } else {
      setError('Username atau password salah');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg-primary)] p-4">
      {/* Subtle gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full bg-[var(--color-brand)] opacity-[0.02] blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] rounded-full bg-[var(--color-info)] opacity-[0.015] blur-[100px]" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-dark)] flex items-center justify-center mx-auto mb-5 shadow-lg shadow-[var(--color-brand)]/10">
            <Shield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] tracking-tight">Emergency Hub</h1>
          <p className="text-[13px] text-[var(--color-text-muted)] mt-1">
            Interkoneksi Sarana Proteksi Kedaruratan
          </p>
          <p className="text-[11px] text-[var(--color-text-muted)] mt-0.5">
            PT Pupuk Kujang
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl bg-[var(--color-bg-card)] border border-[var(--color-border)] p-7">
          <h2 className="text-base font-semibold text-[var(--color-text-primary)] mb-6">
            Masuk ke Command Center
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[12px] font-medium text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="operator"
                className="w-full px-4 py-2.5 text-sm rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)]
                  text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]
                  focus:outline-none focus:border-[var(--color-brand)] transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-[12px] font-medium text-[var(--color-text-secondary)] mb-2 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 text-sm rounded-lg bg-[var(--color-bg-input)] border border-[var(--color-border)]
                    text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]
                    focus:outline-none focus:border-[var(--color-brand)] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-[var(--color-critical)] bg-[var(--color-critical-dim)] px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full py-2.5 text-sm font-semibold rounded-lg bg-[var(--color-brand)] text-white
                hover:bg-[var(--color-brand-light)] transition-colors cursor-pointer
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
            <p className="text-[11px] text-[var(--color-text-muted)] text-center">
              Default: <code className="text-[var(--color-brand)]">operator</code> / <code className="text-[var(--color-brand)]">operator123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
