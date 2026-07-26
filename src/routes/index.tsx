import zabakuLogo from "@/assets/zabaku-logo.png.asset.json";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Sparkles, ArrowRight, ArrowUp, Search, Menu, X, Grid3x3, Layers, Tag,
  Zap, Bot, Kanban, CheckCircle2, TrendingUp, Wand2, Users, Briefcase,
  Leaf, Check, Github, Slack, Figma as FigmaIcon, Twitter, Linkedin,
  Calendar, ListChecks, MessageSquare, BarChart3,
} from "lucide-react";
import { SmoothCursor } from "../components/ui/smooth-cursor";
import { KineticText } from "../components/ui/kinetic-text";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "Zabaku — Clarity for building startups" },
      { name: "description", content: "The AI-powered operating system for founders and software teams. Plan, ship, and scale with a beautifully calm workspace." },
      { property: "og:title", content: "Zabaku — Clarity for building startups" },
      { property: "og:description", content: "Plan, ship, and scale with a calm AI workspace built for modern teams." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

/* ============ REVEAL HOOK (AOS replacement) ============ */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-revealed");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Landing() {
  useReveal();
  return (
    <div className="min-h-screen bg-[#FAFAF9] text-stone-900 overflow-x-hidden selection:bg-orange-200 selection:text-orange-900">
      <DesktopNav />
      <MobileNav />
      <main>
        <Hero />
        <Features />
        <Planning />
        <Organization />
        <Pricing />
        <CTA />
      </main>
      <Footer />
      <BackToTop />
    </div>
  );
}

/* ============ DESKTOP NAV ============ */
function DesktopNav() {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] group/header hidden lg:block w-full max-w-5xl px-6">
      <div className="flex flex-col gap-3">
        <nav className="h-20 bg-stone-900/95 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between px-4 shadow-2xl transition-all duration-500 group-hover/header:-translate-y-1">
          <div className="flex items-center gap-4">
            <a href="#top" className="relative group/logo">
              <img src={zabakuLogo.url} alt="Zabaku" className="w-12 h-12 rounded-2xl object-cover shadow-lg group-hover/logo:rotate-[360deg] transition-transform duration-1000" />
            </a>
            <div className="h-8 w-px bg-white/10 mx-2" />
            <div className="flex items-center gap-6">
              <a href="#features" className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5">
                <Grid3x3 className="h-4 w-4" /> Features
              </a>
              <a href="#planning" className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5">
                <Layers className="h-4 w-4" /> Planning
              </a>
              <a href="#pricing" className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5">
                <Tag className="h-4 w-4" /> Pricing
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-10 h-10 rounded-full bg-white/5 text-stone-400 flex items-center justify-center hover:text-white hover:bg-white/10 transition-all">
              <Search className="h-5 w-5" />
            </button>
            <Link to="/login" className="text-stone-400 hover:text-white text-sm font-medium px-3 py-2 rounded-lg hover:bg-white/5 transition">
              Sign in
            </Link>
            <div className="h-8 w-px bg-white/10 mx-1" />
            <Link
              to="/register"
              className="bg-orange-600 text-white text-sm font-bold px-6 py-3 rounded-full hover:bg-white hover:text-orange-600 transition-all shadow-xl shadow-orange-600/20 active:scale-95"
            >
              Get Zabaku Free
            </Link>
          </div>
        </nav>

        {/* Mega menu drawer */}
        <div className="relative w-full">
          <div className="absolute left-0 right-0 top-0 bg-white/95 backdrop-blur-md rounded-[2.5rem] border border-stone-200/50 opacity-0 -translate-y-4 pointer-events-none group-hover/header:opacity-100 group-hover/header:pointer-events-auto group-hover/header:translate-y-0 shadow-2xl transition-all duration-500 p-8">
            <div className="grid grid-cols-4 gap-12">
              <div className="col-span-1">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-6">Product</div>
                <div className="flex flex-col gap-4">
                  <Link to="/dashboard" className="group/link flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center group-hover/link:bg-orange-100 group-hover/link:text-orange-600 transition">
                      <Kanban className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-stone-900">Dashboard</span>
                  </Link>
                  <Link to="/projects" className="group/link flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center group-hover/link:bg-blue-100 group-hover/link:text-blue-600 transition">
                      <Calendar className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-stone-900">Projects</span>
                  </Link>
                  <Link to="/ai" className="group/link flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-50 flex items-center justify-center group-hover/link:bg-amber-100 group-hover/link:text-amber-600 transition">
                      <Bot className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-semibold text-stone-900">AI Workspace</span>
                  </Link>
                </div>
              </div>
              <div className="col-span-1 border-l border-stone-100 pl-12">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-6">Resources</div>
                <div className="flex flex-col gap-4">
                  <Link to="/design-system" className="text-sm font-semibold text-stone-600 hover:text-orange-600 transition">Design System</Link>
                  <Link to="/analytics" className="text-sm font-semibold text-stone-600 hover:text-orange-600 transition">Analytics</Link>
                  <Link to="/team" className="text-sm font-semibold text-stone-600 hover:text-orange-600 transition">Team</Link>
                </div>
              </div>
              <div className="col-span-2 bg-stone-50 rounded-3xl p-6 flex flex-col justify-between">
                <div>
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-1 rounded uppercase mb-2 inline-block">Pro Tip</span>
                  <h4 className="text-lg font-serif italic text-stone-900 mb-2">The focus mode manifesto</h4>
                  <p className="text-xs text-stone-500 leading-relaxed mb-4">Reclaim 2 hours of deep work daily with Zabaku's Focus Timer and AI-drafted daily briefings.</p>
                </div>
                <Link to="/ai" className="text-stone-900 font-bold text-xs flex items-center gap-2 group/btn">
                  Read Guide <ArrowRight className="h-3 w-3 group-hover/btn:translate-x-1 transition" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

