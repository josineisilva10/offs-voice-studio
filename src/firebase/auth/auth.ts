"use client";

import {
  getAuth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { initializeFirebase } from "@/firebase";

type UserProfileData = {
  firstName: string;
  lastName: string;
  whatsAppNumber: string;
};

export async function createUser(
  email: string,
  password: string,
  profileData: UserProfileData
) {
  const { auth, firestore } = initializeFirebase();
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await updateProfile(user, {
    displayName: `${profileData.firstName} ${profileData.lastName}`,
  });

  const userDocRef = doc(firestore, "users", user.uid);
  await setDoc(userDocRef, {
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    whatsAppNumber: profileData.whatsAppNumber,
    email: user.email,
    creditBalance: 0,
  });

  return userCredential;
}
