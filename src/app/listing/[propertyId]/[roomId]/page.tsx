"use client"
import { useParams } from "next/navigation";
import Carousel from "../../../components/common/Carousel"
import { useDetailRoom } from "@/hooks/useDetailRoom";
import Loader from "@/app/components/common/Loader";
import Link from "next/link";
import { useLiveRooms } from "@/hooks/useLiveRooms";
import { useEffect, useState } from "react";


const RoomDetail = () => {
  const { propertyId, roomId }= useParams<{propertyId: string;roomId: string;}>();
  const {roomData, propertyData, loading} = useDetailRoom(propertyId, roomId)
  const {data: roomCount, loading: loadingRooms} = useLiveRooms()
  const [roommatesCount, setRoommatesCount] = useState(0);

  useEffect(()=>{
    const roommates = roomCount.filter(r => r.id_property === propertyData.id).length
    setRoommatesCount(roommates);
  },[roomCount, propertyData, loading, loadingRooms])

  if (loading || loadingRooms) {
    return <Loader />;
  }
  console.log(roomData)

  return (
    <div className="min-h-screen flex flex-col">
      
      <div className="flex-grow">
        {/* Room Gallery */}
        <div className="bg-gray-100">
          <div className="container mx-auto px-4 py-8">
            <Carousel room={roomData}/>
          </div>
        </div>
        
        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Column - Room Details */}
            <div className="lg:w-2/3">
              {/* Title and Badge */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{roomData.title}</h1>
                {roomData.available ? (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0">
                    Available Now
                  </div>
                ):(
                  <div className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mt-2 sm:mt-0">
                    Already taken
                  </div>
                )}
                
              </div>
              
              {/* Location */}
              <div className="flex items-center text-gray-600 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {propertyData.location}
              </div>
              
              {/* Key Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-gray-500 text-sm">Price</div>
                  <div className="text-2xl font-bold text-blue-600">${roomData.price}<span className="text-gray-500 text-lg">/month</span></div>
                </div>
                
                {!roomData.available &&
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-gray-500 text-sm">Available</div>
                  <div className="text-xl font-semibold">{roomData.date_availability.toDate().toLocaleDateString('en-CA', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'})}</div>
                </div>
                }

                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-gray-500 text-sm">Washroom</div>
                  <div className="text-xl font-semibold">{roomData.private_washroom ? 'Private' : 'Shared'}</div>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="text-gray-500 text-sm">Roommates</div>
                  <div className="text-xl font-semibold">{roommatesCount}</div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">About This Room</h2>
                <div className="prose max-w-none">
                  {roomData.description.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-4 text-gray-700">{paragraph}</p>
                  ))}
                </div>
              </div>
              
              {/* Amenities */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {/** SPECIFIC */}
                  {roomData.specific_amenities.map((amenity, index) => amenity.available && (
                    <div key={index} className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {amenity.name}
                    </div>
                  ))}

                  {/** GLOBAL */}
                  {propertyData.global_amenities.map((amenity, index) => amenity.available && (
                    <div key={index} className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {amenity.name}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Map */}
              {/*<div className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">Location</h2>
                <div className="bg-gray-200 rounded-lg overflow-hidden" style={{ height: '400px' }}>
                  <iframe src={propertyData.url_map} className="w-full h-full flex items-center justify-center" allowFullScreen={false} loading="lazy" referrerPolicy={"no-referrer-when-downgrade"}></iframe>
                </div>
              </div>*/}
            </div>
            
            {/* Right Column - Contact/CTA */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-md p-6 sticky top-4">
                <h3 className="text-xl font-semibold mb-4">Interested in this room?</h3>
                <p className="text-gray-600 mb-6">Contact the property manager to schedule a viewing or ask questions.</p>
                
                <div className="space-y-4">
                  <div>
                    <Link href="tel:+1234567890">
                      <button className="sm:hidden w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        Call Now
                      </button>
                    </Link>
                  </div>
                  
                  <Link href={process.env.NEXT_PUBLIC_WHATSAPP_API || ""} target="_blank">
                    <button className="w-full bg-white border-2 border-green-600 text-green-600 hover:bg-blue-50 py-3 rounded-lg font-medium transition flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Send Message
                    </button>
                  </Link>
                  
                  {/*<button className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-medium transition flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                    Save to Favorites
                  </button>*/}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium mb-2">Share this listing</h4>
                  <div className="flex space-x-4">
                    <button className="text-blue-600 hover:text-blue-800">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button className="text-blue-400 hover:text-blue-600">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </button>
                    <button className="text-red-500 hover:text-red-700">
                      <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>


                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex space-x-4">
                  <Link href={"/listing"} className="text-blue-700 underline">Go back to listing</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;