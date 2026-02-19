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

export function VerifyAccountPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { confirmAccount } = useAuth();
    const locationState = (location.state ?? {}) as LocationState;

    const [email, setEmail] = useState(locationState.email ?? '');
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim() || !code.trim()) {
            toast.error('Please fill in all fields');
            return;
        }

        setLoading(true);
        const result = await confirmAccount(email.trim(), code.trim());
        setLoading(false);

        if (!result.success) {
            toast.error(result.error || 'Could not verify account');
            return;
        }

        toast.success(result.message || 'Account confirmed successfully');
        navigate('/auth/login', {
            replace: true,
            state: { email: email.trim() },
        });
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
                    <Label htmlFor="code" className="text-white/70">
                        Confirmation code
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

                <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50"
                    size="lg"
                >
                    {loading ? 'Verifying...' : 'Confirm account'}
                </Button>

                <p className="text-center text-sm text-white/40">
                    Already verified?{' '}
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
