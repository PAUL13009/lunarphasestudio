import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import { getAdminDb } from "@/lib/firebase-admin";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body?.email ?? "").trim().toLowerCase();

    if (!email || !EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Email invalide." }, { status: 400 });
    }

    const adminDb = getAdminDb();
    await adminDb.collection("waitlistEmails").add({
      email,
      createdAt: FieldValue.serverTimestamp(),
      source: "tools-page",
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Waitlist POST error:", error);
    return NextResponse.json(
      { error: "Impossible d'enregistrer cet email pour le moment." },
      { status: 500 }
    );
  }
}
