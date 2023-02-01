import { getAuth as getAuthLibFunc } from "firebase/auth";
import { getApp } from "./app";

export default function getAuth() {
	return getAuthLibFunc(getApp());
}
