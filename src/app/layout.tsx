import type { Metadata } from "next";
import "./globals.css";
import Header from "./Header";
import Footer from "./Footer";
import { getSession } from "@/lib/auth";
import { AuthProvider } from "./contexts/AuthProvider";

export const metadata: Metadata = {
  title: "Welcome Travel Accommodation",
  description: "The warmest rooms in Metro Vancouver",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const session = await getSession();
  let isAuth = false;
  let name = "";
  let email = "";
  let fisrtTime = false;
  if(session){
    isAuth = true;
    name = session.displayName;
    email = session.email;
    fisrtTime = session.firstTime
  }


  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col">
          <AuthProvider isAuth={isAuth} name={name} email={email} firstTime={fisrtTime}>
            <Header />

            <main className="flex-grow">
              {children}
            </main>

            <Footer />
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
