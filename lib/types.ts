// ==================== User ====================
export interface User {
  id: string; // For mock data compatibility
  _id?: string; // Optional for backend data
  name: string;
  email?: string;
  password?: string;
  avatar?: string;
  avatarUrl?: string; // For mock data
  role: 'buyer' | 'seller' | 'admin' | 'freelancer' | 'client';
  createdAt?: string;
  updatedAt?: string;
  location?: string;
  memberSince?: string | Date;
}

// ==================== Review ====================
export interface Review {
  id: string;
  author: User;
  rating: number;
  comment: string;
  createdAt: string;
}

// ==================== Gig ====================
export interface Gig {
  id: string; // For mock data
  _id?: string; // For backend data
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  revisions?: number;
  revisionNumber?: number;
  features?: string[];
  coverImage?: string;
  imageUrl?: string;
  images?: string[];
  userId?: string;
  freelancer?: User; // For mock data
  createdAt?: string;
  updatedAt?: string;
  rating?: number;
  totalReviews?: number;
  reviews?: Review[];
  tags?: string[];
  
}

// ==================== Order ====================
export interface Order {
  id: string; // For mock data
  _id?: string; // For backend data
  gig: Gig; // Mock data version
  client: User; // Mock data version
  gigId?: string; // Backend version
  buyerId?: string;
  sellerId?: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'pending' | 'in progress' | 'completed' | 'cancelled';
  amount?: number;
  orderDate?: string;
  deliveryDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== Message ====================
export interface Message {
  id: string; // For mock data
  _id?: string; // For backend data
  chatId?: string;
  senderId: string;
  receiverId?: string;
  text: string;
  seen?: boolean;
  timestamp?: Date | string; // Allow both formats
  createdAt?: string;
  updatedAt?: string;
}

// ==================== Conversation ====================
export interface Conversation {
  id: string; // For mock data
  _id?: string; // For backend data
  participants: User[]; // Mock data
  messages: Message[];
  lastMessage?: { text: string; timestamp: string } | Message;
  unreadCount?: number;
}

// ==================== Notification ====================
export interface Notification {
  _id: string;
  userId: string;
  type: 'order' | 'gig' | 'message' | 'review';
  message: string;
  seen: boolean;
  createdAt: string;
}

// ==================== Auth ====================
export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload extends LoginPayload {
  name: string;
  role: 'buyer' | 'seller';
}

export interface AuthContextType {
  currentUser: User | null;
  login: (data: LoginPayload) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

// ==================== GigFormData ====================
export interface GigFormData {
  title: string;
  description: string;
  category: string;
  deliveryTime: number;
  revisionNumber: number;
  price: number;
  shortDesc: string;
  features: string[];
  
}
