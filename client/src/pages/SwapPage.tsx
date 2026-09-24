import {
  ArrowUpRight,
  Bell,
  Check,
  RefreshCcw,
  Send,
  Shirt,
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import type { Product, WardrobeItem } from "@/lib/types";
import { useSwapStore } from "@/store/useSwapStore";
import { getUserWardrobe } from "@/services/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

// ─── Local sub-components ─────────────────────────────────────────────────────
function TradeItem({ label, user, item }: { label: string; user: string; item: Product }) {
  return (
    <div className="rounded-[24px] border border-[#1d1d1a]/10 bg-[#efebe4] p-4 sm:p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">{label}</p>
          <p className="mt-2 font-display text-2xl font-bold tracking-[-0.06em]">{item.name}</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d9c7d5] text-[10px] font-bold">
          {item.initials}
        </span>
      </div>
      <div className="mt-5 aspect-[1.2] overflow-hidden rounded-[18px]" style={{ backgroundColor: item.color }}>
        <img src={item.image} alt={item.name} className="h-full w-full object-cover mix-blend-multiply" />
      </div>
      <div className="mt-4 flex items-center justify-between text-xs">
        <span className="font-bold">{user}</span>
        <span className="text-[#1d1d1a]/50">
          Size {item.size} · ${item.price}
        </span>
      </div>
    </div>
  );
}

