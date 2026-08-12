import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AppointmentForm } from "@/components/forms/appointment-form";

// Converted from app/modules/website/resources/views/screens/apointment/appointment.blade.php
export default function AppointmentPage() {
  return (
    <>
      <PublicNav />
      <div className="container py-16 flex justify-center">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Book an Appointment</CardTitle>
            <CardDescription>Choose a date to see available time slots.</CardDescription>
          </CardHeader>
          <CardContent>
            <AppointmentForm />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </>
  );
}
