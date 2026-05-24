"use client";

import { useEffect, useState } from "react";

import { getAuthClient } from "@/lib/auth-client";
import { getOrpc } from "@/lib/orpc";

type DashboardContentProps = {
  initialDisplayName?: string;
  initialEmail?: string | null;
};

export function DashboardContent({
  initialDisplayName,
  initialEmail,
}: DashboardContentProps) {
  const [displayName, setDisplayName] = useState(initialDisplayName ?? "User");
  const [email, setEmail] = useState(initialEmail ?? "—");
  const [apiMessage, setApiMessage] = useState("Loading…");

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const { data } = await getAuthClient().getSession();
        if (cancelled || !data?.user) return;
        const user = data.user;
        setDisplayName(user.name || user.email?.split("@")[0] || "User");
        setEmail(user.email ?? "—");
      } catch {
        // RequireAuth already gated; keep SSR fallbacks
      }
    }

    async function loadPrivateData() {
      try {
        const data = await getOrpc().privateData();
        if (!cancelled) {
          setApiMessage(data.message || "Connected to server");
        }
      } catch {
        if (!cancelled) {
          setApiMessage("Failed to load server data");
        }
      }
    }

    void loadSession();
    void loadPrivateData();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className="h-full min-h-0 w-full max-w-4xl px-4">
      <h1 className="text-4xl font-bold text-primary my-8">
        Welcome to your customer portal
      </h1>

      <div className="space-y-10">
        <div className="space-y-4">
          <div className="rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Welcome back,</p>
            <p className="text-xl font-medium text-primary">{displayName}</p>
          </div>

          <div className="rounded-lg p-4">
            <p className="mb-2 text-sm text-muted-foreground">Email</p>
            <p className="text-primary">{email}</p>
          </div>

          <div className="rounded-lg p-4">
            <p className="mb-2 text-sm text-muted-foreground">Server Message</p>
            <p className="text-primary">{apiMessage}</p>
          </div>
        </div>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-primary">
              Job contracts and quotes
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              View signed contracts, pending quotes, and project proposals.
            </p>
          </div>

          <div className="rounded-lg border border-border/15 bg-muted/40 p-6">
            <p className="text-sm text-muted-foreground">
              No contracts or quotes yet. When we send you a proposal or
              contract, it will appear here.
            </p>
          </div>
        </section>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold text-primary">Aftercare</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Care guides, maintenance schedules, and ongoing support for your
              pond.
            </p>
          </div>

          <div className="rounded-lg border border-border/15 bg-muted/40 p-6">
            <p className="text-sm text-muted-foreground">
              Aftercare resources will be available here once your project is
              complete.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
