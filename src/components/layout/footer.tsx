// Converted from app/modules/website/resources/views/components/footer.blade.php
export function Footer() {
  return (
    <footer className="border-t bg-secondary/40 mt-20">
      <div className="container py-10 grid gap-8 md:grid-cols-3 text-sm">
        <div>
          <h3 className="font-semibold mb-2">Urmila Homoeopathic Clinic</h3>
          <p className="text-muted-foreground">
            Gentle, holistic homoeopathic care for the whole family.
          </p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1 text-muted-foreground">
            <li>Treatments</li>
            <li>Appointments</li>
            <li>Contact</li>
          </ul>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Contact</h3>
          <p className="text-muted-foreground">Mon - Sat, 9:00 AM - 7:00 PM</p>
        </div>
      </div>
      <p className="text-center text-xs text-muted-foreground pb-6">
        &copy; {new Date().getFullYear()} Urmila Homoeopathic Clinic. All rights reserved.
      </p>
    </footer>
  );
}
