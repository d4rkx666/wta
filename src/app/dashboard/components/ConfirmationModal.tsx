import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useState } from "react";

function ConfirmationModal({ email, payment, setPaymentProof, paymentProof, loading, handleConfirm, setShowConfirmationModal }: { email: string, payment: number, setPaymentProof: Dispatch<SetStateAction<File | null>>, paymentProof: File | null, loading: boolean, handleConfirm: (email: string) => void, setShowConfirmationModal: Dispatch<SetStateAction<boolean>> }) {
   const [selectedEmail, setSelectedEmail] = useState(email);
   const [isDefaultSelected, setIsDefaultSeleted] = useState(true);
   const [error, setError] = useState("");

   function validateEmail(email: string) {
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return regex.test(email);
   }

   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 ">
         <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
               <h2 className="text-xl font-bold text-gray-800 mb-4">Confirm Payment</h2>

               <div className="mb-6 space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                     <h3 className="font-semibold text-blue-800 mb-2">Please complete your e-transfer</h3>
                     <p className="text-sm text-blue-700">
                        Send your payment of <span className="font-bold">${payment && payment.toFixed(2)}</span> to:
                     </p>
                     <p className="text-lg font-bold text-blue-800 mt-1">{process.env.NEXT_PUBLIC_ETRANSFER_EMAIL_COMPANY}</p>
                  </div>

                  <label className="text-xs text-red-500">
                     {error}
                  </label>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2">
                        Which email did you use to send the e-transfer?
                     </label>
                     <div className="space-y-2">
                        <div className="flex items-center">
                           <input
                              id={email}
                              name="payment-email"
                              type="radio"
                              checked={isDefaultSelected}
                              onChange={() => {
                                 setIsDefaultSeleted(true);
                                 setSelectedEmail(email);
                                 setError("");
                              }}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                           />
                           <label htmlFor={email} className="ml-3 block text-sm font-medium text-gray-700">
                              {email}
                           </label>
                        </div>

                        <div className="flex items-center">
                           <input
                              id="another"
                              name="payment-email"
                              type="radio"
                              checked={!isDefaultSelected}
                              onChange={() => {
                                 setIsDefaultSeleted(false);
                                 setSelectedEmail("");
                              }}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                           />
                           <label htmlFor="another" className="ml-3 block text-sm font-medium text-gray-700">
                              Use this instead:
                           </label>
                           <input
                              id="email"
                              type="email"
                              placeholder="example@gmail.com"
                              disabled={isDefaultSelected}
                              onChange={(e) => setSelectedEmail(e.target.value)}
                              className="h-6 w-60 ml-2 pl-1 border border-gray-400 rounded-full focus:ring-2 focus:ring-blue-300 focus:outline-none disabled:border-gray-200"
                           />
                        </div>
                     </div>
                  </div>


                  <div>
                     <label htmlFor="paymentProof" className="block text-sm font-medium text-gray-700 mb-1">
                        Please attach the payment proof (screenshot)
                     </label>
                     <div className="flex items-center">
                        <label className="flex flex-col items-center justify-center w-full p-2 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                           <div className="flex flex-col items-center justify-center pt-2 pb-3">
                              <DocumentTextIcon className="h-8 w-8 text-gray-400" />
                              <p className="text-xs text-gray-500 mt-2">
                                 {paymentProof ? paymentProof.name : "Click to upload payment screenshot"}
                              </p>
                           </div>
                           <input
                              id="paymentProof"
                              name="paymentProof"
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => setPaymentProof(e.target.files?.[0] || null)}
                           />
                        </label>
                     </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-500">
                     <p>Once you&apos;ve sent the e-transfer, click &quot;Confirm Payment&quot; below to notify the landlord about your payment.</p>
                  </div>
               </div>

               <div className="flex justify-end space-x-3">
                  <button
                     onClick={() => {
                        setPaymentProof(null);
                        setShowConfirmationModal(false)
                     }}
                     className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                     Cancel
                  </button>
                  <button
                     disabled={loading}
                     onClick={() => {
                        if (selectedEmail != "") {
                           if (validateEmail(selectedEmail)) {
                              if(paymentProof){
                                 handleConfirm(selectedEmail)
                              }else{
                                 setError("Please attach the payment proof.")
                              }
                           } else {
                              setError("Please provide a valid email.");
                           }
                        } else {
                           setError("Please provide an email.");
                        }
                     }}
                     className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
                  >
                     {loading ? "Notifying your landlord..." : "Confirm Payment"}

                  </button>
               </div>
            </div>
         </div>
      </div>
   );
}

export default ConfirmationModal;