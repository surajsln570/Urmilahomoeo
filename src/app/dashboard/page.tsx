import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Users, UserRound, CalendarCheck, Stethoscope } from "lucide-react";

// Converted from app/modules/dashboard/resources/views/dashboard.blade.php
export default async function DashboardHome() {
  const session = await getServerSession(authOptions);

  const [userCount, patientCount, appointmentCount, treatmentCount] = await Promise.all([
    prisma.user.count(),
    prisma.patient.count(),
    prisma.appointment.count(),
    prisma.treatment.count(),
  ]);

  const stats = [
    { label: "Users", value: userCount, icon: Users },
    { label: "Patients", value: patientCount, icon: UserRound },
    { label: "Appointments", value: appointmentCount, icon: CalendarCheck },
    { label: "Treatments", value: treatmentCount, icon: Stethoscope },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Welcome back, {session?.user.name}</h1>
        <p className="text-muted-foreground">Role: {session?.user.role}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
