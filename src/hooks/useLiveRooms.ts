'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Room } from '@/types/room';


export function useLiveRooms() {
  const [data, setData] = useState<Room[]>([]); // State to hold the documents
  const [loading, setLoading] = useState<boolean>(true); // Loading state to track fetching status

  useEffect(() => {
    // First fetch all documents initially with getDocs
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "rooms"));
        const docs = querySnapshot.docs.map(doc => ({
          ...doc.data() as Room,
        }));

        const sortedRooms = docs.sort((a, b) => {
          if (a.available === b.available) {
            return 0;
          }
          return a.available ? -1 : 1;
        });

        setData(sortedRooms); // Set the initial data
        setLoading(false); // Data is now loaded
      } catch (error) {
        console.error("Error fetching documents:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchData();

    // Now set up the real-time listener with onSnapshot for live updates
    const unsubscribe = onSnapshot(collection(db, "rooms"), (snap) => {
      const updatedDocs = snap.docs.map(doc => ({
        ...doc.data() as Room,
      }));

      const sortedRooms = updatedDocs.sort((a, b) => {
        if (a.available === b.available) {
          return 0;
        }
        return a.available ? -1 : 1;
      });

      setData(sortedRooms); 
    });

    return () => unsubscribe();
  }, []); 
  return { data, loading };
}