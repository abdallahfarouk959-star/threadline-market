import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addWardrobeItem } from "@/services/firestore";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Plus } from "lucide-react";

export function AddWardrobeItemForm({ onSuccess }: { onSuccess: () => void }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return toast.error("You must be logged in to add an item.");

    setIsLoading(true);
    try {
      await addWardrobeItem({
        name: title,
        meta: category, // Using meta for category mapping to our UI
        image: imageUrl,
        ownerId: user.uid,
        tone: "#f7f5f0", // Default tone
      });
      toast.success("Item added to your wardrobe!");
      setOpen(false);
      setTitle("");
      setCategory("");
      setImageUrl("");
      onSuccess();
    } catch (error: any) {
      toast.error(error.message || "Failed to add item.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex aspect-[0.82] flex-col items-center justify-center rounded-[20px] border border-dashed border-[#1d1d1a]/20 bg-[#efebe4] text-center transition hover:border-[#1d1d1a]/50">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-[#d7ff3f]">
            <Plus size={18} />
          </span>
          <span className="mt-3 text-xs font-bold">Add an item</span>
          <span className="mt-1 text-[10px] text-[#1d1d1a]/45">Keep the loop going</span>
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to your wardrobe</DialogTitle>
          <DialogDescription>
            Enter the details of the item you want to swap.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="title">Title</label>
            <Input
              id="title"
              placeholder="e.g. Vintage Leather Jacket"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="category">Category / Meta</label>
            <Input
              id="category"
              placeholder="e.g. Outerwear · Size M"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="imageUrl">Image URL</label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...</> : "Add Item"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
