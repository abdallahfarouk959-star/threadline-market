import { ArrowLeft, Search, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";
import { MobileNav } from "./MobileNav";
import { useAuth } from "@/contexts/AuthContext";
import { auth } from "@/lib/firebase";

export interface ShellProps {
  children: React.ReactNode;
  active?: string;
  showBack?: boolean;
  title?: string;
}

export function AppShell({ children, active = "shop", showBack, title }: ShellProps) {
  const [, navigate] = useLocation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#f7f5f0] text-[#1d1d1a] selection:bg-[#d7ff3f] selection:text-[#1d1d1a]">
      <header className="sticky top-0 z-40 border-b border-[#1d1d1a]/10 bg-[#f7f5f0]/92 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-4 sm:px-6 lg:px-10">
          <div className="flex items-center gap-3">
            {showBack ? (
              <button aria-label="Go back" onClick={() => navigate("/")} className="icon-button mr-1 lg:hidden">
                <ArrowLeft size={18} />
              </button>
            ) : null}
            <button onClick={() => navigate("/")} className="group flex items-center gap-2" aria-label="Threadline home">
              <span className="grid h-7 w-7 place-items-center rounded-[9px] bg-[#1d1d1a] text-[#d7ff3f] transition-transform group-hover:rotate-6">
                <span className="h-2.5 w-2.5 rounded-full border-2 border-[#d7ff3f]" />
              </span>
              <span className="font-display text-[22px] font-bold tracking-[-0.06em]">threadline</span>
            </button>
            {title ? <span className="hidden text-sm text-[#1d1d1a]/45 sm:block">/ {title}</span> : null}
          </div>
          <nav className="hidden items-center gap-7 text-[13px] font-semibold tracking-[-0.01em] lg:flex">
            <Link className={active === "shop" ? "nav-link nav-link-active" : "nav-link"} href="/">Shop</Link>
            <Link className={active === "wardrobe" ? "nav-link nav-link-active" : "nav-link"} href="/wardrobe">Wardrobe</Link>
            <Link className={active === "swaps" ? "nav-link nav-link-active" : "nav-link"} href="/swap">
              Swaps <span className="ml-1 rounded-full bg-[#d7ff3f] px-1.5 py-0.5 text-[10px]">2</span>
            </Link>
          </nav>
          <div className="flex items-center gap-1.5">
            <button className="icon-button hidden sm:grid" aria-label="Search" onClick={() => toast("Search is ready for your next idea.")}>
              <Search size={18} />
            </button>
            <button className="icon-button relative" aria-label="View bag" onClick={() => toast("Your bag is empty for now.")}>
              <ShoppingBag size={18} />
              <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#d7ff3f] ring-2 ring-[#f7f5f0]" />
            </button>
            {user ? (
              <div className="flex items-center gap-3 ml-2">
                <button
                  onClick={() => navigate("/wardrobe")}
                  className="grid h-9 w-9 place-items-center rounded-full bg-[#dbd4c6] text-[11px] font-bold ring-2 ring-[#f7f5f0] transition hover:ring-[#d7ff3f]"
                >
                  {user.email?.charAt(0).toUpperCase() || "U"}
                </button>
                <button
                  onClick={() => {
                    auth.signOut();
                    toast.success("Logged out successfully");
                  }}
                  className="text-xs font-bold underline underline-offset-4 hidden sm:block"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="ml-2 rounded-full bg-[#1d1d1a] px-4 py-1.5 text-xs font-bold text-[#f7f5f0] hidden sm:block"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </header>
      <main className="pb-24 lg:pb-10">{children}</main>
      <MobileNav active={active} />
    </div>
  );
}
