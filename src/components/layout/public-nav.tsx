'use client'
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { CalendarCheck, LogIn, Menu, MessageSquareQuote, Stethoscope, UserPlus, UserRound, X } from "lucide-react";
import { Container } from "../ui/container";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navLinks = [
  { href: "/#treatments", label: "Treatments", icon: Stethoscope },
  { href: "/#testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/appointment", label: "Book Appointment", icon: CalendarCheck },
];

export function PublicNav() {
  const pathname = usePathname();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isNavOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsNavOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isNavOpen]);

  const closeNav = () => setIsNavOpen(false);

  return (
    <>
      <header
        className={clsx(
          "fixed top-0 left-0 z-40 flex h-20 w-full items-center border-b transition-all duration-300",
          isScrolled
            ? "border-border bg-bg-primary/90 shadow-sm backdrop-blur-md"
            : "border-transparent bg-bg-primary/60 backdrop-blur-sm"
        )}
      >
        <Container className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Avatar size="xl">
              <AvatarImage src="/logo.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div className="leading-tight">
              <p className="text-base font-bold text-primary lg:text-lg">Curative</p>
              <p className="text-xs text-text-muted lg:text-sm">Homoeopathic Clinic and Research Center</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium lg:flex">
            {navLinks.slice(0, 2).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative py-1 transition-colors hover:text-primary after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:after:scale-x-100"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary"
            >
              <UserRound className="h-4 w-4" />
              Login
            </Link>
            <Link
              href="/appointment"
              className={clsx(
                "inline-flex h-10 items-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:opacity-90 hover:shadow-md",
                pathname === "/appointment" && "ring-2 ring-primary/30 ring-offset-2 ring-offset-background"
              )}
            >
              <CalendarCheck className="h-4 w-4" />
              Book Appointment
            </Link>
          </div>

          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={isNavOpen}
            aria-controls="mobile-nav"
            onClick={() => setIsNavOpen(true)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-primary/10 lg:hidden"
          >
            <Menu className="h-6 w-6" />
          </button>
        </Container>
      </header>

      <div
        onClick={closeNav}
        className={clsx(
          "fixed inset-0 z-50 bg-bg-dark/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          isNavOpen ? "visible opacity-100" : "invisible opacity-0"
        )}
      >
        <aside
          id="mobile-nav"
          aria-hidden={!isNavOpen}
          onClick={(e) => e.stopPropagation()}
          className={clsx(
            "absolute left-0 top-0 flex h-full w-[85vw] max-w-sm flex-col bg-bg-primary shadow-xl transition-transform duration-300",
            isNavOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex items-center justify-between border-b border-border-secondary p-4">
            <Link href="/" onClick={closeNav} className="flex items-center gap-3">
              <Avatar size="xl">
                <AvatarImage src="/logo.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="leading-tight">
                <p className="text-base font-bold text-primary">Curative</p>
                <p className="text-xs text-text-muted">Homoeopathic Clinic</p>
              </div>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              onClick={closeNav}
              className="inline-flex h-10 w-10 items-center justify-center rounded-md transition-colors hover:bg-primary/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeNav}
                  className={clsx(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-primary/10 hover:text-primary",
                    isActive && "bg-primary/10 text-primary"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="grid grid-cols-2 gap-3 border-t border-border-secondary p-4">
            <Link
              href="/login"
              onClick={closeNav}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border text-sm font-medium transition-colors hover:bg-primary/10"
            >
              <LogIn className="h-4 w-4" />
              Login
            </Link>
            <Link
              href="/register"
              onClick={closeNav}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <UserPlus className="h-4 w-4" />
              Register
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}