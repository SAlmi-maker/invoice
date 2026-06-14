// ============================================================
// RENVA - Firebase Configuration
// ⚠️  REPLACE the firebaseConfig object with YOUR project values
//     from Firebase Console → Project Settings → Your Apps
// ============================================================

const firebaseConfig = {
  apiKey: "AIzaSyCRNK5nRVZKV7Xy2Rk0-KjJCMr-cg2kthg",
  authDomain: "RENVA-ebb4d.firebaseapp.com",
  projectId: "RENVA-ebb4d",
  storageBucket: "RENVA-ebb4d.firebasestorage.app",
  messagingSenderId: "555809439826",
  appId: "1:555809439826:web:d6adba53f321eb9711df8b",
  measurementId: "G-DWTFRW1W53"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const auth     = firebase.auth();
const db       = firebase.firestore();
const storage  = firebase.storage();

// Enable offline persistence
db.enablePersistence({ synchronizeTabs: true }).catch(err => {
  if (err.code === 'failed-precondition') {
    console.warn('Firestore persistence unavailable (multiple tabs open).');
  } else if (err.code === 'unimplemented') {
    console.warn('Firestore persistence not supported in this browser.');
  }
});
