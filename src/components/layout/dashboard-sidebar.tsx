"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils/utils";
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
  Menu,
} from "lucide-react";
import { useState } from "react";

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
  const [isNavOpen, setIsNavOpen] = useState(false)
  return (
    <aside className="w-full lg:w-64 shrink-0 border-r lg:h-screen lg:sticky top-0 lg:flex flex-col">
      <div className="p-4 flex justify-between w-full border-b">
        <div className="w-full">
          <span className="font-bold text-primary">Urmila Clinic</span>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>
        <Menu onClick={() => setIsNavOpen(!isNavOpen)} className="lg:hidden" />
        <div>

        </div>
      </div>
      <nav className="lg:flex-1 hidden p-3 space-y-1">
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
      {isNavOpen && <nav className="flex-1 p-3 space-y-1">
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
      </nav>}
      {isNavOpen && <div className="p-3 border-t">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>}
      <div className="p-3 hidden lg:block border-t">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={() => signOut({ callbackUrl: "/login" })}>
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>
    </aside>
  );
}