/* ============ MOBILE NAV ============ */
function MobileNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav className="lg:hidden fixed top-6 left-6 right-6 z-[100] h-16 bg-stone-950/90 backdrop-blur-xl border border-white/10 rounded-full flex items-center justify-between px-6 shadow-2xl">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-serif text-lg font-bold text-stone-900">Z</div>
        <div className="flex gap-6 text-stone-400">
          <a href="#features"><Grid3x3 className="h-5 w-5 hover:text-white transition" /></a>
          <a href="#planning"><Layers className="h-5 w-5 hover:text-white transition" /></a>
          <a href="#pricing"><Tag className="h-5 w-5 hover:text-white transition" /></a>
        </div>
        <button
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="w-10 h-10 rounded-full bg-orange-600 flex items-center justify-center text-white active:scale-95 transition"
        >
          <Menu className="h-4 w-4" />
        </button>
      </nav>

      <div
        className={`fixed inset-4 bg-white rounded-[2.5rem] shadow-2xl border border-stone-100 z-[110] p-8 flex flex-col transition-all duration-500 ease-out lg:hidden ${
          open ? "opacity-100 pointer-events-auto translate-y-0" : "opacity-0 pointer-events-none translate-y-8"
        }`}
      >
        <div className="flex justify-between items-center mb-12">
          <div className="w-10 h-10 bg-stone-900 rounded-full flex items-center justify-center text-white font-serif text-xl">Z</div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center text-stone-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6">
          <a onClick={() => setOpen(false)} href="#features" className="text-4xl font-serif text-stone-950 hover:italic">Product</a>
          <a onClick={() => setOpen(false)} href="#planning" className="text-4xl font-serif text-stone-950 hover:italic">Planning</a>
          <a onClick={() => setOpen(false)} href="#pricing" className="text-4xl font-serif text-stone-950 hover:italic">Pricing</a>
          <Link onClick={() => setOpen(false)} to="/design-system" className="text-4xl font-serif text-stone-950 hover:italic">Design</Link>
        </div>

        <div className="mt-auto space-y-4">
          <Link to="/register" onClick={() => setOpen(false)} className="block text-center w-full bg-stone-950 text-white py-4 rounded-2xl font-bold text-lg">
            Get Zabaku Free
          </Link>
          <Link to="/login" onClick={() => setOpen(false)} className="block text-center w-full bg-stone-100 text-stone-950 py-4 rounded-2xl font-bold text-lg">
            Sign in
          </Link>
        </div>
      </div>
    </>
  );
}

