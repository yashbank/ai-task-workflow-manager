import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { isAuthDisabled } from "@/lib/session";
import { ClientShell } from "@/components/layout/client-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const preview = isAuthDisabled();

  if (!preview) {
    const session = await getServerSession(authOptions);
    if (!session?.user) redirect("/login");
    return (
      <ClientShell preview={false} user={{ name: session.user.name, email: session.user.email }}>
        {children}
      </ClientShell>
    );
  }

  return (
    <ClientShell
      preview
      user={{ name: "Guest", email: "preview@demo.local" }}
    >
      {children}
    </ClientShell>
  );
}
