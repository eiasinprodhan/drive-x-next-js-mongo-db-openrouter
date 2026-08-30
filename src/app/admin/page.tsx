"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { TOKEN_KEY } from "@/lib/api";

export default function AdminIndex() {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      router.replace("/admin/dashboard");
    } else {
      router.replace("/login");
    }
  }, [router]);

  return (
    <div className="grid min-h-screen place-items-center bg-navy-950 text-xs font-bold text-navy-400">
      Loading Admin Suite…
    </div>
  );
}
