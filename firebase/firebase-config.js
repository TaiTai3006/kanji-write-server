
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB5LY4eI-mHa4DlRUg9wwMwYsth1jd6LhU",
  authDomain: "assign-work-59dd4.firebaseapp.com",
  projectId: "assign-work-59dd4",
  storageBucket: "assign-work-59dd4.appspot.com",
  messagingSenderId: "1017639265146",
  appId: "1:1017639265146:web:35bdf846dc7072ef99ecc3",
  measurementId: "G-FCF7NHDZSH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);