import { setRequestLocale } from "next-intl/server";
import { RoomCanvas } from "@/components/room/RoomCanvas";
import { Loader } from "@/components/Loader";
import { Header } from "@/components/Header";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { Experience } from "@/components/sections/Experience";
import { Projects } from "@/components/sections/Projects";
import { Education } from "@/components/sections/Education";
import { Contact } from "@/components/sections/Contact";
import { Game } from "@/components/sections/Game";
import { Terminal } from "@/components/sections/Terminal";

export default async function Home({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Loader />
      <RoomCanvas />
      <Header />
      <main className="relative z-10 flex-1">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Education />
        <Contact />
        <Game />
        <Terminal />
      </main>
    </>
  );
}
