import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminAuth } from "@/lib/admin-auth";

export const Route = createFileRoute("/atelier")({
  head: () => ({
    meta: [
      { title: "—" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AtelierPage,
});

function AtelierPage() {
  const authed = useAdminAuth((s) => s.authed);
  const hydrate = useAdminAuth((s) => s.hydrate);
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    hydrate();
    setReady(true);
  }, [hydrate]);

  useEffect(() => {
    if (ready && !authed) navigate({ to: "/" });
  }, [ready, authed, navigate]);

  if (!ready || !authed) return null;
  return <AdminShell />;
}
