import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface VendorUser {
  id: string;
  mobileNumber: string;
  name: string;
  companyName: string;
  gstNumber: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: VendorUser | null;
  isLoading: boolean;
}

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    loadStoredAuth();
  }, []);

  const loadStoredAuth = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('vendor_user');
      if (storedUser) {
        const user = JSON.parse(storedUser) as VendorUser;
        setAuthState({
          isAuthenticated: true,
          user,
          isLoading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('Failed to load auth:', error);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const sendOTP = useCallback(async (mobileNumber: string): Promise<{ success: boolean; message: string }> => {
    console.log('Sending OTP to:', mobileNumber);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      success: true,
      message: 'OTP sent successfully to ' + mobileNumber,
    };
  }, []);

  const verifyOTP = useCallback(async (
    mobileNumber: string,
    otp: string
  ): Promise<{ success: boolean; message: string; requiresRegistration?: boolean }> => {
    console.log('Verifying OTP:', otp, 'for mobile:', mobileNumber);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otp === '123456') {
      const existingUserData = await AsyncStorage.getItem('vendor_user');
      const existingUser = existingUserData ? JSON.parse(existingUserData) as VendorUser : null;
      
      if (existingUser && existingUser.mobileNumber === mobileNumber) {
        setAuthState({
          isAuthenticated: true,
          user: existingUser,
          isLoading: false,
        });
        return {
          success: true,
          message: 'Login successful',
          requiresRegistration: false,
        };
      }
      
      return {
        success: true,
        message: 'OTP verified. Please complete registration.',
        requiresRegistration: true,
      };
    }
    
    return {
      success: false,
      message: 'Invalid OTP. Please try again.',
    };
  }, []);

  const completeRegistration = useCallback(async (userData: Omit<VendorUser, 'id'>) => {
    console.log('Completing registration:', userData);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newUser: VendorUser = {
      ...userData,
      id: Date.now().toString(),
    };
    
    try {
      await AsyncStorage.setItem('vendor_user', JSON.stringify(newUser));
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        isLoading: false,
      });
      
      return {
        success: true,
        message: 'Registration completed successfully',
      };
    } catch (error) {
      console.error('Failed to save user:', error);
      return {
        success: false,
        message: 'Failed to complete registration. Please try again.',
      };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('vendor_user');
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }, []);

  return useMemo(() => ({
    ...authState,
    sendOTP,
    verifyOTP,
    completeRegistration,
    logout,
  }), [authState, sendOTP, verifyOTP, completeRegistration, logout]);
});
