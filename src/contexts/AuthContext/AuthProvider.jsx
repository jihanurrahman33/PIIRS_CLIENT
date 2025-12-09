import React, { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  onIdTokenChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebase/firebase.config";

const googleProvider = new GoogleAuthProvider();
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signInUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signInGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      setUser(null);
      localStorage.removeItem("access-token");
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = (profile) => {
    return updateProfile(auth.currentUser, profile);
  };
  //observe user state
  useEffect(() => {
    const unSubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const token = await currentUser.getIdToken();
        localStorage.setItem("access-token", token);
      } else {
        localStorage.removeItem("access-token");
      }
      setLoading(false);
    });
    return () => unSubscribe();
  }, []);
  // Listen to token refresh (happens every ~1 hour)
  useEffect(() => {
    const unsubscribe = onIdTokenChanged(auth, async (currentUser) => {
      if (currentUser) {
        const token = await currentUser.getIdToken(true);
        localStorage.setItem("access-token", token);
      }
    });

    return () => unsubscribe();
  }, []);
  const authInfo = {
    updateUserProfile,
    user,
    loading,
    logOut,
    registerUser,
    signInUser,
    signInGoogle,
  };
  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
