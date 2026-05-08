import { CognitoIdentityProviderClient, DescribeUserPoolClientCommand, UpdateUserPoolClientCommand } from "@aws-sdk/client-cognito-identity-provider";
import * as dotenv from 'dotenv';
dotenv.config();

const client = new CognitoIdentityProviderClient({
  region: process.env.EXPO_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.EXPO_PUBLIC_AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.EXPO_PUBLIC_AWS_SECRET_ACCESS_KEY!,
  }
});

async function main() {
  const describeCommand = new DescribeUserPoolClientCommand({
    UserPoolId: process.env.EXPO_PUBLIC_AWS_USER_POOL_ID!,
    ClientId: process.env.EXPO_PUBLIC_AWS_USER_POOL_CLIENT_ID!,
  });

  const { UserPoolClient } = await client.send(describeCommand);
  if (!UserPoolClient) throw new Error("Client not found");

  const explicitAuthFlows = UserPoolClient.ExplicitAuthFlows || [];
  
  if (!explicitAuthFlows.includes("ALLOW_USER_PASSWORD_AUTH")) {
    explicitAuthFlows.push("ALLOW_USER_PASSWORD_AUTH");
    console.log("Adding ALLOW_USER_PASSWORD_AUTH...");
  }

  if (!explicitAuthFlows.includes("ALLOW_ADMIN_USER_PASSWORD_AUTH")) {
    explicitAuthFlows.push("ALLOW_ADMIN_USER_PASSWORD_AUTH");
    console.log("Adding ALLOW_ADMIN_USER_PASSWORD_AUTH...");
  }

  const updateCommand = new UpdateUserPoolClientCommand({
    UserPoolId: process.env.EXPO_PUBLIC_AWS_USER_POOL_ID!,
    ClientId: process.env.EXPO_PUBLIC_AWS_USER_POOL_CLIENT_ID!,
    ClientName: UserPoolClient.ClientName,
    ExplicitAuthFlows: explicitAuthFlows,
    SupportedIdentityProviders: UserPoolClient.SupportedIdentityProviders,
    CallbackURLs: UserPoolClient.CallbackURLs,
    LogoutURLs: UserPoolClient.LogoutURLs,
    DefaultRedirectURI: UserPoolClient.DefaultRedirectURI,
    AllowedOAuthFlows: UserPoolClient.AllowedOAuthFlows,
    AllowedOAuthScopes: UserPoolClient.AllowedOAuthScopes,
    AllowedOAuthFlowsUserPoolClient: UserPoolClient.AllowedOAuthFlowsUserPoolClient,
    AnalyticsConfiguration: UserPoolClient.AnalyticsConfiguration,
    PreventUserExistenceErrors: UserPoolClient.PreventUserExistenceErrors,
    EnableTokenRevocation: UserPoolClient.EnableTokenRevocation,
    TokenValidityUnits: UserPoolClient.TokenValidityUnits,
    IdTokenValidity: UserPoolClient.IdTokenValidity,
    AccessTokenValidity: UserPoolClient.AccessTokenValidity,
    RefreshTokenValidity: UserPoolClient.RefreshTokenValidity,
    AuthSessionValidity: UserPoolClient.AuthSessionValidity,
    ReadAttributes: UserPoolClient.ReadAttributes,
    WriteAttributes: UserPoolClient.WriteAttributes,
  });

  await client.send(updateCommand);
  console.log("Successfully updated User Pool Client.");
}

main().catch(console.error);
