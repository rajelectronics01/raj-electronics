import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';
import { cookies } from 'next/headers';

const getJwtSecretKey = () => {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length === 0) {
        throw new Error('The environment variable JWT_SECRET is not set.');
    }
    return secret;
};

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        // Verify credentials against environment variables
        const validUsername = process.env.ADMIN_USERNAME;
        const validPassword = process.env.ADMIN_PASSWORD;

        if (!validUsername || !validPassword) {
            return NextResponse.json(
                { error: 'Server misconfiguration: Admin credentials missing.' },
                { status: 500 }
            );
        }

        if (username === validUsername && password === validPassword) {
            // Sign the JWT token
            const secret = new TextEncoder().encode(getJwtSecretKey());
            const token = await new SignJWT({ role: 'admin' })
                .setProtectedHeader({ alg: 'HS256' })
                .setIssuedAt()
                .setExpirationTime('24h') // Session valid for 1 day
                .sign(secret);

            // Set the HttpOnly cookie for strict security
            const cookieStore = await cookies();
            cookieStore.set('admin-token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 60 * 60 * 24, // 24 hours in seconds
                path: '/',
            });

            return NextResponse.json({ success: true }, { status: 200 });
        }

        // Invalid credentials
        return NextResponse.json(
            { error: 'Incorrect username or password' },
            { status: 401 }
        );

    } catch (error: any) {
        console.error('Login error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
