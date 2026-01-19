import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { VendorProvider } from "@/contexts/VendorContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { trpc, trpcClient } from "../lib/trpc";

// const trpc = {
//   Provider: ({ children }: any) => children,
// } as any;

// const trpcClient = {};

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(tabs)';
    const inPublicGroup = segments[0] === 'splash' || segments[0] === 'login';

    if (!isAuthenticated && !inPublicGroup) {
      // Redirect to splash if not authenticated and trying to access protected route
      router.replace('/splash');
    } else if (isAuthenticated && inPublicGroup) {
      // Redirect to tabs if authenticated and on public route
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="splash" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="service/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <VendorProvider>
            <GestureHandlerRootView>
              <RootLayoutNav />
            </GestureHandlerRootView>
          </VendorProvider>
        </AuthProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
