import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ClientShell } from "@/components/layout/client-shell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <ClientShell user={{ name: session.user.name, email: session.user.email }}>
      {children}
    </ClientShell>
  );
}
