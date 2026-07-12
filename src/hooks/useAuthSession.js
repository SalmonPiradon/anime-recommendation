import { useEffect, useState } from "react";

import { getSession } from "../lib/authStorage";

export function useAuthSession() {
  const [session, setSession] = useState(getSession);

  useEffect(() => {
    const refreshSession = () => setSession(getSession());

    window.addEventListener("auth-change", refreshSession);
    return () => window.removeEventListener("auth-change", refreshSession);
  }, []);

  return session;
}
