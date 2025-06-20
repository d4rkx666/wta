'use client';

import { useEffect, useState } from 'react';
import Loader from '../components/common/Loader';
import { useLiveRooms } from '@/hooks/useLiveRooms';
import { useLiveDocuments } from '@/hooks/useLiveProperties';
import ShowRoomCards from '../components/common/ShowRoomCards';

const RoomListing = () => {
   // State for filters
   const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
   const [onlyAvailable, setOnlyAvailable] = useState(true);
   const [currentPriceRange, setCurrentPriceRange] = useState<[number, number]>([0, 0]);
   const [selectedNeighborhoods, setSelectedNeighborhoods] = useState<string[]>([]);
   const [hasPrivateWashroom, setHasPrivateWashroom] = useState<boolean | null>(null);

   const { data: rooms, loading: loadingRooms } = useLiveRooms();
   const { data: properties, loading: loadingProperties } = useLiveDocuments();

   const neighborhoods = [...new Map(properties.map(item => [item.location, item])).values()];

   // Filter rooms based on selected filters
   const filteredRooms = rooms ? rooms.filter(room => {
      // Price range filter
      if (room.price < currentPriceRange[0]) return false;

      // Private washroom filter
      if (hasPrivateWashroom !== null && room.private_washroom !== hasPrivateWashroom) return false;

      // Neighborhood filter
      if (selectedNeighborhoods.length > 0) {
         const neighborhood = properties.find(p => p.id === room.id_property)?.location || "";
         if (!selectedNeighborhoods.includes(neighborhood)) return false;
      }

      if(onlyAvailable && !room.available){
         return false;
      }

      return true;
   }) : [];

   useEffect(() => {
      const cheapestPrice = rooms.reduce((minPrice, currentItem) => {
         return currentItem.price < minPrice ? currentItem.price : minPrice;
      }, Infinity);

      const highestPrice = rooms.reduce((maxPrice, currentItem) => {
         return currentItem.price > maxPrice ? currentItem.price : maxPrice;
      }, -Infinity);

      setPriceRange([cheapestPrice, highestPrice])
      setCurrentPriceRange([cheapestPrice, highestPrice])
   }, [rooms, loadingRooms])

   if (loadingRooms || loadingProperties) {
      return <Loader />;
   }

   return (
      <div className="container mx-auto px-4 py-8">
         {/* Filter Section */}
         <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Filter Rooms</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {/* Price Range Filter */}
               <div>
                  <label className="block text-gray-700 font-medium mb-2">Price Range</label>
                  <div className="flex items-center space-x-4">
                     <span className="text-gray-600">${currentPriceRange[0]}</span>
                     <input
                        type="range"
                        min={priceRange[0]}
                        max={priceRange[1]}
                        step="50"
                        value={currentPriceRange[0]}
                        onChange={(e) => setCurrentPriceRange([parseInt(e.target.value), priceRange[1]])}
                        className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                     />
                     <span className="text-gray-600">${currentPriceRange[1]}</span>
                  </div>
               </div>

               {/* Neighborhood Filter */}
               <div>
                  <label className="block text-gray-700 font-medium mb-2">Neighborhood</label>
                  <div className="flex flex-wrap gap-2">
                     {neighborhoods.map(prop => (
                        <button
                           key={prop.id}
                           onClick={() => {
                              if (selectedNeighborhoods.includes(prop.location)) {
                                 setSelectedNeighborhoods(selectedNeighborhoods.filter(n => n !== prop.location));
                              } else {
                                 setSelectedNeighborhoods([...selectedNeighborhoods, prop.location]);
                              }
                           }}
                           className={`px-3 py-1 rounded-full text-sm ${selectedNeighborhoods.includes(prop.location)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                              }`}
                        >
                           {prop.location}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Washroom Filter */}
               <div>
                  <label className="block text-gray-700 font-medium mb-2">Washroom</label>
                  <div className="flex space-x-4">
                     <button
                        onClick={() => setHasPrivateWashroom(null)}
                        className={`px-4 py-2 rounded-lg ${hasPrivateWashroom === null
                           ? 'bg-blue-600 text-white'
                           : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                           }`}
                     >
                        Any
                     </button>
                     <button
                        onClick={() => setHasPrivateWashroom(true)}
                        className={`px-4 py-2 rounded-lg ${hasPrivateWashroom === true
                           ? 'bg-blue-600 text-white'
                           : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                           }`}
                     >
                        Private
                     </button>
                     <button
                        onClick={() => setHasPrivateWashroom(false)}
                        className={`px-4 py-2 rounded-lg ${hasPrivateWashroom === false
                           ? 'bg-blue-600 text-white'
                           : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                           }`}
                     >
                        Shared
                     </button>
                  </div>
               </div>

               {/* Availability Checkbox */}
               <div className="flex items-center">
                  <label className="flex items-center space-x-3 cursor-pointer">
                     <input
                        type="checkbox"
                        checked={onlyAvailable}
                        onChange={(e) => setOnlyAvailable(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                     />
                     <span className="text-gray-700 font-medium">Only Available</span>
                  </label>
               </div>
            </div>
         </div>

         {/* Results Count */}
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
               {filteredRooms.length} {filteredRooms.length === 1 ? 'Room' : 'Rooms'} Available
            </h3>
            <div className="text-gray-600">
               Showing {filteredRooms.length} of {rooms.length} results
            </div>
         </div>

         {/* Room Cards Grid */}
         {filteredRooms.length > 0 ? (
            <ShowRoomCards rooms={filteredRooms} showNotAvailable={true} />
         ) : (
            <div className="bg-white rounded-xl shadow-md p-8 text-center">
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
               </svg>
               <h3 className="text-xl font-semibold text-gray-900 mb-2">No rooms match your filters</h3>
               <p className="text-gray-600 mb-4">
                  Try adjusting your filters or check back later for new listings.
               </p>
               <button
                  onClick={() => {
                     setCurrentPriceRange([priceRange[0], priceRange[1]])
                     setSelectedNeighborhoods([]);
                     setHasPrivateWashroom(null);
                  }}
                  className="text-blue-600 hover:text-blue-800 font-medium"
               >
                  Reset all filters
               </button>
            </div>
         )}

         {/* Pagination - would be implemented with real data */}
         {filteredRooms.length > 0 && (
            <div className="flex justify-center mt-8">
               <nav className="flex items-center space-x-2">
                  <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                     Previous
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-blue-600 text-white">1</button>
                  <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                     2
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                     3
                  </button>
                  <button className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">
                     Next
                  </button>
               </nav>
            </div>
         )}
      </div>
   );
};

export default RoomListing;