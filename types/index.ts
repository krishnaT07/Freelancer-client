// client/types/index.ts

export type User = {
  id: string;
  name: string;
  role: "client" | "freelancer";
  avatarUrl: string;
  location?: string;
  memberSince?: string | Date;
};

export type Review = {
  id: string;
  author: User;
  rating: number;
  comment: string;
  createdAt: string;
};

export type Gig = {
  id: string;
  title: string;
  description: string;
  price: number;
  rating: number;
  totalReviews: number;
  category: string;
  deliveryTime: number;
  revisionNumber: number; // required everywhere
  images: string[];
  freelancer: User;
  reviews?: Review[];
  imageUrl?: string;
  tags?: string[];
  features: string[];
  shortDesc: string;
  // ...other fields
};
export type Message = {
  text: string;
  timestamp: string;
};

export type Conversation = {
  id: string;
  participants: User[];
  messages: Message[];
  lastMessage: Message;
  unreadCount: number;
};

export type Order = {
  id: string;
  gig: Gig;
  client: User;
  status: "In Progress" | "Completed" | "Cancelled";
  orderDate: string;
};
export type GigFormData = Omit<Gig, 'id'>;