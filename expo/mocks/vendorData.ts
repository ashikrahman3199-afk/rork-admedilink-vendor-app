import { Service, Booking, VendorProfile, PerformanceMetrics } from '@/types/vendor';

export const mockVendorProfile: VendorProfile = {
  id: '1',
  name: 'MediaHub Advertising',
  type: 'agency',
  email: 'contact@mediahub.com',
  phone: '+1 (555) 123-4567',
  address: '123 Media Plaza, Downtown, NY 10001',
  description: 'Premier advertising medium provider specializing in high-impact billboard locations and digital displays across major metropolitan areas.',
  rating: 4.8,
  totalRatings: 1247,
  joinedDate: '2023-01-15',
  verified: true,
};

export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Times Square Digital Billboard',
    category: 'LED Billboards',
    description: 'Premium digital billboard in Times Square with 4K LED display, 15-second rotation',
    rating: 4.9,
    totalBookings: 342,
    image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=400',
    options: [
      {
        id: 'opt1',
        name: 'Hoardings',
        price: 412500,
        duration: 30,
        availability: 'available',
        photos: ['https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=400'],
      }
    ]
  },
  {
    id: '2',
    name: 'Highway Billboard - Route 95',
    category: 'Billboards',
    description: 'Large format static billboard on I-95, high traffic area with 250k daily impressions',
    rating: 4.8,
    totalBookings: 567,
    image: 'https://images.unsplash.com/photo-1551677117-8b3e02c944c0?w=400',
    options: [
      {
        id: 'opt2',
        name: 'Hoarding',
        price: 288750,
        duration: 30,
        availability: 'available',
      }
    ]
  },
  {
    id: '3',
    name: 'Metro Station Displays',
    category: 'Metro & Trains',
    description: 'Digital displays across 5 major metro stations in downtown area',
    rating: 4.7,
    totalBookings: 234,
    image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400',
    options: []
  },
  {
    id: '4',
    name: 'Morning News Page 3',
    category: 'Newspaper',
    description: 'Quarter-page advertisement in premium daily newspaper, 500k circulation',
    rating: 4.6,
    totalBookings: 189,
    image: 'https://images.unsplash.com/photo-1586769852836-bc069f19e1b6?w=400',
    options: [
      {
        id: 'opt3',
        name: 'Quarter page',
        price: 346500,
        duration: 1,
        availability: 'available',
      }
    ]
  },
  {
    id: '5',
    name: 'City FM Prime Time',
    category: 'Radio',
    description: '30-second spots during morning and evening rush hours',
    rating: 4.9,
    totalBookings: 445,
    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=400',
    options: [
      {
        id: 'opt4',
        name: 'Jingle',
        price: 150000,
        duration: 30,
        availability: 'available',
      }
    ]
  },
  {
    id: '6',
    name: 'Bus Wrap Advertising',
    category: 'Buses',
    description: 'Full bus wrap advertisement on city bus routes with 150k daily reach',
    rating: 4.7,
    totalBookings: 298,
    image: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400',
    options: [
      {
        id: 'opt5',
        name: 'Full bus exterior',
        price: 264000,
        duration: 30,
        availability: 'available',
      }
    ]
  },
];

export const mockBookings: Booking[] = [

  {
    id: '1',
    serviceId: '1',
    serviceName: 'Times Square Digital Billboard',
    clientName: 'TechCorp Inc.',
    clientPhone: '+1 (555) 234-5678',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    status: 'pending',
    amount: 412500,
    campaignObjective: 'Launch of new flagship smartphone',
    designPreference: 'High-tech, futuristic, neon colors',
    clientImages: [
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
      'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400'
    ],
    progress: 0,
    proofOfExecution: []
  },
  {
    id: '2',
    serviceId: '2',
    serviceName: 'Highway Billboard - Route 95',
    clientName: 'AutoMax Dealership',
    clientPhone: '+1 (555) 345-6789',
    startDate: '2025-11-15',
    endDate: '2025-12-14',
    status: 'confirmed',
    amount: 288750,
    campaignObjective: 'Year-end clearance sale',
    designPreference: 'Bold red text on white background, high visibility',
    clientImages: [
      'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400'
    ],
    progress: 0,
    proofOfExecution: []
  },
  {
    id: '3',
    serviceId: '3',
    serviceName: 'Metro Station Displays',
    clientName: 'Fashion Forward',
    clientPhone: '+1 (555) 456-7890',
    startDate: '2025-12-01',
    endDate: '2025-12-31',
    status: 'confirmed',
    amount: 231000,
    campaignObjective: 'Winter collection promotion',
    designPreference: 'Elegant, minimalist, winter theme',
    clientImages: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400'
    ],
    progress: 0,
    proofOfExecution: []
  },
  {
    id: '4',
    serviceId: '1',
    serviceName: 'Times Square Digital Billboard',
    clientName: 'Global Brands Co.',
    clientPhone: '+1 (555) 567-8901',
    startDate: '2025-10-01',
    endDate: '2025-10-31',
    status: 'completed',
    amount: 412500,
    campaignObjective: 'Global brand awareness campaign',
    designPreference: 'Corporate colors, professional look',
    clientImages: [],
    progress: 100,
    proofOfExecution: [
      'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?w=400'
    ]
  },
  {
    id: '5',
    serviceId: '4',
    serviceName: 'Magazine Full Page Ad',
    clientName: 'Luxury Watches Ltd.',
    clientPhone: '+1 (555) 678-9012',
    startDate: '2025-11-20',
    endDate: '2025-12-19',
    status: 'pending',
    amount: 346500,
    campaignObjective: 'Introducing new luxury watch series',
    designPreference: 'Black and gold, sophisticated',
    clientImages: [
      'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400'
    ],
    progress: 0,
    proofOfExecution: []
  },
  {
    id: '6',
    serviceId: '5',
    serviceName: 'Stadium Event Sponsorship',
    clientName: 'Energy Drink Co.',
    clientPhone: '+1 (555) 789-0123',
    startDate: '2025-10-15',
    endDate: '2025-10-15',
    status: 'active',
    amount: 701250,
    campaignObjective: 'Sponsorship for the national cup final',
    designPreference: 'Energetic, dynamic, sporty',
    clientImages: [
      'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400',
      'https://images.unsplash.com/photo-1522770179533-24471fcdba45?w=400'
    ],
    progress: 45,
    proofOfExecution: [
      'https://images.unsplash.com/photo-1551677117-8b3e02c944c0?w=400'
    ]
  },
];

export const mockPerformanceMetrics: PerformanceMetrics = {
  totalRevenue: 4021875,
  totalBookings: 567,
  averageRating: 4.8,
  activeServices: 6,
  revenueGrowth: 12.5,
  bookingsGrowth: 8.3,
  monthlyRevenue: [
    { month: 'Apr', amount: 536250 },
    { month: 'May', amount: 594000 },
    { month: 'Jun', amount: 668250 },
    { month: 'Jul', amount: 643500 },
    { month: 'Aug', amount: 734250 },
    { month: 'Sep', amount: 763125 },
    { month: 'Oct', amount: 825000 },
  ],
  topServices: [
    { serviceName: 'Highway Billboard', bookings: 567 },
    { serviceName: 'Stadium Events', bookings: 445 },
    { serviceName: 'Digital Billboards', bookings: 342 },
    { serviceName: 'Bus Wrap Ads', bookings: 298 },
    { serviceName: 'Metro Displays', bookings: 234 },
  ],
};
