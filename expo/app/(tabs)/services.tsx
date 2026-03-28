import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { Plus, Search, Edit2, Trash2, X } from 'lucide-react-native';
import { useVendor } from '@/contexts/VendorContext';
import { Service } from '@/types/vendor';
import { Image } from 'expo-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SERVICE_CATEGORIES, SERVICE_FIELDS } from '@/constants/serviceFields';

export default function ServicesScreen() {
  const { services, addService, updateService, deleteService } = useVendor();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const filteredServices = services.filter(service =>
    service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    service.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteService = (service: Service) => {
    Alert.alert(
      'Delete Ad Medium',
      `Are you sure you want to delete "${service.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteService(service.id)
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.headerTitle}>Ad Mediums</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={20} color="#FFFFFF" strokeWidth={2.5} />
          <Text style={styles.addButtonText}>Add Medium</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search ad mediums..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#9CA3AF"
        />
      </View>

      <ScrollView style={styles.servicesList} showsVerticalScrollIndicator={false}>
        {filteredServices.map((service) => (
          <View key={service.id} style={styles.serviceCard}>
            <Image
              source={{ uri: service.image }}
              style={styles.serviceImage}
              contentFit="cover"
            />
            <TouchableOpacity
              style={styles.serviceInfo}
              onPress={() => router.push(`/service/${service.id}`)}
            >
              <View style={styles.serviceHeader}>
                <View style={styles.serviceHeaderLeft}>
                  <Text style={styles.serviceName}>{service.name}</Text>
                  <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{service.category}</Text>
                  </View>
                </View>
                <View style={styles.serviceActions}>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => setEditingService(service)}
                  >
                    <Edit2 size={18} color="#3B82F6" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteService(service)}
                  >
                    <Trash2 size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.serviceDescription} numberOfLines={2}>
                {service.description}
              </Text>


            </TouchableOpacity>
          </View>
        ))}

        {filteredServices.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No ad mediums found</Text>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <ServiceFormModal
        visible={showAddModal || editingService !== null}
        service={editingService}
        onClose={() => {
          setShowAddModal(false);
          setEditingService(null);
        }}
        onSave={(data) => {
          if (editingService) {
            updateService(editingService.id, data);
          } else {
            addService(data);
          }
          setShowAddModal(false);
          setEditingService(null);
        }}
      />
    </View>
  );
}

interface ServiceFormModalProps {
  visible: boolean;
  service: Service | null;
  onClose: () => void;
  onSave: (data: Omit<Service, 'id' | 'rating' | 'totalBookings'>) => void;
}

function ServiceFormModal({ visible, service, onClose, onSave }: ServiceFormModalProps) {
  const [name, setName] = useState(service?.name || '');
  const [category, setCategory] = useState<Service['category']>(service?.category || SERVICE_CATEGORIES.BILLBOARD);
  const [description, setDescription] = useState(service?.description || '');
  const [details, setDetails] = useState<Record<string, any>>(service?.details || {});

  const handleSave = () => {
    if (!name || !description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    onSave({
      name,
      category,
      description,
      details,
      image: service?.image || 'https://images.unsplash.com/photo-1551677117-8b3e02c944c0?w=400',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{service ? 'Edit Ad Medium' : 'Add Ad Medium'}</Text>
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Medium Name *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g., Times Square Billboard"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.label}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
              <View style={styles.categorySelector}>
                {Object.values(SERVICE_CATEGORIES).map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[styles.categoryOption, category === cat && styles.categoryOptionActive]}
                    onPress={() => setCategory(cat)}
                  >
                    <Text style={[styles.categoryOptionText, category === cat && styles.categoryOptionTextActive]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {SERVICE_FIELDS[category] && (
            <View style={styles.formGroup}>
              <Text style={styles.label}>Service Details</Text>
              <View style={styles.detailsContainer}>
                {SERVICE_FIELDS[category].map((field) => (
                  <View key={field.name} style={styles.detailField}>
                    <Text style={styles.detailLabel}>{field.label}</Text>
                    <TextInput
                      style={styles.input}
                      value={details[field.name]?.toString() || ''}
                      onChangeText={(text) => setDetails((prev) => ({ ...prev, [field.name]: text }))}
                      placeholder={field.placeholder}
                      placeholderTextColor="#9CA3AF"
                      keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                    />
                  </View>
                ))}
              </View>
            </View>
          )}

          <View style={styles.formGroup}>
            <Text style={styles.label}>Description *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the advertising medium..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
            />
          </View>


        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save Medium</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: '#111827',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#111827',
  },
  servicesList: {
    flex: 1,
    marginTop: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  serviceImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F3F4F6',
  },
  serviceInfo: {
    padding: 16,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  serviceHeaderLeft: {
    flex: 1,
    gap: 6,
  },
  serviceName: {
    fontSize: 17,
    fontWeight: '700' as const,
    color: '#111827',
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0E7FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600' as const,
    color: '#6366F1',
    textTransform: 'capitalize' as const,
  },
  serviceActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  serviceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  servicePrice: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#111827',
  },
  serviceDuration: {
    fontSize: 14,
    color: '#6B7280',
  },
  availabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600' as const,
    textTransform: 'capitalize' as const,
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  categorySelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryOptionActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryOptionText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: '#6B7280',
    textTransform: 'capitalize' as const,
  },
  categoryOptionTextActive: {
    color: '#FFFFFF',
  },
  availabilitySelector: {
    flexDirection: 'row',
    gap: 8,
  },
  availabilityOption: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  availabilityOptionActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  availabilityOptionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: '#6B7280',
    textTransform: 'capitalize' as const,
  },
  availabilityOptionTextActive: {
    color: '#FFFFFF',
  },
  modalFooter: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#6B7280',
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#FFFFFF',
  },
  categoryScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  detailsContainer: {
    gap: 16,
  },
  detailField: {
    gap: 8,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500' as const,
    color: '#4B5563',
  },
});
