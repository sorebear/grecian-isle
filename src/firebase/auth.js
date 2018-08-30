import { auth } from './firebase';

export const annonymousSignIn = () => {
  auth.signInAnonymously().catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log('ERROR:', errorCode, errorMessage);
  });
};

export const getUseInfo = (callback) => auth.onAuthStateChanged(user => callback(user));