import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    if (!id) return Response.json({ error: 'Project ID is required' }, { status: 400 });

    const docRef = doc(db, 'projects', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return Response.json({ error: 'Project not found' }, { status: 404 });
    
    return Response.json({ id: docSnap.id, ...docSnap.data() });
  } catch (error: any) {
     return Response.json({ error: error.message }, { status: 500 });
  }
}