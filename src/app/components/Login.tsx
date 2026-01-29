import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/app/contexts/AuthContext';
import { Shield, Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/user');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (result.success) {
      // Navigation is handled by useEffect
    } else {
      setError(result.message || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-500 rounded-lg mb-4">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">XCyber</h1>
          <p className="text-blue-200">Question & Answer Platform</p>
        </div>

        {/* Login Card */}
        <div className="bg-slate-800 rounded-lg shadow-2xl p-8 border border-slate-700">
          <h2 className="text-2xl font-bold text-white mb-6">Login</h2>

          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-300 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-400 hover:text-blue-300 font-medium"
              >
                Register here
              </button>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-500 mb-2">Demo Credentials:</p>
            <div className="text-xs text-slate-400 space-y-1">
              <p>Admin: admin@xcyber.com / admin123</p>
              <p>User: user@xcyber.com / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
