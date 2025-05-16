import { getSession } from "@/lib/auth";
import LoginPage from "../login/page";
import { NotificationProvider } from "../contexts/NotificationContext";

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {

   const session = await getSession();
   if(!session){
      return <LoginPage/>
   }

   return (
      <main className="flex-grow">
         <NotificationProvider>
            {children}
         </NotificationProvider>
      </main>
   );
}
