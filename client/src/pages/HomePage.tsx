import { AlertCircle, ArrowRight, ChevronDown, Plus, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { ProductCard } from "@/components/cards/ProductCard";
import { CATEGORIES as categories, type Product } from "@/lib/types";
import { getAllProducts, seedInitialProducts } from "@/services/firestore";
import { useEffect } from "react";

// ─── Local types ──────────────────────────────────────────────────────────────
type FeedState = "ready" | "loading" | "empty" | "error";

// ─── Local sub-components ─────────────────────────────────────────────────────
function ArrowDownSmall() {
  return (
    <span className="inline-block rotate-90">
      <ArrowRight size={15} />
    </span>
  );
}

function LoadingGrid() {
  return (
    <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-[0.82] rounded-[20px] bg-[#e5e0d7]" />
          <div className="mt-3 h-3 w-3/4 rounded-full bg-[#e5e0d7]" />
          <div className="mt-2 h-2.5 w-1/2 rounded-full bg-[#e5e0d7]" />
        </div>
      ))}
    </div>
  );
}

function EmptyFeed({ onReset }: { onReset: () => void }) {
  return (
    <div className="my-10 flex min-h-[290px] flex-col items-center justify-center rounded-[24px] border border-dashed border-[#1d1d1a]/20 bg-[#efebe4] px-6 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#d7ff3f]">
        <Sparkles size={20} />
      </span>
      <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.06em]">Nothing in this rack yet</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#1d1d1a]/55">
        Try widening your edit, or be the first to list something in this category.
      </p>
      <button onClick={onReset} className="button-secondary mt-5">Reset filters</button>
    </div>
  );
}

