import createContextHook from '@nkzw/create-context-hook';
import { useState, useMemo, useCallback, useEffect } from 'react';
import { Service, Booking, VendorProfile, PerformanceMetrics } from '@/types/vendor';
import { docClient, AWS_CONFIG } from '@/lib/aws-config';
import { ScanCommand, PutCommand, UpdateCommand, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { useAuth } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const [VendorProvider, useVendor] = createContextHook(() => {
  const { user, isAuthenticated } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [profile, setProfile] = useState<VendorProfile>({
    id: '',
    name: '',
    type: 'agency',
    email: '',
    phone: '',
    address: '',
    description: '',
    rating: 0,
    totalRatings: 0,
    joinedDate: new Date().toISOString(),
    verified: false,
  });

  const fetchServices = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setServices([]);
      return;
    }

    try {
      const command = new ScanCommand({
        TableName: AWS_CONFIG.TABLES.SERVICE,
      });
      const data = await docClient.send(command);
      const allServices = (data.Items as any[]) || [];

      const mappedServices = allServices.map(item => ({
        ...item,
        category: item.type || item.category || 'Billboards', // map AppSync type -> category
      })) as Service[];

      const vendorServices = mappedServices.filter(s => s.vendorId === user.id);
      setServices(vendorServices);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  }, [isAuthenticated, user?.id]);

  const fetchBookings = useCallback(async () => {
    if (!isAuthenticated || !user?.id) {
      setBookings([]);
      return;
    }

    try {
      const command = new ScanCommand({
        TableName: AWS_CONFIG.TABLES.BOOKING,
      });
      const data = await docClient.send(command);
      const allBookings = (data.Items as Booking[]) || [];

      // Temporarily letting all pass or filter strictly if structure allows.
      setBookings(allBookings);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  }, [isAuthenticated, user?.id]);

  // Sync auth user to profile
  useEffect(() => {
    if (user) {
      // try loading additional profile data from async storage
      AsyncStorage.getItem(`vendor_profile_${user.id}`).then(stored => {
        let extra = {};
        if (stored) {
          try {
            extra = JSON.parse(stored);
          } catch (e) { }
        }
        setProfile(prev => ({
          ...prev,
          id: user.id || prev.id,
          name: user.companyName || user.name || prev.name,
          email: user.email || prev.email,
          phone: user.mobileNumber || prev.phone,
          ...extra,
        }));
      });
    }
  }, [user]);

  // Initial fetch
  useEffect(() => {
    fetchServices();
    fetchBookings();

    const interval = setInterval(() => {
      fetchServices();
      fetchBookings();
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchServices, fetchBookings]);

  const addService = useCallback(async (service: Omit<Service, 'id' | 'rating' | 'totalBookings' | 'vendorId'>) => {
    if (!isAuthenticated || !user?.id) {
      console.error("Cannot add service: User not authenticated");
      return;
    }

    try {
      const id = Date.now().toString();
      const newService = {
        ...service,
        id,
        rating: 0,
        totalBookings: 0,
        vendorId: user.id,
        approvalStatus: 'PENDING',
        createdAt: new Date().toISOString(),

        // Ensure primitive fields expected by AppSync
        price: service.options && service.options.length > 0 ? service.options[0].price : 0,
        type: service.category || 'Cinema',
        category: service.category || 'Cinema',

        // AppSync Metadata compatibility
        __typename: 'Service',
        _version: 1,
        _lastChangedAt: Date.now()
      };

      const command = new PutCommand({
        TableName: AWS_CONFIG.TABLES.SERVICE,
        Item: newService,
      });

      await docClient.send(command);
      fetchServices(); // Refresh list
    } catch (error) {
      console.error("Error adding service: ", error);
    }
  }, [fetchServices, isAuthenticated, user?.id]);

  const updateService = useCallback(async (id: string, updates: Partial<Service>) => {
    try {
      // Approval Workflow Logic
      let updatesWithApproval: any = {
        ...updates,
        approvalStatus: 'PENDING'
      };

      if (Object.keys(updates).includes('blockedDates') && Object.keys(updates).length === 1) {
        // If only updating blockedDates, don't change approval status
        const { approvalStatus, ...rest } = updatesWithApproval;
        updatesWithApproval = rest;
      }

      // AppSync Metadata
      updatesWithApproval._lastChangedAt = Date.now();

      const keys = Object.keys(updatesWithApproval);
      if (keys.length === 0) return;

      const updateExpressionParts: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      keys.forEach((key, index) => {
        const attrName = `#attr${index}`;
        const attrVal = `:val${index}`;
        updateExpressionParts.push(`${attrName} = ${attrVal}`);
        expressionAttributeNames[attrName] = key;
        expressionAttributeValues[attrVal] = updatesWithApproval[key];
      });

      const command = new UpdateCommand({
        TableName: AWS_CONFIG.TABLES.SERVICE,
        Key: { id },
        UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      });

      await docClient.send(command);
      fetchServices(); // Refresh
    } catch (error) {
      console.error("Error updating service: ", error);
    }
  }, [fetchServices]);

  const deleteService = useCallback(async (id: string) => {
    try {
      const command = new DeleteCommand({
        TableName: AWS_CONFIG.TABLES.SERVICE,
        Key: { id },
      });
      await docClient.send(command);
      fetchServices(); // Refresh
    } catch (error) {
      console.error("Error deleting service: ", error);
    }
  }, [fetchServices]);

  const updateBookingStatus = useCallback(async (id: string, status: Booking['status']) => {
    try {
      const command = new UpdateCommand({
        TableName: AWS_CONFIG.TABLES.BOOKING,
        Key: { id },
        UpdateExpression: "SET #status = :status, #lastChangedAt = :now",
        ExpressionAttributeNames: { "#status": "status", "#lastChangedAt": "_lastChangedAt" },
        ExpressionAttributeValues: { ":status": status.toUpperCase(), ":now": Date.now() },
      });
      await docClient.send(command);
      fetchBookings(); // Refresh
    } catch (error) {
      console.error("Error updating booking status: ", error);
    }
  }, [fetchBookings]);

  const updateBooking = useCallback(async (id: string, updates: Partial<Booking>) => {
    try {
      updates = { ...updates, _lastChangedAt: Date.now() } as any;
      const keys = Object.keys(updates);
      if (keys.length === 0) return;

      const updateExpressionParts: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      keys.forEach((key, index) => {
        const attrName = `#attr${index}`;
        const attrVal = `:val${index}`;
        updateExpressionParts.push(`${attrName} = ${attrVal}`);
        expressionAttributeNames[attrName] = key;
        expressionAttributeValues[attrVal] = (updates as any)[key];
      });

      const command = new UpdateCommand({
        TableName: AWS_CONFIG.TABLES.BOOKING,
        Key: { id },
        UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
      });

      await docClient.send(command);
      fetchBookings(); // Refresh
    } catch (error) {
      console.error("Error updating booking: ", error);
    }
  }, [fetchBookings]);

  const updateProfile = useCallback(async (updates: Partial<VendorProfile>) => {
    setProfile(prev => {
      const next = { ...prev, ...updates };
      if (user?.id) {
        AsyncStorage.setItem(`vendor_profile_${user.id}`, JSON.stringify({
          address: next.address,
          description: next.description
        })).catch(console.error);

        // Sync to DynamoDB Vendor table
        const syncToBackend = async () => {
          try {
            const table = AWS_CONFIG.TABLES.VENDOR || 'Vendor-nsbiqzdckfe7jabryaawz4tjwe-NONE';
            const dbUpdates: any = {};
            if (updates.address) dbUpdates.location = updates.address;
            if (updates.description) dbUpdates.businessName = updates.description; // Mapping descriptions/names if needed

            // Note: Since Vendor schema might not naturally have all these fields, 
            // the most critical one to sync is location/address based on GraphQL schema.
            if (Object.keys(dbUpdates).length > 0) {
              const keys = Object.keys(dbUpdates);
              const updateExpressionParts: string[] = [];
              const expressionAttributeNames: Record<string, string> = {};
              const expressionAttributeValues: Record<string, any> = {};

              keys.forEach((key, index) => {
                const attrName = `#attr${index}`;
                const attrVal = `:val${index}`;
                updateExpressionParts.push(`${attrName} = ${attrVal}`);
                expressionAttributeNames[attrName] = key;
                expressionAttributeValues[attrVal] = dbUpdates[key];
              });

              // Add AppSync Metadata
              updateExpressionParts.push(`#lastChanged = :now`);
              expressionAttributeNames['#lastChanged'] = '_lastChangedAt';
              expressionAttributeValues[':now'] = Date.now();

              const command = new UpdateCommand({
                TableName: table,
                Key: { id: user.id },
                UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
                ExpressionAttributeNames: expressionAttributeNames,
                ExpressionAttributeValues: expressionAttributeValues,
              });
              await docClient.send(command).catch(() => {
                // Ignore if creating vendor record dynamically instead of strict update
              });
            }
          } catch (e) {
            console.error("Backend vendor sync failed", e);
          }
        };
        syncToBackend();
      }
      return next;
    });
  }, [user?.id]);

  const metrics = useMemo<PerformanceMetrics>(() => {
    const completedBookings = bookings.filter(b => b.status === 'completed' || b.status === 'COMPLETED' as any);
    const totalRevenue = completedBookings.reduce((sum, b) => sum + (b.amount || 0), 0);
    const avgRating = services.length > 0 ? services.reduce((sum, s) => sum + (s.rating || 0), 0) / services.length : 0;

    return {
      totalRevenue,
      totalBookings: bookings.length,
      averageRating: avgRating,
      activeServices: services.length,
      monthlyRevenue: [],
      topServices: [],
      revenueGrowth: 0,
      bookingsGrowth: 0,
    };
  }, [services, bookings]);

  const pendingBookings = useMemo(() =>
    bookings.filter(b => b.status === 'pending' || b.status === 'PENDING' as any).length,
    [bookings]
  );

  const activeBookings = useMemo(() => {
    return bookings.filter(b => b.status === 'active' || b.status === 'confirmed' || b.status === 'CONFIRMED' as any);
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
