
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
  DocumentData
} from 'firebase/firestore';

import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPhoneNumber
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
  
  // Auth exports
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  signInWithPhoneNumber
};
