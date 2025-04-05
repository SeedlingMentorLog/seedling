import {initializeApp} from "firebase/app";
import {getAuth} from "firebase/auth"; 
import {getStorage} from "firebase/storage"

const firebaseConfig = {
    apiKey: "AIzaSyDSANeYEEEzNuIniB2bvakYKknnrF_WRko",
    authDomain: "seedling-e5a7e.firebaseapp.com",
    projectId: "seedling-e5a7e",
    storageBucket: "seedling-e5a7e.firebasestorage.app",
    messagingSenderId: "1066957557089",
    appId: "1:1066957557089:web:fe69c5942842b0c461c920",
    measurementId: "G-KB6PQ4WQV8",
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app); 
export const storage = getStorage(app);
export default app; 