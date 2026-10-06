"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSite } from "@/lib/store";
import { AdminShell } from "@/components/admin/shell";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function AdminPage() {
  const router = useRouter();
  const {
    content,
    setContent,
    media,
    setMedia,
    requests,
    setRequests,
    saveWarning,
    dismissSaveWarning,
  } = useSite();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (isSupabaseConfigured) {
        const { data } = await getSupabase()!.auth.getSession();
        if (!data.session) {
          router.replace("/kdlebron13/login");
          return;
        }
      } else if (sessionStorage.getItem("ece_admin") !== "1") {
        router.replace("/kdlebron13/login");
        return;
      }
      if (!cancelled) setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = async () => {
    if (isSupabaseConfigured) {
      await getSupabase()!.auth.signOut();
    } else {
      sessionStorage.removeItem("ece_admin");
    }
    router.push("/");
  };

  if (!ready) return null;

  return (
    <>
      <AdminShell
        content={content}
        setContent={setContent}
        media={media}
        setMedia={setMedia}
        requests={requests}
        setRequests={setRequests}
        onLogout={handleLogout}
        onBack={() => router.push("/")}
      />
      {saveWarning && (
        <div className="fixed bottom-6 right-6 z-[90] bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-[13px] max-w-xs shadow-lg">
          <p className="font-semibold">Espace de stockage presque plein</p>
          <p className="mt-1 text-[12px]">
            Supprimez quelques images de la médiathèque pour libérer de
            l&apos;espace.
          </p>
          <button
            onClick={dismissSaveWarning}
            className="mt-2 text-[12px] font-semibold underline"
          >
            Fermer
          </button>
        </div>
      )}
    </>
  );
}
