"use client";
import {call} from "@/lib/services/api"
import { Payment } from "@/types/payment";
export const notify_payment = async (payment: Payment| undefined, email: string)=>{
   const response = await call("/notify-payment", {payment, email})
   return response;
}