import { useState, useEffect } from "react";
import type { SwapRequest, Product, WardrobeItem } from "@/lib/types";
import { getProductById, getWardrobeItemById, updateSwapStatus } from "@/services/firestore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface SwapRequestCardProps {
  request: SwapRequest;
  type: "incoming" | "outgoing";
  onStatusChange: () => void;
}

function SwapRequestCard({ request, type, onStatusChange }: SwapRequestCardProps) {
  const [targetItem, setTargetItem] = useState<Product | null>(null);
  const [offeredItem, setOfferedItem] = useState<WardrobeItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const [target, offered] = await Promise.all([
          getProductById(request.targetItemId),
          getWardrobeItemById(request.offeredItemId)
        ]);
        setTargetItem(target);
        setOfferedItem(offered);
      } catch (error) {
        console.error("Failed to load swap items", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [request]);

  const handleUpdateStatus = async (status: 'accepted' | 'rejected') => {
    setIsUpdating(true);
    try {
      await updateSwapStatus(request.id, status);
      toast.success(`Swap request ${status}!`);
      onStatusChange();
    } catch (error: any) {
      toast.error(error.message || "Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl border border-[#1d1d1a]/10 bg-[#efebe4]">
        <Loader2 className="h-6 w-6 animate-spin text-[#1d1d1a]/50" />
      </div>
    );
  }

  if (!targetItem || !offeredItem) {
    return (
      <div className="flex h-32 items-center justify-center rounded-2xl border border-[#1d1d1a]/10 bg-[#efebe4] text-sm text-[#1d1d1a]/50">
        Item details unavailable.
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-between rounded-2xl border border-[#1d1d1a]/10 bg-[#efebe4] p-4 sm:flex-row sm:items-center">
      <div className="flex items-center gap-4">
        {/* Target Item (What they want / What you want) */}
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#d7c4b7]" style={{ backgroundColor: targetItem.color }}>
            <img src={targetItem.image} alt={targetItem.name} className="h-full w-full object-cover mix-blend-multiply" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1d1d1a]/50">
              {type === "incoming" ? "They want" : "You want"}
            </p>
            <p className="text-sm font-bold">{targetItem.name}</p>
          </div>
        </div>

        <div className="mx-2 text-[#1d1d1a]/20">⇄</div>

        {/* Offered Item (What they offer / What you offer) */}
        <div className="flex items-center gap-3">
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#d7c4b7]" style={{ backgroundColor: offeredItem.tone }}>
            <img src={offeredItem.image} alt={offeredItem.name} className="h-full w-full object-cover mix-blend-multiply" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#1d1d1a]/50">
              {type === "incoming" ? "They offer" : "You offer"}
            </p>
            <p className="text-sm font-bold">{offeredItem.name}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between sm:mt-0 sm:flex-col sm:items-end">
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
          request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
          request.status === 'accepted' ? 'bg-green-100 text-green-800' :
          'bg-red-100 text-red-800'
        }`}>
          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
        </span>
        
        {type === "incoming" && request.status === "pending" && (
          <div className="mt-2 flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleUpdateStatus('rejected')}
              disabled={isUpdating}
            >
              Reject
            </Button>
            <Button 
              size="sm" 
              className="bg-[#d7ff3f] text-[#1d1d1a] hover:bg-[#d7ff3f]/80"
              onClick={() => handleUpdateStatus('accepted')}
              disabled={isUpdating}
            >
              Accept
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface SwapRequestListProps {
  requests: SwapRequest[];
  type: "incoming" | "outgoing";
  onStatusChange: () => void;
}

export function SwapRequestList({ requests, type, onStatusChange }: SwapRequestListProps) {
  if (requests.length === 0) {
    return (
      <div className="flex h-40 flex-col items-center justify-center rounded-2xl border border-dashed border-[#1d1d1a]/10 bg-[#efebe4]/50 text-center">
        <p className="text-sm font-bold text-[#1d1d1a]/50">No {type} swap requests.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {requests.map((req) => (
        <SwapRequestCard 
          key={req.id} 
          request={req} 
          type={type} 
          onStatusChange={onStatusChange} 
        />
      ))}
    </div>
  );
}
