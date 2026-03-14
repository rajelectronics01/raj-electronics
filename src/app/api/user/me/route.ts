// API Route: GET /api/user/me
// Returns the currently logged-in user from the user-token cookie

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user-token")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const { payload } = await jwtVerify(token, getSecret());
    const userId = payload.userId as string;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, phone: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null }, { status: 401 });
  }
}
