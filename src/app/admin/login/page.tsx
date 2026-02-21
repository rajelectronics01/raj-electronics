'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            if (res.ok) {
                // Force a hard refresh to re-evaluate the edge middleware layout
                window.location.href = '/admin';
            } else {
                const data = await res.json();
                setError(data.error || 'Invalid credentials');
            }
        } catch (err) {
            setError('An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f8fafc',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                background: 'white',
                padding: '40px',
                borderRadius: '16px',
                boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
                width: '100%',
                maxWidth: '400px'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>
                        Admin Portal
                    </h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        Enter your credentials to access the dashboard.
                    </p>
                </div>

                {error && (
                    <div style={{
                        background: '#fef2f2',
                        color: '#ef4444',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        fontSize: '0.9rem',
                        border: '1px solid #fca5a5'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            placeholder="Store Admin Username"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500, color: '#334155' }}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                            style={{
                                width: '100%',
                                padding: '12px 16px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '8px',
                                outline: 'none',
                                transition: 'border-color 0.2s',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <Button type="submit" disabled={loading} style={{ width: '100%', marginTop: '10px', padding: '14px' }}>
                        {loading ? 'Authenticating...' : 'Secure Login'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
