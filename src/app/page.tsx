import Image from "next/image";
import Link from "next/link";
import { PublicNav } from "@/components/layout/public-nav";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { getActiveHeroImages } from "@/actions/hero-image.actions";
import { getAllTreatments } from "@/actions/treatment.actions";
import { Container } from "@/components/ui/container";

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
        <section className="py-8">
          <div className="container grid gap-8 md:grid-cols-3 text-center">
            {[
              { title: "Experienced Doctors", desc: "Decades of homoeopathic practice." },
              { title: "Individualized Care", desc: "Treatment tailored to each patient." },
              { title: "Online & In-Clinic", desc: "Consult however suits you best." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl bg-secondary/40">
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Container>

      <Footer />
    </>
  );
}
