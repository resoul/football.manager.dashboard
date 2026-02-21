import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/button';
import { Input, Label } from '@/components/input';
import { useAuth } from '@/providers/auth-context';
import { countriesRequest } from '@/lib/auth-api';

export function OnboardPage() {
    const navigate = useNavigate();
    const { user, completeOnboarding, logout } = useAuth();
    const [name, setName] = useState('');
    const [countryId, setCountryId] = useState<number | null>(null);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [countries, setCountries] = useState<Array<{ id: number; code: string; name: string }>>([]);
    const [loadingCountries, setLoadingCountries] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadCountries = async () => {
            try {
                const response = await countriesRequest<{ countries?: Array<{ id: number; code: string; name: string }> }>('');
                const list = Array.isArray(response.countries) ? response.countries : [];
                setCountries(list);
            } catch {
                toast.error('Could not load countries');
            } finally {
                setLoadingCountries(false);
            }
        };

        void loadCountries();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !countryId || !avatarFile) {
            toast.error('Please fill in all fields and upload avatar');
            return;
        }

        setLoading(true);
        const result = await completeOnboarding(name.trim(), countryId, avatarFile);
        setLoading(false);

        if (!result.success) {
            toast.error(result.error || 'Could not save manager profile');
            return;
        }

        toast.success(result.message || 'Onboarding completed');
        navigate('/career', { replace: true });
    };

    useEffect(() => {
        return () => {
            if (avatarPreview) {
                URL.revokeObjectURL(avatarPreview);
            }
        };
    }, [avatarPreview]);

    const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) {
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('Please select an image file');
            return;
        }

        const maxBytes = 5 * 1024 * 1024;
        if (file.size > maxBytes) {
            toast.error('Avatar must be 5MB or smaller');
            return;
        }

        if (avatarPreview) {
            URL.revokeObjectURL(avatarPreview);
        }

        try {
            const nextPreview = URL.createObjectURL(file);
            setAvatarFile(file);
            setAvatarPreview(nextPreview);
        } catch {
            toast.error('Could not read avatar image');
        };
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-emerald-950 text-white">
            <div className="mx-auto flex min-h-screen max-w-3xl items-center px-4 py-10">
                <div className="w-full rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur">
                    <p className="text-sm uppercase tracking-[0.18em] text-emerald-300/80">Onboarding</p>
                    <h1 className="mt-3 text-3xl font-bold">Create manager profile</h1>
                    <p className="mt-2 text-sm text-white/60">
                        {user?.email ? `Account: ${user.email}` : 'Complete your profile to continue to dashboard'}
                    </p>

                    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-white/70">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Alex Ferguson"
                                className="border-white/10 bg-white/[0.06] text-white placeholder:text-white/25 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="country" className="text-white/70">
                                Country
                            </Label>
                            <select
                                id="country"
                                value={countryId ?? ''}
                                onChange={(e) => setCountryId(Number(e.target.value) || null)}
                                disabled={loadingCountries}
                                className="flex h-10 w-full rounded-md border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white placeholder:text-white/25 focus-visible:border-emerald-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20 disabled:opacity-50"
                            >
                                <option value="">{loadingCountries ? 'Loading countries...' : 'Select country'}</option>
                                {countries.map((country) => (
                                    <option key={country.id} value={country.id} className="text-black">
                                        {country.name} ({country.code})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="avatar-file" className="text-white/70">
                                Avatar
                            </Label>
                            <Input
                                id="avatar-file"
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarFileChange}
                                className="border-white/10 bg-white/[0.06] text-white placeholder:text-white/25 focus-visible:border-emerald-500/50 focus-visible:ring-emerald-500/20"
                            />
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar preview" className="mt-2 h-16 w-16 rounded-full border border-white/20 object-cover" />
                            ) : null}
                        </div>

                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 text-white shadow-lg shadow-emerald-500/20 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50"
                            size="lg"
                        >
                            {loading ? 'Saving...' : 'Complete onboarding'}
                        </Button>
                    </form>

                    <div className="mt-6 flex justify-end">
                        <Button type="button" variant="ghost" className="text-white/70 hover:text-white" onClick={() => void logout()}>
                            Logout
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
