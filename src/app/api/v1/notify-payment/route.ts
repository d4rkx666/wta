
import { firestoreService } from '@/lib/services/firestore-service';
import { Payment } from '@/types/payment';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const {payment, email}:{payment:Payment, email:string} = await req.json();

  try {

    // Inserting individually because we want to ONLY UPDATE, not insert in case payment.id is changed to another uniexistent one
    await firestoreService.updateDocument("payments",payment.id,"e_transfer_email",email);
    await firestoreService.updateDocument("payments",payment.id,"payment_method","E-Transfer");
    await firestoreService.updateDocument("payments",payment.id,"amount_paid",payment.amount_payment);
    await firestoreService.updateDocument("payments",payment.id,"paidDate", new Date(Date.now()));
    await firestoreService.updateDocument("payments",payment.id,"status", "Marked");

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}