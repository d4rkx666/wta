'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/client';
import { onAuthStateChanged, User } from 'firebase/auth'; // Import onAuthStateChanged
import { Contract } from '@/types/contract';

export function useLiveContracts() {
  const [data, setData] = useState<Contract[]>([]); // State to hold the documents
  const [loading, setLoading] = useState<boolean>(true); // Loading state to track fetching status
  const [user, setUser] = useState<User | null>(null); // To hold the authenticated user info

  useEffect(() => {
    // Check if the user is authenticated when the component mounts
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set user state when authenticated
      } else {
        setUser(null); // Clear user state when not authenticated
      }
    });

    // Clean up the auth listener
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) {
      return; // Don't fetch data if not authenticated
    }

    const fetchData = async () => {
      try {
        // Now that you have the user, query payments where tenant_id is equal to user.uid
        const paymentsQuery = query(
          collection(db, "contracts"),
          where("tenant_id", "==", user.uid) // Ensure we are fetching payments only for the authenticated user
        );
        const querySnapshot = await getDocs(paymentsQuery);
        const docs = querySnapshot.docs.map(doc => ({
          ...doc.data() as Contract,
        }));

        setData(docs); // Set the initial data
      } catch (error) {
        console.error("Error fetching documents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Real-time updates using onSnapshot
    const unsubscribe = onSnapshot(
      query(collection(db, "contracts"), where("tenant_id", "==", user.uid)),
      (snap) => {
        const updatedDocs = snap.docs.map(doc => ({
          ...doc.data() as Contract,
        }));
        setData(updatedDocs); 
      }
    );

    return () => unsubscribe(); 
  }, [user]); // Dependency on user to refetch when user changes

  return { data, loading };
}