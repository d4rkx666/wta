import { useAuth } from "@/app/contexts/AuthProvider";
import { useNotification } from "@/app/contexts/NotificationContext";
import { change_status_password } from "@/hooks/changeStatusPassword";
import { logout_user } from "@/hooks/logout";
import { getAuth, signInWithEmailAndPassword, updatePassword, User } from "firebase/auth";
import { FormEvent, useEffect, useState } from "react";

export default function ChangePasswordModal({isFromDashboard}:{isFromDashboard?:boolean}){
   const {showNotification} = useNotification();
   const auth = getAuth();
   const [user, setUser] = useState<User | null>();
   const {email} = useAuth();
   const [isError, setIsError] = useState(true);
   const [isConfirmed, setIsConfirmed] = useState(false);
   const [currentPasswordEnabled, setCurrentPasswordEnabled] = useState(true);

   const [currentPassword, setCurrentPassword] = useState("")
   const [newPassword, setNewPassword] = useState("")
   const [confirmNewPassword, setConfirmNewPassword] = useState("")

   const validatePassword = (password: string)=>{
      setNewPassword(password)
      setConfirmNewPassword("");
      setIsConfirmed(false);
      const regex = /^(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
      if(regex.test(password)){
         setIsError(false)
      }else{
         setIsError(true)
      }
   }

   const validateSamePassword = (samePassword: string)=>{
      setConfirmNewPassword(samePassword)
      if(newPassword === samePassword){
         setIsConfirmed(true);
      }else{
         setIsConfirmed(false)
      }
   }

   useEffect(()=>{
      setUser(auth.currentUser)
      if(auth.currentUser){
         setCurrentPasswordEnabled(false);
      }
   }, [auth])

   const handleChangePassword = async(e:FormEvent)=>{
      e.preventDefault();

      // Validate theres no error
      if(!isError && isConfirmed){

         try{

            if(user){
               let passwordUpdated = false
               await updatePassword(user, newPassword).then(()=>{
                  passwordUpdated = true;
               })

               if(passwordUpdated){
                  const data = await change_status_password();
                  const resp = await data.json();

                  if(resp.success){
                     showNotification("success", "Password changed succesfully. Please login again.")
                     setTimeout(async() => {
                        await logout_user();
                        window.location.reload();
                     }, 3000);
                  }else{
                     showNotification("error", "Something went wrong. Please try again later!")
                  }
               }
            }else if (currentPasswordEnabled){
               await signInWithEmailAndPassword(auth, email, currentPassword).then(resp=>{
                  console.log(resp.user);
               }).catch(() => {
                  showNotification("error", "Your current password is wrong.")
               })
            }
         }catch{
            showNotification("error", "Something went wrong. Please try again later!")
         }
      }else{
         showNotification("error", "Please check that your passwords meet the requirements.")
      }
   }
   return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
         <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6">
               <h2 className="text-xl font-bold text-gray-800 mb-6">Change Password</h2>

               <form onSubmit={(e) => handleChangePassword(e)} method="post">
                  <div className="space-y-4">
                     {currentPasswordEnabled && 
                        <div>
                           <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                              Current Password
                           </label>
                           <div className="relative">
                              <input
                                 id="current-password"
                                 name="current-password"
                                 type="password"
                                 required
                                 value={currentPassword}
                                 onChange={(e) => setCurrentPassword(e.target.value)}
                                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                 placeholder="Enter current password"
                              />
                           </div>
                        </div>
                     }

                     <div>
                        <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                           New Password
                        </label>
                        <div className="relative">
                           <input
                              id="new-password"
                              name="new-password"
                              type="password"
                              required
                              value={newPassword}
                              onChange={(e) => validatePassword(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Enter new password"
                           />
                        </div>
                        <p className={`mt-1 text-xs ${isError ? "text-red-500" : "text-green-500"}`}>
                           Must be at least 8 characters with one number and one special character
                        </p>
                     </div>

                     <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                           Confirm New Password
                        </label>
                        <div className="relative">
                           <input
                              id="confirm-password"
                              name="confirm-password"
                              type="password"
                              required
                              value={confirmNewPassword}
                              onChange={(e) => validateSamePassword(e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                              placeholder="Confirm new password"
                           />
                        </div>
                        <p className={`mt-1 text-xs ${isConfirmed ? "text-green-500" : "text-red-500"}`}>
                           Please, confirm your password
                        </p>
                     </div>
                  </div>

                  <div className="mt-8 flex justify-end space-x-3">
                     {!isFromDashboard &&
                        <button
                           type="button"
                           className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                           Cancel
                        </button>
                     }
                     <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                     >
                        Update Password
                     </button>
                  </div>
               </form>
            </div>
         </div>
      </div>
   )
}