/* ============ HERO ============ */
function Hero() {
  const [heroHover, setHeroHover] = useState(false);
  return (
    <section
      id="top"
      onMouseEnter={() => setHeroHover(true)}
      onMouseLeave={() => setHeroHover(false)}
      className="min-h-[90vh] flex flex-col justify-center pt-32 pb-16 px-6 lg:pt-40 relative overflow-hidden bg-stone-50"
    >
      {heroHover && <SmoothCursor />}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-orange-200/30 blur-[120px] rounded-full -z-10 animate-float pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center z-10 relative">

        <div
          data-reveal
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-stone-200 shadow-sm mb-8 hover:border-orange-200 transition duration-300 cursor-default"
        >
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
          </span>
          <span className="text-xs font-semibold text-stone-700">Zabaku 2.0 — AI planning is here</span>
        </div>

        <h1
          data-reveal
          style={{ transitionDelay: "80ms" }}
          className="font-serif text-[2.5rem] sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-stone-900 mb-6 tracking-tight flex flex-nowrap justify-center items-baseline gap-x-[0.25em]"
        >
          <KineticText
            as="span"
            text="Build better products"
            className="font-serif justify-center font-normal whitespace-nowrap"
          />
          <KineticText
            as="span"
            text="with AI"
            className="font-serif justify-center italic text-orange-600 font-normal whitespace-nowrap"
          />
        </h1>

        <p
          data-reveal
          style={{ transitionDelay: "160ms" }}
          className="text-lg md:text-xl text-stone-600 max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The AI-powered operating system for startups. Plan projects, manage tasks, and ship
          faster — in one calm, beautifully designed workspace.
        </p>

        <div data-reveal style={{ transitionDelay: "240ms" }} className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-16">
          <Link
            to="/register"
            className="group inline-flex items-center gap-2 bg-stone-900 text-white px-7 py-4 rounded-full font-bold shadow-xl shadow-stone-900/10 hover:bg-orange-600 transition-all active:scale-95"
          >
            Start for free
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 bg-white text-stone-900 border border-stone-200 px-7 py-4 rounded-full font-bold hover:border-stone-300 hover:-translate-y-0.5 transition-all"
          >
            Explore the workspace
          </Link>
        </div>

        {/* Dashboard mockup */}
        <HeroMockup />
      </div>
    </section>
  );
}

