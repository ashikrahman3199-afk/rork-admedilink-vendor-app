export interface Service {
  id: string;
  name: string;
  category: 'billboard' | 'digital' | 'transit' | 'print' | 'event';
  description: string;
  price: number;
  duration: number;
  availability: 'available' | 'limited' | 'unavailable';
  image?: string;
  rating: number;
  totalBookings: number;
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
