
import { getSession } from '@/lib/auth';
import { firestoreService } from '@/lib/services/firestore-service';
import { NextResponse } from 'next/server';

export async function POST() {

  try {
    const user = await getSession();
    if(user?.uid){
      await firestoreService.updateDocument("users", user.uid, "firstTime", false)
      return NextResponse.json({ success: true });
    }
    
    return NextResponse.json({ success: false });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}