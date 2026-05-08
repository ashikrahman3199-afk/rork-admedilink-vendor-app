import 'react-native-get-random-values';
import 'react-native-url-polyfill/auto';
import 'fast-text-encoding';
import structuredClone from '@ungap/structured-clone';

if (typeof global.structuredClone === 'undefined') {
  global.structuredClone = structuredClone as any;
}
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { S3Client } from "@aws-sdk/client-s3";
import { SNSClient } from "@aws-sdk/client-sns";
import { Amplify } from 'aws-amplify';
import { cognitoUserPoolsTokenProvider } from 'aws-amplify/auth/cognito';
import { defaultStorage } from 'aws-amplify/utils';

cognitoUserPoolsTokenProvider.setKeyValueStorage(defaultStorage);

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: process.env.EXPO_PUBLIC_AWS_USER_POOL_ID || "ap-south-1_eKjXNF2RB",
            userPoolClientId: process.env.EXPO_PUBLIC_AWS_USER_POOL_CLIENT_ID || "57m1tv51rvmaq23935t8bpfcv1",
        }
    }
});

// Load credentials from environment variables securely
const CREDENTIALS = {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY || "",
};

const REGION = process.env.EXPO_PUBLIC_AWS_REGION || "ap-south-1";

// Initialize DynamoDB Client
const dbClient = new DynamoDBClient({
    region: REGION,
    credentials: CREDENTIALS,
});

export const docClient = DynamoDBDocumentClient.from(dbClient);

// Initialize S3 Client
export const s3Client = new S3Client({
    region: REGION,
    credentials: CREDENTIALS,
});

export const snsClient = new SNSClient({
    region: REGION,
    credentials: CREDENTIALS,
});

const TABLE_SUFFIX = process.env.EXPO_PUBLIC_AWS_TABLE_SUFFIX || "uxp5cmbsczg7ld4jekrlpzyzgu";

export const AWS_CONFIG = {
    TABLES: {
        BOOKING: `Booking-${TABLE_SUFFIX}-NONE`,
        SERVICE: `Service-${TABLE_SUFFIX}-NONE`,
        VENDOR: `Vendor-${TABLE_SUFFIX}-NONE`,
    },
    BUCKET: "amplify-expoapp-ashik-san-amplifydataamplifycodege-uyiq7trackfq",
};
