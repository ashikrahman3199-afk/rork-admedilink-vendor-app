import { StyleSheet, Text, View, ScrollView, Dimensions, TouchableOpacity, Alert } from 'react-native';
import { TrendingUp, IndianRupee, Calendar, Star, Package } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useVendor } from '@/contexts/VendorContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

export default function DashboardScreen() {
  const { metrics, pendingBookings, activeBookings } = useVendor();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Dashboard</Text>
        <Text style={styles.headerSubtitle}>Welcome back! Here&apos;s your overview</Text>
      </View>

      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#DCFCE7' }]}>
            <IndianRupee size={22} color="#10B981" strokeWidth={2.5} />
          </View>
          <Text style={styles.statValue}>₹{metrics.totalRevenue.toLocaleString('en-IN')}</Text>
          <Text style={styles.statLabel}>Total Revenue</Text>
          <View style={styles.statTrend}>
            <TrendingUp size={14} color="#10B981" />
            <Text style={[styles.statTrendText, { color: '#10B981' }]}>
              +{metrics.revenueGrowth}%
            </Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#DBEAFE' }]}>
            <Calendar size={22} color="#3B82F6" strokeWidth={2.5} />
          </View>
          <Text style={styles.statValue}>{metrics.totalBookings}</Text>
          <Text style={styles.statLabel}>Total Bookings</Text>
          <View style={styles.statTrend}>
            <TrendingUp size={14} color="#10B981" />
            <Text style={[styles.statTrendText, { color: '#10B981' }]}>
              +{metrics.bookingsGrowth}%
            </Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#FEF3C7' }]}>
            <Star size={22} color="#F59E0B" strokeWidth={2.5} />
          </View>
          <Text style={styles.statValue}>{metrics.averageRating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Avg. Rating</Text>
          <View style={styles.statTrend}>
            <Star size={14} color="#F59E0B" fill="#F59E0B" />
            <Text style={[styles.statTrendText, { color: '#F59E0B', marginLeft: 4 }]}>
              Excellent
            </Text>
          </View>
        </View>

        <View style={styles.statCard}>
          <View style={[styles.statIconContainer, { backgroundColor: '#E0E7FF' }]}>
            <Package size={22} color="#6366F1" strokeWidth={2.5} />
          </View>
          <Text style={styles.statValue}>{metrics.activeServices}</Text>
          <Text style={styles.statLabel}>Active Mediums</Text>
          <View style={styles.statTrend}>
            <Text style={[styles.statTrendText, { color: '#6B7280' }]}>
              Available
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={[styles.sectionTitle, { marginBottom: 0 }]}>Financial Breakdown</Text>
          <TouchableOpacity
            style={{ backgroundColor: '#115E59', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}
            onPress={() => {
              if (!user?.bankDetails) {
                Alert.alert('Bank Details Missing', 'Please add your bank details in your Profile to withdraw funds.', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Go to Profile', onPress: () => router.navigate('/(tabs)/profile') }
                ]);
              } else {
                Alert.alert('Withdraw Funds', 'Withdrawal request initiated successfully. Your net earnings will be transferred to your registered bank account.');
              }
            }}
          >
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>Withdraw</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.financialCard}>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabel}>Gross Sales</Text>
            <Text style={styles.financialValue}>₹{metrics.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
          </View>
          <View style={styles.financialDivider} />
          
          <View style={styles.financialRow}>
            <Text style={styles.financialLabelNegative}>GST (18%)</Text>
            <Text style={styles.financialValueNegative}>-₹{(metrics.totalRevenue * 0.18).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
          </View>
          <View style={styles.financialRow}>
            <Text style={styles.financialLabelNegative}>Platform Fee (10%)</Text>
            <Text style={styles.financialValueNegative}>-₹{(metrics.totalRevenue * 0.10).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
          </View>
          
          <View style={[styles.financialDivider, { borderTopWidth: 2, borderTopColor: '#E5E7EB', marginVertical: 12 }]} />
          
          <View style={styles.financialRow}>
            <Text style={styles.financialLabelTotal}>Net Earnings</Text>
            <Text style={styles.financialValueTotal}>₹{(metrics.totalRevenue * 0.72).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</Text>
          </View>
        </View>
      </View>

      <View style={styles.alertsSection}>
        {pendingBookings > 0 && (
          <TouchableOpacity
            style={[styles.alertCard, { backgroundColor: '#FEFCE8' }]}
            onPress={() => router.push({ pathname: '/(tabs)/bookings', params: { status: 'pending' } })}
            activeOpacity={0.9}
          >
            <View style={[styles.alertIconContainer, { backgroundColor: '#F59E0B' }]}>
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#F59E0B', opacity: 0.2, position: 'absolute' }} />
              <Calendar size={20} color="#FFF" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Upcoming Works</Text>
              <Text style={styles.alertText}>
                You have {pendingBookings} new order{pendingBookings > 1 ? 's' : ''} to start working on
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {activeBookings.length > 0 && (
          <TouchableOpacity
            style={[styles.alertCard, { backgroundColor: '#EFF6FF' }]}
            onPress={() => router.push({ pathname: '/(tabs)/bookings', params: { status: 'active' } })}
            activeOpacity={0.9}
          >
            <View style={[styles.alertIconContainer, { backgroundColor: '#3B82F6' }]}>
              <View style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: '#3B82F6', opacity: 0.2, position: 'absolute' }} />
              <Calendar size={20} color="#FFF" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>Active Campaigns</Text>
              <Text style={styles.alertText}>
                {activeBookings.length} campaign{activeBookings.length > 1 ? 's are' : ' is'} currently running
              </Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Revenue Trend</Text>
        <View style={styles.chartCard}>
          {metrics.monthlyRevenue.length > 0 ? (
            <View style={styles.chartContainer}>
              {metrics.monthlyRevenue.map((data, index) => {
                const maxRevenue = Math.max(...metrics.monthlyRevenue.map(d => d.amount));
                const heightPercentage = (data.amount / maxRevenue) * 100;

                return (
                  <View key={data.month} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      <LinearGradient
                        colors={['#3B82F6', '#8B5CF6']}
                        style={[styles.bar, { height: `${heightPercentage}%` }]}
                      />
                    </View>
                    <Text style={styles.barLabel}>{data.month}</Text>
                  </View>
                );
              })}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No revenue data yet</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Advertising Mediums</Text>
        <View style={styles.topServicesCard}>
          {metrics.topServices.length > 0 ? (
            metrics.topServices.map((service, index) => (
              <View key={service.serviceName} style={styles.topServiceRow}>
                <View style={styles.topServiceRank}>
                  <Text style={styles.topServiceRankText}>#{index + 1}</Text>
                </View>
                <View style={styles.topServiceInfo}>
                  <Text style={styles.topServiceName}>{service.serviceName}</Text>
                  <Text style={styles.topServiceBookings}>{service.bookings} bookings</Text>
                </View>
                <View style={styles.topServiceBar}>
                  <View
                    style={[
                      styles.topServiceBarFill,
                      { width: `${(service.bookings / metrics.topServices[0].bookings) * 100}%` }
                    ]}
                  />
                </View>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No services booked yet</Text>
            </View>
          )}
        </View>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
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
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 16,
  },
  statCard: {
    width: CARD_WIDTH,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#D1FAE5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statTrendText: {
    fontSize: 12,
    fontWeight: '600' as const,
  },
  financialCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  financialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  financialLabel: {
    fontSize: 15,
    color: '#374151',
    fontWeight: '500' as const,
  },
  financialValue: {
    fontSize: 15,
    color: '#111827',
    fontWeight: '600' as const,
  },
  financialLabelNegative: {
    fontSize: 14,
    color: '#6B7280',
  },
  financialValueNegative: {
    fontSize: 14,
    color: '#EF4444',
    fontWeight: '500' as const,
  },
  financialDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginVertical: 8,
  },
  financialLabelTotal: {
    fontSize: 16,
    color: '#115E59',
    fontWeight: '700' as const,
  },
  financialValueTotal: {
    fontSize: 20,
    color: '#0F766E',
    fontWeight: '700' as const,
  },
  alertsSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  alertCard: {
    flexDirection: 'row',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  alertIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 16,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 180,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    paddingHorizontal: 4,
  },
  bar: {
    width: '100%',
    borderRadius: 6,
    minHeight: 20,
  },
  barLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500' as const,
  },
  topServicesCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  topServiceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  topServiceRank: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topServiceRankText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: '#6B7280',
  },
  topServiceInfo: {
    flex: 1,
  },
  topServiceName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 2,
  },
  topServiceBookings: {
    fontSize: 12,
    color: '#6B7280',
  },
  topServiceBar: {
    width: 80,
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  topServiceBarFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 3,
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontStyle: 'italic',
  },
});