function ErrorFeed({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="my-10 flex min-h-[290px] flex-col items-center justify-center rounded-[24px] border border-[#efb6a7] bg-[#fff4f0] px-6 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#efb6a7] text-[#792d1d]">
        <AlertCircle size={20} />
      </span>
      <h3 className="font-display mt-5 text-2xl font-bold tracking-[-0.06em]">The rack took a breather</h3>
      <p className="mt-2 max-w-sm text-sm leading-6 text-[#1d1d1a]/55">
        We couldn't load the latest pieces. Your saved edits are safe.
      </p>
      <button onClick={onRetry} className="button-primary mt-5">
        Try again <ArrowRight size={14} className="rotate-[135deg]" />
      </button>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [category, setCategory] = useState("All");
  const [feedState, setFeedState] = useState<FeedState>("loading");
  const [products, setProducts] = useState<Product[]>([]);

  const fetchProducts = async () => {
    setFeedState("loading");
    try {
      const data = await getAllProducts();
      setProducts(data);
      if (data.length === 0) {
        setFeedState("empty");
      } else {
        setFeedState("ready");
      }
    } catch (error) {
      setFeedState("error");
      toast.error("Failed to load products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSeed = async () => {
    try {
      setFeedState("loading");
      await seedInitialProducts();
      toast.success("Test products seeded!");
      await fetchProducts();
    } catch (error) {
      toast.error("Failed to seed products.");
      setFeedState("empty");
    }
  };

  const filteredProducts = useMemo(
    () => (category === "All" ? products : products.filter((p) => p.type === category)),
    [category, products],
  );

  return (
    <AppShell active="shop">
      <div className="mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        {/* Hero */}
        <section className="relative overflow-hidden pb-12 pt-7 sm:pb-16 sm:pt-12 lg:pb-20 lg:pt-16">
          <div className="absolute -right-16 -top-24 hidden h-72 w-72 rounded-full bg-[#d7ff3f]/60 blur-3xl sm:block" />
          <div className="relative grid items-end gap-10 lg:grid-cols-[1.08fr_0.92fr] lg:gap-16">
            <div className="max-w-2xl">
              <div className="eyebrow">
                <span className="h-1.5 w-1.5 rounded-full bg-[#d7ff3f]" /> The considered closet
              </div>
              <h1 className="font-display mt-5 max-w-xl text-[clamp(3.25rem,12vw,7.8rem)] font-bold leading-[0.86] tracking-[-0.09em]">
                Wear it.<br />
                <span className="text-[#737067]">Share it.</span>
              </h1>
              <p className="mt-6 max-w-md text-[15px] leading-7 text-[#1d1d1a]/62 sm:text-base">
                Threadline brings good clothes back into rotation. Shop the edit, or trade from your own wardrobe.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <a href="#drop" className="button-primary">
                  Explore the edit <ArrowDownSmall />
                </a>
                <Link href="/wardrobe" className="button-secondary">
                  List an item <Plus size={15} />
                </Link>
              </div>
            </div>
            <div className="relative grid grid-cols-2 gap-3 sm:mx-auto sm:max-w-xl lg:mx-0 lg:max-w-none">
              <div className="group relative mt-8 aspect-[0.78] overflow-hidden rounded-[24px] bg-[#d7c4b7] sm:mt-16">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
                  alt="Street style editorial"
                  className="h-full w-full object-cover mix-blend-multiply transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-[#f7f5f0]/85 p-3 backdrop-blur-md">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1d1d1a]/55">01 / New rotation</p>
                  <p className="mt-1 font-display text-lg font-bold leading-none tracking-[-0.05em]">The in-between layer</p>
                </div>
              </div>
              <div className="relative aspect-[0.78] overflow-hidden rounded-[24px] bg-[#cbd8cf]">
                <img
                  src="https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=85"
                  alt="Minimal wardrobe styling"
                  className="h-full w-full object-cover mix-blend-multiply transition duration-700 hover:scale-105"
                />
                <div className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-[#d7ff3f] text-[#1d1d1a]">
                  <ArrowRight size={19} className="-rotate-45" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product feed */}
        <section id="drop" className="border-t border-[#1d1d1a]/10 py-8 sm:py-10">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="eyebrow">
                Curated near you <span className="ml-1 text-[#1d1d1a]/35">· 24 pieces</span>
              </div>
              <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.07em] sm:text-4xl">The weekly edit</h2>
            </div>
            <button
              onClick={() => toast("Filters are saved for this session.")}
              className="flex items-center gap-2 self-start rounded-full border border-[#1d1d1a]/15 px-3 py-2 text-xs font-bold transition hover:border-[#1d1d1a]/50 sm:self-auto"
            >
              Filter &amp; sort <ChevronDown size={15} />
            </button>
          </div>

          {/* Category chips */}
          <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
            {categories.map((item) => (
              <button
                key={item}
                onClick={() => { setCategory(item); setFeedState("ready"); }}
                className={`category-chip ${category === item ? "category-chip-active" : ""}`}
              >
                {item}
              </button>
            ))}
          </div>

          {/* Feed states */}
          {feedState === "ready" && (
            filteredProducts.length === 0 ? (
              <EmptyFeed onReset={() => { setCategory("All"); fetchProducts(); }} />
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-x-3 gap-y-9 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4 lg:gap-x-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )
          )}
          {feedState === "loading" && <LoadingGrid />}
          {feedState === "empty" && (
            <div className="flex flex-col items-center">
              <EmptyFeed onReset={() => { setCategory("All"); fetchProducts(); }} />
              <button 
                onClick={handleSeed}
                className="mt-4 text-xs font-bold underline underline-offset-4 text-[#1d1d1a]/60 hover:text-[#1d1d1a]"
              >
                [Dev] Seed Initial Products
              </button>
            </div>
          )}
          {feedState === "error" && <ErrorFeed onRetry={fetchProducts} />}
        </section>

        {/* Swap CTA banner */}
        <section className="mb-8 mt-12 rounded-[26px] bg-[#1d1d1a] px-6 py-7 text-[#f7f5f0] sm:mb-14 sm:px-10 sm:py-9 lg:flex lg:items-center lg:justify-between">
          <div>
            <div className="eyebrow text-[#d7ff3f]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d7ff3f]" /> The swap loop
            </div>
            <h2 className="font-display mt-3 max-w-lg text-3xl font-bold leading-[0.95] tracking-[-0.07em] sm:text-4xl">
              Your next favourite thing might already be in someone else's closet.
            </h2>
          </div>
          <Link href="/swap" className="button-lime mt-7 w-fit lg:mt-0">
            See swap requests <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    </AppShell>
  );
}
