"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { clearSession, createSession, hashPassword, verifyPassword } from "./auth";
import { prisma } from "./prisma";
import { sendVerificationEmail } from "./resend";

export async function signUp(formData: FormData) {
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !password) {
    return { error: "All fields required" };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { error: "User already exists" };
  }

  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { firstName, lastName, email, hashedPassword },
    });

    await createSession(user.id);

    return { success: true };
  } catch (err) {
    console.error("Production error during signUp:", err);
    throw err;
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password required" };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await verifyPassword(password, user.hashedPassword))) {
      return { error: "Invalid credentials" };
    }

    await createSession(user.id);
    return { success: true };
  } catch {
    return { error: "Sign in failed" };
  }
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

  if (!email) return { error: "Email required" };

  try {
    console.log(email);
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return { error: "User not found with this email address" };
    }

    const code = generateCode();
    const token = generateToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.verificationToken.deleteMany({ where: { userId: user?.id } });
    console.log("User ID:", user.id);
    console.log("Token data:", { token, code, expires, userId: user.id });

    await prisma.verificationToken.create({
      data: {
        token,
        code,
        expires,
        userId: user.id,
      },
    });

    await sendVerificationEmail(email, code);

    return { success: true };
  } catch {
    return { error: "Failed to send verification code" };
  }
}

export async function VerifyResetCode(formData: FormData) {
  const code = formData.get("code") as string;
  const email = formData.get("email") as string;

  if (!code || !email) {
    return { error: "Missing required fields" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    console.log("User Found:", user);

    if (!user) return { error: "User not found" };

    const verify = await prisma.verificationToken.findFirst({
      where: {
        code: code.trim(),
        userId: user.id,
        type: "EMAIL_VERIFICATION",
        used: false,
        expires: {
          gt: new Date(),
        },
      },
    });

    if (!verify) {
      return { error: "Invalid or expired verification code" };
    }

    await prisma.verificationToken.update({
      where: { id: verify.id },
      data: { used: true },
    });

    await createSession(user.id);
    redirect("/auth/reset");
  } catch {
    return { error: "Verification failed" };
  }
}

export async function changePassword(formData: FormData) {
  const oldPassword = formData.get("oldPassword") as string;
  const newPassword = formData.get("newPassword") as string;
  const email = formData.get("email") as string;

  if (!oldPassword || !newPassword || !email) {
    return { error: "Missing required fields" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return { error: "User not found" };

    // Verify old password
    if (!(await verifyPassword(oldPassword, user.hashedPassword))) {
      return { error: "Current password is incorrect" };
    }

    const hashed = await hashPassword(newPassword);

    await prisma.user.update({
      where: {
        email: email,
      },
      data: {
        hashedPassword: hashed,
      },
    });

    redirect("/");
  } catch {
    return { error: "Failed to change password" };
  }
}
