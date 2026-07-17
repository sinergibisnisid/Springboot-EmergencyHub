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

    // Simulate login (matches backend in-memory users)
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
      {/* Background gradient effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-[var(--color-brand)] opacity-[0.03] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-[var(--color-info)] opacity-[0.03] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo section */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[var(--color-brand)] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[var(--color-brand)]/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Emergency Hub</h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Interkoneksi Sarana Proteksi Kedaruratan
          </p>
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
            PT Pupuk Kujang
          </p>
        </div>

        {/* Login card */}
        <div className="rounded-2xl bg-[var(--color-bg-secondary)] border border-[var(--color-border-light)] p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6">
            Masuk ke Command Center
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="operator"
                className="w-full px-4 py-2.5 text-sm rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)]
                  text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]
                  focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-10 text-sm rounded-lg bg-[var(--color-bg-primary)] border border-[var(--color-border)]
                    text-[var(--color-text-primary)] placeholder-[var(--color-text-muted)]
                    focus:outline-none focus:border-[var(--color-border-focus)] transition-colors"
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
              <p className="text-sm text-[var(--color-critical)] bg-[var(--color-critical-bg)] px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full py-2.5 text-sm font-bold rounded-lg bg-[var(--color-brand)] text-white
                hover:bg-[var(--color-brand-light)] transition-colors cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Memproses...' : 'Masuk'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-[var(--color-border)]">
            <p className="text-xs text-[var(--color-text-muted)] text-center">
              Default login: <code className="text-[var(--color-brand-light)]">operator</code> / <code className="text-[var(--color-brand-light)]">operator123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
