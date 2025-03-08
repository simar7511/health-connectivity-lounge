
// This file provides type definitions for Firebase
import { 
  collection as firestoreCollection, 
  getDocs as firestoreGetDocs, 
  query as firestoreQuery, 
  where as firestoreWhere, 
  orderBy as firestoreOrderBy, 
  limit as firestoreLimit, 
  Timestamp as FirestoreTimestamp,
  addDoc as firestoreAddDoc,
  serverTimestamp as firestoreServerTimestamp,
  onSnapshot as firestoreOnSnapshot,
  getFirestore as firestoreGetFirestore,
  setLogLevel as firestoreSetLogLevel,
  type DocumentData as FirestoreDocumentDataType
} from 'firebase/firestore';

import {
  getAuth as authGetAuth,
  onAuthStateChanged as authOnAuthStateChanged,
  signInAnonymously as authSignInAnonymously,
  signInWithPhoneNumber as authSignInWithPhoneNumber,
  PhoneAuthProvider as AuthPhoneAuthProvider
} from 'firebase/auth';

import {
  getMessaging as messagingGetMessaging,
  getToken as messagingGetToken,
  onMessage as messagingOnMessage,
  isSupported as messagingIsSupported
} from 'firebase/messaging';

// Export types
export type DocumentData = FirestoreDocumentDataType;
export type Timestamp = FirestoreTimestamp;

// Export functions and values
export const collection = firestoreCollection;
export const getDocs = firestoreGetDocs;
export const query = firestoreQuery;
export const where = firestoreWhere;
export const orderBy = firestoreOrderBy;
export const limit = firestoreLimit;
export const Timestamp = FirestoreTimestamp;
export const addDoc = firestoreAddDoc;
export const serverTimestamp = firestoreServerTimestamp;
export const onSnapshot = firestoreOnSnapshot;
export const getFirestore = firestoreGetFirestore;
export const setLogLevel = firestoreSetLogLevel;

// Auth exports
export const getAuth = authGetAuth;
export const onAuthStateChanged = authOnAuthStateChanged;
export const signInAnonymously = authSignInAnonymously;
export const signInWithPhoneNumber = authSignInWithPhoneNumber;
export const PhoneAuthProvider = AuthPhoneAuthProvider;

// Messaging exports
export const getMessaging = messagingGetMessaging;
export const getToken = messagingGetToken;
export const onMessage = messagingOnMessage;
export const isSupported = messagingIsSupported;
