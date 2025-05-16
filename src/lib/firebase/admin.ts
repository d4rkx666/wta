import { initializeApp, getApps, getApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string);

if (!getApps().length) {
   initializeApp({
      credential: cert(serviceAccount),
   });
}

const adminApp = getApp();
const adminDb = getFirestore(adminApp);

//eslint-disable-next-line
export async function verifyIdToken(token: string):Promise<any | null>{
   try{
      const auth = getAuth(adminApp);
      const decoded = await auth.verifyIdToken(token);

      if(decoded.email && decoded.name){

         
         const data={
            uid: decoded.uid,
            email: decoded.email,
            displayName: decoded.name,
         }

         const userDoc = await getFirestore().collection('users').doc(decoded.uid).get();

         if (userDoc.exists) {
            const userFirestoreData = userDoc.data();

            // You can merge Firestore data if required
            return {
               ...data,
               ...userFirestoreData,  // Add more fields from Firestore
            };
         }

         return data;
      }else{
         return null;
      }
   }catch{
      return null;
   }
}

export { adminDb };