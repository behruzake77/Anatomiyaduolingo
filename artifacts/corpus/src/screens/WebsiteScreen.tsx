import { ArrowRight, BookOpen, Check, ChevronRight, Flame, Menu, Play, Star, Trophy, X } from "lucide-react";
import { useState } from "react";

const topics = [
  { title: "Suyaklar", subtitle: "Skelet tizimi", color: "#58cc02", image: "/img/stories/bg-skeleton.webp" },
  { title: "Bo‘g‘imlar", subtitle: "Harakat anatomiyasi", color: "#1cb0f6", image: "/img/stories/bg-vertebra.webp" },
  { title: "Yurak", subtitle: "Qon aylanish tizimi", color: "#ff6b6b", image: "/img/stories/bg-heart.webp" },
  { title: "Miya", subtitle: "Asab tizimi", color: "#8c6cff", image: "/img/stories/bg-brain.webp" },
];

export function WebsiteScreen() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="site-page min-h-screen overflow-x-hidden bg-white text-[#4b4b4b]">
      <header className="site-header sticky top-0 z-30 border-b-2 border-[#f0f3eb] bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-[76px] max-w-[1180px] items-center justify-between px-5 lg:px-8">
          <a href="/site" className="flex items-center gap-3" aria-label="CORPUS bosh sahifa">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#58cc02] text-2xl text-white shadow-[0_4px_0_#3b9700]">✦</span>
            <span>
              <strong className="block text-[21px] font-black leading-none tracking-[-0.05em]">CORPUS</strong>
              <small className="mt-1 block text-[10px] font-extrabold uppercase tracking-[0.13em] text-[#58cc02]">Anatomiya maktabi</small>
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm font-bold lg:flex" aria-label="Sayt menyusi">
            <a className="transition hover:text-[#58cc02]" href="#qanday">Qanday ishlaydi?</a>
            <a className="transition hover:text-[#58cc02]" href="#mavzular">Mavzular</a>
            <a className="transition hover:text-[#58cc02]" href="#natijalar">Natijalar</a>
          </nav>

          <div className="hidden items-center gap-3 sm:flex">
            <a href="/?screen=login" className="rounded-xl border-2 border-[#d8ddd2] px-4 py-2.5 text-xs font-extrabold uppercase tracking-[0.05em] text-[#1cb0f6] transition hover:border-[#1cb0f6]">Kirish</a>
            <a href="/?screen=dashboard" className="rounded-xl bg-[#58cc02] px-5 py-3 text-xs font-extrabold uppercase tracking-[0.05em] text-white shadow-[0_3px_0_#3b9700] transition hover:bg-[#4fba02] active:translate-y-[2px] active:shadow-none">Boshlash</a>
          </div>

          <button className="rounded-xl border-2 border-[#d8ddd2] p-2.5 sm:hidden" onClick={() => setMenuOpen((v) => !v)} aria-label="Menyuni ochish">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t-2 border-[#f0f3eb] bg-white px-5 pb-5 pt-3 sm:hidden">
            <div className="grid gap-2 text-center text-sm font-bold">
              <a className="rounded-xl px-4 py-3 hover:bg-[#f0ffdf]" href="#qanday" onClick={() => setMenuOpen(false)}>Qanday ishlaydi?</a>
              <a className="rounded-xl px-4 py-3 hover:bg-[#f0ffdf]" href="#mavzular" onClick={() => setMenuOpen(false)}>Mavzular</a>
              <a className="rounded-xl bg-[#58cc02] px-4 py-3 text-white" href="/?screen=dashboard">O‘rganishni boshlash</a>
            </div>
          </div>
        )}
      </header>

      <main>
        <section className="relative overflow-hidden bg-[#fbfff7]">
          <div className="mx-auto grid max-w-[1180px] items-center gap-10 px-5 py-16 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-28">
            <div className="relative z-10">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#d7ffb8] px-3 py-2 text-xs font-extrabold text-[#3b9700]"><Star className="h-4 w-4 fill-current" /> O‘rganish endi qiziqarli</div>
              <h1 className="max-w-[650px] text-[46px] font-black leading-[1.04] tracking-[-0.055em] text-[#4b4b4b] sm:text-[64px]">Anatomiyani <span className="text-[#58cc02]">o‘yin kabi</span> o‘rganing.</h1>
              <p className="mt-6 max-w-[540px] text-lg font-medium leading-relaxed text-[#777] sm:text-xl">Suyaklar, mushaklar va ichki a’zolarni qisqa darslar, aqlli testlar va muntazam mashqlar orqali oson eslab qoling.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a href="/?screen=dashboard" className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#58cc02] px-6 py-4 text-sm font-extrabold uppercase tracking-[0.04em] text-white shadow-[0_4px_0_#3b9700] transition hover:bg-[#4fba02] active:translate-y-[3px] active:shadow-none">Bepul boshlash <ArrowRight className="h-5 w-5" /></a>
                <a href="#qanday" className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#d8ddd2] bg-white px-6 py-4 text-sm font-extrabold text-[#1cb0f6] transition hover:border-[#1cb0f6]"><Play className="h-4 w-4 fill-current" /> Qanday ishlaydi?</a>
              </div>
              <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-[#777]"><span className="flex -space-x-2"><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#a5ed6e]">🧠</span><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#ffd166]">🫀</span><span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#ff9eb5]">🦴</span></span> 10 000+ o‘quvchi bilan birga</div>
            </div>
            <div className="relative mx-auto h-[350px] w-full max-w-[490px] sm:h-[420px]">
              <div className="absolute inset-x-3 top-4 bottom-4 rotate-2 rounded-[40px] bg-[#d7ffb8]" />
              <div className="absolute inset-0 overflow-hidden rounded-[40px] border-4 border-[#4b4b4b] bg-[#58cc02] shadow-[0_8px_0_#3b9700]">
                <img src="/img/stories/bg-skeleton.webp" alt="Anatomiya darsi" className="h-full w-full object-cover opacity-90 mix-blend-multiply" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000437]/80 via-transparent to-transparent" />
                <div className="absolute left-6 top-6 rounded-xl bg-white px-3 py-2 text-xs font-extrabold text-[#58cc02] shadow-sm">BUGUNGI DARS</div>
                <div className="absolute bottom-7 left-7 right-7 text-white"><p className="text-sm font-bold text-white/75">Skelet tizimi</p><p className="mt-1 text-3xl font-black">Suyaklarni tanib oling</p><div className="mt-4 h-3 overflow-hidden rounded-full bg-white/30"><div className="h-full w-[68%] rounded-full bg-white" /></div></div>
              </div>
              <div className="absolute -bottom-4 -left-2 flex items-center gap-2 rounded-2xl border-2 border-[#4b4b4b] bg-white px-4 py-3 text-sm font-extrabold shadow-[0_4px_0_#d8ddd2] sm:-left-8"><Flame className="h-5 w-5 fill-[#ff9600] text-[#ff9600]" /> 7 kunlik seriya</div>
              <div className="absolute -right-2 top-16 rounded-2xl border-2 border-[#4b4b4b] bg-white px-4 py-3 text-sm font-extrabold shadow-[0_4px_0_#d8ddd2] sm:-right-7"><Trophy className="mr-2 inline h-5 w-5 text-[#ffb800]" /> +20 XP</div>
            </div>
          </div>
        </section>

        <section id="qanday" className="mx-auto max-w-[1180px] px-5 py-20 sm:py-28 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-[.8fr_1.2fr]">
            <div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#58cc02]">Oddiy. Qiziqarli. Samarali.</p><h2 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">Har bir dars — kichik g‘alaba.</h2><p className="mt-5 text-lg leading-relaxed text-[#777]">CORPUS sizga kuniga bir necha daqiqada anatomiyani bosqichma-bosqich o‘rgatadi. Natijani ko‘ring, seriyani saqlang va keyingi bosqichga o‘ting.</p><a href="/?screen=dashboard" className="mt-7 inline-flex items-center gap-2 font-extrabold text-[#1cb0f6]">Darslarni ko‘rish <ChevronRight className="h-5 w-5" /></a></div>
            <div className="grid gap-4 sm:grid-cols-3"><Feature icon={<BookOpen />} title="Qisqa darslar" text="10 daqiqalik tushunarli mavzular." /><Feature icon={<Check />} title="Aqlli testlar" text="Bilimingizni o‘yin orqali sinang." /><Feature icon={<Flame />} title="Kunlik seriya" text="Har kuni o‘rganishni odatga aylantiring." /></div>
          </div>
        </section>

        <section id="mavzular" className="bg-[#fbfff7] px-5 py-20 sm:py-28 lg:px-8"><div className="mx-auto max-w-[1180px]"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#58cc02]">O‘quv yo‘li</p><h2 className="mt-3 text-4xl font-black tracking-[-0.05em] sm:text-5xl">Qaysi mavzudan boshlaymiz?</h2></div><a href="/?screen=topics" className="font-extrabold text-[#1cb0f6]">Barcha mavzular <ArrowRight className="ml-1 inline h-4 w-4" /></a></div><div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{topics.map((topic) => <a key={topic.title} href="/?screen=topics" className="group overflow-hidden rounded-2xl border-2 border-[#e8eee1] bg-white transition hover:-translate-y-1 hover:border-[#58cc02]"><div className="h-36 overflow-hidden" style={{ backgroundColor: `${topic.color}20` }}><img src={topic.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /></div><div className="p-4"><p className="text-lg font-black">{topic.title}</p><p className="mt-1 text-sm font-medium text-[#777]">{topic.subtitle}</p><div className="mt-4 flex items-center justify-between text-xs font-extrabold" style={{ color: topic.color }}>Boshlash <ChevronRight className="h-4 w-4" /></div></div></a>)}</div></div></section>

        <section id="natijalar" className="mx-auto max-w-[1180px] px-5 py-20 sm:py-24 lg:px-8"><div className="rounded-[32px] bg-[#58cc02] px-6 py-12 text-center text-white sm:px-12"><Trophy className="mx-auto h-10 w-10 text-[#d7ffb8]" /><h2 className="mx-auto mt-4 max-w-[680px] text-4xl font-black tracking-[-0.05em] sm:text-5xl">Bilim yo‘lingizni bugun boshlang.</h2><p className="mx-auto mt-4 max-w-[560px] text-lg font-medium text-white/85">Bepul ro‘yxatdan o‘ting va anatomiyani o‘rganishning yangi usulini sinab ko‘ring.</p><a href="/?screen=dashboard" className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-extrabold uppercase tracking-[0.04em] text-[#58cc02] shadow-[0_4px_0_#3b9700] transition hover:bg-[#f0ffdf]">O‘rganishni boshlash <ArrowRight className="h-5 w-5" /></a></div></section>
      </main>
      <footer className="bg-[#000437] px-5 py-10 text-center text-sm text-white/70"><p className="font-black tracking-[0.14em] text-white">CORPUS</p><p className="mt-2">Anatomiyani o‘rgan. Hayotni boshqar.</p></footer>
    </div>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return <div className="rounded-2xl border-2 border-[#e8eee1] bg-white p-5"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f0ffdf] text-[#58cc02]">{icon}</div><h3 className="mt-5 text-base font-black">{title}</h3><p className="mt-2 text-sm leading-relaxed text-[#777]">{text}</p></div>;
}
