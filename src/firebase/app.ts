import { initializeApp, type FirebaseApp } from "firebase/app";

import type FirebaseCredentials from "../types/FirebaseCredentials";

let firebaseApp: FirebaseApp;

const initializeFirebase = (config: FirebaseCredentials) => {
	firebaseApp = initializeApp(config);
};

export default initializeFirebase;

export const getApp = () => firebaseApp;
