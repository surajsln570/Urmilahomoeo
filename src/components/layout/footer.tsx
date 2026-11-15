import Link from "next/link";
import { Clock, Facebook, Instagram, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { Container } from "../ui/container";

const quickLinks = [
  { href: "/#treatments", label: "Treatments" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/appointment", label: "Book Appointment" },
];

const socialLinks = [
  { href: "https://wa.me/919695455228", label: "WhatsApp", icon: MessageCircle },
  { href: "https://m.facebook.com/profile.php?id=100007387778966&name=STSDirectNavUserDecorator", label: "Facebook", icon: Facebook },
  { href: "https://www.instagram.com/deepak2792singh?exln=NnFvdzcyd2F5cmd1", label: "Instagram", icon: Instagram },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t bg-secondary/40 lg:mt-20">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
      <Container className="relative">
        <div className="grid gap-10 py-14 text-sm sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:py-16">
          <div className="space-y-4 sm:col-span-2 lg:col-span-1">
            <h3 className="text-xl font-bold text-primary">Curative</h3>
            <div>
              <p className="leading-relaxed text-muted-foreground">
                Homoeo Clinic And Research Centre
              </p>
              <p className="leading-relaxed text-muted-foreground">
                ( Healing Naturally, Living Healthy)
              </p>
            </div>
            <div className="border-l-2 border-primary pl-3">
              <p className="font-semibold">Dr. Deepak Singh (BHMS)</p>
              <p className="text-muted-foreground">Homoeopathic Consultant</p>
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Quick Links</h3>
            <ul className="space-y-3 text-muted-foreground">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="transition-colors hover:text-primary">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="mb-4 font-semibold">Contact</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Baraunsha, Sultanpur, Uttar Pradesh</span>
              </li>
              <li>
                <a href="tel:+919695455228" className="flex items-center gap-3 transition-colors hover:text-primary">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  +91 9695455228
                </a>
              </li>
              <li>
                <a href="mailto:deepakphoneuthao@gmail.com" className="flex items-center gap-3 break-all transition-colors hover:text-primary">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  deepaksingh901011994@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Mon - Sat, 9:00 AM - 7:00 PM</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold">Follow Us</h3>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-full border bg-card text-muted-foreground shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-primary-foreground"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="border-t py-6 text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Curative. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}