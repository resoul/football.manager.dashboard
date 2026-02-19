import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthLayout } from '../components/auth-layout';
import { Input, Label } from '@/components/input';
import { Button } from '@/components/button';
import { useAuth } from '@/providers/auth-context';
import { toast } from 'sonner';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !password.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);

        const result = await login(email.trim(), password);

        if (result.success) {
            toast.success(result.message || 'Welcome back, Manager!');
            navigate('/home', { replace: true });
        } else {
            toast.error(result.error || 'Login failed');
        }

        setLoading(false);
    };

    return (
        <AuthLayout>
            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/70">
                        Email
                    </Label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="manager@club.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        className="border-white/10 bg-white/[0.06] text-white placeholder:text-white/25 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/70">
                        Password
                    </Label>
                    <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoComplete="current-password"
                        className="border-white/10 bg-white/[0.06] text-white placeholder:text-white/25 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
                    />
                </div>

                <div className="flex items-center justify-end">
                    <Link
                        to="/auth/reset-password"
                        className="text-sm font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                        Forgot password?
                    </Link>
                </div>

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50"
                    size="lg"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Signing in...
                        </span>
                    ) : (
                        'Sign In'
                    )}
                </Button>

                <p className="text-center text-sm text-white/40">
                    Don't have an account?{' '}
                    <Link
                        to="/auth/register"
                        className="font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                        Create Account
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
