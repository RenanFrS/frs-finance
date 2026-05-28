"use client";

import * as React from "react";

export type SessionUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  photoUrl: string | null;
};

export type SessionTenant = {
  id: string;
  name: string;
  slug: string;
};

export type SessionTenantOption = SessionTenant & {
  role: "OWNER" | "EDITOR" | "VIEWER";
};

export type SessionData = {
  user: SessionUser;
  tenant: SessionTenant;
  role: "OWNER" | "EDITOR" | "VIEWER";
  tenants: SessionTenantOption[];
};

const SessionContext = React.createContext<SessionData | null>(null);

export function SessionProvider({
  value,
  children,
}: {
  value: SessionData;
  children: React.ReactNode;
}) {
  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionData {
  const ctx = React.useContext(SessionContext);
  if (!ctx) throw new Error("useSession must be used inside SessionProvider");
  return ctx;
}

export function useOptionalSession(): SessionData | null {
  return React.useContext(SessionContext);
}
