"use client"

import { createContext, ReactNode, useContext } from "react"

interface AuthContextType {
  isAuth: boolean;
  name: string;
  email: string;
  firstTime: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children, isAuth, name, email, firstTime}:{children: ReactNode, isAuth:boolean, name: string, email: string, firstTime: boolean}) =>{
   return (
      <AuthContext.Provider value={{isAuth, name, email, firstTime}}>
         {children}
      </AuthContext.Provider>
   )
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};