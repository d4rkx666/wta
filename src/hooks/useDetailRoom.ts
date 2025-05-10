'use client';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Room, RoomDefaultVal } from '@/types/room';
import { Property, PropertyDefaultVal } from '@/types/property';

export function useDetailRoom(property_id: string, room_id: string) {
  const [propertyData, setPropertyData] = useState<Property>(PropertyDefaultVal); // State to hold the rooms
  const [roomData, setRoomData] = useState<Room>(RoomDefaultVal); // State to hold the rooms
  const [loading, setLoading] = useState<boolean>(true); // Loading state to track fetching status

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const propertyRef = doc(db, 'properties', property_id);
        const roomRef = doc(db, 'rooms', room_id);
        const propertySnap = await getDoc(propertyRef);
        const rooomSnap = await getDoc(roomRef);

        if(propertySnap.exists() && rooomSnap.exists()){
          const propertyData = propertySnap.data() as Property;
          const roomData = rooomSnap.data() as Room;
  
          setPropertyData(propertyData);
          setRoomData(roomData);
        }
        
      } catch (error) {
        console.error("Error fetching documents:", error);
      }finally{
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchRoomDetails();
  }, [property_id, room_id]);

  return { roomData, propertyData, loading };
}