"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { Resend } from "resend";
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

const resend = new Resend(process.env.RESEND_API_KEY);

function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export async function sendVerifyCode(formData: FormData) {
  const email = formData.get("email") as string;

  if (!email) {
    throw new Error("Email Required");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      throw new Error("If an account with that email exists, you will receive a reset code");
    }

    const code = generateVerificationCode();
    const token = generateVerificationToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    console.log("Creating verification token with data:", {
      code,
      token,
      expires,
      userId: user.id,
      user: user,
    });

    await prisma.verificationToken.deleteMany({
      where: {
        userId: user.id,
      },
    });

    await prisma.verificationToken.create({
      data: {
        code,
        token,
        expires,
        userId: user.id,
      },
    });
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const { data, error } = await resend.emails.send({
      from: `${process.env.RESEND_FROM_NAME} <${process.env.RESEND_FROM_EMAIL}>`,
      to: [email],
      subject: "Reset Your Password - SayTask AI",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #4f46e5, #0d9488); border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">🎤</span>
              </div>
              <h1 style="color: #333; margin: 0; font-size: 24px;">SayTask AI</h1>
            </div>

            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
            <p style="color: #666; line-height: 1.6; margin-bottom: 25px;">
              You requested to reset your password for your SayTask AI account. Use the verification code below or click the button to reset your password.
            </p>
            
            <div style="background: linear-gradient(135deg, #e0e7ff, #ccfbf1); padding: 25px; border-radius: 10px; margin: 25px 0; text-align: center; border-left: 4px solid #4f46e5;">
              <h3 style="margin: 0 0 10px 0; color: #4f46e5; font-size: 16px;">Your Verification Code</h3>
              <div style="font-size: 36px; font-weight: bold; color: #4f46e5; letter-spacing: 8px; font-family: 'Courier New', monospace; margin: 10px 0;">${code}</div>
              <p style="margin: 10px 0 0 0; color: #3730a3; font-size: 14px;">Enter this code on the verification page</p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #4f46e5, #0d9488); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px; box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3);">
                Reset Password Now
              </a>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e; font-size: 14px;">
                <strong>Security Notice:</strong> This code will expire in 1 hour. If you didn't request this password reset, please ignore this email.
              </p>
            </div>
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <div style="text-align: center;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                SayTask AI - Voice-Powered Task Management<br>
                This email was sent because you requested a password reset.
              </p>
            </div>
          </div>
        </div>
      `,
      text: `
SayTask AI - Password Reset Request

Your verification code: ${code}

Or visit this link: ${resetUrl}

This code will expire in 1 hour.
      `,
    });

    if (error) {
      console.error("Resend error", error);
      throw new Error("Failed to send email");
    }
    console.log("Password reset email sent successfully, Email ID:", data?.id);

    redirect(`/verify-code?email=${encodeURIComponent(email)}`);
  } catch (error: any) {
    console.error("Send Verify code error: ", error);
    throw new Error(error.message || "Failed to send verification code");
  }
}

export async function VerifyResetCode(data: FormData) {}
