import { supabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return Response.json({ error: error.message }, { status: 500 })
  return Response.json(data)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate request
    if (!body.title || body.title.trim() === '') {
      return new Response(
        JSON.stringify({ success: false, error: 'Title is required' }), 
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Ensure status is valid
    const validStatuses = ['Completed', 'In Progress', 'Active Maintenance'];
    const validStatus = validStatuses.includes(body.status) 
      ? body.status
      : 'Active Maintenance'; // Default if invalid or empty

    // Insert into Supabase
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          title: body.title.trim(),
          description: body.description || null,
          image_url: body.image_url || null,
          status: validStatus,
          url: body.url || null,
          // New fields
          tagline: body.tagline || null,
          overview: body.overview || null,
          key_features: body.key_features || null,
          problem: body.problem || null,
          solution: body.solution || null,
          tech_stack: body.tech_stack || null,
          architecture: body.architecture || null,
          role: body.role || null,
          timeline: body.timeline || null,
          outcomes: body.outcomes || null,
          challenges: body.challenges || null,
          demo_url: body.demo_url || null,
          github_url: body.github_url || null,
          case_study_url: body.case_study_url || null,
          hero_image: body.hero_image || null,
          screenshots: body.screenshots || null,
          demo_video: body.demo_video || null,
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return new Response(
        JSON.stringify({ success: false, error: error.message }), 
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data }), 
      { 
        status: 201, 
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (err: any) {
    console.error('Server error:', err)
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Internal server error' }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id } = body
    
    if (!id) {
      return new Response(
        JSON.stringify({ success: false, error: 'Project ID is required' }), 
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    // Ensure status is valid
    const validStatuses = ['Completed', 'In Progress', 'Active Maintenance'];
    const validStatus = validStatuses.includes(body.status) 
      ? body.status
      : 'Active Maintenance'; // Default if invalid or empty

    // Update in Supabase
    const { data, error } = await supabase
      .from('projects')
      .update({
        title: body.title,
        description: body.description || null,
        image_url: body.image_url || null,
        status: validStatus,
        url: body.url || null,
        // New fields
        tagline: body.tagline || null,
        overview: body.overview || null,
        key_features: body.key_features || null,
        problem: body.problem || null,
        solution: body.solution || null,
        tech_stack: body.tech_stack || null,
        architecture: body.architecture || null,
        role: body.role || null,
        timeline: body.timeline || null,
        outcomes: body.outcomes || null,
        challenges: body.challenges || null,
        demo_url: body.demo_url || null,
        github_url: body.github_url || null,
        case_study_url: body.case_study_url || null,
        hero_image: body.hero_image || null,
        screenshots: body.screenshots || null,
        demo_video: body.demo_video || null,
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return new Response(
        JSON.stringify({ success: false, error: error.message }), 
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data }), 
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (err: any) {
    console.error('Server error:', err)
    return new Response(
      JSON.stringify({ success: false, error: err.message || 'Internal server error' }), 
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}
