import { collection, getDocs, getDoc, addDoc, doc, query, where, writeBatch, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Product, WardrobeItem, SwapRequest } from "@/lib/types";

// Expected Firestore Document Structures:
//
// Collection: products
// Document: { title: string, price: number, image: string, ownerId: string, category: string }
//
// Collection: wardrobeItems
// Document: { title: string, image: string, ownerId: string }
//
// Collection: swapRequests
// Document: { targetItemId: string, offeredItemId: string, senderId: string, receiverId: string, status: 'pending' | 'accepted' | 'rejected' }

export interface SwapRequestPayload {
  targetItemId: string;
  offeredItemId: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const getAllProducts = async (): Promise<Product[]> => {
  const productsCol = collection(db, "products");
  const snapshot = await getDocs(productsCol);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];
};

export const getProductById = async (productId: string): Promise<Product | null> => {
  const productDoc = await getDoc(doc(db, "products", productId));
  if (!productDoc.exists()) return null;
  return { id: productDoc.id, ...productDoc.data() } as Product;
};

export const seedInitialProducts = async () => {
  const image = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1000&q=85`;
  const initialProducts = [
    { name: "Recycled nylon shell", brand: "Alder", type: "Outerwear", price: 148, size: "M", condition: "Like new", tag: "Editor pick", image: image("photo-1551488831-00ddcb6c6bd3"), seller: "Noa Kim", initials: "NK", sellerImage: image("photo-1534528741775-53994a69daeb"), color: "#cbd8cf", description: "Lightweight, packable shell with a soft matte finish. Designed for rainy commutes and long weekends outside.", ownerId: "seed" },
    { name: "Bias-cut satin skirt", brand: "Studio M", type: "Bottoms", price: 72, size: "S", condition: "Excellent", tag: "Swap friendly", image: image("photo-1583496661160-fb5886a0aaaa"), seller: "Mara J.", initials: "MJ", sellerImage: image("photo-1494790108377-be9c29b29330"), color: "#d9c7d5", description: "A fluid satin skirt in a deep aubergine tone. Easy with sneakers in the day, or dressed up after dark.", ownerId: "seed" },
    { name: "Boxy cotton overshirt", brand: "Common Thread", type: "Tops", price: 58, size: "L", condition: "Very good", tag: "Just in", image: image("photo-1525507119028-ed4c629a60a3"), seller: "Alex R.", initials: "AR", sellerImage: image("photo-1500648767791-00dcc994a43e"), color: "#d6c7af", description: "Structured cotton overshirt with oversized pockets and a slightly cropped hem. A dependable everyday layer.", ownerId: "seed" },
    { name: "Soft rib tank", brand: "Lumen", type: "Tops", price: 34, size: "XS", condition: "New with tags", tag: "Under $40", image: image("photo-1551028719-00167b16eac5"), seller: "Iris Vale", initials: "IV", sellerImage: image("photo-1531123897727-8f129e1688ce"), color: "#e6d9be", description: "A barely-there rib tank cut close to the body. Made from a soft organic cotton blend.", ownerId: "seed" },
    { name: "Utility pleat trouser", brand: "Morrow", type: "Bottoms", price: 96, size: "28", condition: "Excellent", tag: "Swap friendly", image: image("photo-1490481651871-ab68de25d43d"), seller: "Jo Bell", initials: "JB", sellerImage: image("photo-1488426862026-3ee34a7d66df"), color: "#cfd4bd", description: "A relaxed high-rise trouser with utility pockets and a clean pleat through the front.", ownerId: "seed" },
  ];

  const batch = writeBatch(db);
  const productsCol = collection(db, "products");
  initialProducts.forEach((product) => {
    const newDocRef = doc(productsCol);
    batch.set(newDocRef, product);
  });
  await batch.commit();
};

export const getUserWardrobe = async (userId: string): Promise<WardrobeItem[]> => {
  const wardrobeCol = collection(db, "wardrobeItems");
  const q = query(wardrobeCol, where("ownerId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as WardrobeItem[];
};

export const addWardrobeItem = async (
  itemData: Omit<WardrobeItem, "id"> & { ownerId: string }
): Promise<string> => {
  const wardrobeCol = collection(db, "wardrobeItems");
  const docRef = await addDoc(wardrobeCol, itemData);
  return docRef.id;
};

export const createSwapRequest = async (payload: SwapRequestPayload): Promise<string> => {
  const swapsCol = collection(db, "swapRequests");
  const docRef = await addDoc(swapsCol, payload);
  return docRef.id;
};

export const getIncomingSwaps = async (userId: string): Promise<SwapRequest[]> => {
  const swapsCol = collection(db, "swapRequests");
  const q = query(swapsCol, where("receiverId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as SwapRequest[];
};

export const getOutgoingSwaps = async (userId: string): Promise<SwapRequest[]> => {
  const swapsCol = collection(db, "swapRequests");
  const q = query(swapsCol, where("senderId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as SwapRequest[];
};

export const updateSwapStatus = async (swapId: string, status: 'accepted' | 'rejected'): Promise<void> => {
  const swapRef = doc(db, "swapRequests", swapId);
  await updateDoc(swapRef, { status });
};

export const getWardrobeItemById = async (itemId: string): Promise<WardrobeItem | null> => {
  const itemDoc = await getDoc(doc(db, "wardrobeItems", itemId));
  if (!itemDoc.exists()) return null;
  return { id: itemDoc.id, ...itemDoc.data() } as WardrobeItem;
};
