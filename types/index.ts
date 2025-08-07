// ==================== User ====================
export interface User {
  _id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role: 'buyer' | 'seller' | 'admin';
  createdAt?: string;
  updatedAt?: string;
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

// ==================== Gig ====================
// client/types/index.ts


export interface Gig {
  _id?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  deliveryTime: number;
  revisions: number;
  features: string[];
  coverImage?: string;
  images?: string[];
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}



// ==================== Order ====================
export interface Order {
  _id: string;
  gigId: string;
  buyerId: string;
  sellerId: string;
  status: 'pending' | 'in progress' | 'completed' | 'cancelled';
  amount: number;
  createdAt?: string;
  updatedAt?: string;
}

// ==================== Message ====================
export interface Message {
  _id: string;
  chatId: string;
  senderId: string;
  receiverId: string;
  text: string;
  seen: boolean;
  createdAt: string;
  updatedAt?: string;
}

// ==================== Chat ====================
export interface Chat {
  _id: string;
  participants: [string, string]; // [senderId, receiverId]
  lastMessage?: Message;
  updatedAt?: string;
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
