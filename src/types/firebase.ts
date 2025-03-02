
// This file provides type definitions for Firebase
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp, 
  addDoc,
  serverTimestamp,
  onSnapshot,
  DocumentData,
  getFirestore,
  setLogLevel
} from 'firebase/firestore';

import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPhoneNumber,
  PhoneAuthProvider
} from 'firebase/auth';

export { 
  // Firestore exports
  collection, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp, 
  addDoc,
  serverTimestamp,
  onSnapshot,
  DocumentData,
  getFirestore,
  setLogLevel,
  
  // Auth exports
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPhoneNumber,
  PhoneAuthProvider
};

// Export types separately with 'export type'
export type { DocumentData };
