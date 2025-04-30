import { createClient } from '@/lib/supabase-auth/server';

export async function POST(req: Request) {
  try {
    const supabaseClient = createClient();
    
    // Verify user session
    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession();

    if (sessionError || !session) {
      console.error('Session error: ', sessionError);
      return new Response(
        JSON.stringify({
          error: 'Unauthorized - Please log in to like diagrams',
        }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json',
          },
        },
      );
    }

    // Parse request body
    const { diagramId, userID } = await req.json();

    if (!diagramId || !userID) {
      return new Response(
        JSON.stringify({
          error: 'Missing required fields: diagramId and userID are required',
        }),
        {
          status: 400,
          headers: {
            'content-type': 'application/json',
          },
        },
      );
    }

    // Check if the like already exists
    const { data: existingLike, error: likeError } = await supabaseClient
      .from('diagram_likes')
      .select('*')
      .eq('diagram_id', diagramId)
      .eq('user_id', userID)
      .maybeSingle();

    if (likeError) {
      throw likeError;
    }

    let action = '';
    
    if (existingLike) {
      // Unlike - remove the existing like
      const { error: deleteError } = await supabaseClient
        .from('diagram_likes')
        .delete()
        .eq('id', existingLike.id);

      if (deleteError) {
        throw deleteError;
      }
      action = 'unliked';
    } else {
      // Like - add new like
      const { error: insertError } = await supabaseClient
        .from('diagram_likes')
        .insert({
          diagram_id: diagramId,
          user_id: userID,
          created_at: new Date().toISOString(),
        });

      if (insertError) {
        throw insertError;
      }
      action = 'liked';
    }

    // Get updated like count for the diagram
    const { count: likeCount, error: countError } = await supabaseClient
      .from('diagram_likes')
      .select('*', { count: 'exact', head: true })
      .eq('diagram_id', diagramId);

    if (countError) {
      throw countError;
    }

    return new Response(
      JSON.stringify({
        success: true,
        action,
        likeCount,
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error processing like:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while processing your like',
        details: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          'content-type': 'application/json',
        },
      },
    );
  }
}