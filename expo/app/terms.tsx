import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';

export default function TermsScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Terms & Conditions' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Terms and Conditions</Text>
        <Text style={styles.paragraph}>
          Welcome to ad.agen. By accessing or using our platform, you agree to be bound by these
          Terms and Conditions. Please read them carefully before using our services.
        </Text>
        <Text style={styles.heading}>1. Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          These Terms constitute a legally binding agreement between you and ad.agen. If you do not
          agree to these Terms, you may not use our platform.
        </Text>
        <Text style={styles.heading}>2. Vendor Responsibilities</Text>
        <Text style={styles.paragraph}>
          As a vendor, you are responsible for maintaining the accuracy of your profile and service
          listings. You agree to provide truthful and complete information regarding your business
          and services.
        </Text>
        <Text style={styles.heading}>3. Service Bookings</Text>
        <Text style={styles.paragraph}>
          ad.agen acts as a facilitator between vendors and customers. We do not guarantee a minimum
          number of bookings or revenue. Vendors are responsible for fulfilling accepted bookings
          professionally and promptly.
        </Text>
        <Text style={styles.heading}>4. Platform Usage</Text>
        <Text style={styles.paragraph}>
          You agree not to misuse our platform or help anyone else do so. This includes any attempts
          to access our systems unlawfully or disrupt our services.
        </Text>
        <Text style={styles.heading}>5. Modifications</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these Terms at any time. We will notify vendors of any
          material changes, and continued use of the platform constitutes acceptance of the modified Terms.
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
