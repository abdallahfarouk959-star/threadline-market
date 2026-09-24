export interface Product {
  id: string;
  name: string;
  brand: string;
  type: string;
  price: number;
  size: string;
  condition: string;
  tag: string;
  image: string;
  seller: string;
  initials: string;
  sellerImage: string;
  color: string;
  description: string;
}

export interface WardrobeItem {
  id?: string;
  name: string;
  meta: string;
  image: string;
  tone: string;
  ownerId?: string;
}

export interface SwapRequest {
  id: string;
  targetItemId: string;
  offeredItemId: string;
  senderId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export const CATEGORIES: string[] = ["All", "Outerwear", "Tops", "Bottoms", "Knitwear"];
