
import { Timestamp } from "firebase/firestore";
import { PaymentStatus } from "./paymentStatus";

type PaymentType = "rent" | "deposit" | "bills" | "penalty" | "fee";
type PaymentMethod = "E-Transfer" | "Credit/Debit Card" | "Cash" | "Other";

export type Payment = {
   id: string;
   contract_id: string;
   bill_id?: string;
   proof_img_id?: string[];
   e_transfer_email?: string;
   type: PaymentType;
   payment_method: PaymentMethod;
   amount_payment: number;
   amount_paid: number;
   amount_discount?: number;
   is_current: boolean;
   dueDate: Timestamp;
   paidDate: Timestamp;
   createdAt: Timestamp;
   paymentVerifiedDate: Timestamp | Date;
   comments?: string;
   status: PaymentStatus;
};

export const PaymentDefaultVal:Payment = {
   id: "", 
   contract_id: "",
   type: "rent",
   payment_method: "Cash",
   amount_payment: 0,
   amount_paid: 0,
   is_current: true,
   dueDate: Timestamp.now(),
   paidDate: Timestamp.now(),
   createdAt: Timestamp.now(),
   paymentVerifiedDate: new Date(Date.now()),
   status: "Pending",
}