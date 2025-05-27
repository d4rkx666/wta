"use client";
import {call} from "@/lib/services/api"
export const notify_payment = async (formData: FormData)=>{
   const response = await call("/notify-payment", formData, false)
   return response;
}