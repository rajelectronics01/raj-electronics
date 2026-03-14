// API Route: POST /api/user/update-name
// Updates the name for the currently logged-in user

import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const getSecret = () => new TextEncoder().encode(process.env.JWT_SECRET!);

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("user-token")?.value;
    if (!token) return NextResponse.json({ success: false }, { status: 401 });

    const { payload } = await jwtVerify(token, getSecret());
    const userId = payload.userId as string;

    const { name } = await req.json();

    await prisma.user.update({
      where: { id: userId },
      data: { name: name?.trim() || null },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
