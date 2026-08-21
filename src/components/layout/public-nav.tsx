'use client'
import Link from "next/link";
import { Container } from "../ui/container";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import clsx from "clsx";
import { Card, CardContent } from "../ui/card";

// Converted from app/modules/website/resources/views/components/nav.blade.php
export function PublicNav() {
  const [isNavOpen, setIsNavOpen] = useState(false)
  return (
    <div className="fixed inset-0 z-40 left-0 top-0 w-full">
      <header className=" bg-bg-primary/80 flex items-center backdrop-blur-sm min-h-[80px] w-full absolute top-0 z-40">
        <Container className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Avatar size="xl">
              <AvatarImage src="logo.png" />
              <AvatarFallback >CN</AvatarFallback>
            </Avatar>
            <div>
              <Link href="/" className="lg:text-lg  font-bold text-primary">
                Urmila Homoeopathic Clinic
              </Link>
              <p className="text-text-muted lg:text-md text-sm">Dr. Deepak Singh (BHMS)</p>
            </div>

          </div>
          <nav className=" items-center lg:flex hidden gap-6 text-sm font-medium.">
            <Link href="/#treatments" className="hover:text-primary">Treatments</Link>
            <Link href="/#testimonials" className="hover:text-primary">Testimonials</Link>
            <Link href="/appointment" className="hover:text-primary">Book Appointment</Link>
          </nav>
          <Link className="hidden lg:block" href="/login">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback >CN</AvatarFallback>
            </Avatar>
          </Link>
          <Menu onClick={() => setIsNavOpen(!isNavOpen)} className="lg:hidden" />
        </Container>

      </header>
      <div onClick={() => setIsNavOpen(false)} className={clsx("bg-bg-dark/20 inset-0 fixed top-0  min-h-screen duration-300 transition-all z-40 w-full", isNavOpen ? "visible opacity-100" : "invisible opacity-0")}>
        <div className={clsx("bg-bg-primary/80 p-2 z-50 inset-0 rounded-tr-lg transition-all duration-300 rounded-br-lg backdrop-blur-md absolute min-h-screen w-[80vw] grid grid-rows-12", isNavOpen ? "left-0" : "-left-full")}>
          <div className="row-span-2 border-b content-center border-border-secondary w-full grid grid-cols-3">
            <div className="col-span-1 flex items-center"><div className="bg-purple-500 rounded-full w-[80px] h-[80px]"></div></div>
            <div className="col-span-2 flex justify-center flex-col">
              <h2 className="text-xl font-semibold">Suraj Singh</h2>
              <p>surajsln570@gmail.com</p>
            </div>
          </div>
          <div className="row-span-9 border-b flex flex-col border-border-secondary w-full">
            <Link href="/#treatments" className="hover:text-primary border-b-2 py-2 border-border">Treatments</Link>
            <Link href="/#testimonials" className="hover:text-primary border-b-2 py-2 border-border">Testimonials</Link>
            <Link href="/appointment" className="hover:text-primary border-b-2 py-2 border-border">Book Appointment</Link>
          </div>
          <div className="row-span-1 place-content-between content-center w-full grid gap-3 grid-cols-2">
            <Button variant={'outline'}><Link href={'/login'}>Login</Link></Button>
            <Button variant={'outline'}><Link href={'/register'}>Register</Link></Button>
          </div>
        </div>
      </div>
    </div>
  )
}