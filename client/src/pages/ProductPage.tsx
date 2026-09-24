import {
  ArrowLeft,
  CircleHelp,
  Heart,
  MessageCircle,
  RefreshCcw,
  ShoppingBag,
  Sparkles,
  Star,
  Tag,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import type { Product } from "@/lib/types";
import { getProductById } from "@/services/firestore";
import { useSwapStore } from "@/store/useSwapStore";
import { Loader2 } from "lucide-react";

// ─── Local sub-component ──────────────────────────────────────────────────────
function Detail({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-[#efebe4] p-4">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#f7f5f0]">{icon}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1d1d1a]/45">{label}</p>
        <p className="mt-1 text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductPage() {
  const [, navigate] = useLocation();
  const setTargetItem = useSwapStore((state) => state.setTargetItem);
  const [, params] = useRoute<{ id: string }>("/product/:id");
  
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!params?.id) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const data = await getProductById(params.id);
        setProduct(data);
      } catch (error) {
        toast.error("Failed to load product.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [params?.id]);

  if (isLoading) {
    return (
      <AppShell active="shop" showBack title="Loading...">
        <div className="mx-auto flex max-w-[1380px] flex-col items-center justify-center px-4 py-32 sm:px-6 lg:px-10">
          <Loader2 className="h-8 w-8 animate-spin text-[#1d1d1a]/50" />
        </div>
      </AppShell>
    );
  }

  // Graceful fallback if the ID doesn't match any product
  if (!product) {
    return (
      <AppShell active="shop" showBack title="Product">
        <div className="mx-auto flex max-w-[1380px] flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-10">
          <h1 className="font-display text-4xl font-bold tracking-[-0.07em]">Product not found</h1>
          <p className="mt-4 text-sm text-[#1d1d1a]/55">This item may have been sold or removed from the edit.</p>
          <button onClick={() => navigate("/")} className="button-primary mt-6">
            Back to the edit
          </button>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell active="shop" showBack title="Product">
      <div className="mx-auto max-w-[1380px] px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
        <button
          onClick={() => navigate("/")}
          className="mb-6 hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#1d1d1a]/50 transition hover:text-[#1d1d1a] lg:flex"
        >
          <ArrowLeft size={15} /> Back to the edit
        </button>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Image */}
          <div
            className="relative aspect-[0.88] overflow-hidden rounded-[26px] sm:aspect-[1.1] lg:aspect-[0.92]"
            style={{ backgroundColor: product.color }}
          >
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover mix-blend-multiply"
            />
            <span className="absolute left-4 top-4 rounded-full bg-[#f7f5f0]/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.12em]">
              {product.tag}
            </span>
            <button
              onClick={() => {
                setSaved(!saved);
                toast(saved ? "Removed from favorites." : "Saved to favorites.");
              }}
              className={`absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full ${saved ? "bg-[#d7ff3f]" : "bg-[#f7f5f0]/90"}`}
            >
              <Heart size={17} fill={saved ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="eyebrow">
              {product.brand} <span className="text-[#1d1d1a]/35">· {product.condition}</span>
            </div>
            <h1 className="font-display mt-4 max-w-xl text-5xl font-bold leading-[0.9] tracking-[-0.08em] sm:text-6xl">
              {product.name}
            </h1>
            <div className="mt-5 flex items-center gap-3">
              <span className="text-xl font-bold">${product.price}</span>
              <span className="rounded-full bg-[#e7e2d8] px-2.5 py-1 text-[11px] font-bold">Ships in 1–2 days</span>
            </div>
            <p className="mt-6 max-w-lg text-[15px] leading-7 text-[#1d1d1a]/60">{product.description}</p>

            {/* Size */}
            <div className="mt-7 border-y border-[#1d1d1a]/10 py-5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-bold">Size</span>
                <button
                  className="flex items-center gap-1 text-xs font-semibold text-[#1d1d1a]/50"
                  onClick={() => toast("Measurements are coming next.")}
                >
                  Size guide <CircleHelp size={14} />
                </button>
              </div>
              <div className="mt-3 flex gap-2">
                <span className="size-chip size-chip-active">{product.size}</span>
                <span className="size-chip">Fits true to size</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 grid gap-2.5 sm:grid-cols-2">
              <button onClick={() => toast("Added to your bag.")} className="button-primary h-12 justify-center">
                Add to cart <ShoppingBag size={16} />
              </button>
              <button 
                onClick={() => {
                  setTargetItem(product);
                  navigate(`/swap`);
                }} 
                className="button-lime h-12 justify-center"
              >
                Request swap <RefreshCcw size={16} />
              </button>
            </div>

            {/* Seller */}
            <div className="mt-7 flex items-center justify-between rounded-2xl bg-[#efebe4] p-4">
              <div className="flex items-center gap-3">
                <img src={product.sellerImage} alt={product.seller} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-bold">{product.seller}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#1d1d1a]/50">
                    <Star size={11} fill="currentColor" /> 4.9 · 18 swaps
                  </p>
                </div>
              </div>
              <button
                onClick={() => toast("Profile preview opened.")}
                className="text-xs font-bold underline underline-offset-4"
              >
                View profile
              </button>
            </div>
          </div>
        </div>

        {/* Condition details row */}
        <div className="mt-12 grid gap-3 border-t border-[#1d1d1a]/10 pt-7 sm:grid-cols-3">
          <Detail label="Condition" value={product.condition} icon={<Sparkles size={16} />} />
          <Detail label="Material" value="Recycled nylon" icon={<Tag size={16} />} />
          <Detail label="Seller's note" value="Freshly steamed" icon={<MessageCircle size={16} />} />
        </div>
      </div>
    </AppShell>
  );
}
