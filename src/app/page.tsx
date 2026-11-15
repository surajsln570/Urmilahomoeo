import Image from "next/image";
import Link from "next/link";
import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { getActiveHeroImages } from "@/actions/hero-image.actions";
import { getAllTreatments } from "@/actions/treatment.actions";
import { Container } from "@/components/ui/container";
import { HeartHandshake, Stethoscope, Video } from "lucide-react";
// Converted from routes/web.php `/` + app/modules/website/resources/views/screens/homescreen/homescreen.blade.php
export default async function HomePage() {
  const [heroImages, treatments] = await Promise.all([getActiveHeroImages(), getAllTreatments()]);
  const hero = heroImages[0];
  return (
    <>
      <PublicNav />
      <Container>
        <section className="relative pt-[40px]">
          <div className="container py-16 grid gap-10 md:grid-cols-2 items-center">
            <div>
              <h1 className="text-2xl md:text-5xl font-bold text-primary leading-tight">
                Gentle Homoeopathic Care for the Whole Family
              </h1>
              <p className="mt-4 text-muted-foreground text-lg">
                Natural, individualized treatment for over 100 ailments — trusted by generations.
              </p>
              <div className="mt-6 flex gap-3">
                <Button size="lg">
                  <Link href="/appointment">Book Appointment</Link>
                </Button>
                <Button size="lg" variant="outline">
                  <Link href="#treatments">Our Treatments</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-72 md:h-96 rounded-2xl overflow-hidden bg-muted">
              {hero ? (
                <Image src={hero.heroImage} alt="Clinic hero" fill className="object-cover" priority />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No hero image published yet
                </div>
              )}
            </div>
          </div>
        </section>
        <section id="treatments" className="bg-white py-8">
          <div className="container">
            <h2 className="text-3xl font-bold text-center">Our Treatments</h2>
            <p className="text-center text-muted-foreground mt-2">We specialize in 100+ ailments</p>

            <div className="grid gap-6 mt-10 md:grid-cols-2 lg:grid-cols-3">
              {treatments.map((t: (typeof treatments)[number]) => (
                <div key={t.id} className="relative rounded-lg overflow-hidden h-72">
                  <Image src={t.image} alt={t.disease} fill className="object-cover" />
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90%] p-3 bg-white/95 rounded-lg text-center">
                    <h3 className="font-semibold">{t.disease}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{t.description}</p>
                  </div>
                </div>
              ))}
              {treatments.length === 0 && (
                <p className="text-muted-foreground col-span-full text-center">No treatments published yet.</p>
              )}
            </div>
          </div>
        </section>
        <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-32">
          <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">Why Choose Us</h2>
              <div className="mx-auto mt-6 h-1.5 w-20 rounded-full bg-primary" />
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-3 lg:gap-10">
              {[
                { icon: Stethoscope, title: "Experienced Doctors", desc: "Decades of homoeopathic practice." },
                { icon: HeartHandshake, title: "Individualized Care", desc: "Treatment tailored to each patient." },
                { icon: Video, title: "Online & In-Clinic", desc: "Consult however suits you best." },
              ].map((item, index) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="group relative overflow-hidden rounded-3xl border bg-card p-10 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl lg:p-12"
                  >
                    <span className="absolute right-6 top-4 select-none text-7xl font-extrabold text-primary/5 transition-colors duration-300 group-hover:text-primary/10">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="relative mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-8 ring-primary/5 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground group-hover:ring-primary/10">
                      <Icon className="h-10 w-10" />
                    </div>
                    <h3 className="relative text-xl font-semibold lg:text-2xl">{item.title}</h3>
                    <p className="relative mt-3 text-base leading-relaxed text-muted-foreground">{item.desc}</p>
                    <span className="absolute inset-x-0 bottom-0 h-1.5 origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </Container>

      <Footer />
    </>
  );
}
