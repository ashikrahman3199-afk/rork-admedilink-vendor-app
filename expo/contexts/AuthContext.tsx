import createContextHook from '@nkzw/create-context-hook';
import { useState, useCallback, useEffect, useMemo } from 'react';
import { AWS_CONFIG, docClient } from '@/lib/aws-config';
import { PutCommand, UpdateCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminSetUserPasswordCommand, AdminInitiateAuthCommand } from "@aws-sdk/client-cognito-identity-provider";

export interface BankDetails {
  accountName: string;
  accountNumber: string;
  ifscCode: string;
  bankName: string;
}

export interface VendorUser {
  id: string;
  email: string;
  mobileNumber?: string;
  name?: string;
  companyName?: string;
  gstNumber?: string;
  bankDetails?: BankDetails;
}

interface AuthState {
  isAuthenticated: boolean;
  user: VendorUser | null;
  isLoading: boolean;
}

const withTimeout = <T,>(promise: Promise<T>, ms: number, label: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(`${label} timed out!`)), ms))
  ]);
};

export const [AuthProvider, useAuth] = createContextHook(() => {
  const REGION = process.env.EXPO_PUBLIC_AWS_REGION || "ap-south-1";

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
        setAuthState({
          isAuthenticated: true,
          user: JSON.parse(storedUser),
          isLoading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    } catch {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const getCognitoClient = () => {
    return new CognitoIdentityProviderClient({
      region: REGION,
      credentials: {
        accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || ""
      }
    });
  };

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; message: string; requiresDetails?: boolean }> => {
    try {
      const cognitoClient = getCognitoClient();
      const clientId = process.env.EXPO_PUBLIC_AWS_USER_POOL_CLIENT_ID || "6s9b0680g2i4t6njq1rhlvqq4c";

      const command = new AdminInitiateAuthCommand({
        AuthFlow: "ADMIN_NO_SRP_AUTH",
        ClientId: clientId,
        UserPoolId: process.env.EXPO_PUBLIC_AWS_USER_POOL_ID || "ap-south-1_eKjXNF2RB",
        AuthParameters: {
          USERNAME: email,
          PASSWORD: password,
        },
      });

      console.log('Initiating Auth...');
      await withTimeout(cognitoClient.send(command), 15000, 'InitiateAuthCommand');

      // Fetch user from DynamoDB
      const getCommand = new GetCommand({
        TableName: AWS_CONFIG.TABLES.VENDOR,
        Key: { id: email }, // Using email as ID for simplicity
      });

      const response = await withTimeout(docClient.send(getCommand), 15000, 'DynamoDB GetCommand');
      let user: VendorUser | null = null;

      if (response.Item) {
         user = {
            id: response.Item.id,
            email: response.Item.contact || email,
            mobileNumber: response.Item.owner,
            name: response.Item.businessName,
            companyName: response.Item.businessName,
            gstNumber: response.Item.gstNumber,
            bankDetails: response.Item.bankDetails,
         };
      } else {
         // User logged in but no profile in DynamoDB yet
         user = { id: email, email };
      }

      await AsyncStorage.setItem('vendor_user', JSON.stringify(user));
      setAuthState({
        isAuthenticated: true,
        user,
        isLoading: false,
      });

      return {
        success: true,
        message: 'Login successful',
        requiresDetails: !user.mobileNumber, // if no mobile number, they need to fill details
      };

    } catch (error: any) {
      console.error('Error logging in:', error);
      return {
        success: false,
        message: error.message || 'Login failed. Please check your credentials.',
      };
    }
  }, []);

  const signup = useCallback(async (data: { email: string; password: string; mobileNumber: string; name: string; companyName: string; gstNumber: string }): Promise<{ success: boolean; message: string }> => {
    try {
      const cognitoClient = getCognitoClient();
      const formattedPhone = data.mobileNumber.startsWith('+') ? data.mobileNumber : `+91${data.mobileNumber}`;
      
      const createCommand = new AdminCreateUserCommand({
        UserPoolId: process.env.EXPO_PUBLIC_AWS_USER_POOL_ID || "ap-south-1_eKjXNF2RB",
        Username: data.email,
        MessageAction: "SUPPRESS",
        UserAttributes: [
          { Name: "email", Value: data.email },
          { Name: "email_verified", Value: "true" },
          { Name: "phone_number", Value: formattedPhone },
          { Name: "phone_number_verified", Value: "true" },
          { Name: "name", Value: data.name },
        ]
      });

      console.log('Creating User in Cognito...');
      await withTimeout(cognitoClient.send(createCommand), 15000, 'AdminCreateUserCommand');

      const passCommand = new AdminSetUserPasswordCommand({
        UserPoolId: process.env.EXPO_PUBLIC_AWS_USER_POOL_ID || "ap-south-1_eKjXNF2RB",
        Username: data.email,
        Password: data.password,
        Permanent: true
      });

      console.log('Setting Password...');
      await withTimeout(cognitoClient.send(passCommand), 15000, 'AdminSetUserPasswordCommand');

      // Now save to DynamoDB directly since we collected all the details
      const vendorItem = {
        id: data.email, // Using email as ID
        businessName: data.companyName,
        contact: data.email,
        location: "HQ",
        owner: data.mobileNumber,
        gstNumber: data.gstNumber,
        status: "PENDING",
        __typename: 'Vendor',
        _version: 1,
        _lastChangedAt: Date.now(),
        createdAt: new Date().toISOString(),
      };

      const putCommand = new PutCommand({
        TableName: AWS_CONFIG.TABLES.VENDOR,
        Item: vendorItem,
      });

      console.log('Saving additional info to DynamoDB...');
      await withTimeout(docClient.send(putCommand), 15000, 'DynamoDB PutCommand');

      const newUser: VendorUser = {
        id: data.email,
        email: data.email,
        mobileNumber: data.mobileNumber,
        name: data.name,
        companyName: data.companyName,
        gstNumber: data.gstNumber,
      };

      await AsyncStorage.setItem('vendor_user', JSON.stringify(newUser));
      setAuthState({
        isAuthenticated: true,
        user: newUser,
        isLoading: false,
      });

      return {
        success: true,
        message: 'Signup successful',
      };
    } catch (error: any) {
      console.error('Error signing up:', error);
      if (error.name === 'UsernameExistsException') {
        return { success: false, message: 'An account with this email already exists.' };
      }
      return {
        success: false,
        message: error.message || 'Signup failed. Please try again.',
      };
    }
  }, []);

  const saveAdditionalInfo = useCallback(async (details: { mobileNumber: string; name: string; companyName: string; gstNumber: string }) => {
    if (!authState.user) return { success: false, message: 'Not logged in' };

    try {
      const vendorItem = {
        id: authState.user.id,
        businessName: details.companyName,
        contact: authState.user.email,
        location: "HQ",
        owner: details.mobileNumber,
        gstNumber: details.gstNumber,
        status: "PENDING",
        __typename: 'Vendor',
        _version: 1,
        _lastChangedAt: Date.now(),
        createdAt: new Date().toISOString(),
      };

      const command = new PutCommand({
        TableName: AWS_CONFIG.TABLES.VENDOR,
        Item: vendorItem,
      });

      console.log('Saving additional info to DynamoDB...');
      await withTimeout(docClient.send(command), 15000, 'DynamoDB PutCommand');

      const updatedUser = { ...authState.user, ...details };
      await AsyncStorage.setItem('vendor_user', JSON.stringify(updatedUser));
      
      setAuthState({
        isAuthenticated: true,
        user: updatedUser,
        isLoading: false,
      });

      return {
        success: true,
        message: 'Profile updated successfully',
      };
    } catch (error: any) {
      console.error('Failed to save info:', error);
      return {
        success: false,
        message: error.message || 'Failed to save additional information.',
      };
    }
  }, [authState.user]);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('vendor_user');
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error signing out:', error);
    }
  }, []);

  const updateBankDetails = useCallback(async (details: BankDetails) => {
    if (!authState.user) return { success: false, message: 'Not logged in' };
    
    try {
      const command = new UpdateCommand({
        TableName: AWS_CONFIG.TABLES.VENDOR,
        Key: { id: authState.user.id },
        UpdateExpression: "SET bankDetails = :b",
        ExpressionAttributeValues: {
          ":b": details
        }
      });
      
      console.log('Sending UpdateCommand to DynamoDB for Bank Details...');
      await withTimeout(docClient.send(command), 15000, 'DynamoDB UpdateCommand');
      
      const updatedUser = { ...authState.user, bankDetails: details };
      await AsyncStorage.setItem('vendor_user', JSON.stringify(updatedUser));
      setAuthState(prev => ({ ...prev, user: updatedUser }));
      
      return { success: true, message: 'Bank details updated successfully' };
    } catch (error: any) {
      console.error('Error updating bank details', error);
      return { success: false, message: error.message || 'Failed to update' };
    }
  }, [authState.user]);

  return useMemo(() => ({
    ...authState,
    login,
    signup,
    saveAdditionalInfo,
    logout,
    updateBankDetails
  }), [authState, login, signup, saveAdditionalInfo, logout, updateBankDetails]);
});
