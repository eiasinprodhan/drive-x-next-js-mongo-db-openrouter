"use client";

import { useEffect, useState } from "react";
import { json } from "./utils";

export const TOKEN_KEY = "drivex_admin_token";

/** fetch helper that auto-attaches the admin session token when present */
export async function api<T>(path: string, opts?: RequestInit): Promise<T> {
  let headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(path, { ...opts, headers: { ...headers, ...(opts?.headers as any) } });
  return json(res) as Promise<T>;
}

export function useFetch<T>(path: string | null, deps: unknown[] = []) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!path) return;
    let alive = true;
    setLoading(true);
    api<T>(path)
      .then((d) => alive && (setData(d), setError(null)))
      .catch((e) => alive && setError(String(e?.message || e)))
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [path, ...deps]);
  return { data, loading, error, setData };
}
