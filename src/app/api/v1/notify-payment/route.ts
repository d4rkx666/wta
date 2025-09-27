
import { firestoreService } from '@/lib/services/firestore-service';
import { Payment } from '@/types/payment';
import { NextResponse } from 'next/server';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { getSession } from '@/lib/auth';
import { Contract } from '@/types/contract';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  const formData = await req.formData();

  // Check auth
  const user = await getSession();
  if(!user){
    return NextResponse.json({ success: false, message: "User not authenticated" });
  }

  const payment = JSON.parse(formData.getAll('payment')[0] as string) as Payment;
  const proofLength = formData.getAll('proofLength')[0] as string;

  try {

    const currentContract:Partial<Contract | null> = await firestoreService.getDocument("contracts",payment.contract_id) as Contract;

    // Validate the contract belongs to the tenant
    if(currentContract && currentContract.tenant_id === user.uid){

      // Inserting individually because we want to ONLY UPDATE, not insert in case payment.id is changed to another uniexistent one
      const paymentToUpdate:Partial<Payment> = {
        id: payment.id,
        e_transfer_email: payment.e_transfer_email ? payment.e_transfer_email : "",
        payment_method: "E-Transfer",
        amount_paid: payment.amount_payment,
        status: "Marked"
      };

      await firestoreService.setDocument("payments", payment.id, paymentToUpdate);
      await firestoreService.updateDocument("payments",payment.id,"paidDate", new Date(Date.now()));

      const filesToInsert = [];
      if(!isNaN(Number(proofLength))){
        // delete previous images if exist
        const path = `${currentContract.tenant_id}/${payment.contract_id}/PAYMENT_PROOF/${payment.id}`;
        if(payment.proof_img_id){
          await deleteMultiCloudinaryFiles(path)
        }

        for (let i = 0; i < Number(proofLength); i++) {
          const file = formData.getAll(`file_${i}`)[0] as File;

          if(file.name){
            const proof_image_id = await insertFile(file, path);
            if(proof_image_id){
              filesToInsert.push(proof_image_id);
            }
          }
        }
      }
      
      if(filesToInsert.length > 0){
        console.log("inserting", filesToInsert)
        await firestoreService.updateDocument("payments",payment.id,"proof_img_id", filesToInsert);
      }
      return NextResponse.json({ success: true });
    }else{
      return NextResponse.json({ success: false, details: "Authentication failed."});
    }
    
  } catch (error) {
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}

async function insertFile(file:File, folder_idContract: string):Promise<string | null>{
try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const stream_setup: UploadApiOptions = {
      folder: folder_idContract,
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

async function deleteMultiCloudinaryFiles(main_folder:string):Promise<string>{
  console.log("deleting files")

  const result = await cloudinary.api.delete_resources_by_prefix(`${main_folder}/`, {
    type: 'private',
    resource_type: 'image'
  });

  console.log("trying to delete folder: ", main_folder)
  const resultFolder = await cloudinary.api.delete_folder(main_folder);

  console.log("delete result", result)
  console.log("delete folder", resultFolder)

  return result;
}