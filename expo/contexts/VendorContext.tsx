import createContextHook from '@nkzw/create-context-hook';
import { useState, useMemo, useCallback } from 'react';
import { Service, Booking, VendorProfile, PerformanceMetrics } from '@/types/vendor';
import { mockServices, mockBookings, mockVendorProfile, mockPerformanceMetrics } from '@/mocks/vendorData';

export const [VendorProvider, useVendor] = createContextHook(() => {
  const [services, setServices] = useState<Service[]>(mockServices);
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);
  const [profile, setProfile] = useState<VendorProfile>(mockVendorProfile);

  const addService = useCallback((service: Omit<Service, 'id' | 'rating' | 'totalBookings'>) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      rating: 0,
      totalBookings: 0,
    };
    setServices(prev => [...prev, newService]);
  }, []);

  const updateService = useCallback((id: string, updates: Partial<Service>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  }, []);

  const deleteService = useCallback((id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  }, []);

  const updateBookingStatus = useCallback((id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  }, []);

  const updateBooking = useCallback((id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  }, []);

  const updateProfile = useCallback((updates: Partial<VendorProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const metrics = useMemo<PerformanceMetrics>(() => {
    const completedBookings = bookings.filter(b => b.status === 'completed');
    const totalRevenue = completedBookings.reduce((sum, b) => sum + b.amount, 0);
    const avgRating = services.reduce((sum, s) => sum + s.rating, 0) / services.length;

    return {
      ...mockPerformanceMetrics,
      totalRevenue,
      totalBookings: bookings.length,
      averageRating: avgRating,
      activeServices: services.length,
    };
  }, [services, bookings]);

  const pendingBookings = useMemo(() =>
    bookings.filter(b => b.status === 'pending').length,
    [bookings]
  );

  const activeBookings = useMemo(() => {
    return bookings.filter(b => b.status === 'active' || b.status === 'confirmed');
  }, [bookings]);

  return useMemo(() => ({
    services,
    bookings,
    profile,
    metrics,
    pendingBookings,
    activeBookings,
    addService,
    updateService,
    deleteService,
    updateBookingStatus,
    updateBooking,
    updateProfile,
  }), [services, bookings, profile, metrics, pendingBookings, activeBookings, addService, updateService, deleteService, updateBookingStatus, updateProfile]);
});
