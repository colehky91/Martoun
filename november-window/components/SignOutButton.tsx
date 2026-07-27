"use client";

import { supabaseBrowser } from "@/lib/supabase/client";

export function SignOutButton() {
  return (
    <button
      className="btn ghost"
      style={{ padding: "7px 16px", fontSize: 12 }}
      onClick={async () => {
        await supabaseBrowser().auth.signOut();
        window.location.href = "/";
      }}
    >
      Sign out
    </button>
  );
}
