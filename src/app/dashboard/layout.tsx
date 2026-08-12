import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, DASHBOARD_ROLES } from "@/lib/auth";
import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";

// Converted from Laravel's `auth` middleware group wrapping all dashboard/* routes.
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (!DASHBOARD_ROLES.includes(session.user.role)) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-muted/30">
      <DashboardSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
