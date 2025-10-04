import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Criar cliente Supabase
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Chamar função para publicar posts agendados
    const { data, error } = await supabaseClient.rpc('publish_scheduled_posts')

    if (error) {
      console.error('Error publishing scheduled posts:', error)
      throw error
    }

    const publishedCount = data?.[0]?.published_count || 0
    const publishedIds = data?.[0]?.published_ids || []

    console.log(`Successfully published ${publishedCount} posts:`, publishedIds)

    return new Response(
      JSON.stringify({ 
        success: true,
        published_count: publishedCount,
        published_ids: publishedIds,
        message: `${publishedCount} post(s) published successfully`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Fatal error in publish-scheduled-posts:', error)
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})
