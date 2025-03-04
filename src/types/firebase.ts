
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
  getFirestore,
  setLogLevel,
  DocumentData
} from 'firebase/firestore';

import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPhoneNumber,
  PhoneAuthProvider
} from 'firebase/auth';

import {
  getMessaging,
  getToken,
  onMessage,
  isSupported
} from 'firebase/messaging';

// Export non-type values
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
  getFirestore,
  setLogLevel,
  
  // Auth exports
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  
  // Messaging exports
  getMessaging,
  getToken,
  onMessage,
  isSupported
};

// Export types separately with 'export type'
export type { DocumentData };
