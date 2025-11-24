import { createClient } from '@/lib/supabase-auth/server';
import { generateApiKey, hashApiKey, createKeyPreview } from '@/lib/api-keys';
import { NextRequest } from 'next/server';
import type { CreateApiKeyRequest, CreateApiKeyResponse, ApiKeyListItem } from '@/types/api-keys';

/**
 * GET /api/api-keys
 * List all API keys for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const supabaseClient = createClient();
    const { data: userData, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Fetch all API keys for the user
    const { data: apiKeys, error: fetchError } = await supabaseClient
      .from('api_keys')
      .select('id, key_preview, name, permissions, created_at, last_used_at, expires_at, is_active')
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false });

    if (fetchError) {
      console.error('Error fetching API keys:', fetchError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch API keys' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const apiKeyList: ApiKeyListItem[] = apiKeys || [];

    return new Response(
      JSON.stringify({ data: apiKeyList }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error in GET /api/api-keys:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

/**
 * POST /api/api-keys
 * Create a new API key for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const supabaseClient = createClient();
    const { data: userData, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !userData?.user) {
      return new Response(
        JSON.stringify({ error: 'Not authenticated' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const body = (await request.json()) as CreateApiKeyRequest;
    const { name, permissions, expires_at } = body;

    // Validate input
    if (!name || name.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'API key name is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    if (!permissions || permissions.length === 0) {
      return new Response(
        JSON.stringify({ error: 'At least one permission is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate permissions
    const validPermissions = ['generate_diagrams', 'read_diagrams'];
    const invalidPermissions = permissions.filter(p => !validPermissions.includes(p));
    if (invalidPermissions.length > 0) {
      return new Response(
        JSON.stringify({ error: `Invalid permissions: ${invalidPermissions.join(', ')}` }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate expiration date if provided
    if (expires_at) {
      const expirationDate = new Date(expires_at);
      if (isNaN(expirationDate.getTime())) {
        return new Response(
          JSON.stringify({ error: 'Invalid expiration date format' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      if (expirationDate <= new Date()) {
        return new Response(
          JSON.stringify({ error: 'Expiration date must be in the future' }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
    }

    // Generate API key
    const apiKey = generateApiKey();
    const keyHash = hashApiKey(apiKey);
    const keyPreview = createKeyPreview(apiKey);

    // Insert into database
    const { data: insertedKey, error: insertError } = await supabaseClient
      .from('api_keys')
      .insert({
        user_id: userData.user.id,
        key_hash: keyHash,
        key_preview: keyPreview,
        name: name.trim(),
        permissions: permissions,
        expires_at: expires_at || null,
        is_active: true,
      })
      .select('id, key_preview, name, permissions, created_at, expires_at')
      .single();

    if (insertError) {
      console.error('Error creating API key:', insertError);
      return new Response(
        JSON.stringify({ error: 'Failed to create API key' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Return the full key (only time it will be shown)
    const response: CreateApiKeyResponse = {
      id: insertedKey.id,
      key: apiKey, // Full key, only shown once
      key_preview: insertedKey.key_preview,
      name: insertedKey.name,
      permissions: insertedKey.permissions,
      created_at: insertedKey.created_at,
      expires_at: insertedKey.expires_at,
    };

    return new Response(
      JSON.stringify({ data: response }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error in POST /api/api-keys:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
