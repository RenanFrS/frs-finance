import { SidebarProvider } from "@/components/app-shell/sidebar-provider";
import { Sidebar } from "@/components/app-shell/sidebar";
import { SessionProvider } from "@/components/app-shell/session-provider";
import { requireSession } from "@/lib/session";
import { db } from "@/lib/db";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();

  const memberships = await db.membership.findMany({
    where: { userId: session.user.id },
    include: { tenant: { select: { id: true, name: true, slug: true } } },
    orderBy: { createdAt: "asc" },
  });

  const tenants = memberships.map((m) => ({
    id: m.tenant.id,
    name: m.tenant.name,
    slug: m.tenant.slug,
    role: m.role,
  }));

  return (
    <SessionProvider
      value={{
        user: session.user,
        tenant: session.tenant,
        role: session.role,
        tenants,
      }}
    >
      <SidebarProvider>
        <div className="min-h-screen flex bg-background">
          <Sidebar />
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
