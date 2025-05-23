"use server";

import { redirect } from "next/navigation";
import { clearSession, createSession, hashPassword, verifyPassword } from "./auth";
import { prisma } from "./prisma";

export async function signUp(formData: FormData) {
  const firstName = formData.get("firstname") as string;
  const lastName = formData.get("lastname") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!firstName || !lastName || !email || !password) {
    throw new Error("All field required");
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
  redirect("/home");
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
  redirect("/home");
}

export async function signOut() {
  await clearSession();
  redirect("/");
}
