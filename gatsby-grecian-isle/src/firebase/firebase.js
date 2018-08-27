import firebase from 'firebase/app';
import 'firebase/database';

const prodConfig = {
  apiKey: "AIzaSyBleN9k8hHVHCGFats4I41nHov25q3b6Zc",
  authDomain: "grecian-isle.firebaseapp.com",
  databaseURL: "https://grecian-isle.firebaseio.com",
  projectId: "grecian-isle",
  storageBucket: "grecian-isle.appspot.com",
  messagingSenderId: "99254806555"
};

const devConfig = {
  apiKey: "AIzaSyBleN9k8hHVHCGFats4I41nHov25q3b6Zc",
  authDomain: "grecian-isle.firebaseapp.com",
  databaseURL: "https://grecian-isle.firebaseio.com",
  projectId: "grecian-isle",
  storageBucket: "grecian-isle.appspot.com",
  messagingSenderId: "99254806555"
};

const config = process.env.NODE_ENV === 'production' ? prodConfig : devConfig;

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const db = firebase.database();

export {
  db
};
