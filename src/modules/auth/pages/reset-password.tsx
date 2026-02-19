import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/button';
import { Input, Label } from '@/components/input';
import { useAuth } from '@/providers/auth-context';
import { AuthLayout } from '../components/auth-layout';

interface LocationState {
    email?: string;
}

export function ResetPasswordPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { requestPasswordReset, resetPassword } = useAuth();
    const locationState = (location.state ?? {}) as LocationState;

    const [email, setEmail] = useState(locationState.email ?? '');
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [isCodeSent, setIsCodeSent] = useState(false);

    const handleRequestCode = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast.error('Please enter your email');
            return;
        }

        setLoading(true);
        const result = await requestPasswordReset(email.trim());
        setLoading(false);

        if (!result.success) {
            toast.error(result.error || 'Could not send reset code');
            return;
        }

        setIsCodeSent(true);
        toast.success(result.message || 'Reset code sent to your email');
    };

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !code.trim() || !newPassword.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        const result = await resetPassword(email.trim(), code.trim(), newPassword);
        setLoading(false);

        if (!result.success) {
            toast.error(result.error || 'Could not reset password');
            return;
        }

        toast.success(result.message || 'Password reset successful');
        navigate('/auth/login', { replace: true });
    };

    return (
        <AuthLayout>
            <form onSubmit={isCodeSent ? handleResetPassword : handleRequestCode} className="space-y-5">
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

                {isCodeSent && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="code" className="text-white/70">
                                Reset code
                            </Label>
                            <Input
                                id="code"
                                type="text"
                                placeholder="123456"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                className="border-white/10 bg-white/[0.06] text-white placeholder:text-white/25 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="new-password" className="text-white/70">
                                New password
                            </Label>
                            <Input
                                id="new-password"
                                type="password"
                                placeholder="••••••••"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                autoComplete="new-password"
                                className="border-white/10 bg-white/[0.06] text-white placeholder:text-white/25 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
                            />
                        </div>
                    </>
                )}

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50"
                    size="lg"
                >
                    {loading ? 'Please wait...' : isCodeSent ? 'Reset password' : 'Send reset code'}
                </Button>

                {!isCodeSent && (
                    <p className="text-center text-xs text-white/40">
                        We will send a confirmation code to your email.
                    </p>
                )}

                <p className="text-center text-sm text-white/40">
                    Remembered your password?{' '}
                    <Link
                        to="/auth/login"
                        className="font-medium text-emerald-400 transition-colors hover:text-emerald-300"
                    >
                        Sign In
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
