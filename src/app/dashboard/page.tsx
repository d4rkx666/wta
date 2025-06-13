"use client"
import { useMemo, useState } from 'react';
import Head from 'next/head';
import { useLivePayments } from '@/hooks/useLivePayments';
import { useAuth } from '../contexts/AuthProvider';
import Loader from '../components/common/Loader';
import { Payment } from '@/types/payment';
import ConfirmationModal from './components/ConfirmationModal';
import { notify_payment } from '@/hooks/notifyPayment';
import ChangePasswordModal from '../components/common/ChangePasswordModal';
import { useLiveBills } from '@/hooks/useLiveBills';
import { useNotification } from '../contexts/NotificationContext';

export default function CustomerDashboard() {
  const {name, email, firstTime} = useAuth();
  const {showNotification} = useNotification();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('payments');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('Pending');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('maintenance');
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [currentPayment, setCurrentPayment] = useState<Payment>();
  const [paymentProof, setPaymentProof] = useState<File | null>(null);

  const {data: payments, loading: loadingPayments} = useLivePayments();
  const ids = payments.filter(p=>p.bill_id).map(p=>p.bill_id);
  const {data: bills, loading: loadingBills} = useLiveBills({ids: ids.length > 0 ? ids : []});

  const markAsPaid = (id: string) => {
    setShowConfirmationModal(true);
    const currentP = payments.find(payment => payment.id === id);
    setCurrentPayment(currentP);
  };

  const sendRequest = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Your ${messageType} request has been submitted successfully!`);
    setMessage('');
  };

  const filteredPayments = useMemo(()=>{
    if(paymentStatusFilter === "Paid"){
      return payments.filter(payment => payment.status === "Paid").sort((a,b) =>(a.dueDate && b.dueDate) && b.dueDate.toDate().getTime() - a.dueDate.toDate().getTime()); 
    }else if(paymentStatusFilter === "Pending"){
      return payments.filter(payment => (payment.status === "Pending" || payment.status === "Marked") && payment.is_current).sort((a,b) =>(a.dueDate && b.dueDate) && a.dueDate.toDate().getTime() - b.dueDate.toDate().getTime()); 
    }else if(paymentStatusFilter === "Future"){
      return payments.filter(payment => payment.dueDate && payment.dueDate.toDate().getTime() > new Date(new Date().setMonth(new Date().getMonth() + 1)).getTime()).sort((a,b) =>(a.dueDate && b.dueDate) && a.dueDate.toDate().getTime() - b.dueDate.toDate().getTime()); 
    }
    return payments.sort((a,b) => b.status.localeCompare(a.status)).sort((a,b) =>(a.dueDate && b.dueDate) && b.dueDate.toDate().getTime() - a.dueDate.toDate().getTime());
  },[payments, paymentStatusFilter])

  const balance = useMemo(()=>{
    const total = filteredPayments.reduce((number, payment) => number + payment.amount_payment, 0);
    const balance = filteredPayments.reduce((number, payment) => number - (payment.status === "Paid" ? payment.amount_payment : 0),total);
    return balance;
  },[filteredPayments]);

  const lastUpdate = useMemo(()=>{
    const last = payments.reduce((latest, payment) => {return payment.paidDate ? payment.paidDate.toDate() > latest ? payment.paidDate.toDate() : latest : latest}, new Date(0));
    return last;
  },[payments]);

  const handleConfirm = async(email:string)=>{
    try{
      setLoading(true);
      if(!currentPayment || !paymentProof){
        showNotification("error", "Something went wrong. Please check the form before submitting.")
        setLoading(false);
        return;
      }

      const formData = new FormData();
      currentPayment.e_transfer_email = email;

      formData.append("payment", JSON.stringify(currentPayment));
      formData.append("proof", paymentProof)
      
      const data = await notify_payment(formData);
      const resp = await data.json();

      if(resp.success){
        showNotification("success", "Notification sent. Your landlord is verifying your payment. Come back later to check your payment's status!")
        setShowConfirmationModal(false);
      }else{
        showNotification("error", "Something went wrong. Please try again. If the problem persists, please re-login.")
      }
      
    }catch{

    }finally{
      setLoading(false)
    }
  }

  if(loadingPayments || loadingBills){
    return <Loader/>
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Customer Dashboard</title>
        <meta name="description" content="Your personal customer portal" />
      </Head>

      <div className="bg-indigo-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Welcome Back!</h1>
            <div className="flex items-center space-x-4">
              <span className="hidden md:inline">{name || email}</span>
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                <span className="text-lg font-semibold">{name && name.split(" ").slice(0,2).map(word => word[0]).join('')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Balance Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Your Current Balance</h2>
            <p className="text-3xl font-bold text-indigo-600">${balance.toFixed(2)}</p>
            <p className="text-sm text-gray-500 mt-2">Last updated: {lastUpdate.toLocaleDateString()}</p>
            <p className="text-xs text-yellow-600 mt-5">Avoid <span className='font-bold'>penalties</span> paying your rent and other payments <span className='font-bold'>on time</span>.</p>
            <p className="text-xs text-yellow-600/60">Penalty formula: <span className='font-bold'>Penalty * Day late</span> (e.g. 25 cad * 2 days late = <span className='font-bold'>50 cad of penalty</span>)</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'payments' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveTab('request')}
            className={`px-4 py-2 font-medium text-sm focus:outline-none ${activeTab === 'request' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            Send Request
          </button>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {activeTab === 'payments' ? (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Payment History</h2>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPaymentStatusFilter('all')}
                    className={`px-3 py-1 text-xs rounded-full ${paymentStatusFilter === 'all' ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setPaymentStatusFilter('Pending')}
                    className={`px-3 py-1 text-xs rounded-full ${paymentStatusFilter === 'Pending' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Pending (Current)
                  </button>
                  <button
                    onClick={() => setPaymentStatusFilter('Future')}
                    className={`px-3 py-1 text-xs rounded-full ${paymentStatusFilter === 'Future' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Future
                  </button>
                  <button
                    onClick={() => setPaymentStatusFilter('Paid')}
                    className={`px-3 py-1 text-xs rounded-full ${paymentStatusFilter === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                  >
                    Paid
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => {
                    let bill = undefined;
                    if (payment.bill_id){
                      bill = bills.find(bill=>bill.id === payment.bill_id);
                    }
                    return(
                      <tr key={payment.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {payment.type.replace(/^(\w)/, (match) => match.toUpperCase())}
                          {(payment.type === "bills" && bill) &&
                            <span className='ml-2'>({bill.type})</span>
                          }
                          {payment.type === "penalty" && 
                            <>
                              <br/><span className='text-red-500 text-xs'>{payment.comments}</span>
                            </>
                          }
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          ${payment.amount_payment.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.dueDate && payment.dueDate.toDate().toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${payment.status === "Paid" ? 'bg-green-100 text-green-800' : payment.status === "Marked" ? 'bg-blue-100 text-blue-800': 'bg-amber-100 text-amber-800'}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {payment.status === 'Pending' ? (
                            <button
                              onClick={() => markAsPaid(payment.id)}
                              className="text-indigo-600 hover:text-indigo-900 font-medium"
                            >
                              Mark as Paid
                            </button>
                          ) : (
                            <span className="text-gray-400">Paid on {payment.paidDate && payment.paidDate.toDate().toLocaleDateString()}</span>
                          )}
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Send a Request</h2>
              <form onSubmit={sendRequest}>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="requestType">
                    Request Type
                  </label>
                  <select
                    id="requestType"
                    value={messageType}
                    onChange={(e) => setMessageType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="question">General Question</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Describe your request in detail..."
                    required
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Send Request
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {showConfirmationModal &&
        <ConfirmationModal
        email={email}
        payment={currentPayment?.amount_payment && currentPayment?.amount_payment || 0}
        setPaymentProof={setPaymentProof}
        paymentProof={paymentProof}
        handleConfirm={handleConfirm}
        loading={loading}
        setShowConfirmationModal={setShowConfirmationModal}/>
      }

      {firstTime && 
        <ChangePasswordModal isFromDashboard={true}/>
      }
    </div>
  );
}