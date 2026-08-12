import Link from "next/link";

// Converted from app/modules/website/resources/views/components/nav.blade.php
export function PublicNav() {
  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-40">
      <div className="container flex items-center justify-between py-4">
        <Link href="/" className="text-lg font-bold text-primary">
          Urmila Homoeopathic Clinic
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium">
          <Link href="/#treatments" className="hover:text-primary">Treatments</Link>
          <Link href="/#testimonials" className="hover:text-primary">Testimonials</Link>
          <Link href="/appointment" className="hover:text-primary">Book Appointment</Link>
          <Link href="/login" className="hover:text-primary">Staff Login</Link>
        </nav>
      </div>
    </header>
  );
}
