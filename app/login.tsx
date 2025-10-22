import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { TrendingUp, Phone, Lock, User, Building2, Mail, FileText } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Step = 'mobile' | 'otp' | 'registration';

export default function LoginScreen() {
  const router = useRouter();
  const { sendOTP, verifyOTP, completeRegistration } = useAuth();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>('mobile');
  const [isLoading, setIsLoading] = useState(false);

  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');

  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  const [email, setEmail] = useState('');

  const handleSendOTP = async () => {
    if (!mobileNumber || mobileNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendOTP(mobileNumber);
      if (result.success) {
        Alert.alert('Success', result.message + '\nUse OTP: 123456 for testing');
        setStep('otp');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch {
      Alert.alert('Error', 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit OTP');
      return;
    }

    setIsLoading(true);
    try {
      const result = await verifyOTP(mobileNumber, otp);
      if (result.success) {
        if (result.requiresRegistration) {
          setStep('registration');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        Alert.alert('Error', result.message);
      }
    } catch {
      Alert.alert('Error', 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteRegistration = async () => {
    if (!name || !companyName || !gstNumber || !email) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const result = await completeRegistration({
        mobileNumber,
        name,
        companyName,
        gstNumber,
        email,
      });

      if (result.success) {
        Alert.alert('Success', result.message);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', result.message);
      }
    } catch {
      Alert.alert('Error', 'Failed to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#3B82F6', '#8B5CF6']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 40 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <View style={styles.iconWrapper}>
              <TrendingUp size={48} color="#FFFFFF" strokeWidth={2.5} />
            </View>
            <Text style={styles.title}>Ad-Run Vendor</Text>
            <Text style={styles.subtitle}>
              {step === 'mobile' && 'Welcome! Login to manage your campaigns'}
              {step === 'otp' && 'Enter the OTP sent to your mobile'}
              {step === 'registration' && 'Complete your vendor profile'}
            </Text>
          </View>

          <View style={styles.card}>
            {step === 'mobile' && (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Phone size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    placeholderTextColor="#9CA3AF"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                    editable={!isLoading}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleSendOTP}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Sending...' : 'Send OTP'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 'otp' && (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Lock size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter 6-digit OTP"
                    placeholderTextColor="#9CA3AF"
                    value={otp}
                    onChangeText={setOtp}
                    keyboardType="number-pad"
                    maxLength={6}
                    editable={!isLoading}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleVerifyOTP}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.linkButton}
                  onPress={() => setStep('mobile')}
                  disabled={isLoading}
                >
                  <Text style={styles.linkText}>Change Mobile Number</Text>
                </TouchableOpacity>
              </View>
            )}

            {step === 'registration' && (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <User size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Your Name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Building2 size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Company Name"
                    placeholderTextColor="#9CA3AF"
                    value={companyName}
                    onChangeText={setCompanyName}
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <FileText size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="GST Number"
                    placeholderTextColor="#9CA3AF"
                    value={gstNumber}
                    onChangeText={setGstNumber}
                    autoCapitalize="characters"
                    editable={!isLoading}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Mail size={20} color="#6B7280" />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>

                <TouchableOpacity
                  style={[styles.button, isLoading && styles.buttonDisabled]}
                  onPress={handleCompleteRegistration}
                  disabled={isLoading}
                >
                  <Text style={styles.buttonText}>
                    {isLoading ? 'Registering...' : 'Complete Registration'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  button: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700' as const,
  },
  linkButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  linkText: {
    color: '#3B82F6',
    fontSize: 14,
    fontWeight: '600' as const,
  },
});
