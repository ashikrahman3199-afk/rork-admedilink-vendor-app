import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Clock, Phone, CheckCircle, XCircle, AlertCircle } from 'lucide-react-native';
import { useVendor } from '@/contexts/VendorContext';
import { Booking } from '@/types/vendor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function BookingsScreen() {
  const { bookings, updateBookingStatus } = useVendor();
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState<'all' | Booking['status']>('all');

  const filteredBookings = filter === 'all' 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const sortedBookings = [...filteredBookings].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateB.getTime() - dateA.getTime();
  });

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#3B82F6';
      case 'active': return '#8B5CF6';
      case 'completed': return '#10B981';
      case 'cancelled': return '#EF4444';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    const color = getStatusColor(status);
    switch (status) {
      case 'pending': return <AlertCircle size={18} color={color} />;
      case 'confirmed': return <CheckCircle size={18} color={color} />;
      case 'active': return <CheckCircle size={18} color={color} fill={color} />;
      case 'completed': return <CheckCircle size={18} color={color} fill={color} />;
      case 'cancelled': return <XCircle size={18} color={color} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Campaigns</Text>
        <Text style={styles.headerSubtitle}>{bookings.length} total campaigns</Text>
      </View>

      <ScrollView 
        horizontal 
        style={styles.filterContainer} 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={[styles.filterButton, filter === 'all' && styles.filterButtonActive]}
          onPress={() => setFilter('all')}
        >
          <Text style={[styles.filterButtonText, filter === 'all' && styles.filterButtonTextActive]}>
            All ({bookings.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'pending' && styles.filterButtonActive]}
          onPress={() => setFilter('pending')}
        >
          <Text style={[styles.filterButtonText, filter === 'pending' && styles.filterButtonTextActive]}>
            Pending ({bookings.filter(b => b.status === 'pending').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'confirmed' && styles.filterButtonActive]}
          onPress={() => setFilter('confirmed')}
        >
          <Text style={[styles.filterButtonText, filter === 'confirmed' && styles.filterButtonTextActive]}>
            Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, filter === 'completed' && styles.filterButtonActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[styles.filterButtonText, filter === 'completed' && styles.filterButtonTextActive]}>
            Completed ({bookings.filter(b => b.status === 'completed').length})
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <ScrollView style={styles.bookingsList} showsVerticalScrollIndicator={false}>
        {sortedBookings.map((booking) => (
          <View key={booking.id} style={styles.bookingCard}>
            <View style={styles.bookingHeader}>
              <View style={styles.bookingHeaderLeft}>
                <Text style={styles.serviceName}>{booking.serviceName}</Text>
                <View style={styles.statusBadge}>
                  {getStatusIcon(booking.status)}
                  <Text style={[styles.statusText, { color: getStatusColor(booking.status) }]}>
                    {booking.status}
                  </Text>
                </View>
              </View>
              <Text style={styles.amount}>₹{booking.amount.toLocaleString('en-IN')}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.bookingDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Client:</Text>
                <Text style={styles.detailValue}>{booking.clientName}</Text>
              </View>
              <View style={styles.detailRow}>
                <Phone size={16} color="#6B7280" />
                <Text style={styles.detailValue}>{booking.clientPhone}</Text>
              </View>
              <View style={styles.detailRow}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.detailValue}>
                  {formatDate(booking.startDate)} - {formatDate(booking.endDate)}
                </Text>
              </View>
            </View>

            {booking.status === 'pending' && (
              <View style={styles.bookingActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.confirmBtn]}
                  onPress={() => updateBookingStatus(booking.id, 'confirmed')}
                >
                  <CheckCircle size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Confirm</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.cancelBtn]}
                  onPress={() => updateBookingStatus(booking.id, 'cancelled')}
                >
                  <XCircle size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            )}

            {booking.status === 'confirmed' && (
              <View style={styles.bookingActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.activeBtn]}
                  onPress={() => updateBookingStatus(booking.id, 'active')}
                >
                  <CheckCircle size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Start Campaign</Text>
                </TouchableOpacity>
              </View>
            )}

            {booking.status === 'active' && (
              <View style={styles.bookingActions}>
                <TouchableOpacity
                  style={[styles.actionBtn, styles.completeBtn]}
                  onPress={() => updateBookingStatus(booking.id, 'completed')}
                >
                  <CheckCircle size={18} color="#FFFFFF" />
                  <Text style={styles.actionBtnText}>Mark Completed</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        {sortedBookings.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No campaigns found</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B7280',
  },
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  bookingsList: {
    flex: 1,
  },
  bookingCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  bookingHeaderLeft: {
    flex: 1,
    gap: 6,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#111827',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
  },
  amount: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#111827',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 12,
  },
  bookingDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
  },
  detailValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  bookingActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  confirmBtn: {
    backgroundColor: '#10B981',
  },
  cancelBtn: {
    backgroundColor: '#EF4444',
  },
  activeBtn: {
    backgroundColor: '#8B5CF6',
  },
  completeBtn: {
    backgroundColor: '#3B82F6',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#9CA3AF',
  },
});
