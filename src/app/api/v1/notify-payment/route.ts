
import { firestoreService } from '@/lib/services/firestore-service';
import { Payment } from '@/types/payment';
import { NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const formData = await req.formData();

  const payment = JSON.parse(formData.getAll('payment')[0] as string) as Payment;
  const proofFile = formData.getAll('proof')[0] as File

  try {
    // Inserting individually because we want to ONLY UPDATE, not insert in case payment.id is changed to another uniexistent one
    await firestoreService.updateDocument("payments",payment.id,"e_transfer_email", payment.e_transfer_email ? payment.e_transfer_email : "" );
    await firestoreService.updateDocument("payments",payment.id,"payment_method","E-Transfer");
    await firestoreService.updateDocument("payments",payment.id,"amount_paid",payment.amount_payment);
    await firestoreService.updateDocument("payments",payment.id,"paidDate", new Date(Date.now()));
    await firestoreService.updateDocument("payments",payment.id,"status", "Marked");

    const proof_image_id = await insertFile(proofFile, payment.tenant_id);
    if(proof_image_id){
      await firestoreService.updateDocument("payments",payment.id,"proof_img_id", proof_image_id);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

async function insertFile(file:File, folder_idTenant: string):Promise<string | null>{
try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const stream_setup: UploadApiOptions = {
      folder: folder_idTenant,
      resource_type: 'image',
      type: 'private',
    }

    // eslint-disable-next-line
    const resp:any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream( stream_setup,
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(buffer);
    });

    if(!resp.public_id){
      return null;
    }
    console.log('Created successful:', resp);
    return resp.public_id;
  } catch (error) {
    console.log(error);
    return null;
  }
}