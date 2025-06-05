import { getServerSession } from "next-auth";
import { authOptions } from "../auth/authOptions";
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });
  return NextResponse.json({ user });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await req.json();
  const user = await prisma.user.update({
    where: { email: session.user.email },
    data: { name: data.name },
  });
  return NextResponse.json({ user });
}

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.user.delete({ where: { email: session.user.email } });
  return NextResponse.json({ message: "Account deleted" });
}
