
'use client';

import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, Firestore, serverTimestamp } from "firebase/firestore";

export async function signUpWithEmail(
    auth: Auth,
    firestore: Firestore,
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    whatsappName: string
) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userProfile = {
        id: user.uid,
        firstName,
        lastName,
        whatsappName,
        email: user.email,
        createdAt: serverTimestamp(),
        credits: 0,
    };
    
    await setDoc(doc(firestore, "users", user.uid), userProfile);

    return userCredential;
}

export async function signInWithEmail(auth: Auth, email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
}
