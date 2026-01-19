import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Switch, Alert, Platform } from 'react-native';
import { useState } from 'react';
import { Building2, Mail, Phone, MapPin, Info, CheckCircle, Bell, Settings, LogOut } from 'lucide-react-native';
import { useVendor } from '@/contexts/VendorContext';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { profile, updateProfile } = useVendor();
  const { logout } = useAuth();
  const insets = useSafeAreaInsets();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [phone, setPhone] = useState(profile.phone);
  const [address, setAddress] = useState(profile.address);
  const [description, setDescription] = useState(profile.description);
  const [notifications, setNotifications] = useState(true);
  const [autoConfirm, setAutoConfirm] = useState(false);

  const handleSave = () => {
    updateProfile({ name, email, phone, address, description });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setName(profile.name);
    setEmail(profile.email);
    setPhone(profile.phone);
    setAddress(profile.address);
    setDescription(profile.description);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Are you sure you want to log out?')) {
        logout();
      }
    } else {
      Alert.alert(
        'Log Out',
        'Are you sure you want to log out?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Log Out', style: 'destructive', onPress: logout },
        ]
      );
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Profile</Text>
            <View style={styles.verifiedBadge}>
              <CheckCircle size={14} color="#10B981" fill="#10B981" />
              <Text style={styles.verifiedText}>Verified Vendor</Text>
            </View>
          </View>
          {!isEditing ? (
            <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
              <Settings size={20} color="#3B82F6" />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.editActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      <View style={styles.statsCard}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.rating.toFixed(1)}</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{profile.totalRatings}</Text>
          <Text style={styles.statLabel}>Reviews</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{new Date(profile.joinedDate).getFullYear()}</Text>
          <Text style={styles.statLabel}>Member Since</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vendor Information</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Building2 size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Business Name</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Business name"
                  placeholderTextColor="#9CA3AF"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.name}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoRow}>
            <Mail size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Email address"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.email}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoRow}>
            <Phone size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Phone</Text>
              {isEditing ? (
                <TextInput
                  style={styles.input}
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="Phone number"
                  placeholderTextColor="#9CA3AF"
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{profile.phone}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Address</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Business address"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={2}
                />
              ) : (
                <Text style={styles.infoValue}>{profile.address}</Text>
              )}
            </View>
          </View>

          <View style={styles.infoRow}>
            <Info size={20} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Description</Text>
              {isEditing ? (
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Business description"
                  placeholderTextColor="#9CA3AF"
                  multiline
                  numberOfLines={3}
                />
              ) : (
                <Text style={styles.infoValue}>{profile.description}</Text>
              )}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Bell size={20} color="#6B7280" />
              <View>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Receive campaign updates</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={notifications ? '#3B82F6' : '#F3F4F6'}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <CheckCircle size={20} color="#6B7280" />
              <View>
                <Text style={styles.settingTitle}>Auto-Confirm Campaigns</Text>
                <Text style={styles.settingDescription}>Automatically accept new campaigns</Text>
              </View>
            </View>
            <Switch
              value={autoConfirm}
              onValueChange={setAutoConfirm}
              trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
              thumbColor={autoConfirm ? '#3B82F6' : '#F3F4F6'}
            />
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <LogOut size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 6,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  verifiedText: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600' as const,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  editButtonText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  editActions: {
    flexDirection: 'row',
    gap: 8,
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
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
  },
  statDivider: {
    width: 1,
    backgroundColor: '#F3F4F6',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: '#111827',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    minHeight: 60,
    textAlignVertical: 'top',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '600' as const,
    color: '#111827',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#6B7280',
  },
  settingDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  logoutButtonText: {
    color: '#EF4444',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});
