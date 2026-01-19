import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Modal, Alert, Image as RNImage } from 'react-native';
import { Calendar, DateData } from 'react-native-calendars';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useVendor } from '@/contexts/VendorContext';
import { Service, ServiceOption } from '@/types/vendor';
import { SERVICE_OPTIONS } from '@/constants/serviceFields';
import { Image } from 'expo-image';
import { Plus, ArrowLeft, Trash2, X, Upload, Pencil } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

export default function ServiceDetailsScreen() {
    const { id } = useLocalSearchParams();
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { services, updateService } = useVendor();

    const [service, setService] = useState<Service | undefined>(undefined);
    const [showAddOptionModal, setShowAddOptionModal] = useState(false);
    const [editingOption, setEditingOption] = useState<ServiceOption | undefined>(undefined);

    useEffect(() => {
        const found = services.find(s => s.id === id);
        setService(found);
    }, [id, services]);

    if (!service) {
        return (
            <View style={styles.container}>
                <Text>Service not found</Text>
            </View>
        );
    }

    const handleSaveOption = (option: ServiceOption) => {
        if (editingOption) {
            const updatedOptions = (service.options || []).map(o => o.id === editingOption.id ? { ...option, id: editingOption.id } : o);
            updateService(service.id, { options: updatedOptions });
        } else {
            const updatedOptions = [...(service.options || []), option];
            updateService(service.id, { options: updatedOptions });
        }
        setShowAddOptionModal(false);
        setEditingOption(undefined);
    };

    const handleEditOption = (option: ServiceOption) => {
        setEditingOption(option);
        setShowAddOptionModal(true);
    };

    const handleDeleteOption = (optionId: string) => {
        Alert.alert(
            'Delete Service Option',
            'Are you sure you want to delete this option?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        const updatedOptions = (service.options || []).filter(o => o.id !== optionId);
                        updateService(service.id, { options: updatedOptions });
                    }
                }
            ]
        );
    };

    return (
        <View style={styles.container}>
            <View style={[styles.header, { paddingTop: insets.top }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#111827" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>{service.name}</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.serviceMeta}>
                    <Image source={{ uri: service.image }} style={styles.coverImage} contentFit="cover" />
                    <View style={styles.metaInfo}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryText}>{service.category}</Text>
                        </View>
                        <Text style={styles.description}>{service.description}</Text>
                    </View>
                </View>

                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Service Options</Text>
                    <TouchableOpacity
                        style={styles.addButton}
                        onPress={() => setShowAddOptionModal(true)}
                    >
                        <Plus size={16} color="#FFFFFF" strokeWidth={2.5} />
                        <Text style={styles.addButtonText}>Add Service</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.optionsList}>
                    {service.options?.map((option) => (
                        <View key={option.id} style={styles.optionCard}>
                            <View style={styles.optionHeader}>
                                <Text style={styles.optionName}>{option.name}</Text>
                                <View style={{ flexDirection: 'row', gap: 12 }}>
                                    <TouchableOpacity onPress={() => handleEditOption(option)}>
                                        <Pencil size={18} color="#3B82F6" />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteOption(option.id)}>
                                        <Trash2 size={18} color="#EF4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.optionDetails}>
                                <Text style={styles.optionPrice}>₹{option.price.toLocaleString('en-IN')}</Text>
                                <Text style={styles.optionDuration}>• {option.duration} days</Text>
                                <View style={[
                                    styles.availabilityBadge,
                                    { backgroundColor: option.availability === 'available' ? '#D1FAE5' : option.availability === 'limited' ? '#FEF3C7' : '#FEE2E2' }
                                ]}>
                                    <Text style={[
                                        styles.availabilityText,
                                        { color: option.availability === 'available' ? '#065F46' : option.availability === 'limited' ? '#92400E' : '#991B1B' }
                                    ]}>
                                        {option.availability}
                                    </Text>
                                </View>
                            </View>
                            {option.photos && option.photos.length > 0 && (
                                <ScrollView horizontal style={styles.optionPhotos} showsHorizontalScrollIndicator={false}>
                                    {option.photos.map((photo, index) => (
                                        <Image key={index} source={{ uri: photo }} style={styles.optionPhoto} />
                                    ))}
                                </ScrollView>
                            )}
                        </View>
                    ))}
                    {(!service.options || service.options.length === 0) && (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>No service options added yet.</Text>
                        </View>
                    )}
                </View>
                <View style={{ height: 40 }} />
            </ScrollView>

            <AddOptionModal
                visible={showAddOptionModal}
                serviceCategory={service.category}
                initialData={editingOption}
                onClose={() => {
                    setShowAddOptionModal(false);
                    setEditingOption(undefined);
                }}
                onSave={handleSaveOption}
            />
        </View>
    );
}

