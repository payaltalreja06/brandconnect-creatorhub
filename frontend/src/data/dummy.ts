export interface Influencer {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  domain: string[];
  followers: number;
  engagement: number;
  platforms: string[];
  location: string;
  bio: string;
  rate: string;
  verified: boolean;
  ytSubscribers?: number;
  instaFollowers?: number;
  healthScore?: number;
}

export interface Brand {
  id: string;
  name: string;
  logo: string;
  domain: string;
  description: string;
  campaigns: number;
  industry: string;
  budget: string;
  website: string;
  contactEmail: string;
}

export interface Campaign {
  id: string;
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

export const domains = [
  "Skincare", "Fitness", "Fashion", "Tech", "Food", "Travel",
  "Beauty", "Gaming", "Education", "Lifestyle", "Health", "Finance",
];

export const influencers: Influencer[] = [
  {
    id: "1", name: "Priya Sharma", handle: "@priyaskincare", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
    domain: ["Skincare", "Beauty"], followers: 2400000, engagement: 4.8, platforms: ["YouTube", "Instagram"],
    location: "Mumbai, India", bio: "Dermatologist-turned-creator sharing honest skincare reviews and routines. Featured in Vogue India.", rate: "₹80,000 - ₹1,50,000", verified: true, ytSubscribers: 1800000, instaFollowers: 600000, healthScore: 87,
  },
  {
    id: "2", name: "Arjun Mehta", handle: "@arjunfitlife", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Arjun",
    domain: ["Fitness", "Health"], followers: 1800000, engagement: 5.2, platforms: ["YouTube", "Instagram"],
    location: "Delhi, India", bio: "Certified personal trainer helping you transform your life. 500+ client transformations.", rate: "₹60,000 - ₹1,20,000", verified: true, ytSubscribers: 1200000, instaFollowers: 600000, healthScore: 82,
  },
  {
    id: "3", name: "Sneha Kapoor", handle: "@snehastyle", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sneha",
    domain: ["Fashion", "Lifestyle"], followers: 1500000, engagement: 3.9, platforms: ["Instagram", "YouTube"],
    location: "Bangalore, India", bio: "Fashion editor & sustainable style advocate. Collaborating with 50+ ethical brands.", rate: "₹50,000 - ₹1,00,000", verified: true, ytSubscribers: 500000, instaFollowers: 1000000, healthScore: 74,
  },
  {
    id: "4", name: "Ravi Kumar", handle: "@techwithravi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ravi",
    domain: ["Tech", "Education"], followers: 3200000, engagement: 6.1, platforms: ["YouTube", "Instagram"],
    location: "Hyderabad, India", bio: "Making tech accessible. Gadget reviews, coding tutorials, and startup insights.", rate: "₹1,00,000 - ₹2,00,000", verified: true, ytSubscribers: 2800000, instaFollowers: 400000, healthScore: 91,
  },
  {
    id: "5", name: "Ananya Desai", handle: "@ananyacooks", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ananya",
    domain: ["Food", "Lifestyle"], followers: 980000, engagement: 7.3, platforms: ["Instagram", "YouTube"],
    location: "Chennai, India", bio: "Home chef sharing family recipes with a modern twist. Cookbook author.", rate: "₹30,000 - ₹70,000", verified: false, ytSubscribers: 380000, instaFollowers: 600000, healthScore: 79,
  },
  {
    id: "6", name: "Vikram Singh", handle: "@wandervikram", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Vikram",
    domain: ["Travel", "Lifestyle"], followers: 1200000, engagement: 4.5, platforms: ["YouTube", "Instagram"],
    location: "Jaipur, India", bio: "Full-time traveler documenting hidden gems of India and beyond.", rate: "₹45,000 - ₹90,000", verified: true, ytSubscribers: 900000, instaFollowers: 300000, healthScore: 76,
  },
  {
    id: "7", name: "Meera Nair", handle: "@meeraglows", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Meera",
    domain: ["Skincare", "Health"], followers: 750000, engagement: 8.1, platforms: ["Instagram", "YouTube"],
    location: "Kochi, India", bio: "Ayurvedic skincare enthusiast. Sharing natural remedies that actually work.", rate: "₹25,000 - ₹60,000", verified: false, ytSubscribers: 250000, instaFollowers: 500000, healthScore: 83,
  },
  {
    id: "8", name: "Kabir Joshi", handle: "@kabfitness", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kabir",
    domain: ["Fitness", "Food"], followers: 650000, engagement: 5.8, platforms: ["YouTube", "Instagram"],
    location: "Pune, India", bio: "Calisthenics coach & nutrition expert. Free workout plans every week.", rate: "₹20,000 - ₹50,000", verified: false, ytSubscribers: 450000, instaFollowers: 200000, healthScore: 71,
  },
];

export const brands: Brand[] = [
  { id: "b1", name: "GlowSkin Co.", logo: "🧴", domain: "Skincare", description: "Premium organic skincare brand", campaigns: 12, industry: "Beauty & Skincare", budget: "₹5,00,000 - ₹15,00,000", website: "glowskin.co", contactEmail: "collab@glowskin.co" },
  { id: "b2", name: "FitGear Pro", logo: "💪", domain: "Fitness", description: "Performance fitness equipment", campaigns: 8, industry: "Fitness & Sports", budget: "₹3,00,000 - ₹10,00,000", website: "fitgearpro.in", contactEmail: "brand@fitgearpro.in" },
  { id: "b3", name: "StyleVerse", logo: "👗", domain: "Fashion", description: "Sustainable fashion marketplace", campaigns: 15, industry: "Fashion & Apparel", budget: "₹8,00,000 - ₹20,00,000", website: "styleverse.com", contactEmail: "partner@styleverse.com" },
  { id: "b4", name: "TechNova", logo: "🔧", domain: "Tech", description: "Consumer electronics brand", campaigns: 6, industry: "Technology", budget: "₹10,00,000 - ₹25,00,000", website: "technova.in", contactEmail: "marketing@technova.in" },
  { id: "b5", name: "NutriLife", logo: "🥗", domain: "Food", description: "Organic health food brand", campaigns: 9, industry: "Food & Nutrition", budget: "₹2,00,000 - ₹8,00,000", website: "nutrilife.co", contactEmail: "collab@nutrilife.co" },
  { id: "b6", name: "WanderIndia", logo: "✈️", domain: "Travel", description: "Luxury travel experiences", campaigns: 4, industry: "Travel & Tourism", budget: "₹6,00,000 - ₹18,00,000", website: "wanderindia.com", contactEmail: "partner@wanderindia.com" },
];

export const campaigns: Campaign[] = [
  { id: "c1", brandId: "b1", brandName: "GlowSkin Co.", brandLogo: "🧴", title: "Summer Skincare Launch", description: "Promote our new SPF50 sunscreen range across YouTube and Instagram", deliverables: ["1 YouTube video", "2 Instagram Reels", "3 Stories"], budget: "₹1,20,000", deadline: "2024-03-15", status: "in_progress", influencerId: "1", influencerName: "Priya Sharma", engagement: 5.2, roi: 3.8 },
  { id: "c2", brandId: "b2", brandName: "FitGear Pro", brandLogo: "💪", title: "New Year Fitness Challenge", description: "30-day fitness transformation challenge featuring our equipment", deliverables: ["4 YouTube videos", "Daily Instagram Stories", "1 Reel"], budget: "₹95,000", deadline: "2024-02-28", status: "completed", influencerId: "2", influencerName: "Arjun Mehta", engagement: 6.1, roi: 4.2 },
  { id: "c3", brandId: "b3", brandName: "StyleVerse", brandLogo: "👗", title: "Sustainable Fashion Week", description: "Showcase our sustainable collection during fashion week", deliverables: ["2 YouTube vlogs", "5 Instagram Posts", "4 Reels"], budget: "₹1,80,000", deadline: "2024-04-10", status: "accepted", influencerId: "3", influencerName: "Sneha Kapoor" },
  { id: "c4", brandId: "b4", brandName: "TechNova", brandLogo: "🔧", title: "Gadget Unboxing Series", description: "Unbox and review our latest smartphone lineup", deliverables: ["3 YouTube reviews", "1 Instagram Reel"], budget: "₹2,00,000", deadline: "2024-03-20", status: "pending" },
  { id: "c5", brandId: "b1", brandName: "GlowSkin Co.", brandLogo: "🧴", title: "Winter Glow Campaign", description: "Winter skincare routine featuring our moisturizer range", deliverables: ["1 YouTube video", "2 Reels"], budget: "₹85,000", deadline: "2024-01-30", status: "completed", influencerId: "7", influencerName: "Meera Nair", engagement: 7.8, roi: 5.1 },
  { id: "c6", brandId: "b5", brandName: "NutriLife", brandLogo: "🥗", title: "Healthy Recipe Series", description: "Create recipes using our organic ingredient range", deliverables: ["5 YouTube videos", "5 Instagram Posts"], budget: "₹70,000", deadline: "2024-04-30", status: "pending" },
];

export const payments: Payment[] = [
  { id: "p1", campaignTitle: "Summer Skincare Launch", brandName: "GlowSkin Co.", influencerName: "Priya Sharma", amount: "₹1,20,000", status: "processing", date: "2024-01-20" },
  { id: "p2", campaignTitle: "New Year Fitness Challenge", brandName: "FitGear Pro", influencerName: "Arjun Mehta", amount: "₹95,000", status: "completed", date: "2024-01-15" },
  { id: "p3", campaignTitle: "Winter Glow Campaign", brandName: "GlowSkin Co.", influencerName: "Meera Nair", amount: "₹85,000", status: "completed", date: "2024-01-10" },
  { id: "p4", campaignTitle: "Sustainable Fashion Week", brandName: "StyleVerse", influencerName: "Sneha Kapoor", amount: "₹1,80,000", status: "pending", date: "2024-02-01" },
];

export const chatThreads: ChatThread[] = [
  {
    id: "t1", name: "GlowSkin Co.", avatar: "🧴", lastMessage: "Would love to discuss a collaboration!", timestamp: "2 min ago", unread: 2,
    messages: [
      { id: "m1", senderId: "b1", senderName: "GlowSkin Co.", senderAvatar: "🧴", text: "Hi! We love your skincare content.", timestamp: "10:30 AM", isOwn: false },
      { id: "m2", senderId: "u1", senderName: "You", senderAvatar: "", text: "Thank you! I'd love to learn more about your brand.", timestamp: "10:32 AM", isOwn: true },
      { id: "m3", senderId: "b1", senderName: "GlowSkin Co.", senderAvatar: "🧴", text: "Would love to discuss a collaboration!", timestamp: "10:35 AM", isOwn: false },
    ],
  },
  {
    id: "t2", name: "FitGear Pro", avatar: "💪", lastMessage: "Can you share your media kit?", timestamp: "1 hr ago", unread: 0,
    messages: [
      { id: "m4", senderId: "b2", senderName: "FitGear Pro", senderAvatar: "💪", text: "Hey Arjun! We're launching a new product line.", timestamp: "9:00 AM", isOwn: false },
      { id: "m5", senderId: "u1", senderName: "You", senderAvatar: "", text: "Sounds exciting! What kind of collaboration are you looking for?", timestamp: "9:15 AM", isOwn: true },
      { id: "m6", senderId: "b2", senderName: "FitGear Pro", senderAvatar: "💪", text: "Can you share your media kit?", timestamp: "9:20 AM", isOwn: false },
    ],
  },
  {
    id: "t3", name: "Priya Sharma", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", lastMessage: "Sure, let's connect!", timestamp: "3 hrs ago", unread: 1,
    messages: [
      { id: "m7", senderId: "u1", senderName: "You", senderAvatar: "", text: "Hi Priya, interested in a collab?", timestamp: "7:00 AM", isOwn: true },
      { id: "m8", senderId: "1", senderName: "Priya Sharma", senderAvatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya", text: "Sure, let's connect!", timestamp: "7:30 AM", isOwn: false },
    ],
  },
];

// Extended analytics data
export const ytAnalytics = {
  overview: { totalViews: 12500000, subscribers: 1800000, avgWatchTime: "4:32", totalVideos: 245 },
  recentVideos: [
    { title: "Morning Skincare Routine 2024", views: 520000, likes: 32000, comments: 1800, ctr: 8.2, avgViewDuration: "5:12", retention: 62, date: "2024-01-15" },
    { title: "Top 10 Serums Under ₹500", views: 890000, likes: 56000, comments: 3200, ctr: 11.5, avgViewDuration: "6:45", retention: 71, date: "2024-01-10" },
    { title: "Sunscreen Myths Busted", views: 340000, likes: 21000, comments: 950, ctr: 6.8, avgViewDuration: "4:02", retention: 55, date: "2024-01-05" },
    { title: "Winter Skincare Tips", views: 670000, likes: 41000, comments: 2100, ctr: 9.1, avgViewDuration: "5:38", retention: 65, date: "2023-12-28" },
    { title: "Drugstore vs Luxury Products", views: 1200000, likes: 78000, comments: 4500, ctr: 13.2, avgViewDuration: "7:15", retention: 74, date: "2023-12-20" },
  ],
  monthlyViews: [
    { month: "Aug", views: 850000 }, { month: "Sep", views: 920000 }, { month: "Oct", views: 1100000 },
    { month: "Nov", views: 980000 }, { month: "Dec", views: 1350000 }, { month: "Jan", views: 1450000 },
  ],
  demographics: [
    { age: "18-24", percent: 35 }, { age: "25-34", percent: 42 }, { age: "35-44", percent: 15 }, { age: "45+", percent: 8 },
  ],
  genderSplit: [
    { gender: "Female", percent: 68 }, { gender: "Male", percent: 28 }, { gender: "Other", percent: 4 },
  ],
  topCountries: [
    { country: "India", percent: 72 }, { country: "USA", percent: 12 }, { country: "UK", percent: 6 }, { country: "Canada", percent: 4 }, { country: "Others", percent: 6 },
  ],
  deviceUsage: [
    { device: "Mobile", percent: 78 }, { device: "Desktop", percent: 16 }, { device: "Tablet", percent: 4 }, { device: "TV", percent: 2 },
  ],
};

export const instaAnalytics = {
  overview: { followers: 600000, reach: 2800000, impressions: 5200000, profileVisits: 45000 },
  recentPosts: [
    { type: "Reel", caption: "Glass skin tutorial ✨", likes: 45000, comments: 2300, shares: 8900, saves: 12000, reach: 580000, date: "2024-01-14" },
    { type: "Reel", caption: "3-step routine for beginners", likes: 62000, comments: 3100, shares: 15000, saves: 18000, reach: 720000, date: "2024-01-11" },
    { type: "Post", caption: "My holy grail products", likes: 28000, comments: 1500, shares: 3200, saves: 7800, reach: 320000, date: "2024-01-08" },
    { type: "Reel", caption: "Affordable alternatives", likes: 55000, comments: 2800, shares: 11000, saves: 14500, reach: 650000, date: "2024-01-04" },
    { type: "Story", caption: "Q&A: Your skin questions", likes: 0, comments: 0, shares: 0, saves: 0, reach: 180000, date: "2024-01-02" },
  ],
  weeklyReach: [
    { week: "W1", reach: 420000 }, { week: "W2", reach: 510000 }, { week: "W3", reach: 380000 },
    { week: "W4", reach: 620000 }, { week: "W5", reach: 550000 }, { week: "W6", reach: 700000 },
  ],
  engagementByType: [
    { type: "Reels", rate: 6.8 }, { type: "Posts", rate: 3.2 }, { type: "Stories", rate: 4.5 }, { type: "Carousels", rate: 5.1 },
  ],
};

// Posting consistency data
export const postingData = {
  weeklyPosts: [
    { week: "W1", posts: 5 }, { week: "W2", posts: 7 }, { week: "W3", posts: 4 },
    { week: "W4", posts: 6 }, { week: "W5", posts: 8 }, { week: "W6", posts: 5 },
  ],
  bestPostingTimes: [
    { time: "9 AM", engagement: 4.2 }, { time: "12 PM", engagement: 5.8 }, { time: "3 PM", engagement: 3.9 },
    { time: "6 PM", engagement: 7.1 }, { time: "9 PM", engagement: 6.5 },
  ],
  bestDays: [
    { day: "Mon", engagement: 4.1 }, { day: "Tue", engagement: 5.3 }, { day: "Wed", engagement: 4.8 },
    { day: "Thu", engagement: 5.9 }, { day: "Fri", engagement: 6.2 }, { day: "Sat", engagement: 7.4 }, { day: "Sun", engagement: 6.8 },
  ],
};

// Revenue data for influencers
export const revenueData = {
  totalEarnings: "₹8,45,000",
  monthlyEarnings: [
    { month: "Aug", earnings: 85000 }, { month: "Sep", earnings: 120000 }, { month: "Oct", earnings: 95000 },
    { month: "Nov", earnings: 150000 }, { month: "Dec", earnings: 180000 }, { month: "Jan", earnings: 215000 },
  ],
  earningsByBrand: [
    { brand: "GlowSkin Co.", amount: 320000 }, { brand: "FitGear Pro", amount: 195000 },
    { brand: "StyleVerse", amount: 180000 }, { brand: "TechNova", amount: 150000 },
  ],
  pendingPayments: "₹1,80,000",
  completedPayments: "₹6,65,000",
};

// Cross-platform comparison
export const platformComparison = [
  { platform: "YouTube", followers: 1800000, engagement: 4.8, growth: 12.5, content: 245 },
  { platform: "Instagram", followers: 600000, engagement: 6.2, growth: 18.3, content: 520 },
];

// Brand dashboard analytics
export const brandAnalytics = {
  overview: {
    totalCampaigns: 12,
    activeCampaigns: 3,
    completedCampaigns: 8,
    totalSpending: "₹15,60,000",
    avgCampaignROI: 4.2,
    successRate: 92,
  },
  spendingTrend: [
    { month: "Aug", spending: 120000 }, { month: "Sep", spending: 180000 }, { month: "Oct", spending: 95000 },
    { month: "Nov", spending: 250000 }, { month: "Dec", spending: 320000 }, { month: "Jan", spending: 195000 },
  ],
  campaignPerformance: [
    { campaign: "Summer Skincare", engagement: 5.2, roi: 3.8, reach: 2400000 },
    { campaign: "Fitness Challenge", engagement: 6.1, roi: 4.2, reach: 1800000 },
    { campaign: "Winter Glow", engagement: 7.8, roi: 5.1, reach: 1200000 },
  ],
  influencerComparison: [
    { name: "Priya Sharma", engagement: 4.8, roi: 3.8, campaigns: 3 },
    { name: "Arjun Mehta", engagement: 5.2, roi: 4.2, campaigns: 2 },
    { name: "Meera Nair", engagement: 8.1, roi: 5.1, campaigns: 1 },
  ],
};

// Notification types
export interface Notification {
  id: string;
  type: "campaign" | "message" | "payment" | "request";
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
}

export const notifications: Notification[] = [
  { id: "n1", type: "campaign", title: "Campaign Accepted", description: "Priya Sharma accepted your Summer Skincare campaign", timestamp: "5 min ago", read: false },
  { id: "n2", type: "message", title: "New Message", description: "FitGear Pro sent you a message", timestamp: "1 hr ago", read: false },
  { id: "n3", type: "payment", title: "Payment Received", description: "₹95,000 received from FitGear Pro", timestamp: "2 hrs ago", read: true },
  { id: "n4", type: "request", title: "Collaboration Request", description: "TechNova wants to collaborate with you", timestamp: "1 day ago", read: true },
];
