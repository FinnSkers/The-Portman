import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ error: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: {
      email,
      name,
      // @ts-ignore
      password: hashedPassword,
    },
  });
  return res.status(201).json({ message: "User registered" });
}