function ChatBubble({ text, time, mine }: { text: string; time: string; mine?: boolean }) {
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm leading-5 ${
          mine ? "rounded-br-sm bg-[#1d1d1a] text-[#f7f5f0]" : "rounded-bl-sm bg-[#f7f5f0]"
        }`}
      >
        <p>{text}</p>
        <p className={`mt-2 text-[10px] ${mine ? "text-[#f7f5f0]/45" : "text-[#1d1d1a]/35"}`}>{time}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function SwapPage() {
  const [, navigate] = useLocation();
  const { selectedTargetItem, selectedOfferedItem, setOfferedItem, clearSwapDesk, submitSwap } = useSwapStore();
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wardrobeItems, setWardrobeItems] = useState<WardrobeItem[]>([]);

  useEffect(() => {
    if (user) {
      getUserWardrobe(user.uid).then(setWardrobeItems).catch(() => toast.error("Failed to load wardrobe"));
    }
  }, [user]);

  if (!selectedTargetItem) {
    return (
      <AppShell active="swaps" showBack title="Swap desk">
        <div className="mx-auto flex max-w-[1380px] flex-col items-center justify-center px-4 py-20 sm:px-6 lg:px-10">
          <h1 className="font-display text-4xl font-bold tracking-[-0.07em]">No item selected for swap</h1>
          <button onClick={() => navigate("/")} className="button-primary mt-6">
            Explore the edit
          </button>
        </div>
      </AppShell>
    );
  }

  const sellerFirstName = selectedTargetItem.seller.split(' ')[0];

  return (
    <AppShell active="swaps" showBack title="Swap desk">
      <div className="mx-auto max-w-[1380px] px-4 py-7 sm:px-6 sm:py-12 lg:px-10">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <div className="eyebrow">One good thing for another</div>
            <h1 className="font-display mt-3 text-5xl font-bold leading-[0.9] tracking-[-0.08em] sm:text-6xl">
              Make the trade.
            </h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#1d1d1a]/55">
              Choose one piece from your wardrobe to send {sellerFirstName} in exchange for their {selectedTargetItem.name.toLowerCase()}.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#e9e4db] px-3 py-2 text-xs font-bold">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-[#cbd8cf] text-[9px]">{selectedTargetItem.initials}</span>
            {selectedTargetItem.seller} <span className="text-[#1d1d1a]/35">· Brooklyn</span>
          </div>
        </div>

        {/* Sent confirmation banner */}
        {sent ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#b9d76b] bg-[#eff8d4] p-4 text-sm">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#d7ff3f]">
              <Check size={16} />
            </span>
            <div>
              <p className="font-bold">Proposal sent to {sellerFirstName}.</p>
              <p className="mt-0.5 text-xs text-[#1d1d1a]/55">We'll let you know when they respond.</p>
            </div>
            <button onClick={() => setSent(false)} className="ml-auto text-xs font-bold underline underline-offset-4">
              Edit
            </button>
          </div>
        ) : null}

        {/* Trade columns */}
        <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
          <TradeItem label={`${sellerFirstName}'s piece`} user={selectedTargetItem.seller} item={selectedTargetItem} />

          <div className="trade-arrow">
            <RefreshCcw size={19} />
            <span>for</span>
          </div>

          {/* Your offer picker */}
          <div className="rounded-[24px] border border-[#1d1d1a]/10 bg-[#efebe4] p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Your offer</p>
                <p className="mt-2 font-display text-2xl font-bold tracking-[-0.06em]">Pick a piece</p>
              </div>
              <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d7ff3f]">
                <Shirt size={18} />
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2">
              {wardrobeItems.length === 0 ? (
                <div className="col-span-3 text-center text-xs text-[#1d1d1a]/50 py-4">Your closet is empty. Go to Wardrobe to add items.</div>
              ) : (
                wardrobeItems.slice(0, 3).map((item) => (
                  <button
                    key={item.id || item.name}
                    onClick={() => setOfferedItem(item)}
                    className={`text-left ${selectedOfferedItem?.name === item.name ? "ring-2 ring-[#1d1d1a] ring-offset-2 ring-offset-[#efebe4]" : ""} rounded-[14px]`}
                  >
                    <div className="aspect-square overflow-hidden rounded-[14px]" style={{ backgroundColor: item.tone }}>
                      <img src={item.image} alt={item.name} className="h-full w-full object-cover mix-blend-multiply" />
                    </div>
                    <p className="mt-2 truncate text-[10px] font-bold">{item.name}</p>
                  </button>
                ))
              )}
            </div>
            <div className="mt-5 rounded-xl bg-[#f7f5f0] px-3 py-2.5 text-xs text-[#1d1d1a]/55">
              <span className="font-bold text-[#1d1d1a]">Offering:</span> {selectedOfferedItem ? selectedOfferedItem.name : "Select an item"}
            </div>
            <button
              disabled={!selectedTargetItem || !selectedOfferedItem || isSubmitting}
              onClick={async () => { 
                setIsSubmitting(true);
                try {
                  await submitSwap();
                  setSent(true); 
                  toast.success("Your swap proposal is on its way."); 
                  clearSwapDesk();
                } catch (error) {
                  toast.error("Failed to send proposal. Please try again.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              className="button-primary mt-4 h-12 w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Sending..." : "Confirm Swap Proposal"} <Send size={16} />
            </button>
          </div>
        </div>

        {/* Chat + Etiquette */}
        <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_0.8fr]">
          {/* Chat */}
          <div className="rounded-[24px] border border-[#1d1d1a]/10 bg-[#efebe4] p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Conversation</p>
                <h2 className="font-display mt-2 text-2xl font-bold tracking-[-0.06em]">Chat with {sellerFirstName}</h2>
              </div>
              <button onClick={() => toast("Notifications are on.")} className="icon-button">
                <Bell size={16} />
              </button>
            </div>
            <div className="mt-6 space-y-3">
              <ChatBubble text={`Hey Jamie! I love the shape of your linen chore jacket. Open to a swap?`} time="10:42" />
              <ChatBubble text="Absolutely. The shell is exactly what I've been looking for." time="10:45" mine />
              <div className="flex items-center gap-2 pt-2">
                <div className="h-px flex-1 bg-[#1d1d1a]/10" />
                <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1d1d1a]/35">Today</span>
                <div className="h-px flex-1 bg-[#1d1d1a]/10" />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#1d1d1a]/15 bg-[#f7f5f0] p-2">
              <input
                aria-label={`Message ${sellerFirstName}`}
                placeholder="Write a message..."
                className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-[#1d1d1a]/35"
              />
              <button
                onClick={() => toast("Message draft saved.")}
                className="grid h-9 w-9 place-items-center rounded-lg bg-[#1d1d1a] text-[#d7ff3f]"
              >
                <Send size={14} />
              </button>
            </div>
          </div>

          {/* Swap etiquette */}
          <div className="rounded-[24px] bg-[#1d1d1a] p-5 text-[#f7f5f0] sm:p-6">
            <div className="eyebrow text-[#d7ff3f]">Swap etiquette</div>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-[#f7f5f0]/65">
              <li className="flex gap-3">
                <span className="text-[#d7ff3f]">01</span>
                <span>Be clear about condition, fit and any small quirks.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#d7ff3f]">02</span>
                <span>Keep it kind. Every piece is making a second lap.</span>
              </li>
              <li className="flex gap-3">
                <span className="text-[#d7ff3f]">03</span>
                <span>Once you both agree, we'll help you sort the handoff.</span>
              </li>
            </ul>
            <button
              onClick={() => toast("Help center opened.")}
              className="mt-6 flex items-center gap-2 text-xs font-bold text-[#d7ff3f]"
            >
              Read the full guide <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