function AddOptionModal({ visible, serviceCategory, onClose, onSave, initialData }: any) {
    const [selectedType, setSelectedType] = useState('');
    const [price, setPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [availability, setAvailability] = useState<ServiceOption['availability']>('available');
    const [blockedDates, setBlockedDates] = useState<Record<string, any>>({});
    const [photos, setPhotos] = useState<string[]>([]);

    useEffect(() => {
        if (initialData) {
            setSelectedType(initialData.name);
            setPrice(initialData.price.toString());
            setDuration(initialData.duration.toString());
            setAvailability(initialData.availability);
            setBlockedDates(initialData.blockedDates || {});
            setPhotos(initialData.photos || []);
        } else {
            setSelectedType('');
            setPrice('');
            setDuration('');
            setAvailability('available');
            setBlockedDates({});
            setPhotos([]);
        }
    }, [initialData, visible]);

    const availableTypes = SERVICE_OPTIONS[serviceCategory] || [];

    const handlePickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.5,
        });

        if (!result.canceled) {
            setPhotos([...photos, result.assets[0].uri]);
        }
    };

    const handleSave = () => {
        if (!selectedType || !price || !duration) {
            Alert.alert('Error', 'Please fill all required fields');
            return;
        }

        onSave({
            id: Math.random().toString(36).substr(2, 9),
            name: selectedType,
            price: parseFloat(price),
            duration: parseInt(duration),
            availability,
            blockedDates,
            photos,
        });

        // Reset form
        setSelectedType('');
        setPrice('');
        setDuration('');
        setAvailability('available');
        setBlockedDates({});
        setPhotos([]);
    };

    return (
        <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
            <View style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{initialData ? 'Edit Service Option' : 'Add Service Option'}</Text>
                    <TouchableOpacity onPress={onClose}>
                        <X size={24} color="#6B7280" />
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.modalContent}>
                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Service Type *</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.typeScroll}>
                            <View style={styles.typeSelector}>
                                {availableTypes.map((type) => (
                                    <TouchableOpacity
                                        key={type}
                                        style={[styles.typeOption, selectedType === type && styles.typeOptionActive]}
                                        onPress={() => setSelectedType(type)}
                                    >
                                        <Text style={[styles.typeOptionText, selectedType === type && styles.typeOptionTextActive]}>
                                            {type}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </ScrollView>
                    </View>

                    <View style={styles.formRow}>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Price (₹) *</Text>
                            <TextInput
                                style={styles.input}
                                value={price}
                                onChangeText={setPrice}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>
                        <View style={[styles.formGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Duration (days) *</Text>
                            <TextInput
                                style={styles.input}
                                value={duration}
                                onChangeText={setDuration}
                                keyboardType="numeric"
                                placeholder="0"
                            />
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Availability *</Text>
                        <View style={styles.availabilitySelector}>
                            {(['available', 'limited', 'unavailable'] as const).map((avail) => (
                                <TouchableOpacity
                                    key={avail}
                                    style={[styles.availabilityOption, availability === avail && styles.availabilityOptionActive]}
                                    onPress={() => setAvailability(avail)}
                                >
                                    <Text style={[styles.availabilityOptionText, availability === avail && styles.availabilityOptionTextActive]}>
                                        {avail}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Availability Calendar</Text>
                        <Text style={styles.helperText}>Tap dates to mark as unavailable (Red)</Text>
                        <Calendar
                            onDayPress={(day: DateData) => {
                                const dateString = day.dateString;
                                const current = blockedDates[dateString];
                                if (current) {
                                    const newDates = { ...blockedDates };
                                    delete newDates[dateString];
                                    setBlockedDates(newDates);
                                } else {
                                    setBlockedDates({
                                        ...blockedDates,
                                        [dateString]: { selected: true, selectedColor: '#EF4444' }
                                    });
                                }
                            }}
                            markedDates={blockedDates}
                            theme={{
                                todayTextColor: '#3B82F6',
                                arrowColor: '#3B82F6',
                                textDayFontWeight: '600',
                                textMonthFontWeight: '700',
                                textDayHeaderFontWeight: '600',
                            }}
                        />
                    </View>

                    <View style={styles.formGroup}>
                        <Text style={styles.label}>Photos</Text>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoList}>
                            <TouchableOpacity style={styles.addPhotoButton} onPress={handlePickImage}>
                                <Upload size={24} color="#6B7280" />
                                <Text style={styles.addPhotoText}>Upload</Text>
                            </TouchableOpacity>
                            {photos.map((uri, idx) => (
                                <View key={idx} style={styles.photoPreviewWrapper}>
                                    <Image source={{ uri }} style={styles.photoPreview} />
                                    <TouchableOpacity
                                        style={styles.removePhoto}
                                        onPress={() => setPhotos(photos.filter((_, i) => i !== idx))}
                                    >
                                        <X size={12} color="#FFF" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                    <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>{initialData ? 'Save Changes' : 'Add Service'}</Text>
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
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    content: {
        flex: 1,
    },
    serviceMeta: {
        backgroundColor: '#FFF',
        marginBottom: 16,
        paddingBottom: 20,
    },
    coverImage: {
        width: '100%',
        height: 200,
    },
    metaInfo: {
        padding: 20,
    },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#E0E7FF',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
        marginBottom: 12,
    },
    categoryText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6366F1',
    },
    description: {
        fontSize: 15,
        color: '#4B5563',
        lineHeight: 24,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#3B82F6',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        gap: 6,
    },
    addButtonText: {
        color: '#FFF',
        fontSize: 13,
        fontWeight: '600',
    },
    optionsList: {
        paddingHorizontal: 20,
        gap: 16,
    },
    optionCard: {
        backgroundColor: '#FFF',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    optionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    optionName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
    },
    optionDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    optionPrice: {
        fontSize: 18,
        fontWeight: '700',
        color: '#111827',
    },
    optionDuration: {
        fontSize: 14,
        color: '#6B7280',
    },
    availabilityBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    availabilityText: {
        fontSize: 12,
        fontWeight: '600',
        textTransform: 'capitalize',
    },
    optionPhotos: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 8,
    },
    optionPhoto: {
        width: 60,
        height: 60,
        borderRadius: 8,
        marginRight: 8,
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
    },
    emptyStateText: {
        color: '#9CA3AF',
        fontSize: 15,
    },

    // Modal Styles
    modalContainer: {
        flex: 1,
        backgroundColor: '#FFF',
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
        fontSize: 18,
        fontWeight: '700',
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
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    helperText: {
        fontSize: 12,
        color: '#6B7280',
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 15,
    },
    formRow: {
        flexDirection: 'row',
        gap: 12,
    },
    typeScroll: {
        marginHorizontal: -20,
        paddingHorizontal: 20,
    },
    typeSelector: {
        flexDirection: 'row',
        gap: 8,
    },
    typeOption: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    typeOptionActive: {
        backgroundColor: '#3B82F6',
        borderColor: '#3B82F6',
    },
    typeOptionText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#6B7280',
    },
    typeOptionTextActive: {
        color: '#FFF',
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
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    availabilityOptionActive: {
        backgroundColor: '#10B981',
        borderColor: '#10B981',
    },
    availabilityOptionText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6B7280',
        textTransform: 'capitalize',
    },
    availabilityOptionTextActive: {
        color: '#FFF',
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
        fontWeight: '600',
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
        fontWeight: '600',
        color: '#FFF',
    },
    photoList: {
        flexDirection: 'row',
    },
    addPhotoButton: {
        width: 80,
        height: 80,
        borderRadius: 12,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderStyle: 'dashed',
    },
    addPhotoText: {
        fontSize: 12,
        color: '#6B7280',
        marginTop: 4,
    },
    photoPreviewWrapper: {
        position: 'relative',
        marginRight: 12,
    },
    photoPreview: {
        width: 80,
        height: 80,
        borderRadius: 12,
    },
    removePhoto: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderRadius: 10,
        padding: 4,
    },
});
