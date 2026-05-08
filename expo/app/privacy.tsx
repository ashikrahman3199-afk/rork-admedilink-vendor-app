import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function PrivacyScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Privacy Statement' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Privacy Statement</Text>
        <Text style={styles.paragraph}>
          At ad.agen, we take your privacy seriously. This Privacy Statement explains how we collect,
          use, disclose, and safeguard your information when you visit our platform.
        </Text>
        <Text style={styles.heading}>1. Information We Collect</Text>
        <Text style={styles.paragraph}>
          We may collect information about you in a variety of ways. This includes personal data you
          provide to us, such as your name, business name, GST number, email address, and mobile number.
        </Text>
        <Text style={styles.heading}>2. How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          Having accurate information about you permits us to provide you with a smooth, efficient,
          and customized experience. We use the information we collect to manage your account,
          process transactions, and improve our services.
        </Text>
        <Text style={styles.heading}>3. Disclosure of Your Information</Text>
        <Text style={styles.paragraph}>
          We may share information we have collected about you in certain situations. Your information
          may be disclosed to facilitate vendor bookings and interactions on our platform, or if we
          are required to do so by law.
        </Text>
        <Text style={styles.heading}>4. Security of Your Information</Text>
        <Text style={styles.paragraph}>
          We use administrative, technical, and physical security measures to help protect your
          personal information. While we have taken reasonable steps to secure the personal
          information you provide to us, please be aware that despite our efforts, no security
          measures are perfect or impenetrable.
        </Text>
        <Text style={styles.heading}>5. Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have questions or comments about this Privacy Statement, please contact us at
          support@ad.agen.com.
        </Text>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: '#4B5563',
    marginBottom: 16,
  },
});
