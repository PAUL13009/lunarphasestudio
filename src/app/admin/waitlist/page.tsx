 "use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { collection, onSnapshot, orderBy, query, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase-client";

type WaitlistEntry = {
  id: string;
  email: string;
  createdAt: string;
};

export default function AdminWaitlistPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const total = useMemo(() => entries.length, [entries]);

  useEffect(() => {
    const q = query(collection(db, "waitlistEmails"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snapshot) => {
      const parsed = snapshot.docs.map((doc) => {
        const data = doc.data() as { email?: string; createdAt?: Timestamp };
        const date = data.createdAt ? data.createdAt.toDate() : null;
        return {
          id: doc.id,
          email: data.email ?? "—",
          createdAt: date ? date.toLocaleString("fr-FR") : "En attente…",
        };
      });
      setEntries(parsed);
    });
    return () => unsub();
  }, []);

  return (
    <>
      <Header />
      <main className="relative z-10 min-h-screen bg-black px-6 pb-28 pt-32 text-white lg:px-10 lg:pt-40">
        <div className="mx-auto max-w-[1400px]">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.25em] text-white/45">
            Dashboard Admin
          </p>
          <h1 className="mb-10 text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-7xl">
            Waitlist Emails
          </h1>

          <div className="mb-6 flex items-center justify-between border border-white/10 bg-white/[0.02] px-6 py-4">
            <span className="text-sm uppercase tracking-[0.2em] text-white/60">
              Total inscrits
            </span>
            <span className="text-2xl font-bold text-white">{total}</span>
          </div>

          <div className="overflow-hidden border border-white/10">
            <table className="w-full border-collapse">
              <thead className="bg-white/[0.03]">
                <tr>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.2em] text-white/55">
                    Email
                  </th>
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-[0.2em] text-white/55">
                    Date d&apos;inscription
                  </th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry) => (
                  <tr key={entry.id} className="border-t border-white/10">
                    <td className="px-5 py-4 text-sm text-white/90">{entry.email}</td>
                    <td className="px-5 py-4 text-sm text-white/55">{entry.createdAt}</td>
                  </tr>
                ))}
                {entries.length === 0 && (
                  <tr className="border-t border-white/10">
                    <td colSpan={2} className="px-5 py-8 text-center text-sm text-white/50">
                      Aucun email enregistré pour le moment.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
