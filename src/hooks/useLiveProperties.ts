'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Property } from '@/types/property';


export function useLiveDocuments() {
  const [data, setData] = useState<Property[]>([]); // State to hold the documents
  const [loading, setLoading] = useState<boolean>(true); // Loading state to track fetching status

  useEffect(() => {
    // First fetch all documents initially with getDocs
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const docs = querySnapshot.docs.map(doc => ({
          ...doc.data() as Property,
        }));

        setData(docs); // Set the initial data
        setLoading(false); // Data is now loaded
      } catch (error) {
        console.error("Error fetching documents:", error);
        setLoading(false); // Stop loading even if there's an error
      }
    };

    fetchData();

    const unsubscribe = onSnapshot(collection(db, "properties"), (snap) => {
      const updatedDocs = snap.docs.map(doc => ({
        ...doc.data() as Property,
      }));
      setData(updatedDocs); // Update the state with live changes
    });

    return () => unsubscribe();
  }, []); 

  return { data, loading };
}