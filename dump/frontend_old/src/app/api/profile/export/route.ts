import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/authOptions";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { accounts: true, sessions: true },
  });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  // Remove sensitive fields
  if (user && Object.prototype.hasOwnProperty.call(user, 'password')) {
    (user as any).password = undefined;
  }
  return NextResponse.json({ user });
}
