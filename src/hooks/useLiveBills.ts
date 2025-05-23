'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Bill } from '@/types/bill';

export function useLiveBills({ ids }: { ids: (string | undefined)[] }) {
  const [data, setData] = useState<Bill[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!ids || ids.length === 0) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const billsQuery = query(
      collection(db, "bills"),
      where("id", "in", ids) // Use "in" operator for multiple IDs
    );

    // For real-time updates
    const unsubscribe = onSnapshot(
      billsQuery,
      (querySnapshot) => {
        const docs = querySnapshot.docs.map(doc => ({
          ...doc.data() as Bill,
          id: doc.id // Include the document ID if needed
        }));
        setData(docs);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching documents:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [ids?.length]); // Re-run effect when ids change

  return { data, loading };
}