export interface ServiceOption {
  id: string;
  name: string;
  price: number;
  duration: number;
  availability: 'available' | 'limited' | 'unavailable';
  blockedDates?: Record<string, { marked?: boolean; dotColor?: string; disabled?: boolean; disableTouchEvent?: boolean; selected?: boolean; selectedColor?: string; textColor?: string }>;
  photos?: string[];
}

export interface Service {
  id: string;
  vendorId: string;
  name: string;
  category:
  | 'Billboards'
  | 'LED Billboards'
  | 'Radio'
  | 'Cinema'
  | 'Newspaper'
  | 'Influencers'
  | 'Buses'
  | 'Cabs'
  | 'Auto'
  | 'Metro & Trains'
  | 'Digital(TV)'
  | 'Digital Marketing'
  | 'LED Vending Machine'
  | 'LED Vehicle';
  description: string;
  image?: string;
  rating: number;
  totalBookings: number;
  details?: Record<string, any>;
  options?: ServiceOption[];
  approvalStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  blockedDates?: Record<string, { marked?: boolean; dotColor?: string; disabled?: boolean; disableTouchEvent?: boolean; selected?: boolean; selectedColor?: string; textColor?: string }>;
}

export interface Booking {
  id: string;
  serviceId: string;
  serviceName: string;
  clientName: string;
  clientPhone: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  amount: number;
  campaignDetails?: string;
  campaignObjective?: string;
  designPreference?: string;
  clientImages?: string[];
  progress?: number;
  proofOfExecution?: string[];
}

export interface VendorProfile {
  id: string;
  name: string;
  type: 'agency' | 'individual' | 'media-owner' | 'broker' | 'network';
  email: string;
  phone: string;
  address: string;
  description: string;
  rating: number;
  totalRatings: number;
  joinedDate: string;
  verified: boolean;
}

export interface PerformanceMetrics {
  totalRevenue: number;
  totalBookings: number;
  averageRating: number;
  activeServices: number;
  monthlyRevenue: { month: string; amount: number }[];
  topServices: { serviceName: string; bookings: number }[];
  revenueGrowth: number;
  bookingsGrowth: number;
}
