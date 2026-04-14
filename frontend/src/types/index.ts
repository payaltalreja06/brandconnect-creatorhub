export interface FAQ {
  question: string;
  answer: string;
}

export interface Influencer {
  id: string;
  _id?: string;
  userId?: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage?: string;
  domain: string[];
  followers: number;
  engagement: number;
  platforms?: string[];
  location: string;
  bio: string;
  rate: string;
  price?: number;
  rating?: number;
  reviewCount?: number;
  contentType?: string[];
  gender?: string;
  age?: string;
  language?: string;
  badges?: string[];
  verified: boolean;
  ytSubscribers?: number;
  instaFollowers?: number;
  healthScore?: number;
  faqs?: FAQ[];
}

export interface Brand {
  id: string;
  _id?: string;
  userId?: string;
  name: string;
  logo: string;
  domain: string;
  description: string;
  campaigns: number;
  industry: string;
  budget: string;
  website: string;
  contactEmail: string;
  faqs?: FAQ[];
}

export interface Campaign {
  id: string;
  _id?: string;
  brandId: string;
  brandName: string;
  brandLogo: string;
  title: string;
  description: string;
  deliverables: string[];
  budget: string;
  deadline: string;
  status: "pending" | "accepted" | "in_progress" | "completed";
  influencerId?: string;
  influencerName?: string;
  engagement?: number;
  roi?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
}

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  messages: ChatMessage[];
}

export interface Payment {
  id: string;
  campaignTitle: string;
  brandName: string;
  influencerName: string;
  amount: string;
  status: "completed" | "pending" | "processing";
  date: string;
}

export interface Notification {
  id: string;
  type: "campaign" | "message" | "payment" | "request";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export interface YTAnalytics {
  overview: {
    totalViews: number;
    subscribers: number;
    avgWatchTime: string;
    totalVideos: number;
  };
  recentVideos: {
    videoId?: string;
    title: string;
    views: number;
    likes: number;
    comments: number;
    ctr: number;
    avgViewDuration: string;
    retention: number;
    date: string;
  }[];
  monthlyViews: { month: string; views: number }[];
  demographics: { age: string; percent: number }[];
  genderSplit: { gender: string; percent: number }[];
  topCountries: { country: string; percent: number }[];
  deviceUsage: { device: string; percent: number }[];
}

export interface InstaAnalytics {
  overview: {
    followers: number;
    reach: number;
    impressions: number;
    profileVisits: number;
  };
  recentPosts: {
    type: string;
    caption: string;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    reach: number;
    date: string;
  }[];
  weeklyReach: { week: string; reach: number }[];
  engagementByType: { type: string; rate: number }[];
}