function HeroMockup() {
  return (
    <div data-reveal style={{ transitionDelay: "320ms" }} className="relative max-w-5xl mx-auto perspective-[1000px]">
      <div className="rounded-3xl border border-stone-200 bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-4 py-3 border-b border-stone-100 bg-stone-50">
          <div className="w-3 h-3 rounded-full bg-stone-200" />
          <div className="w-3 h-3 rounded-full bg-stone-200" />
          <div className="w-3 h-3 rounded-full bg-stone-200" />
          <div className="ml-3 flex-1 max-w-xs mx-auto bg-white border border-stone-200 rounded-md text-[10px] text-stone-400 px-2 py-1 text-center">
            zabaku.app / workspace
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 p-4 md:p-6 bg-white text-left">
          {/* Progress card */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-stone-800 text-sm">Sprint 24</h4>
              <span className="text-[10px] bg-stone-100 text-stone-500 px-2 py-1 rounded">Today</span>
            </div>
            <div className="mb-1 flex justify-between text-xs">
              <span className="text-stone-500">Progress</span>
              <span className="text-orange-600 font-bold">85%</span>
            </div>
            <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
              <div className="w-[85%] bg-gradient-to-r from-orange-600 to-orange-400 h-full rounded-full relative overflow-hidden">
                <div className="absolute inset-0 bg-white/30 shimmer" />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {["Todo","Doing","Done"].map((c, i) => (
                <div key={c} className="rounded-lg bg-stone-50 p-2 text-center">
                  <div className="text-[10px] text-stone-400">{c}</div>
                  <div className="text-sm font-bold text-stone-800">{[8, 5, 21][i]}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Up next */}
          <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
            <h4 className="font-bold text-stone-800 text-sm mb-4 flex justify-between items-center">
              Up Next
              <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-600 text-[10px] flex items-center justify-center">3</span>
            </h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 border-2 border-stone-300 rounded mt-0.5" />
                <span className="text-xs font-medium text-stone-400 line-through decoration-stone-300">Morning sync</span>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 border-2 border-orange-500 bg-orange-50 rounded mt-0.5 flex items-center justify-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-sm" />
                </div>
                <div>
                  <span className="text-xs font-medium text-stone-800">Ship landing page</span>
                  <span className="block text-[10px] text-orange-600 font-bold mt-1 bg-orange-50 px-1.5 py-0.5 rounded w-fit">High Priority</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-4 h-4 border-2 border-stone-300 rounded mt-0.5" />
                <span className="text-xs font-medium text-stone-600">Review mobile designs</span>
              </div>
            </div>
          </div>

          {/* Velocity */}
          <div className="rounded-2xl bg-stone-900 text-white p-5 shadow-sm relative overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-bold text-sm">Velocity</h4>
              <TrendingUp className="h-4 w-4 text-orange-400" />
            </div>
            <div className="text-3xl font-serif">42<span className="text-sm text-stone-400 font-sans"> pts</span></div>
            <div className="text-[11px] text-stone-400 mb-3">+18% vs last sprint</div>
            <div className="flex items-end gap-1 h-16">
              {[30,45,32,60,48,70,85].map((h, i) => (
                <div key={i} className="flex-1 rounded-sm bg-gradient-to-t from-orange-600 to-orange-400" style={{ height: `${h}%`, opacity: 0.4 + i * 0.08 }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI summary */}
      <div className="absolute -bottom-6 right-4 md:right-12 bg-white/95 backdrop-blur-xl shadow-2xl border border-stone-200 p-4 rounded-xl animate-float hidden md:flex items-center gap-4 z-20 max-w-xs">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 border border-amber-200 flex items-center justify-center text-amber-600 shadow-sm">
          <Wand2 className="h-5 w-5" />
        </div>
        <div>
          <div className="text-xs font-bold text-stone-800 mb-0.5">AI Summary Ready</div>
          <div className="text-[10px] text-stone-500 leading-tight">Condensed 4 meetings and 12 docs into a daily briefing.</div>
        </div>
        <button className="w-6 h-6 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500">
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}

/* ============ FEATURES ============ */
function Features() {
  return (
    <section id="features" className="py-16 md:py-24 px-4 sm:px-6 overflow-hidden">
      <div data-reveal className="max-w-7xl mx-auto rounded-3xl bg-white border border-stone-200 p-6 sm:p-10 md:p-16 relative overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="relative group">
            <div className="absolute top-4 left-4 w-full h-full bg-stone-100 rounded-2xl transform rotate-3 -z-10 transition group-hover:rotate-6" />
            <div className="rounded-2xl shadow-xl border border-stone-100 bg-white w-full h-[380px] sm:h-[450px] overflow-hidden p-6 sm:p-8 relative transform -rotate-1 group-hover:rotate-0 transition duration-500">
              <div className="flex items-center gap-3 mb-6 opacity-50">
                <ArrowRight className="h-4 w-4 rotate-180" />
                <div className="text-xs">Projects / Q1 Goals</div>
              </div>
              <h2 className="text-3xl font-serif text-stone-900 mb-6">Launch Strategy</h2>
              <div className="space-y-4">
                <p className="text-sm text-stone-600 leading-relaxed">
                  The primary objective is to streamline the onboarding flow.
                </p>
                <div className="pl-4 border-l-2 border-stone-300 italic text-stone-500 text-sm">
                  "Simplicity is the ultimate sophistication."
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5" />
                    <span>Reduce steps from 5 to 3</span>
                  </li>
                  <li className="flex items-start gap-2 text-sm text-stone-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mt-1.5" />
                    <span>Implement <span className="bg-blue-100 text-blue-800 px-1 rounded">@SSO Login</span></span>
                  </li>
                </ul>
                <div className="absolute bottom-6 left-6 right-6 sm:bottom-12 sm:left-12 sm:right-12 bg-white/95 backdrop-blur border border-stone-200 shadow-2xl rounded-lg p-2 animate-float">
                  <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 px-2">Insert</div>
                  <div className="flex items-center gap-3 p-2 hover:bg-stone-100 rounded cursor-pointer">
                    <div className="w-6 h-6 bg-amber-100 text-amber-600 rounded flex items-center justify-center"><Wand2 className="h-3 w-3" /></div>
                    <span className="text-sm font-medium">Ask AI to summarize</span>
                  </div>
                  <div className="flex items-center gap-3 p-2 hover:bg-stone-100 rounded cursor-pointer">
                    <div className="w-6 h-6 bg-green-100 text-green-600 rounded flex items-center justify-center"><Kanban className="h-3 w-3" /></div>
                    <span className="text-sm font-medium">Kanban board</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <span className="text-xs font-bold tracking-widest text-orange-600 uppercase mb-2 block">Create</span>
            <h2 className="font-serif text-4xl sm:text-5xl mb-6 text-stone-900 leading-tight">
              Flow without <span className="italic">friction</span>
            </h2>
            <p className="text-lg text-stone-600 mb-8 leading-relaxed">
              A writing experience that disappears when you don't need it and appears exactly when you do.
              Use <code className="bg-stone-100 px-1.5 py-0.5 rounded text-sm">/</code> commands to summon powerful blocks.
            </p>

            <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-8">
              {[
                { icon: Zap, title: "Slash commands", body: "Summon anything, instantly." },
                { icon: Bot, title: "AI blocks", body: "Draft, summarize, plan." },
                { icon: Kanban, title: "Live Kanban", body: "Drag, drop, ship." },
                { icon: CheckCircle2, title: "Nested tasks", body: "Break big things down." },
              ].map((f) => (
                <div key={f.title} className="flex items-start gap-3">
                  <f.icon className="h-5 w-5 text-stone-400 mt-1" />
                  <div>
                    <h4 className="font-bold text-sm">{f.title}</h4>
                    <p className="text-xs text-stone-500">{f.body}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/design-system"
              className="inline-flex items-center gap-2 text-stone-900 font-bold border-b-2 border-stone-900 hover:text-orange-600 hover:border-orange-600 transition pb-1 w-fit"
            >
              Explore the system <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ PLANNING BENTO ============ */
function Planning() {
  return (
    <section id="planning" className="py-16 md:py-24 px-4 sm:px-6 bg-stone-50">
      <div data-reveal className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          <div className="lg:col-span-4 order-2 lg:order-1">
            <span className="text-xs font-bold tracking-widest text-orange-600 uppercase mb-2 block">Plan</span>
            <h2 className="font-serif text-4xl sm:text-5xl mb-4 text-stone-900 leading-tight">
              Your day,<br /><span className="italic">deciphered</span>
            </h2>
            <p className="text-stone-600 mb-8 leading-relaxed">
              Don't just list tasks. Schedule them. Zabaku combines your calendar and to-dos into a
              single, unified timeline — automatically arranged by AI.
            </p>
            <Link to="/tasks" className="inline-flex items-center gap-2 text-stone-900 font-bold border-b-2 border-stone-900 hover:text-orange-600 hover:border-orange-600 transition pb-1 w-fit">
              See how it works <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 gap-4 order-1 lg:order-2 lg:min-h-[500px]">
            {/* Schedule */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 col-span-2 md:col-span-1 hover:shadow-lg transition duration-300 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-amber-500" />
              <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-lg">Schedule</h4>
                <span className="text-xs bg-stone-100 px-2 py-1 rounded text-stone-500">Today</span>
              </div>
              <div className="space-y-4 relative">
                <div className="absolute left-[50px] top-0 bottom-0 w-px bg-stone-100" />
                <div className="flex gap-4 items-start">
                  <span className="text-xs text-stone-400 w-10 text-right mt-1">10:00</span>
                  <div className="bg-blue-50 border border-blue-100 p-2 rounded-lg flex-1">
                    <div className="text-xs font-bold text-blue-700">Design Critique</div>
                    <div className="text-[10px] text-blue-500">with Sarah & Tom</div>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <span className="text-xs text-stone-400 w-10 text-right mt-1">11:30</span>
                  <div className="bg-orange-50 border border-orange-100 p-2 rounded-lg flex-1 translate-x-2 shadow-lg">
                    <div className="text-xs font-bold text-orange-700">Client Call</div>
                    <div className="text-[10px] text-orange-500">Zoom Link • 30m</div>
                  </div>
                </div>
                <div className="flex gap-4 items-center">
                  <span className="text-xs font-bold text-red-500 w-10 text-right">12:15</span>
                  <div className="h-px bg-red-500 flex-1 relative">
                    <div className="absolute -left-1 -top-1 w-2 h-2 bg-red-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Up Next */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 col-span-2 md:col-span-1 hover:shadow-lg transition duration-300 flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-lg">Up Next</h4>
                <div className="flex -space-x-2">
                  <div className="w-6 h-6 rounded-full bg-orange-200 border border-white" />
                  <div className="w-6 h-6 rounded-full bg-blue-200 border border-white" />
                </div>
              </div>
              <div className="space-y-3 flex-1">
                <div className="p-3 border border-stone-200 rounded-xl flex items-start gap-3 bg-stone-50 cursor-grab active:cursor-grabbing hover:bg-white transition">
                  <div className="w-4 h-4 border-2 border-stone-300 rounded-full mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-stone-800">Update API Docs</p>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-medium">Dev</span>
                      <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-medium">Urgent</span>
                    </div>
                  </div>
                </div>
                <div className="p-3 border border-stone-100 rounded-xl flex items-center gap-3 opacity-50">
                  <div className="w-4 h-4 bg-stone-300 rounded-full flex items-center justify-center text-white">
                    <Check className="h-2.5 w-2.5" />
                  </div>
                  <p className="text-sm font-medium text-stone-500 line-through">Email Newsletter</p>
                </div>
              </div>
            </div>

            {/* Weekly goal */}
            <div className="col-span-2 bg-stone-900 text-white p-6 rounded-3xl shadow-lg flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full border-4 border-orange-500 flex items-center justify-center text-lg font-bold">85%</div>
                <div>
                  <h4 className="font-bold">Weekly Goal</h4>
                  <p className="text-xs text-stone-400">Finish 12 tasks</p>
                </div>
              </div>
              <Link to="/analytics" className="bg-white text-black px-4 py-2 rounded-full text-xs font-bold hover:bg-stone-200 transition">
                View Report
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ ORGANIZATION ============ */
function Organization() {
  const cards = [
    {
      title: "Spaces",
      body: "Separate Work, Life, and Hobby into distinct areas.",
      icon: Briefcase,
      accent: "orange",
      hover: "hover:border-orange-200",
      mock: (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-2 space-y-2 mt-auto">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-orange-50/50 border border-orange-100">
            <div className="w-8 h-8 rounded bg-orange-100 flex items-center justify-center text-orange-600"><Briefcase className="h-4 w-4" /></div>
            <div>
              <div className="text-xs font-bold text-stone-800">Acme Corp</div>
              <div className="text-[10px] text-stone-400">12 members</div>
            </div>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg opacity-60">
            <div className="w-8 h-8 rounded bg-green-100 flex items-center justify-center text-green-600"><Leaf className="h-4 w-4" /></div>
            <div>
              <div className="text-xs font-bold text-stone-800">Personal</div>
              <div className="text-[10px] text-stone-400">Private</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "AI Copilot",
      body: "Chat with your workspace. Draft, plan, and summarize.",
      icon: Bot,
      accent: "purple",
      hover: "hover:border-blue-200",
      mock: (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 mt-auto space-y-2">
          <div className="flex gap-2">
            <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center"><Bot className="h-3 w-3" /></div>
            <div className="text-[10px] text-stone-600 bg-stone-50 rounded-lg p-2 flex-1">
              Drafted your sprint plan. 12 tasks queued.
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <div className="text-[10px] text-white bg-orange-600 rounded-lg p-2 max-w-[80%]">
              Reprioritize by customer impact
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Team",
      body: "Multiplayer, threaded comments, and live cursors.",
      icon: Users,
      accent: "green",
      hover: "hover:border-green-200",
      mock: (
        <div className="bg-white rounded-xl shadow-sm border border-stone-100 p-3 mt-auto">
          <div className="flex -space-x-2 mb-3">
            {["bg-orange-300","bg-blue-300","bg-amber-300","bg-green-300"].map((c) => (
              <div key={c} className={`w-8 h-8 rounded-full border-2 border-white ${c}`} />
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-stone-100 text-[10px] text-stone-600 flex items-center justify-center font-bold">+8</div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-stone-500">
            <MessageSquare className="h-3 w-3" /> 4 comments · 2 unread
          </div>
        </div>
      ),
    },
  ];

  return (
    <section id="organization" className="py-16 md:py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto text-center mb-12 md:mb-16">
        <span data-reveal className="text-xs font-bold tracking-widest text-stone-400 uppercase mb-2 block">Organize</span>
        <h2 data-reveal style={{ transitionDelay: "80ms" }} className="font-serif text-4xl sm:text-5xl mb-6 text-stone-900">
          Find flow in <span className="italic">structure</span>
        </h2>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {cards.map((c, i) => (
          <div
            key={c.title}
            data-reveal
            style={{ transitionDelay: `${i * 100}ms` }}
            className={`group bg-white p-1 rounded-3xl border border-stone-200 ${c.hover} hover:shadow-xl hover:-translate-y-2 transition duration-500`}
          >
            <div className="bg-stone-50 rounded-[20px] p-8 h-full flex flex-col">
              <div className={`w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-${c.accent}-600 mb-6 group-hover:scale-110 transition`}>
                <c.icon className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-xl mb-2 text-stone-900">{c.title}</h3>
              <p className="text-sm text-stone-500 mb-8">{c.body}</p>
              {c.mock}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ============ PRICING ============ */
function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24 px-4 sm:px-6 bg-stone-50">
      <div className="max-w-5xl mx-auto text-center mb-12 md:mb-16">
        <span data-reveal className="text-xs font-bold tracking-widest text-orange-600 uppercase mb-2 block">Pricing</span>
        <h2 data-reveal style={{ transitionDelay: "80ms" }} className="font-serif text-4xl sm:text-5xl text-stone-900">
          Simple, <span className="italic">honest</span> pricing
        </h2>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Free */}
        <div data-reveal className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-xl text-stone-900">Free</h3>
          <p className="text-sm text-stone-500 mt-1">For getting started.</p>
          <div className="my-6">
            <span className="text-4xl font-serif font-bold text-stone-900">$0</span>
            <span className="text-stone-400"> / forever</span>
          </div>
          <Link to="/register" className="w-full py-3 rounded-xl border border-stone-200 font-bold text-stone-800 hover:bg-stone-50 transition mb-8 text-center">
            Start free
          </Link>
          <div className="space-y-4">
            {["3 projects", "Basic AI features", "5 team members"].map((f) => (
              <div key={f} className="flex items-start gap-3 text-sm text-stone-600">
                <Check className="h-4 w-4 text-orange-600 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pro (featured, dark) */}
        <div data-reveal style={{ transitionDelay: "100ms" }} className="bg-stone-900 text-white rounded-3xl p-8 border border-stone-900 shadow-2xl relative flex flex-col">
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-orange-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Most Popular
          </span>
          <h3 className="font-bold text-xl">Pro</h3>
          <p className="text-sm text-stone-400 mt-1">For serious builders.</p>
          <div className="my-6">
            <span className="text-4xl font-serif font-bold">$12</span>
            <span className="text-stone-400"> / seat</span>
          </div>
          <Link to="/register" className="w-full py-3 rounded-xl bg-orange-600 hover:bg-orange-500 font-bold transition mb-8 text-center">
            Get Zabaku Pro
          </Link>
          <div className="space-y-4">
            {["Unlimited projects","Advanced AI features","Unlimited file uploads","Version history (30 days)"].map((f) => (
              <div key={f} className="flex items-start gap-3 text-sm text-stone-300">
                <div className="bg-orange-500/20 p-0.5 rounded-full">
                  <Check className="h-3 w-3 text-orange-400" />
                </div>
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div data-reveal style={{ transitionDelay: "200ms" }} className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm flex flex-col">
          <h3 className="font-bold text-xl text-stone-900">Team</h3>
          <p className="text-sm text-stone-500 mt-1">For synchronized squads.</p>
          <div className="my-6">
            <span className="text-4xl font-serif font-bold text-stone-900">$25</span>
            <span className="text-stone-400"> / seat</span>
          </div>
          <button className="w-full py-3 rounded-xl border border-stone-200 font-bold text-stone-800 hover:bg-stone-50 transition mb-8">
            Contact Sales
          </button>
          <div className="space-y-4">
            {["Everything in Pro","Shared workspaces","Admin controls","Priority support"].map((f) => (
              <div key={f} className="flex items-start gap-3 text-sm text-stone-600">
                <Check className="h-4 w-4 text-orange-600 mt-0.5" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ CTA ============ */
function CTA() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6">
      <div data-reveal className="max-w-7xl mx-auto rounded-[2rem] md:rounded-[3rem] bg-stone-900 relative overflow-hidden text-center py-16 md:py-24 px-6">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-orange-600/30 rounded-full blur-[100px]" />
        <div className="relative z-10">
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl italic mb-6 text-white">Find your vantage point.</h2>
          <p className="text-xl text-stone-400 mb-10 max-w-2xl mx-auto">
            Join the new era of productivity. Free forever for individuals.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="bg-white text-stone-900 px-8 py-4 rounded-full flex items-center justify-center gap-3 hover:bg-orange-50 transition shadow-lg hover:scale-105 font-bold">
              Start for free
            </Link>
            <a href="#pricing" className="text-white border border-stone-700 px-8 py-4 rounded-full font-medium hover:bg-stone-800 transition">
              View Pricing
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============ FOOTER ============ */
function Footer() {
  return (
    <footer className="bg-white text-stone-500 py-20 text-sm border-t border-stone-100">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 text-stone-900 mb-6">
            <img src={zabakuLogo.url} alt="Zabaku" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-lg tracking-tight">Zabaku</span>
          </div>
          <p className="mb-6 text-stone-400">Clarity for building startups.</p>
          <div className="flex gap-3 text-stone-400">
            <a href="#" className="hover:text-orange-600 transition"><Twitter className="h-4 w-4" /></a>
            <a href="#" className="hover:text-orange-600 transition"><Github className="h-4 w-4" /></a>
            <a href="#" className="hover:text-orange-600 transition"><Linkedin className="h-4 w-4" /></a>
          </div>
        </div>

        <FooterCol title="Product" links={[
          { label: "Dashboard", to: "/dashboard" },
          { label: "Projects", to: "/projects" },
          { label: "Tasks", to: "/tasks" },
          { label: "AI Workspace", to: "/ai" },
        ]} />
        <FooterCol title="Resources" links={[
          { label: "Design System", to: "/design-system" },
          { label: "Analytics", to: "/analytics" },
          { label: "Team", to: "/team" },
          { label: "Notifications", to: "/notifications" },
        ]} />
        <FooterCol title="Company" links={[
          { label: "Profile", to: "/profile" },
          { label: "Settings", to: "/settings" },
          { label: "Sign in", to: "/login" },
          { label: "Register", to: "/register" },
        ]} />
        <FooterCol title="Integrations" links={[
          { label: "GitHub", to: "/settings" },
          { label: "Slack", to: "/settings" },
          { label: "Figma", to: "/settings" },
          { label: "Linear", to: "/settings" },
        ]} />
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-stone-100 flex flex-col md:flex-row justify-between items-center gap-3">
        <p>© 2026 Zabaku Inc.</p>
        <div className="flex gap-2 items-center">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs">All systems operational</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-stone-900 font-bold uppercase text-[10px] tracking-widest mb-2">{title}</h4>
      {links.map((l) => (
        <Link key={l.label} to={l.to} className="hover:text-orange-600 transition">
          {l.label}
        </Link>
      ))}
    </div>
  );
}

/* ============ BACK TO TOP ============ */
function BackToTop() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <button
      ref={ref}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className={`fixed bottom-24 md:bottom-6 right-6 z-40 bg-stone-900 text-white w-12 h-12 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center hover:bg-stone-800 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-24 opacity-0 pointer-events-none"
      }`}
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
