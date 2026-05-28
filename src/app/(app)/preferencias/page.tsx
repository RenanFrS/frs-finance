import { AppBar } from "@/components/app-shell/app-bar";
import { PageSection } from "@/components/app-shell/page-section";
import { PreferenciasForm } from "@/components/preferencias/preferencias-form";
import { requireSession } from "@/lib/session";

export const metadata = { title: "Preferências · FrS Finance" };
export const dynamic = "force-dynamic";

export default async function PreferenciasPage() {
  const session = await requireSession();
  return (
    <>
      <AppBar
        crumb="Configuração · Preferências"
        title="Suas"
        titleEm="preferências"
      />
      <PageSection className="grid gap-5">
        <PreferenciasForm
          user={{
            firstName: session.user.firstName,
            lastName: session.user.lastName,
            email: session.user.email,
          }}
          tenant={session.tenant}
          role={session.role}
        />
      </PageSection>
    </>
  );
}
