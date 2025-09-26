'use client'

import Carousel from '@/app/components/common/Carousel';
import { useRouter } from 'next/navigation';
import ShowRoomCards from './components/common/ShowRoomCards';

export default function HomePage() {

   // Navigation
   const router = useRouter();

   return (
      <div>

         {/* Hero Section */}
         <section className="relative bg-blue-600 text-white">
            <Carousel/>
         </section>

         {/* Featured Listings */}
         <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
               <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Rooms</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">Browse our selection of premium rooms in Vancouver&apos;s best neighborhoods.</p>
               </div>

               
               <ShowRoomCards showNotAvailable={false} frontPage={true}/>

               <div className="text-center mt-12">
                  <button onClick={() => router.push(`/listing`)} className="bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-medium transition">
                     View All Listings
                  </button>
               </div>
            </div>
         </section>

         {/* Why Choose Us */}
         <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
               <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Vancouver Rooms</h2>
                  <p className="text-gray-600 max-w-2xl mx-auto">We make finding and renting rooms in Vancouver simple and stress-free.</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center p-6 rounded-lg bg-gray-50">
                     <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
                     <p className="text-gray-600">Every room is personally verified by our team to ensure quality and accuracy.</p>
                  </div>

                  <div className="text-center p-6 rounded-lg bg-gray-50">
                     <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-semibold mb-2">No Hidden Fees</h3>
                     <p className="text-gray-600">Transparent pricing with no surprise costs or hidden charges.</p>
                  </div>

                  <div className="text-center p-6 rounded-lg bg-gray-50">
                     <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                     </div>
                     <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
                     <p className="text-gray-600">Safe and secure payment processing for your peace of mind.</p>
                  </div>
               </div>
            </div>
         </section>

         {/* CTA Section */}
         <section className="py-16 bg-gradient-to-r from-blue-600 to-red-600 text-white">
            <div className="container mx-auto px-4 text-center">
               <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Room?</h2>
               <p className="text-xl mb-8 max-w-2xl mx-auto">Join thousands of happy renters who found their ideal living space with Vancouver Rooms.</p>
               <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button onClick={() => router.push(`/listing`)} className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium text-lg transition">
                     Browse Listings
                  </button>
               </div>
            </div>
         </section>
      </div>
   );
}