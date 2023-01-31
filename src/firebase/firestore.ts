import { getFirestore as getFirestoreLibFunc } from "firebase/firestore";
import { getApp } from "./app";

export default function getFirestore() {
	return getFirestoreLibFunc(getApp());
}
