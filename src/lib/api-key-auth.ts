import { createClient } from '@/lib/supabase-auth/server';
import { hashApiKey, isValidApiKeyFormat } from '@/lib/api-keys';
import { NextRequest } from 'next/server';
import type { ApiKeyPermission } from '@/types/api-keys';

export interface ApiKeyAuthResult {
  authenticated: boolean;
  userId?: string;
  keyId?: string;
  permissions?: ApiKeyPermission[];
  error?: string;
}

/**
 * Validates an API key from the Authorization header
 * @param request - The NextRequest object
 * @returns ApiKeyAuthResult with authentication status and user info
 */
export async function validateApiKey(request: NextRequest): Promise<ApiKeyAuthResult> {
  try {
    // Check for Authorization header
    const authHeader = request.headers.get('Authorization');

    if (!authHeader) {
      return {
        authenticated: false,
        error: 'Missing Authorization header',
      };
    }

    // Check for Bearer token format
    if (!authHeader.startsWith('Bearer ')) {
      return {
        authenticated: false,
        error: 'Invalid Authorization header format. Expected: Bearer <api_key>',
      };
    }

    // Extract the API key
    const apiKey = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Validate API key format
    if (!isValidApiKeyFormat(apiKey)) {
      return {
        authenticated: false,
        error: 'Invalid API key format',
      };
    }

    // Hash the API key for database lookup
    const keyHash = hashApiKey(apiKey);

    // Query the database using the Supabase function
    const supabaseClient = createClient();
    const { data, error } = await supabaseClient.rpc('is_api_key_valid', {
      key_hash_input: keyHash,
    });

    if (error) {
      console.error('Error validating API key:', error);
      return {
        authenticated: false,
        error: 'Failed to validate API key',
      };
    }

    // Check if a valid key was found
    if (!data || data.length === 0) {
      return {
        authenticated: false,
        error: 'Invalid or expired API key',
      };
    }

    const keyData = data[0];

    // Update last_used_at timestamp (fire and forget)
    supabaseClient
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', keyData.key_id)
      .then(() => {
        // Success - no action needed
      });

    return {
      authenticated: true,
      userId: keyData.user_id,
      keyId: keyData.key_id,
      permissions: keyData.permissions,
    };
  } catch (error) {
    console.error('Unexpected error in validateApiKey:', error);
    return {
      authenticated: false,
      error: 'Internal server error',
    };
  }
}

/**
 * Checks if an API key has a specific permission
 * @param authResult - The result from validateApiKey
 * @param requiredPermission - The permission to check for
 * @returns True if the key has the permission
 */
export function hasPermission(
  authResult: ApiKeyAuthResult,
  requiredPermission: ApiKeyPermission
): boolean {
  if (!authResult.authenticated || !authResult.permissions) {
    return false;
  }
  return authResult.permissions.includes(requiredPermission);
}

/**
 * Middleware wrapper for API routes that support API key authentication
 * Falls back to session authentication if no API key is provided
 * @param request - The NextRequest object
 * @returns Authentication result with userId
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<{ authenticated: boolean; userId?: string; error?: string; isApiKey: boolean }> {
  // First, try API key authentication
  const authHeader = request.headers.get('Authorization');

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const apiKeyResult = await validateApiKey(request);
    return {
      authenticated: apiKeyResult.authenticated,
      userId: apiKeyResult.userId,
      error: apiKeyResult.error,
      isApiKey: true,
    };
  }

  // Fall back to session authentication
  const supabaseClient = createClient();
  const { data: userData, error: authError } = await supabaseClient.auth.getUser();

  if (authError || !userData?.user) {
    return {
      authenticated: false,
      error: 'Not authenticated',
      isApiKey: false,
    };
  }

  return {
    authenticated: true,
    userId: userData.user.id,
    isApiKey: false,
  };
}
