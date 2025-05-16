"use client";
import {call} from "@/lib/services/api"
export const change_status_password = async ()=>{
   const response = await call("/change-status-password", "")
   return response;
}