import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Lock, User, Building2, Mail, FileText, Check } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Step = 'login' | 'signup' | 'details';

export default function LoginScreen() {
  const router = useRouter();
  const { login, signup, saveAdditionalInfo } = useAuth();
  const insets = useSafeAreaInsets();

  const [step, setStep] = useState<Step>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login & Signup
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Details (used in signup and fallback details step)
  const [mobileNumber, setMobileNumber] = useState('');
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  
  const [isAcceptedTerms, setIsAcceptedTerms] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleLogin = async () => {
    setErrorMessage('');
    if (!email || !password) {
      setErrorMessage('Please enter both email and password');
      return;
    }
    
    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        if (result.requiresDetails) {
          setStep('details');
        } else {
          router.replace('/(tabs)');
        }
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Failed to log in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async () => {
    if (!isAcceptedTerms) {
      setErrorMessage('Please accept the Terms & Conditions and Privacy Policy');
      return;
    }
    setErrorMessage('');
    
    if (!email || !password || !mobileNumber || !name || !companyName) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters');
      return;
    }

    if (mobileNumber.length < 10) {
      setErrorMessage('Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);

    try {
      const result = await signup({
        email,
        password,
        mobileNumber,
        name,
        companyName,
        gstNumber,
      });
      
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Failed to sign up. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDetails = async () => {
    setErrorMessage('');
    if (!mobileNumber || !name || !companyName) {
      setErrorMessage('Please fill in all required fields');
      return;
    }

    if (mobileNumber.length < 10) {
      setErrorMessage('Please enter a valid mobile number');
      return;
    }

    setIsLoading(true);

    try {
      const result = await saveAdditionalInfo({
        mobileNumber,
        name,
        companyName,
        gstNumber,
      });

      if (result.success) {
        router.replace('/(tabs)');
      } else {
        setErrorMessage(result.message);
      }
    } catch {
      setErrorMessage('Failed to save details. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient colors={['#115E59', '#0F766E']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 60 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.title}>
              ad<Text style={{ color: '#2DD4BF' }}>.</Text>agen
            </Text>
            <Text style={styles.subtitle}>The Future of Ad Booking</Text>
          </View>

          <View style={styles.card}>
            {(step === 'login' || step === 'signup') && (
              <View style={styles.form}>
                <View style={{ alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
                    {step === 'login' ? 'Welcome Back' : 'Create Account'}
                  </Text>
                  <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
                    {step === 'login' ? 'Log in to your vendor dashboard' : 'Sign up to start receiving ad requests'}
                  </Text>
                </View>

                {errorMessage ? (
                  <View style={{ backgroundColor: '#FEF2F2', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#FECACA' }}>
                    <Text style={{ color: '#DC2626', fontSize: 14, textAlign: 'center', fontWeight: '500' }}>
                      {errorMessage}
                    </Text>
                  </View>
                ) : null}

                {step === 'signup' && (
                  <>
                    <View style={[styles.inputGroup, { borderColor: '#2DD4BF', borderWidth: 1.5, backgroundColor: '#F0FDFA' }]}>
                      <User size={20} color="#0F766E" />
                      <TextInput
                        style={styles.input}
                        placeholder="Your Full Name"
                        placeholderTextColor="#0F766E"
                        value={name}
                        onChangeText={setName}
                        editable={!isLoading}
                      />
                    </View>

                    <View style={[styles.inputGroup, { borderColor: '#2DD4BF', borderWidth: 1.5, backgroundColor: '#F0FDFA' }]}>
                      <Building2 size={20} color="#0F766E" />
                      <TextInput
                        style={styles.input}
                        placeholder="Business / Company Name"
                        placeholderTextColor="#0F766E"
                        value={companyName}
                        onChangeText={setCompanyName}
                        editable={!isLoading}
                      />
                    </View>
                  </>
                )}

                <View style={[styles.inputGroup, { borderColor: '#2DD4BF', borderWidth: 1.5, backgroundColor: '#F0FDFA' }]}>
                  <Mail size={20} color="#0F766E" />
                  <TextInput
                    style={styles.input}
                    placeholder="Email Address"
                    placeholderTextColor="#0F766E"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                  />
                </View>

                {step === 'signup' && (
                  <View style={[styles.inputGroup, { borderColor: '#2DD4BF', borderWidth: 1.5, backgroundColor: '#F0FDFA' }]}>
                    <Phone size={20} color="#0F766E" />
                    <TextInput
                      style={styles.input}
                      placeholder="Mobile Number"
                      placeholderTextColor="#0F766E"
                      value={mobileNumber}
                      onChangeText={setMobileNumber}
                      keyboardType="phone-pad"
                      maxLength={10}
                      editable={!isLoading}
                    />
                  </View>
                )}

                <View style={[styles.inputGroup, { borderColor: '#2DD4BF', borderWidth: 1.5, backgroundColor: '#F0FDFA' }]}>
                  <Lock size={20} color="#0F766E" />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="#0F766E"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!isLoading}
                  />
                </View>

                {step === 'signup' && (
                  <View style={[styles.inputGroup, { borderColor: '#2DD4BF', borderWidth: 1.5, backgroundColor: '#F0FDFA' }]}>
                    <FileText size={20} color="#0F766E" />
                    <TextInput
                      style={styles.input}
                      placeholder="Valid GST Number (Optional)"
                      placeholderTextColor="#0F766E"
                      value={gstNumber}
                      onChangeText={setGstNumber}
                      autoCapitalize="characters"
                      editable={!isLoading}
                    />
                  </View>
                )}

                {step === 'signup' && (
                  <TouchableOpacity 
                    style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, marginTop: 8, gap: 10, alignSelf: 'flex-start' }}
                    onPress={() => setIsAcceptedTerms(!isAcceptedTerms)}
                    activeOpacity={0.7}
                  >
                    <View style={{ 
                      width: 22, 
                      height: 22, 
                      borderRadius: 6, 
                      borderWidth: 2, 
                      borderColor: isAcceptedTerms ? '#0F766E' : '#D1D5DB',
                      backgroundColor: isAcceptedTerms ? '#0F766E' : 'transparent',
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}>
                      {isAcceptedTerms && <Check size={16} color="white" strokeWidth={3} />}
                    </View>
                    <Text style={{ fontSize: 13, color: '#4B5563', flex: 1 }}>
                      I agree to the <Text style={{ color: '#0F766E', fontWeight: '600' }} onPress={() => router.push('/terms' as any)}>Terms & Conditions</Text> and <Text style={{ color: '#0F766E', fontWeight: '600' }} onPress={() => router.push('/privacy' as any)}>Privacy Policy</Text>
                    </Text>
                  </TouchableOpacity>
                )}

                <View style={{ marginTop: 8 }}>
                  <TouchableOpacity
                    style={[
                      styles.button, 
                      { backgroundColor: '#115E59', shadowColor: '#115E59', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }, 
                      (isLoading || (step === 'signup' && !isAcceptedTerms)) && styles.buttonDisabled
                    ]}
                    onPress={step === 'login' ? handleLogin : handleSignup}
                    disabled={isLoading || (step === 'signup' && !isAcceptedTerms)}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>{step === 'login' ? 'Log In' : 'Sign Up'}</Text>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 12 }}>
                  <Text style={{ color: '#6B7280', fontSize: 13 }}>
                    {step === 'login' ? "Don't have an account? " : "Already have an account? "}
                  </Text>
                  <TouchableOpacity onPress={() => { setStep(step === 'login' ? 'signup' : 'login'); setErrorMessage(''); }} disabled={isLoading}>
                    <Text style={{ color: '#0F766E', fontSize: 13, fontWeight: '600' }}>
                      {step === 'login' ? 'Sign up' : 'Log in'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {step === 'details' && (
              <View style={styles.form}>
                <View style={{ alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
                    Complete Profile
                  </Text>
                  <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
                    Final step to get your vendor account ready!
                  </Text>
                </View>

                {errorMessage ? (
                  <View style={{ backgroundColor: '#FEF2F2', padding: 12, borderRadius: 8, marginBottom: 16, borderWidth: 1, borderColor: '#FECACA' }}>
                    <Text style={{ color: '#DC2626', fontSize: 14, textAlign: 'center', fontWeight: '500' }}>
                      {errorMessage}
                    </Text>
                  </View>
                ) : null}

                <View style={[styles.inputGroup, { borderColor: '#2DD4BF', borderWidth: 1.5, backgroundColor: '#F0FDFA' }]}>
                  <User size={20} color="#0F766E" />
                  <TextInput
                    style={styles.input}
                    placeholder="Your Full Name"
                    placeholderTextColor="#0F766E"
                    value={name}
                    onChangeText={setName}
                    editable={!isLoading}
                  />
                </View>

                <View style={[styles.inputGroup, { borderColor: '#2DD4BF', borderWidth: 1.5, backgroundColor: '#F0FDFA' }]}>
                  <Building2 size={20} color="#0F766E" />
                  <TextInput
                    style={styles.input}
                    placeholder="Business / Company Name"
                    placeholderTextColor="#0F766E"
                    value={companyName}
                    onChangeText={setCompanyName}
                    editable={!isLoading}
                  />
                </View>

                <View style={[styles.inputGroup, { borderColor: '#2DD4BF', borderWidth: 1.5, backgroundColor: '#F0FDFA' }]}>
                  <Phone size={20} color="#0F766E" />
                  <TextInput
                    style={styles.input}
                    placeholder="Mobile Number"
                    placeholderTextColor="#0F766E"
                    value={mobileNumber}
                    onChangeText={setMobileNumber}
                    keyboardType="phone-pad"
                    maxLength={10}
                    editable={!isLoading}
                  />
                </View>

                <View style={[styles.inputGroup, { borderColor: '#2DD4BF', borderWidth: 1.5, backgroundColor: '#F0FDFA' }]}>
                  <FileText size={20} color="#0F766E" />
                  <TextInput
                    style={styles.input}
                    placeholder="Valid GST Number (Optional)"
                    placeholderTextColor="#0F766E"
                    value={gstNumber}
                    onChangeText={setGstNumber}
                    autoCapitalize="characters"
                    editable={!isLoading}
                  />
                </View>

                <View style={{ marginTop: 8, gap: 12 }}>
                  <TouchableOpacity
                    style={[styles.button, { backgroundColor: '#115E59', shadowColor: '#115E59', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 }, isLoading && styles.buttonDisabled]}
                    onPress={handleSaveDetails}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.buttonText}>Finish Registration</Text>
                    )}
                  </TouchableOpacity>

                  {/* We optionally allow them to log out if they are stuck here */}
                  <TouchableOpacity
                    style={[styles.linkButton, { backgroundColor: '#F3F4F6', borderRadius: 12 }]}
                    onPress={() => setStep('login')}
                    disabled={isLoading}
                  >
                    <Text style={[styles.linkText, { color: '#4B5563' }]}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>

          <View style={styles.termsContainer}>
            <Text style={styles.termsText}>
              By logging in or creating an account, you agree with{'\n'}our{' '}
              <Text style={styles.termsLink} onPress={() => router.push('/terms' as any)}>
                Terms & Conditions
              </Text>
              {' '}and{' '}
              <Text style={styles.termsLink} onPress={() => router.push('/privacy' as any)}>
                Privacy Statement
              </Text>
            </Text>
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
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#99F6E4',
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
    color: '#0F766E',
    fontSize: 14,
    fontWeight: '600' as const,
  },
  termsContainer: {
    marginTop: 24,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  termsText: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    lineHeight: 20,
  },
  termsLink: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
    fontWeight: '600' as const,
  },
});
