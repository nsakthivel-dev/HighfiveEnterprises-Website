import { supabase } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  
  if (!id) {
    return Response.json({ error: 'Project ID is required' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return Response.json({ error: error.message }, { status: 500 })
  if (!data) return Response.json({ error: 'Project not found' }, { status: 404 })
  
  return Response.json(data)
}