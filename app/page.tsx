import { readData } from "@/lib/db";
import { Typewriter } from "@/components/ui/Typewriter";
import { BentoCard } from "@/components/ui/BentoCard";
import { SearchModal } from "@/components/ui/SearchModal";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import Image from "next/image";

export const revalidate = 0; // Disable static rendering to always show fresh data

export default async function Home() {
  const data = await readData();

  const visibleCards = data.cards
    .filter((card) => card.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <main className="min-h-screen pt-24 pb-12 px-4 sm:px-6 md:px-12 max-w-6xl mx-auto">
      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 py-4 flex items-center justify-between pointer-events-none">
        <div className="flex-1" />
        <div className="pointer-events-auto">
          <SearchModal />
        </div>
        <div className="flex-1 flex justify-end pointer-events-auto">
          <ThemeToggle />
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-8 mb-16 mt-8">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden glass p-1 shadow-xl flex-shrink-0">
          <img
            src={data.profile.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"}
            alt={data.profile.name}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="text-center md:text-left flex-1">
          <h1 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4 tracking-tight">
            Hi, I'm {data.profile.name} <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 text-lg max-w-2xl">
            {data.profile.bio}
          </p>
          <div className="inline-block px-4 py-2 rounded-2xl glass">
            <Typewriter sentences={data.profile.motto} />
          </div>
        </div>
      </section>

      {/* Bento Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[160px]">
        {visibleCards.map((card) => (
          <BentoCard
            key={card.id}
            title={card.title}
            description={card.description}
            type={card.type}
            link={card.link}
            size={card.size}
          />
        ))}
      </section>

      {/* Footer */}
      <footer className="mt-20 text-center text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} {data.profile.name}. All rights reserved.</p>
      </footer>
    </main>
  );
}
