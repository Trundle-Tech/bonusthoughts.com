import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import config from "./firebase-config.json";

// The site's other Firebase app (lib/firebase.ts, project bonusthoughts-portal)
// is a different project. The briefing lives in bonusthoughtshome, so it gets
// its own named app. This web config is public by design; access is enforced by
// Firebase Auth + Firestore rules (owner-only read, no client writes).
const NAME = "briefing";

function app() {
  return getApps().some((a) => a.name === NAME)
    ? getApp(NAME)
    : initializeApp(config, NAME);
}

export const briefingAuth = () => getAuth(app());
export const briefingDb = () => getFirestore(app());
