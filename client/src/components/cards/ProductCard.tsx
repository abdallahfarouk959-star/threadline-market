import { Heart, RefreshCcw } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [, navigate] = useLocation();
  const [liked, setLiked] = useState(false);

  return (
    <article
      className="group cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
      onKeyDown={(event) => event.key === "Enter" && navigate(`/product/${product.id}`)}
      tabIndex={0}
      role="button"
    >
      <div
        className="relative aspect-[0.82] overflow-hidden rounded-[20px] bg-[#ded8ce]"
        style={{ backgroundColor: product.color }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover mix-blend-multiply transition duration-500 ease-out group-hover:scale-[1.04]"
        />
        <span className="absolute left-3 top-3 rounded-full bg-[#f7f5f0]/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] backdrop-blur-sm">
          {product.tag}
        </span>
        <button
          aria-label={liked ? "Remove from favorites" : "Add to favorites"}
          onClick={(event) => {
            event.stopPropagation();
            setLiked(!liked);
            toast(liked ? "Removed from favorites." : "Saved to favorites.");
          }}
          className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full backdrop-blur-md transition ${
            liked ? "bg-[#d7ff3f] text-[#1d1d1a]" : "bg-[#f7f5f0]/80 text-[#1d1d1a] hover:bg-[#d7ff3f]"
          }`}
        >
          <Heart size={15} fill={liked ? "currentColor" : "none"} />
        </button>
        {product.tag === "Swap friendly" ? (
          <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-[#1d1d1a] px-2.5 py-1 text-[10px] font-bold text-[#d7ff3f]">
            <RefreshCcw size={11} /> swap
          </span>
        ) : null}
      </div>
      <div className="flex items-start justify-between gap-3 px-1 pt-3">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-bold tracking-[-0.02em]">{product.name}</p>
          <p className="mt-1 text-[11px] text-[#1d1d1a]/50">
            {product.brand} · {product.size} · {product.condition}
          </p>
        </div>
        <p className="shrink-0 text-[13px] font-bold">${product.price}</p>
      </div>
    </article>
  );
}
