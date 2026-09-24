import {
  ArrowUpRight,
  Bell,
  ImagePlus,
  Loader2,
  Menu,
  Plus,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import type { WardrobeItem, SwapRequest } from "@/lib/types";
import { getUserWardrobe, getIncomingSwaps, getOutgoingSwaps } from "@/services/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { AddWardrobeItemForm } from "@/components/forms/AddWardrobeItemForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SwapRequestList } from "@/components/swap/SwapRequestList";

// ─── Local sub-components ─────────────────────────────────────────────────────
function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-bold tracking-[-0.06em]">{value}</p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#1d1d1a]/45">{label}</p>
    </div>
  );
}

function WardrobeCard({ item }: { item: WardrobeItem }) {
  return (
    <div className="group">
      <div className="relative aspect-[0.82] overflow-hidden rounded-[20px]" style={{ backgroundColor: item.tone }}>
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover mix-blend-multiply transition duration-500 group-hover:scale-105"
        />
        <button
          onClick={() => toast("Item options opened.")}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-[#f7f5f0]/85"
        >
          <Menu size={15} />
        </button>
      </div>
      <p className="mt-3 text-[13px] font-bold">{item.name}</p>
      <p className="mt-1 text-[11px] text-[#1d1d1a]/50">{item.meta}</p>
    </div>
  );
}

export default function WardrobePage() {
  const [uploadOpen, setUploadOpen] = useState(false);
  
  const { user } = useAuth();
  const [items, setItems] = useState<WardrobeItem[]>([]);
  const [incomingSwaps, setIncomingSwaps] = useState<SwapRequest[]>([]);
  const [outgoingSwaps, setOutgoingSwaps] = useState<SwapRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWardrobe = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const data = await getUserWardrobe(user.uid);
      setItems(data);
    } catch (error) {
      toast.error("Failed to load wardrobe items.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchSwaps = async () => {
    if (!user) return;
    try {
      const [incoming, outgoing] = await Promise.all([
        getIncomingSwaps(user.uid),
        getOutgoingSwaps(user.uid)
      ]);
      setIncomingSwaps(incoming);
      setOutgoingSwaps(outgoing);
    } catch (error) {
      toast.error("Failed to load swap requests.");
    }
  };

  useEffect(() => {
    fetchWardrobe();
    fetchSwaps();
  }, [user]);

  return (
    <AppShell active="wardrobe" title="Your wardrobe">
      <div className="mx-auto max-w-[1380px] px-4 py-7 sm:px-6 sm:py-12 lg:px-10">
        {/* Profile / hero section */}
        <section className="grid gap-5 lg:grid-cols-[1.3fr_0.7fr]">
          {/* Upload panel */}
          <div className="rounded-[26px] bg-[#1d1d1a] p-6 text-[#f7f5f0] sm:p-9">
            <div className="flex items-start justify-between">
              <div>
                <div className="eyebrow text-[#d7ff3f]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#d7ff3f]" /> Your closet
                </div>
                <h1 className="font-display mt-4 max-w-md text-5xl font-bold leading-[0.9] tracking-[-0.08em] sm:text-6xl">
                  Make room for what's next.
                </h1>
              </div>
              <button className="icon-button-dark" aria-label="Notifications" onClick={() => toast("No new notifications.")}>
                <Bell size={17} />
              </button>
            </div>
            <p className="mt-6 max-w-md text-sm leading-6 text-[#f7f5f0]/60">
              Keep the good stuff moving. Add pieces you're ready to trade and we'll find their next rotation.
            </p>
            <button onClick={() => setUploadOpen(!uploadOpen)} className="button-lime mt-7">
              {uploadOpen ? "Close uploader" : "Add an item"} <Plus size={16} />
            </button>

            {uploadOpen ? (
              <div className="mt-5 rounded-2xl border border-dashed border-[#f7f5f0]/25 bg-[#f7f5f0]/5 p-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#d7ff3f] text-[#1d1d1a]">
                    <ImagePlus size={18} />
                  </span>
                  <div>
                    <p className="text-sm font-bold">Drop a few good photos here</p>
                    <p className="mt-1 text-xs text-[#f7f5f0]/50">Mock upload · JPG or PNG · up to 10 MB</p>
                  </div>
                </div>
                <button
                  onClick={() => toast("Upload flow is mocked for this prototype.")}
                  className="mt-4 flex w-full items-center justify-center rounded-xl border border-[#f7f5f0]/20 py-2.5 text-xs font-bold"
                >
                  Choose photos
                </button>
              </div>
            ) : null}
          </div>

          {/* User stats card */}
          <div className="rounded-[26px] border border-[#1d1d1a]/10 bg-[#efebe4] p-6 sm:p-9">
            <div className="flex items-center gap-4">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-[#dbd4c6] text-sm font-bold">
                {user?.email?.charAt(0).toUpperCase() || "U"}
              </div>
              <div>
                <p className="font-display text-2xl font-bold tracking-[-0.06em]">
                  {user?.email?.split('@')[0] || "User"}
                </p>
                <p className="mt-1 text-xs text-[#1d1d1a]/50">Threadline Member</p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-2 border-t border-[#1d1d1a]/10 pt-5 text-center">
              <Stat value="12" label="Items" />
              <Stat value="4" label="Swap-ready" />
              <Stat value="8" label="Swaps" />
            </div>
            <button
              onClick={() => toast("Public profile preview opened.")}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#1d1d1a]/15 py-3 text-xs font-bold"
            >
              View public profile <ArrowUpRight size={14} />
            </button>
          </div>
        </section>

        {/* Wardrobe items / swap requests */}
        <section className="mt-12">
          <Tabs defaultValue="items">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="eyebrow">The digital wardrobe</div>
                <h2 className="font-display mt-3 text-3xl font-bold tracking-[-0.07em] sm:text-4xl">Your pieces</h2>
              </div>
              <TabsList className="bg-[#e9e4db] rounded-full p-1 h-auto">
                <TabsTrigger value="items" className="rounded-full px-4 py-2 text-xs font-bold data-[state=active]:bg-[#1d1d1a] data-[state=active]:text-[#f7f5f0]">
                  My Closet
                </TabsTrigger>
                <TabsTrigger value="requests" className="rounded-full px-4 py-2 text-xs font-bold data-[state=active]:bg-[#1d1d1a] data-[state=active]:text-[#f7f5f0]">
                  Swap Requests <span className="ml-1 text-[#d7ff3f]">{incomingSwaps.filter(s => s.status === 'pending').length || ''}</span>
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="items" className="mt-7">
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
                {isLoading ? (
                  <div className="col-span-full flex h-40 flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#1d1d1a]/10 bg-[#efebe4]/50">
                    <Loader2 className="h-6 w-6 animate-spin text-[#1d1d1a]/50" />
                    <p className="text-sm font-bold text-[#1d1d1a]/50">Loading your closet...</p>
                  </div>
                ) : items.length === 0 ? (
                  <div className="col-span-full flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[#1d1d1a]/10 bg-[#efebe4]/50 text-center">
                    <p className="text-sm font-bold text-[#1d1d1a]/50">Your closet is empty. Add items to start swapping!</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <WardrobeCard key={item.id || item.name} item={item} />
                  ))
                )}
                <AddWardrobeItemForm onSuccess={fetchWardrobe} />
              </div>
            </TabsContent>

            <TabsContent value="requests" className="mt-7">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h3 className="mb-4 text-lg font-bold">Incoming Requests</h3>
                  <SwapRequestList requests={incomingSwaps} type="incoming" onStatusChange={fetchSwaps} />
                </div>
                <div>
                  <h3 className="mb-4 text-lg font-bold">Outgoing Requests</h3>
                  <SwapRequestList requests={outgoingSwaps} type="outgoing" onStatusChange={fetchSwaps} />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </AppShell>
  );
}
