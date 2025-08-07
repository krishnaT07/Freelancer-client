import type { User, Review, Gig, Conversation, Message, Order } from './types';

export const users: User[] = [
  { id: 'user-1', name: 'Alice Johnson', avatarUrl: 'https://i.pravatar.cc/150?u=user-1', role: 'freelancer', memberSince: 'Jan 2022', location: 'USA' },
  { id: 'user-2', name: 'Bob Williams', avatarUrl: 'https://i.pravatar.cc/150?u=user-2', role: 'client', memberSince: 'Mar 2021', location: 'Canada' },
  { id: 'user-3', name: 'Charlie Brown', avatarUrl: 'https://i.pravatar.cc/150?u=user-3', role: 'freelancer', memberSince: 'Jun 2023', location: 'UK' },
  { id: 'user-4', name: 'Diana Miller', avatarUrl: 'https://i.pravatar.cc/150?u=user-4', role: 'client', memberSince: 'Sep 2022', location: 'Australia' },
];

export const reviews: Review[] = [
    { id: 'review-1', author: users[1], rating: 5, comment: 'Amazing work, delivered on time!', createdAt: '2 days ago' },
    { id: 'review-2', author: users[3], rating: 4, comment: 'Good communication, will hire again.', createdAt: '1 week ago' },
];

export const gigs: Gig[] = [
  {
    id: 'gig-1',
    title: 'I will build a professional responsive website',
    description: 'A full-featured website with a modern design and responsive layout. I will use the latest technologies to create a fast and secure website for your business. Includes 3 pages, and source code.',
    category: 'Web Development',
    price: 500,
    deliveryTime: 7,
    imageUrl: 'https://placehold.co/600x400.png?text=Web+Development',
    images: ['https://placehold.co/600x400.png?text=Web+Development', 'https://placehold.co/600x400.png', 'https://placehold.co/600x400.png'],
    freelancer: users[0],
    rating: 4.9,
    totalReviews: 120,
    reviews: [reviews[0], reviews[1]],
    tags: ['website', 'react', 'nextjs', 'development'],
  },
  {
    id: 'gig-2',
    title: 'I will design a stunning modern logo',
    description: 'Get a unique and professional logo design for your brand. I provide high-resolution files and unlimited revisions until you are satisfied.',
    category: 'Graphic Design',
    price: 150,
    deliveryTime: 3,
    imageUrl: 'https://placehold.co/600x400.png?text=Graphic+Design',
    images: ['https://placehold.co/600x400.png?text=Graphic+Design', 'https://placehold.co/600x400.png'],
    freelancer: users[2],
    rating: 4.8,
    totalReviews: 85,
    reviews: [],
    tags: ['logo design', 'branding', 'graphic design'],
  },
  {
    id: 'gig-3',
    title: 'I will write compelling SEO blog posts',
    description: 'Engaging and SEO-optimized content to boost your search rankings. I research keywords and write articles that drive traffic.',
    category: 'Writing & Translation',
    price: 75,
    deliveryTime: 2,
    imageUrl: 'https://placehold.co/600x400.png?text=Writing',
    images: ['https://placehold.co/600x400.png?text=Writing'],
    freelancer: users[0],
    rating: 5.0,
    totalReviews: 210,
    reviews: [],
    tags: ['seo', 'writing', 'content creation'],
  },
  {
    id: 'gig-4',
    title: 'I will create a promotional video animation',
    description: 'A captivating animated video to promote your product or service. Full HD video with background music and voice-over.',
    category: 'Video & Animation',
    price: 300,
    deliveryTime: 5,
    imageUrl: 'https://placehold.co/600x400.png?text=Animation',
    images: ['https://placehold.co/600x400.png?text=Animation', 'https://placehold.co/600x400.png'],
    freelancer: users[2],
    rating: 4.7,
    totalReviews: 54,
    reviews: [],
    tags: ['video', 'animation', 'marketing'],
  },
];

export const orders: Order[] = [
    { 
        id: 'order-1', 
        gig: gigs[0], 
        client: users[1], 
        status: 'Completed', 
        orderDate: '2024-05-10',
        deliveryDate: '2024-05-17'
    },
    { 
        id: 'order-2', 
        gig: gigs[2], 
        client: users[1], 
        status: 'In Progress', 
        orderDate: '2024-07-20',
    },
     { 
        id: 'order-3', 
        gig: gigs[1], 
        client: users[3], 
        status: 'Pending', 
        orderDate: '2024-07-25',
    },
];

export const conversations: Conversation[] = [
    {
        id: 'conv-1',
        participants: [users[1], users[0]],
        messages: [
            {
                id: 'msg-1',
                senderId: users[1].id,
                text: 'Hi! I\'m interested in your website development service.',
                timestamp: new Date('2024-07-20T10:00:00Z'),
            },
            {
                id: 'msg-2',
                senderId: users[0].id,
                text: 'Hello! Thanks for your interest. I\'d be happy to help you with your website project.',
                timestamp: new Date('2024-07-20T10:05:00Z'),
            },
            {
                id: 'msg-3',
                senderId: users[1].id,
                text: 'Great! Can you tell me more about what\'s included in the package?',
                timestamp: new Date('2024-07-20T10:10:00Z'),
            },
        ],
        lastMessage: { text: 'Can you tell me more about what\'s included in the package?', timestamp: '10:10 AM' },
        unreadCount: 0,
    },
    {
        id: 'conv-2',
        participants: [users[3], users[2]],
        messages: [
            {
                id: 'msg-4',
                senderId: users[3].id,
                text: 'I need a logo for my new startup. What\'s your process like?',
                timestamp: new Date('2024-07-25T14:30:00Z'),
            },
        ],
        lastMessage: { text: 'I need a logo for my new startup. What\'s your process like?', timestamp: '2:30 PM' },
        unreadCount: 1,
    },
];