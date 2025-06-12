"use server";

import axios from "axios";
import crypto from "crypto";
import { redirect } from "next/navigation";
import { clearSession, createSession, hashPassword, verifyPassword } from "./auth";
import { prisma } from "./prisma";

export async function signUp(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All fields required");
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { firstName, lastName, email, hashedPassword },
  });

  await createSession(user.id);
  redirect("/");
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password required");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user || !(await verifyPassword(password, user.hashedPassword))) {
    throw new Error("Invalid credentials");
  }

  await createSession(user.id);
  redirect("/");
}

export async function signOut() {
  await clearSession();
  redirect("/login");
}

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function sendVerifyCode(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) throw new Error("Email required");

  console.log(email);
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new Error("User not found with this email address");
  }

  const code = generateCode();
  const token = generateToken();
  const expires = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.verificationToken.deleteMany({ where: { userId: user?.id } });
  console.log("User ID:", user.id); // Add this before your create call
  console.log("Token data:", { token, code, expires, userId: user.id });

  await prisma.verificationToken.create({
    data: {
      token,
      code,
      expires,
      userId: user.id,
    },
  });

  try {
    const { data } = await axios.get(
      `${process.env.NEXTJS_URL || "http://localhost:3000"}/api/send`
    );
    console.log("email info", data);
  } catch (error) {
    console.error("ERROR fetching: ", error);
  }

  return redirect(`/verify-code?email=${encodeURIComponent(email)}`);
}

export async function VerifyResetCode(data: FormData) {}
