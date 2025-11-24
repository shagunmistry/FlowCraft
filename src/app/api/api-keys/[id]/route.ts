import { createClient } from '@/lib/supabase-auth/server';
import { NextRequest } from 'next/server';

/**
 * DELETE /api/api-keys/[id]
 * Delete (revoke) an API key
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'API key ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify the API key belongs to the user before deleting
    const { data: existingKey, error: fetchError } = await supabaseClient
      .from('api_keys')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .single();

    if (fetchError || !existingKey) {
      return new Response(
        JSON.stringify({ error: 'API key not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Delete the API key
    const { error: deleteError } = await supabaseClient
      .from('api_keys')
      .delete()
      .eq('id', id)
      .eq('user_id', userData.user.id);

    if (deleteError) {
      console.error('Error deleting API key:', deleteError);
      return new Response(
        JSON.stringify({ error: 'Failed to delete API key' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: 'API key deleted successfully' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error in DELETE /api/api-keys/[id]:', error);
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
 * PATCH /api/api-keys/[id]
 * Update an API key (e.g., toggle active status, update name)
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { id } = params;
    const body = await request.json();
    const { name, is_active } = body;

    if (!id) {
      return new Response(
        JSON.stringify({ error: 'API key ID is required' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify the API key belongs to the user
    const { data: existingKey, error: fetchError } = await supabaseClient
      .from('api_keys')
      .select('id, user_id')
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .single();

    if (fetchError || !existingKey) {
      return new Response(
        JSON.stringify({ error: 'API key not found' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Build update object
    const updates: { name?: string; is_active?: boolean } = {};
    if (name !== undefined && name.trim().length > 0) {
      updates.name = name.trim();
    }
    if (is_active !== undefined) {
      updates.is_active = is_active;
    }

    if (Object.keys(updates).length === 0) {
      return new Response(
        JSON.stringify({ error: 'No valid fields to update' }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Update the API key
    const { data: updatedKey, error: updateError } = await supabaseClient
      .from('api_keys')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userData.user.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating API key:', updateError);
      return new Response(
        JSON.stringify({ error: 'Failed to update API key' }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({ data: updatedKey }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error in PATCH /api/api-keys/[id]:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
