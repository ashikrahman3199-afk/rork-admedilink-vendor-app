import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Modal, TextInput, Alert, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { Clock, Phone, CheckCircle, XCircle, AlertCircle, HelpCircle, ChevronDown, ChevronUp, Send } from 'lucide-react-native';
import { useVendor } from '@/contexts/VendorContext';
import { Booking } from '@/types/vendor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import Slider from '@react-native-community/slider';
import * as ImagePicker from 'expo-image-picker';
import { Camera } from 'lucide-react-native';

export default function BookingsScreen() {
  const { bookings, updateBookingStatus, updateBooking, pendingBookings } = useVendor();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ status: Booking['status'] }>();

  const [filter, setFilter] = useState<'all' | Booking['status']>('all');

  useEffect(() => {
    if (params.status && ['pending', 'confirmed', 'active', 'completed', 'cancelled'].includes(params.status)) {
      setFilter(params.status);
    }
  }, [params.status]);
  const [expandedBookingId, setExpandedBookingId] = useState<string | null>(null);
  const [helpModalVisible, setHelpModalVisible] = useState(false);
  const [selectedBookingForHelp, setSelectedBookingForHelp] = useState<string | null>(null);
  const [helpMessage, setHelpMessage] = useState('');

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

  const pickImage = async (bookingId: string, currentImages: string[] = []) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      updateBooking(bookingId, {
        proofOfExecution: [...currentImages, result.assets[0].uri]
      });
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={sortedBookings}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <>
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
              <Text style={styles.headerTitle}>Campaigns</Text>
              <Text style={styles.headerSubtitle}>{bookings.length} total campaigns</Text>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.filterContainer}
              contentContainerStyle={styles.filterContent}
            >
              <TouchableOpacity
                style={[styles.statCard, filter === 'all' ? { backgroundColor: '#4F46E5' } : { backgroundColor: '#F3F4F6' }]}
                onPress={() => setFilter('all')}
              >
                <Text style={[styles.statLabel, filter !== 'all' && { color: '#6B7280' }]}>All Campaigns</Text>
                <Text style={[styles.statValue, filter !== 'all' && { color: '#111827' }]}>{bookings.length}</Text>
                <Text style={[styles.statSubtext, filter !== 'all' && { color: '#9CA3AF' }]}>Total</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, filter === 'pending' ? { backgroundColor: '#F59E0B' } : { backgroundColor: '#F3F4F6' }]}
                onPress={() => setFilter('pending')}
              >
                <Text style={[styles.statLabel, filter !== 'pending' && { color: '#6B7280' }]}>Pending</Text>
                <Text style={[styles.statValue, filter !== 'pending' && { color: '#111827' }]}>
                  {bookings.filter(b => b.status === 'pending').length}
                </Text>
                <Text style={[styles.statSubtext, filter !== 'pending' && { color: '#9CA3AF' }]}>Requests</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, filter === 'confirmed' ? { backgroundColor: '#3B82F6' } : { backgroundColor: '#F3F4F6' }]}
                onPress={() => setFilter('confirmed')}
              >
                <Text style={[styles.statLabel, filter !== 'confirmed' && { color: '#6B7280' }]}>Confirmed</Text>
                <Text style={[styles.statValue, filter !== 'confirmed' && { color: '#111827' }]}>
                  {bookings.filter(b => b.status === 'confirmed').length}
                </Text>
                <Text style={[styles.statSubtext, filter !== 'confirmed' && { color: '#9CA3AF' }]}>Approved</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, filter === 'active' ? { backgroundColor: '#8B5CF6' } : { backgroundColor: '#F3F4F6' }]}
                onPress={() => setFilter('active')}
              >
                <Text style={[styles.statLabel, filter !== 'active' && { color: '#6B7280' }]}>Active</Text>
                <Text style={[styles.statValue, filter !== 'active' && { color: '#111827' }]}>
                  {bookings.filter(b => b.status === 'active').length}
                </Text>
                <Text style={[styles.statSubtext, filter !== 'active' && { color: '#9CA3AF' }]}>Running</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statCard, filter === 'completed' ? { backgroundColor: '#10B981' } : { backgroundColor: '#F3F4F6' }]}
                onPress={() => setFilter('completed')}
              >
                <Text style={[styles.statLabel, filter !== 'completed' && { color: '#6B7280' }]}>Completed</Text>
                <Text style={[styles.statValue, filter !== 'completed' && { color: '#111827' }]}>
                  {bookings.filter(b => b.status === 'completed').length}
                </Text>
                <Text style={[styles.statSubtext, filter !== 'completed' && { color: '#9CA3AF' }]}>Finished</Text>
              </TouchableOpacity>
            </ScrollView>
          </>
        }
        renderItem={({ item: booking }) => (
          <TouchableOpacity
            key={booking.id}
            style={styles.bookingCard}
            onPress={() => setExpandedBookingId(expandedBookingId === booking.id ? null : booking.id)}
            activeOpacity={0.9}
          >
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
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={styles.amount}>₹{booking.amount.toLocaleString('en-IN')}</Text>
                {expandedBookingId === booking.id ? <ChevronUp size={20} color="#9CA3AF" /> : <ChevronDown size={20} color="#9CA3AF" />}
              </View>
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

            {expandedBookingId === booking.id && (
              <View style={styles.expandedContent}>
                <View style={styles.divider} />

                {booking.campaignObjective && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionLabel}>Campaign Objective</Text>
                    <Text style={styles.sectionText}>{booking.campaignObjective}</Text>
                  </View>
                )}

                {booking.designPreference && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionLabel}>Design Preference</Text>
                    <Text style={styles.sectionText}>{booking.designPreference}</Text>
                  </View>
                )}

                {booking.clientImages && booking.clientImages.length > 0 && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionLabel}>Final Image</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                      {booking.clientImages.map((img, idx) => (
                        <Image key={idx} source={{ uri: img }} style={styles.clientImage} contentFit="cover" />
                      ))}
                    </ScrollView>
                  </View>
                )}

                <TouchableOpacity
                  style={styles.helpButton}
                  onPress={() => {
                    setSelectedBookingForHelp(booking.id);
                    setHelpModalVisible(true);
                  }}
                >
                  <HelpCircle size={16} color="#6366F1" />
                  <Text style={styles.helpButtonText}>Need Help with this Campaign?</Text>
                </TouchableOpacity>
              </View>
            )}

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

            {booking.status === 'active' && expandedBookingId === booking.id && (
              <View style={styles.activeCampaignControls}>
                <View style={styles.divider} />

                <Text style={styles.sectionLabel}>Campaign Progress: {Math.round(booking.progress || 0)}%</Text>
                <Slider
                  style={{ width: '100%', height: 40 }}
                  minimumValue={0}
                  maximumValue={100}
                  minimumTrackTintColor="#8B5CF6"
                  maximumTrackTintColor="#E5E7EB"
                  thumbTintColor="#8B5CF6"
                  value={booking.progress || 0}
                  onSlidingComplete={(value) => updateBooking(booking.id, { progress: value })}
                />

                <View style={styles.divider} />

                <Text style={styles.sectionLabel}>Proof of Execution</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.imageScroll}>
                  {booking.proofOfExecution?.map((img, idx) => (
                    <Image key={idx} source={{ uri: img }} style={styles.clientImage} contentFit="cover" />
                  ))}
                  <TouchableOpacity
                    style={styles.addImageBtn}
                    onPress={() => pickImage(booking.id, booking.proofOfExecution)}
                  >
                    <Camera size={24} color="#6B7280" />
                    <Text style={styles.addImageText}>Add Photo</Text>
                  </TouchableOpacity>
                </ScrollView>
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
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No campaigns found</Text>
          </View>
        }
      />

      <View style={{ height: 20 }} />

      <Modal
        visible={helpModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setHelpModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Contact Support</Text>
              <TouchableOpacity onPress={() => setHelpModalVisible(false)}>
                <XCircle size={24} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.modalSubtitle}>
              Our team will contact you regarding Campaign #{selectedBookingForHelp}
            </Text>

            <TextInput
              style={styles.helpInput}
              placeholder="Describe your issue or question..."
              multiline
              numberOfLines={4}
              value={helpMessage}
              onChangeText={setHelpMessage}
              textAlignVertical="top"
            />

            <TouchableOpacity
              style={styles.sendButton}
              onPress={() => {
                Alert.alert('Message Sent', 'Our support team has been notified and will contact you shortly.');
                setHelpModalVisible(false);
                setHelpMessage('');
                setSelectedBookingForHelp(null);
              }}
            >
              <Send size={16} color="#FFF" />
              <Text style={styles.sendButtonText}>Send Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  // ... (keep existing styles until bookingCard)
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
  /* Removed dashboard styles, reusing statCard for filters */
  statCard: {
    width: 160,
    height: 100,
    borderRadius: 16,
    padding: 16,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '600',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  statSubtext: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.6)',
  },
  filterContainer: {
    marginBottom: 20,
    marginTop: -10,
  },
  filterContent: {
    paddingHorizontal: 20,
    gap: 12,
    alignItems: 'center',
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
  // ... (keep existing styles)
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
  // New Styles
  expandedContent: {
    marginTop: 8,
  },
  detailSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  sectionText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  imageScroll: {
    marginHorizontal: -4,
  },
  clientImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    marginHorizontal: 4,
    backgroundColor: '#F3F4F6',
  },
  helpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#E0E7FF',
    borderRadius: 8,
    marginTop: 8,
  },
  helpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4338CA',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
  },
  helpInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 16,
    height: 120,
    textAlignVertical: 'top',
    fontSize: 15,
    marginBottom: 20,
  },
  sendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    borderRadius: 12,
  },
  sendButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // Existing Actions
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
  activeCampaignControls: {
    marginTop: 8,
  },
  addImageBtn: {
    width: 120,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
    gap: 4,
  },
  addImageText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
});
