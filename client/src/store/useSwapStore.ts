import { create } from "zustand";
import type { Product, WardrobeItem } from "@/lib/types";
import { createSwapRequest } from "@/services/firestore";
import { auth } from "@/lib/firebase";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────
interface SwapState {
  /** The product the user wants to receive (set from ProductPage) */
  selectedTargetItem: Product | null;
  /** The wardrobe item the user is offering in return (set from SwapPage) */
  selectedOfferedItem: WardrobeItem | null;

  // Actions
  setTargetItem: (product: Product) => void;
  setOfferedItem: (item: WardrobeItem) => void;
  clearSwapDesk: () => void;
  submitSwap: () => Promise<void>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────
export const useSwapStore = create<SwapState>((set, get) => ({
  selectedTargetItem: null,
  selectedOfferedItem: null,

  setTargetItem: (product: Product) =>
    set({ selectedTargetItem: product, selectedOfferedItem: null }),

  setOfferedItem: (item: WardrobeItem) =>
    set({ selectedOfferedItem: item }),

  clearSwapDesk: () =>
    set({ selectedTargetItem: null, selectedOfferedItem: null }),

  submitSwap: async () => {
    const { selectedTargetItem, selectedOfferedItem } = get();
    if (!selectedTargetItem || !selectedOfferedItem) return;

    await createSwapRequest({
      targetItemId: selectedTargetItem.id,
      offeredItemId: selectedOfferedItem.id,
      senderId: auth.currentUser?.uid || "unknownUser", 
      receiverId: selectedTargetItem.ownerId || "unknownReceiver",
      status: 'pending'
    });
  }
}));
