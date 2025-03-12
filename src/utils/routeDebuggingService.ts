
import { logNavigationAttempt } from "./navigationService";

interface RouteDebugOptions {
  enableLogging: boolean;
  trackLocalStorage: boolean;
  trackSessionStorage: boolean;
}

// Default options
const defaultOptions: RouteDebugOptions = {
  enableLogging: true,
  trackLocalStorage: true,
  trackSessionStorage: true
};

let options = {...defaultOptions};

// Set up route debugging
export const setupRouteDebugging = (customOptions?: Partial<RouteDebugOptions>) => {
  options = { ...defaultOptions, ...customOptions };
  
  if (options.enableLogging) {
    // Log navigation events
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(state, title, url) {
      console.log(`%c[Route Debug] pushState: ${url}`, 'color: #4CAF50; font-weight: bold');
      logNavigationAttempt('unknown', url?.toString() || 'unknown');
      return originalPushState.apply(this, [state, title, url]);
    };
    
    history.replaceState = function(state, title, url) {
      console.log(`%c[Route Debug] replaceState: ${url}`, 'color: #2196F3; font-weight: bold');
      logNavigationAttempt('unknown', url?.toString() || 'unknown');
      return originalReplaceState.apply(this, [state, title, url]);
    };
    
    // Track route changes
    window.addEventListener('popstate', () => {
      console.log(`%c[Route Debug] popstate: ${window.location.pathname}`, 'color: #9C27B0; font-weight: bold');
    });
  }
  
  // Initialize session tracking
  if (options.trackLocalStorage || options.trackSessionStorage) {
    trackStorageChanges();
  }
  
  console.log('%c[Route Debug] Route debugging initialized', 'color: #FF5722; font-weight: bold');
};

// Track changes to localStorage and sessionStorage
const trackStorageChanges = () => {
  if (options.trackLocalStorage) {
    const originalSetItem = localStorage.setItem;
    
    localStorage.setItem = function(key, value) {
      console.log(`%c[Storage Debug] localStorage.setItem: ${key} = ${value}`, 'color: #795548; font-weight: bold');
      originalSetItem.apply(this, [key, value]);
    };
  }
  
  if (options.trackSessionStorage) {
    const originalSetItem = sessionStorage.setItem;
    
    sessionStorage.setItem = function(key, value) {
      console.log(`%c[Storage Debug] sessionStorage.setItem: ${key} = ${value}`, 'color: #607D8B; font-weight: bold');
      originalSetItem.apply(this, [key, value]);
    };
  }
};

// Debug current route and router state
export const debugCurrentRoute = () => {
  console.group('%c[Route Debug] Current Route Information', 'color: #FF9800; font-weight: bold');
  console.log('Path:', window.location.pathname);
  console.log('Search:', window.location.search);
  console.log('Hash:', window.location.hash);
  console.log('Full URL:', window.location.href);
  
  // Output relevant localStorage items
  console.group('localStorage State:');
  ['currentUser', 'isProvider', 'patientPhone', 'preferredLanguage'].forEach(key => {
    console.log(`${key}:`, localStorage.getItem(key));
  });
  console.groupEnd();
  
  // Output relevant sessionStorage items
  console.group('sessionStorage State:');
  ['navigationAttempt', 'lastVisitedPage', 'preferredLanguage'].forEach(key => {
    console.log(`${key}:`, sessionStorage.getItem(key));
  });
  console.groupEnd();
  
  console.groupEnd();
};

// Initialize route debugging immediately in development
if (import.meta.env.DEV) {
  setupRouteDebugging();
  
  // Debug route after initial load
  window.addEventListener('load', () => {
    setTimeout(debugCurrentRoute, 500);
  });
}
