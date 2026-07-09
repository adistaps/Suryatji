import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Mock login - in production this would use Supabase Auth
    if (email === 'admin@suryatji.com' && password === 'admin123') {
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials. Use admin@suryatji.com / admin123');
    }
  };

  return (
    <div className="min-h-[100dvh] bg-[#1E1A17] flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-[#4A7C3A] flex items-center justify-center mx-auto mb-4">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C8.5 2 6 4.5 6 7c0 1.5.5 2.5 1.5 3.5S9 12 9 13.5c0 2-1 3.5-3 4.5v1.5c2.5 1 6 1.5 6 1.5s3.5-.5 6-1.5V18c-2-1-3-2.5-3-4.5 0-1.5.5-2.5 1.5-3.5S18 8.5 18 7c0-2.5-2.5-5-6-5zm0 2c2 0 3.5 1.5 3.5 3S14 10 12 10 8.5 8.5 8.5 7 10 4 12 4z" />
            </svg>
          </div>
          <h1 className="text-white font-bold text-2xl" style={{ fontFamily: '"Playfair Display", serif' }}>
            Suryatji Admin
          </h1>
          <p className="text-white/50 text-sm mt-1">Sign in to manage your store</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <div>
            <label className="text-white/70 text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              placeholder="admin@suryatji.com"
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A7C3A]"
            />
          </div>

          <div>
            <label className="text-white/70 text-sm mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter password"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 pr-10 text-white placeholder:text-white/30 focus:outline-none focus:border-[#4A7C3A]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#4A7C3A] text-white font-semibold py-3 rounded-lg hover:bg-[#3d6b2f] transition-colors mt-2"
          >
            Sign In
          </button>

          <p className="text-center text-white/30 text-xs mt-4">
            Demo: admin@suryatji.com / admin123
          </p>
        </form>
      </div>
    </div>
  );
}
