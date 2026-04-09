import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, doc, query, orderBy, getDoc } from 'firebase/firestore'

export async function GET() {
  try {
    const q = query(collection(db, 'projects'), orderBy('created_at', 'desc'));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return Response.json(data)
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
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

    // Insert into Firestore
    const docRef = await addDoc(collection(db, 'projects'), {
      title: body.title.trim(),
      description: body.description || null,
      image_url: body.image_url || null,
      status: validStatus,
      url: body.url || null,
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
      team_members: body.team_members || null,
      created_at: new Date().toISOString()
    });

    const docSnap = await getDoc(docRef);
    const data = { id: docSnap.id, ...docSnap.data() };



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

    // Update in Firestore
    const projectRef = doc(db, 'projects', id);
    await updateDoc(projectRef, {
      title: body.title,
      description: body.description || null,
      image_url: body.image_url || null,
      status: validStatus,
      url: body.url || null,
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
      team_members: body.team_members || null,
      updated_at: new Date().toISOString()
    });

    const docSnap = await getDoc(projectRef);
    const data = { id: docSnap.id, ...docSnap.data() };



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
