import { createClient } from '@/lib/supabase-auth/server';

interface PublicVisual {
  id: string;
  title: string;
  data: string; // SVG code as string
  type: string;
  createdAt: string;
  isPublic: boolean;
}

export async function GET(req: Request) {
  try {
    const supabaseClient = createClient();
    
    const {
      data: { session },
      error: sessionError,
    } = await supabaseClient.auth.getSession();

    if (sessionError || !session) {
      console.error('Session error: ', sessionError);
      return new Response(
        JSON.stringify({
          error: 'Unauthorized - Please log in to access public diagrams',
        }),
        {
          status: 401,
          headers: {
            'content-type': 'application/json',
          },
        },
      );
    }

    // Query 20 diagrams where private is false
    const { data: diagrams, error } = await supabaseClient
      .from('diagrams')
      .select('*')
      .eq('private', false)
      .order('created_at', { ascending: false })
    //   .limit(20);

    if (error) {
      throw error;
    }

    // Filter and format the data to only include items with SVG code
    const formattedDiagrams: PublicVisual[] = diagrams
      .filter(diagram => {
        // Check if data exists and looks like SVG code
        return diagram.data && 
               typeof diagram.data === 'string' && 
               diagram.data.trim().startsWith('<svg');
      })
      .map((diagram) => ({
        id: diagram.id,
        title: diagram.title,
        data: diagram.data,
        type: diagram.type,
        createdAt: diagram.created_at,
        isPublic: !diagram.private,
      }));

    return new Response(
      JSON.stringify({
        diagrams: formattedDiagrams,
      }),
      {
        status: 200,
        headers: {
          'content-type': 'application/json',
        },
      },
    );
  } catch (error) {
    console.error('Error fetching public diagrams:', error);
    return new Response(
      JSON.stringify({
        error: 'An error occurred while fetching public diagrams',
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