"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  UserRound,
  Stethoscope,
  Image as ImageIcon,
  CalendarCheck,
  Clock,
  LogOut,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/patients", label: "Patients", icon: UserRound },
  { href: "/dashboard/appointments", label: "Appointments", icon: CalendarCheck },
  { href: "/dashboard/time-slots", label: "Time Slots", icon: Clock },
  { href: "/dashboard/treatments", label: "Treatments (CMS)", icon: Stethoscope },
  { href: "/dashboard/hero-images", label: "Hero Images (CMS)", icon: ImageIcon },
  { href: "/dashboard/users", label: "Users", icon: Users },
];

// Converted from app/modules/dashboard/resources/views/layouts/dashboardLayout.blade.php
export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r bg-white h-screen sticky top-0 flex flex-col">
      <div className="p-4 border-b">
        <span className="font-bold text-primary">Urmila Clinic</span>
        <p className="text-xs text-muted-foreground">Admin Dashboard</p>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
                active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="p-3 border-t">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
