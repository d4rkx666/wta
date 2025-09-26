import { useLiveDocuments } from "@/hooks/useLiveProperties";
import { useLiveRooms } from "@/hooks/useLiveRooms";
import Loader from "./Loader";
import { RoomCard } from "./RoomCard";
import { Property } from "@/types/property";
import { Room } from "@/types/room";

export default function ShowRoomCards(
   {
      showNotAvailable,
      frontPage,
      properties,
      rooms

   }:{
      showNotAvailable:boolean,
      frontPage?:boolean,
      properties?:Property[],
      rooms?:Room[]
   }) {

   /* eslint-disable */
   let loadingData = false;
   if(!properties){
      const {data, loading} = useLiveDocuments();
      properties = data;
      loadingData = loading;
   }

   if(!rooms){
      const {data, loading} = useLiveRooms();
      rooms = data;
      if(frontPage){
         rooms = data.slice(0,3);
      }
      loadingData = loading;
   }
   /* eslint-enable */

   if (loadingData) {
      return <Loader />;
   }

   return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
         {rooms.map((room, i) => {
            const prop = properties.find(p => p.id === room.id_property)
            const roommates = rooms.filter(r => r.id_property === room.id_property).length
            const showAll = showNotAvailable ? true : room.available
            if (prop && showAll) {
               return (
                  <RoomCard key={i} property={prop} room={room} roommates={roommates} />
               )
            }
         })}
      </div>
   )
}