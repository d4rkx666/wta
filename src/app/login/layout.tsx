import { getSession } from "@/lib/auth";
import CustomerDashboard from "../dashboard/page";

export default async function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {

   const session = await getSession();
   if(session){
      return <CustomerDashboard/>
   }

   return (
      <main className="flex-grow">
         {children}
      </main>
   );
}
