
// This file provides type definitions for Firebase
import { 
  collection as importCollection, 
  getDocs as importGetDocs, 
  query as importQuery, 
  where as importWhere, 
  orderBy as importOrderBy, 
  limit as importLimit, 
  Timestamp as ImportTimestamp,
  addDoc as importAddDoc,
  serverTimestamp as importServerTimestamp,
  onSnapshot as importOnSnapshot,
  getFirestore as importGetFirestore,
  setLogLevel as importSetLogLevel,
  DocumentData as ImportDocumentData
} from 'firebase/firestore';

import {
  getAuth as importGetAuth,
  onAuthStateChanged as importOnAuthStateChanged,
  signInAnonymously as importSignInAnonymously,
  signInWithPhoneNumber as importSignInWithPhoneNumber,
  PhoneAuthProvider as ImportPhoneAuthProvider
} from 'firebase/auth';

import {
  getMessaging as importGetMessaging,
  getToken as importGetToken,
  onMessage as importOnMessage,
  isSupported as importIsSupported
} from 'firebase/messaging';

// Export non-type values
export const collection = importCollection;
export const getDocs = importGetDocs;
export const query = importQuery;
export const where = importWhere;
export const orderBy = importOrderBy;
export const limit = importLimit;
export const Timestamp = ImportTimestamp;
export const addDoc = importAddDoc;
export const serverTimestamp = importServerTimestamp;
export const onSnapshot = importOnSnapshot;
export const getFirestore = importGetFirestore;
export const setLogLevel = importSetLogLevel;

// Auth exports
export const getAuth = importGetAuth;
export const onAuthStateChanged = importOnAuthStateChanged;
export const signInAnonymously = importSignInAnonymously;
export const signInWithPhoneNumber = importSignInWithPhoneNumber;
export const PhoneAuthProvider = ImportPhoneAuthProvider;

// Messaging exports
export const getMessaging = importGetMessaging;
export const getToken = importGetToken;
export const onMessage = importOnMessage;
export const isSupported = importIsSupported;

// Export types separately with 'export type'
export type DocumentData = ImportDocumentData;
