import { getSession } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await getSession();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    return NextResponse.json({
      user: { id: user.id, firstname: user.firstName, lastName: user.lastName, email: user.email },
    });
  } catch (error) {
    console.error("Error checking authentication: ", error);
    return NextResponse.json({ error: "Authentication check failed" }, { status: 500 });
  }
}
